import React, { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';
import { useGameStore } from '../store/gameStore';
import { Target } from '../lib/Target';
import { Cannon } from '../lib/Cannon';
import { PrizeDisplay } from './PrizeDisplay';
import { GameOver } from './GameOver';
import { Controls } from './Controls';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const cannonRef = useRef<Cannon>();
  const currentTargetRef = useRef<Target | null>(null);
  const { score, gameOver, prizes, addPrize, setGameOver } = useGameStore();

  const spawnTarget = useCallback((world: Matter.World, engine: Matter.Engine) => {
    if (currentTargetRef.current) return;
    const target = new Target(
      world,
      engine,
      Math.random() * (CANVAS_WIDTH - 100) + 50,
      -30
    );
    target.onHit = (prize) => {
      addPrize(prize);
      Matter.World.remove(world, target.body);
      currentTargetRef.current = null;
      setTimeout(() => spawnTarget(world, engine), 1000);
    };
    target.onMiss = () => {
      Matter.World.remove(world, target.body);
      currentTargetRef.current = null;
      setTimeout(() => spawnTarget(world, engine), 1000);
    };
    currentTargetRef.current = target;
  }, [addPrize]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create engine with gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.5 }
    });
    engineRef.current = engine;
    const world = engine.world;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false,
        background: '#1a1a2e',
      },
    });

    // Create walls
    const walls = [
      Matter.Bodies.rectangle(400, 610, 810, 20, { 
        isStatic: true,
        render: { fillStyle: '#4f46e5' }
      }),
      Matter.Bodies.rectangle(-10, 300, 20, 610, { 
        isStatic: true,
        render: { fillStyle: '#4f46e5' }
      }),
      Matter.Bodies.rectangle(810, 300, 20, 610, { 
        isStatic: true,
        render: { fillStyle: '#4f46e5' }
      }),
    ];

    Matter.World.add(world, walls);

    // Create cannon
    const cannon = new Cannon(world, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 40);
    cannonRef.current = cannon;

    // Start the engine and renderer
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Spawn initial target immediately
    spawnTarget(world, engine);

    // Game loop
    const gameLoop = setInterval(() => {
      if (gameOver) return;
      
      const cannonPos = cannon.body.position;
      const bodies = Matter.Composite.allBodies(world);
      const blockingBodies = bodies.filter(body => {
        return body.position.y > CANVAS_HEIGHT - 100 && 
               Math.abs(body.position.x - cannonPos.x) < 50;
      });

      if (blockingBodies.length > 5) {
        setGameOver(true);
        clearInterval(gameLoop);
      }
    }, 16);

    return () => {
      clearInterval(gameLoop);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      
      if (currentTargetRef.current) {
        Matter.Events.off(engine, 'collisionStart', currentTargetRef.current.collisionHandler);
      }
      
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, [spawnTarget, setGameOver, gameOver]);

  const handleRotateLeft = () => {
    if (cannonRef.current) {
      cannonRef.current.rotate(-0.1);
    }
  };

  const handleRotateRight = () => {
    if (cannonRef.current) {
      cannonRef.current.rotate(0.1);
    }
  };

  const handleShootStart = () => {
    if (cannonRef.current) {
      cannonRef.current.startShooting();
    }
  };

  const handleShootEnd = () => {
    if (cannonRef.current) {
      cannonRef.current.stopShooting();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="absolute top-4 left-4 text-white text-2xl font-bold">
        Score: {score}
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-indigo-500 rounded-lg shadow-2xl"
      />
      <PrizeDisplay prizes={prizes} />
      <Controls
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onShootStart={handleShootStart}
        onShootEnd={handleShootEnd}
      />
      {gameOver && <GameOver score={score} />}
    </div>
  );
};