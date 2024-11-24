import Matter from 'matter-js';

export class Cannon {
  body: Matter.Body;
  angle: number = 0;
  world: Matter.World;
  shootInterval: NodeJS.Timeout | null = null;

  constructor(world: Matter.World, x: number, y: number) {
    this.world = world;
    this.body = Matter.Bodies.rectangle(x, y, 40, 60, {
      isStatic: true,
      render: {
        fillStyle: '#4f46e5',
      },
    });

    Matter.World.add(world, this.body);
  }

  rotate(deltaAngle: number) {
    this.angle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.angle + deltaAngle));
    Matter.Body.setAngle(this.body, this.angle);
  }

  shoot() {
    const force = 0.02;
    const ball = Matter.Bodies.circle(
      this.body.position.x + Math.sin(this.angle) * 40,
      this.body.position.y - Math.cos(this.angle) * 40,
      5,
      {
        render: {
          fillStyle: '#60a5fa',
        },
        restitution: 0.8,
      }
    );

    Matter.World.add(this.world, ball);
    Matter.Body.applyForce(
      ball,
      ball.position,
      {
        x: Math.sin(this.angle) * force,
        y: -Math.cos(this.angle) * force,
      }
    );

    // Remove ball after 3 seconds
    setTimeout(() => {
      Matter.World.remove(this.world, ball);
    }, 3000);
  }

  startShooting() {
    if (!this.shootInterval) {
      this.shootInterval = setInterval(() => this.shoot(), 200);
    }
  }

  stopShooting() {
    if (this.shootInterval) {
      clearInterval(this.shootInterval);
      this.shootInterval = null;
    }
  }
}