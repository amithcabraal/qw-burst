import Matter from 'matter-js';
import { Prize } from '../types';

const PRIZES: Prize[] = [
  { symbol: '🌟', color: '#fbbf24' },
  { symbol: '💎', color: '#60a5fa' },
  { symbol: '🎈', color: '#ef4444' },
  { symbol: '🎯', color: '#10b981' },
];

export class Target {
  body: Matter.Body;
  world: Matter.World;
  engine: Matter.Engine;
  onHit?: (prize: Prize) => void;
  onMiss?: () => void;
  prize: Prize;
  collisionHandler: (event: Matter.IEventCollision<Matter.Engine>) => void;

  constructor(world: Matter.World, engine: Matter.Engine, x: number, y: number) {
    this.world = world;
    this.engine = engine;
    this.prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];

    this.body = Matter.Bodies.circle(x, y, 20, {
      render: {
        fillStyle: this.prize.color,
      },
      label: 'target',
      friction: 0.001,
      frictionAir: 0.001,
      restitution: 0.5,
    });

    Matter.World.add(world, this.body);

    // Create collision handler
    this.collisionHandler = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA === this.body || pair.bodyB === this.body) {
          const otherBody = pair.bodyA === this.body ? pair.bodyB : pair.bodyA;
          if (otherBody.label !== 'target') {
            this.handleCollision();
          }
        }
      });
    };

    // Add collision handler to engine events
    Matter.Events.on(this.engine, 'collisionStart', this.collisionHandler);

    // Check if target hits the ground
    Matter.Events.on(this.engine, 'afterUpdate', () => {
      if (this.body.position.y > CANVAS_HEIGHT - 40) {
        this.onMiss?.();
      }
    });
  }

  handleCollision() {
    if (Math.random() > 0.5) {
      this.explode();
    } else {
      this.onHit?.(this.prize);
    }
  }

  explode() {
    const position = this.body.position;
    
    // Remove collision handler before removing body
    Matter.Events.off(this.engine, 'collisionStart', this.collisionHandler);
    Matter.World.remove(this.world, this.body);

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const velocity = 5;
      const particle = Matter.Bodies.circle(
        position.x,
        position.y,
        5,
        {
          render: {
            fillStyle: this.prize.color,
          },
          frictionAir: 0.01,
        }
      );

      Matter.Body.setVelocity(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
      });

      Matter.World.add(this.world, particle);

      setTimeout(() => {
        Matter.World.remove(this.world, particle);
      }, 1000);
    }

    this.onMiss?.();
  }
}