import React, { useRef, useEffect, useState } from 'react';
import { Stack, TextField, Button, Typography } from '@mui/material';

type Target = {
  x: number;
  y: number;
  r: number;
  value: number;
};

const GRAVITY = 0;
const CONST_FRICTION = 1;
const WALL_BOUNCE = 1.1;
const TARGET_RADIUS = 20;

const createTarget = (
  canvas: HTMLCanvasElement,
  value: number,
  existingTargets: Target[] = []
): Target => {
  let newTarget: Target;
  let attempts = 0;

  do {
    newTarget = {
      x: Math.random() * (canvas.width - 250) + 200,
      y: Math.random() * (canvas.height - 150) + 80,
      r: TARGET_RADIUS,
      value,
    };

    attempts++;
    if (attempts > 100) return newTarget; // avoid infinite loop
  } while (
    existingTargets.some(
      t =>
        Math.abs(t.x - newTarget.x) < 40 && Math.abs(t.y - newTarget.y) < 40
    )
  );

  return newTarget;
};

interface AngryNumbersGameProps {
  label?: string;
  title?: string;
  onSubmit?: (value: string) => void;
  sx?: any;
}

const AngryNumbersGame: React.FC<AngryNumbersGameProps> = ({
  label = "Postal Code",
  title = "Enter Your Postal Code",
  sx
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const runningRef = useRef(false);
  const draggingRef = useRef(false);

  const [score, setScore] = useState('');

  const ball = useRef({
    x: 80,
    y: 300,
    vx: 0,
    vy: 0,
    r: 10,
  });

  const mouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const targets = useRef<Target[]>([]);

  // ---------------- INITIAL SETUP ----------------
  useEffect(() => {
    const canvas = canvasRef.current!;
    targets.current = [];

    for (let i = 0; i < 10; i++) {
      const newTarget = createTarget(canvas, i, targets.current);
      targets.current.push(newTarget);
    }

  }, []);

  // ---------------- DRAW LOOP ----------------
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const drawTrajectory = () => {
      let tx = ball.current.x;
      let ty = ball.current.y;
      let tvx = velocity.current.x;
      let tvy = velocity.current.y;

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let i = 0; i < 25; i++) {
        tvy += GRAVITY;
        tx += tvx;
        ty += tvy;
        
        ctx.beginPath();
        ctx.arc(tx, ty, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Physics
      if (runningRef.current) {
        ball.current.vy += GRAVITY;
        ball.current.x += ball.current.vx;
        ball.current.y += ball.current.vy;
        ball.current.vx *= CONST_FRICTION;
        ball.current.vy *= CONST_FRICTION;


        // Walls
        if (ball.current.x < ball.current.r) {
          ball.current.x = ball.current.r;
          ball.current.vx *= -WALL_BOUNCE;
        }
        if (ball.current.x > canvas.width - ball.current.r) {
          ball.current.x = canvas.width - ball.current.r;
          ball.current.vx *= -WALL_BOUNCE;
        }
        if (ball.current.y < ball.current.r) {
          ball.current.y = ball.current.r;
          ball.current.vy *= -WALL_BOUNCE;
        }
      }

      // Ground
      if (ball.current.y > canvas.height - ball.current.r) {
        ball.current.y = canvas.height - ball.current.r;
        ball.current.vy *= -0.4;
        ball.current.vx *= 0.95;
      }

      // Targets
      targets.current.forEach((t, index) => {
        const dx = ball.current.x - t.x;
        const dy = ball.current.y - t.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ball.current.r + t.r) {
          setScore(prev => prev + t.value.toString());

          // exclude the current target from collision check
          const otherTargets = targets.current.filter((_, i) => i !== index);

          targets.current[index] = createTarget(canvas, t.value, otherTargets);
        }

        // draw the target
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
        ctx.fillStyle = '#1976d2';
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.font = '14px sans-serif';
        ctx.fillText(t.value.toString(), t.x - 4, t.y + 5);
      });


      // Pull feedback
      if (draggingRef.current) {
        ctx.beginPath();
        ctx.moveTo(ball.current.x, ball.current.y);
        ctx.lineTo(mouse.current.x, mouse.current.y);
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.stroke();

        drawTrajectory();
      }

      // Ball
      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, ball.current.r, 0, Math.PI * 2);
      ctx.fillStyle = draggingRef.current ? 'orange' : 'red';
      ctx.fill();

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current!);
  }, []);

  // ---------------- INPUT ----------------
  const onMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    draggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;

    const rect = canvasRef.current!.getBoundingClientRect();
    mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    
    velocity.current = {
      x: (ball.current.x - mouse.current.x) * 0.1,
      y: (ball.current.y - mouse.current.y) * 0.1,
    };
  };

  const onMouseUp = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    runningRef.current = true;

    ball.current.vx = velocity.current.x;
    ball.current.vy = velocity.current.y;
  };

  // ---------------- CONTROLS ----------------
  const clear = () => {
    setScore('');
    runningRef.current = false;

    ball.current = { x: 80, y: 300, vx: 0, vy: 0, r: 10 };

    const canvas = canvasRef.current!;
    targets.current = [];

    for (let i = 0; i < 10; i++) {
      const newTarget = createTarget(canvas, i, targets.current);
      targets.current.push(newTarget);
    }

  };

  // ---------------- UI ----------------
  return (
    <Stack 
      spacing={2} alignItems="center"
      sx = {{
        display: "flex",
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        width: '100%',
        ...sx
      }}
    >
      <Typography variant="h6">{title}</Typography>

      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        style={{ border: '1px solid black' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />

      <TextField
        label={label}
        value={score}
        InputProps={{ readOnly: true }}
      />

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" color="error" onClick={clear}>
          Clear
        </Button>
      </Stack>
    </Stack>
  );
};

export default AngryNumbersGame;
