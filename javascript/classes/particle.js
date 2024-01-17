import { Vector2 } from "./datatypes.js"

// Particle class. Essentially some additional effects to help beautify the game
export class Particles{
    // the class requires a reference to its parent (root), a color, a position (x, y), a maximum radius and an initial speed
    constructor(parent, color, x, y, radiusMax, speed){
        this.parent = parent
        this.color = color
        this.alpha = 1
        this.x = x
        this.y = y
        // sets a radius between a lower limit of 2 and half of the given upper limit
        this.radius = Math.random() * (radiusMax / 2) + 2
        // sets a random speed between the lower limit of 5 and the upper limit of the provided speed
        this.speed = Math.random() * speed + 5
        // keeps track of the history of the particle in order to draw the trail
        this.trail = []
        // sets initial velocity to a random direction multiplied by provided speed
        this.velocity = Vector2.multiply(new Vector2(Math.random() - 0.5, Math.random() - 0.5), this.speed)
    }
    // inform the parent to remove the particle from the scene
    cleanUp(){
        this.parent.cleanParticles(this)
    }
    // update method of the particle
    update(){
        // makes the particle more and more transparent as its lifetime continues
        this.alpha -= 0.015
        // once the particle is extremely faded the cleanup function is called to have it removed from the scene
        if(this.alpha <= 0.02){
            this.alpha = 0
            this.cleanUp()
        }
        // interpolates the velocity towards a zero vector by a given factor
        // this simulates friction
        this.velocity = Vector2.lerp(this.velocity, new Vector2(0, 0), 0.05)
        // update the position of the particle by the velocity
        this.x += this.velocity.x
        this.y += this.velocity.y
        // keeps track of the last 50 positions placed into the trail list
        this.trail.push([this.x, this.y])
        this.trail = this.trail.slice(-50)
    }
    // draw function of the class
    draw(){
        // sets the transparency of the class to match the alpha value
        this.parent.ctx.globalAlpha = this.alpha
        this.parent.ctx.fillStyle = this.color
        this.parent.ctx.beginPath()
        this.parent.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.parent.ctx.fill()
        // if there exists a trail then the trail is drawn to replicate the movement history of the particle
        if(this.trail.length > 0){
            this.parent.ctx.beginPath()
            this.parent.ctx.lineWidth = this.radius
            this.parent.ctx.moveTo(this.trail[0][0], this.trail[0][1])
            for(let point of this.trail){
                this.parent.ctx.lineTo(point[0], point[1])
            }
            this.parent.ctx.strokeStyle = this.color
            this.parent.ctx.stroke()
            this.parent.ctx.strokeStyle = "transparent"
            this.parent.ctx.lineWidth = 1
        }
        this.parent.ctx.fillStyle = "transparent"
        this.parent.ctx.globalAlpha = 1
    }
}