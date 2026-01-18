// Route protection utility using sessionStorage
// Prevents direct URL access while allowing navigation via embedded links

const PROTECTED_ROUTES = [
    '/lostwoods',
    '/zwei',
    '/tres',
    '/shi',
    '/cinq',
    '/liu',
    '/hint',
    '/youwin',
    '/vid',
] as const

const ROUTE_ACCESS_KEY = 'route_access_token'

/**
 * Grant access to a specific route (call before navigation)
 */
export function grantRouteAccess(path: string): void {
    if (typeof window === 'undefined') return

    const token = {
        path,
        timestamp: Date.now(),
        // Token expires after 5 seconds to prevent abuse
        expiresAt: Date.now() + 5000,
    }

    sessionStorage.setItem(ROUTE_ACCESS_KEY, JSON.stringify(token))
}

/**
 * Check if access to a route is granted and consume the token (one-time use)
 */
export function validateAndConsumeAccess(path: string): boolean {
    if (typeof window === 'undefined') return false

    try {
        const tokenStr = sessionStorage.getItem(ROUTE_ACCESS_KEY)
        if (!tokenStr) return false

        const token = JSON.parse(tokenStr)

        // Check if token is valid
        const isValid =
            token.path === path &&
            token.expiresAt > Date.now()

        // Consume the token (one-time use)
        sessionStorage.removeItem(ROUTE_ACCESS_KEY)

        return isValid
    } catch {
        return false
    }
}

/**
 * Check if a route is protected
 */
export function isProtectedRoute(path: string): boolean {
    return PROTECTED_ROUTES.includes(path as any)
}

/**
 * Navigate to a protected route (grants access before navigation)
 */
export function navigateToProtectedRoute(path: string, navigate: (path: string) => void): void {
    grantRouteAccess(path)
    navigate(path)
}
