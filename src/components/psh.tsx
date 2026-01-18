import { useEffect, useRef, useState, useCallback } from 'react'
import Matter from 'matter-js'

export function usePshGame() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const [password] = useState('NUSHACK')
  const [currentInput, setCurrentInput] = useState('')
  const [isWin, setIsWin] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  const init = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    if (!sceneRef.current) return

    const { Engine, Render, Bodies, Composite, Mouse, MouseConstraint, Events, Body, Vector } = Matter

    const engine = Engine.create({
      enableSleeping: false,
      positionIterations: 20,
      velocityIterations: 20,
    })
    engineRef.current = engine

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#ffffff',
      },
    })

    // 1. Physical Boundaries
    const wallOpts = { isStatic: true, friction: 0.1, render: { fillStyle: '#000000' } }
    const ground = Bodies.rectangle(400, 630, 810, 60, wallOpts)
    const leftWall = Bodies.rectangle(-30, 300, 60, 600, wallOpts)
    const rightWall = Bodies.rectangle(830, 300, 60, 600, wallOpts)
    const ceiling = Bodies.rectangle(400, -30, 810, 60, wallOpts)

    // 2. The Target Box
    const physThick = 60;
    const visThick = 10;
    const boxWidth = 320;
    const boxHeight = 160;
    const boxX = 400;
    const boxY = 220;

    const boxBase = Bodies.rectangle(boxX, boxY + (boxHeight / 2) + (physThick / 2) - (visThick / 2), boxWidth, physThick, wallOpts)
    const boxL = Bodies.rectangle(boxX - (boxWidth / 2) - (physThick / 2) + (visThick / 2), boxY, physThick, boxHeight, wallOpts)
    const boxR = Bodies.rectangle(boxX + (boxWidth / 2) + (physThick / 2) - (visThick / 2), boxY, physThick, boxHeight, wallOpts)

    // 3. Letters
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const letterBodies = alphabet.map((char, i) => {
      const x = 120 + (i % 13) * 48
      const y = 440 + Math.floor(i / 13) * 60
      return Bodies.circle(x, y, 22, {
        restitution: 1,
        friction: 0.005,
        frictionAir: 0.02,
        label: char,
        render: { visible: false },
        isDetected: false
      } as any)
    })

    // 4. Interaction
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        damping: 0.5,
        render: { visible: false }
      }
    })

    // 5. CHAOTIC Physics Logic
    Events.on(engine, 'beforeUpdate', () => {
      const mousePos = mouse.position;
      const disturbanceRadius = 140;
      const pushStrength = 0.08;

      letterBodies.forEach(b => {
        const distVec = Vector.sub(b.position, mousePos);
        const distance = Vector.magnitude(distVec);

        if (distance < disturbanceRadius && distance > 0) {
          const jitter = {
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 1.5
          };
          const chaoticDir = Vector.normalise(Vector.add(distVec, jitter));
          const forceMag = (1 - distance / disturbanceRadius) * pushStrength;
          const force = Vector.mult(chaoticDir, forceMag);

          Body.applyForce(b, b.position, force);
          Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.3);
        }

        const maxSpeed = 25;
        const speed = Vector.magnitude(b.velocity);
        if (speed > maxSpeed) {
          Body.setVelocity(b, Vector.mult(Vector.normalise(b.velocity), maxSpeed));
        }

        if (b.position.y > 750 || b.position.x < -150 || b.position.x > 950) {
          Body.setPosition(b, { x: 400, y: 500 });
          Body.setVelocity(b, { x: 0, y: 0 });
        }
      });
    });

    // Custom Rendering
    Events.on(render, 'afterRender', () => {
      const { context } = render
      context.font = 'bold 22px "JetBrains Mono", monospace'
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      letterBodies.forEach(body => {
        context.beginPath()
        context.arc(body.position.x, body.position.y, 22, 0, Math.PI * 2)
        context.fillStyle = (body as any).isDetected ? '#10b981' : '#2563eb'
        context.fill()
        context.fillStyle = '#ffffff'
        context.fillText((body as any).label, body.position.x, body.position.y)
        context.closePath()
      });
    })

    // 6. Win Detection (Updated for "Bottom Floor Only")
    let checkCounter = 0;
    let lastDetectedString = "";
    let stableFrames = 0;

    Events.on(engine, 'afterUpdate', () => {
      checkCounter++;
      if (checkCounter % 8 === 0) {
        const padding = 15;
        const innerL = boxX - boxWidth / 2 + visThick + padding;
        const innerR = boxX + boxWidth / 2 - visThick - padding;
        const innerB = boxY + boxHeight / 2 - visThick; // The actual floor line

        const inBox = letterBodies.filter(b => {
          // Horizontal Check
          const isInsideWidth = b.position.x > innerL && b.position.x < innerR;

          // Floor Check: Ball must be within 35px of the floor (one ball height roughly)
          const isOnFloor = b.position.y > (innerB - 35) && b.position.y < (innerB + 5);

          // Stability Check: Must be almost perfectly still vertically
          const isStable = Math.abs(b.velocity.y) < 0.5 && Vector.magnitude(b.velocity) < 1.2;

          const detected = isInsideWidth && isOnFloor && isStable;
          (b as any).isDetected = detected;
          return detected;
        });

        const currentLetters = inBox.map(b => (b as any).label).sort().join('');
        const target = password.split('').sort().join('');

        if (currentLetters === lastDetectedString) {
          stableFrames++;
        } else {
          stableFrames = 0;
          lastDetectedString = currentLetters;
        }

        // Require more stable frames (5) to ensure they've fully settled on the floor
        if (stableFrames >= 5) {
          if (currentLetters === target) setIsWin(true);
          else setCurrentInput(currentLetters);
        }
      }
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling, boxBase, boxL, boxR, ...letterBodies, mouseConstraint])

    let animationFrameId: number;
    const update = () => {
      if (!engineRef.current) return;
      for (let i = 0; i < 4; i++) {
        Engine.update(engine, 1000 / 60 / 4)
      }
      animationFrameId = requestAnimationFrame(update)
    }

    update()
    Render.run(render)

    const cleanup = () => {
      cancelAnimationFrame(animationFrameId)
      Render.stop(render)
      Engine.clear(engine)
      render.canvas.remove()
      engineRef.current = null
    }

    cleanupRef.current = cleanup
    return cleanup
  }, [password])

  useEffect(() => {
    const cleanup = init()
    return () => cleanup?.()
  }, [init])

  return { sceneRef, password, currentInput, isWin, reboot: init }
}