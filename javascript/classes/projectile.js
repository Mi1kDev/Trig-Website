import { Timer } from "./timer.js"

// projectile object used by the gun class
export class Projectile{
    // the class requires a reference to the root class, a boolean to determine whether the projectile was instanced by a player or not, a damage value, a position, the angle it should travel in, speed, a radius, a color, and a maximum time it should be on screen
    constructor(game, isPlayer, damage, x, y, angle, speed, radius, color, lifetime){
        this.parent = game
        this.isPlayer = isPlayer
        this.damage = damage
        this.x = x
        this.y = y
        this.angle = angle
        this.speed = speed
        this.radius = radius
        this.color = color
        this.lifetime = lifetime
        // immediately starts a timer to destroy the projectile once its lifetime has passed
        this.timeout = new Timer(()=>{this.explode()}, this.lifetime * 1000)
    }
    // toggles the timers of the projectile
    toggleProjectiles(bool){
        if(!bool){
            if(this.timeout){
                this.timeout.pause()
            }
        }else{
            if(this.timeout){
                this.timeout.resume()
            }
        }
    }
    // checks if the projectile has hit any provided targets
    hitCheck(target){
        for(let i = 0; i < target.length; i++){
            let dist = Math.sqrt(Math.pow(target[i].centerX - this.x, 2) + Math.pow(target[i].centerY - this.y, 2))
            if(dist <= this.radius + target[i].width / 2){
                target[i].applyDamage(this.damage)
                this.explode()
                return
            }
        }
    }
    // if the projectile flies off screen it is destroyed
    offScreenClear(){
        if(this.x - this.radius > this.parent.width){
            this.explode()
        }else if(this.x + this.radius < 0){
            this.explode()
        }

        if(this.y + this.radius > this.parent.height){
            this.explode()
        }else if(this.y + this.radius < 0){
            this.explode()
        }
    }
    // tells the parent class to remove the projectile from the scene
    explode(){
        this.timeout.clear()
        // if it a player instanced projectile then it is removed from the parent class's list of player projectiles
        if(this.isPlayer){
            this.parent.destroyPlayerProjectile(this)
        }else{
            // otherwise it is removed from the parent class' list of enemy projectiles
            this.parent.destroyEnemyProjectile(this)
        }   
    }
    // update method of the projectile
    update(bodies){
        // updates the projectile's position bsaed on the angle
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        // destorys the projectile if it travels off screen
        this.offScreenClear()
        // checks if the projectile has collided with any valid bodies
        this.hitCheck(bodies)
    }
    // draw method of the projectile
    draw(){
        this.parent.ctx.beginPath()
        this.parent.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.parent.ctx.strokeStyle = this.color
        this.parent.ctx.stroke()
    }
    
}