import { createFileRoute } from '@tanstack/react-router'
import { usePshGame } from '../components/psh'
import '../components/psh.css'

export const Route = createFileRoute('/pshgame')({
  component: BouncySecurityStage,
})

function BouncySecurityStage() {
  const { sceneRef, password, currentInput, isWin, reboot } = usePshGame()

  return (
    <div className="psh-container">
      <div className="psh-glow-primary"></div>

      <header className="psh-header">
        <h1 className="psh-title">CAPTCHA</h1>
      </header>

      <div className="psh-status-grid">
        <div className="psh-card psh-card-alert">
          <span className="psh-card-label">Cipher_Key</span>
          <p className="psh-card-value psh-value-target">{password}</p>
        </div>

        <div className={`psh-card ${isWin ? 'psh-card-active' : ''}`}>
          <span className="psh-card-label">Input</span>
          <p className={`psh-card-value ${isWin ? 'psh-value-win' : 'psh-value-buffer'}`}>
            {isWin ? password : (currentInput || '')}
          </p>
        </div>
      </div>

      <div className="psh-protocol-list">
        <div className="psh-protocol-item">
          <span className="psh-protocol-tag">Protocol 1:</span>
          <span className="psh-protocol-text">
            Simultaneous floor contact required to register input.
          </span>
        </div>
        <div className="psh-protocol-item">
          <span className="psh-protocol-tag">Protocol 2:</span>
          <span className="psh-protocol-text">
            Character input sequence order is irrelevant.
          </span>
        </div>
      </div>

      <main className="psh-stage-wrapper">
        <div className="psh-canvas-container" ref={sceneRef}>
          {isWin && (
            <div className="psh-win-overlay">
              CAPTCHA_SOLVED
            </div>
          )}
        </div>
      </main>

      <footer className="psh-footer">
        <button
          onClick={() => reboot()}
          className="psh-control-btn"
        >
          RESET
        </button>
      </footer>
    </div>
  )
}
