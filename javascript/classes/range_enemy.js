import { Vector2 } from "./datatypes.js"
import { Gun } from "./gun.js"

// class dictating the behaviour of all ranged enemies
export class RangedEnemy{
    constructor(parent, target, sprite, maxHp, damage, minDistanceFromTarget, backOff, detection, speed, color, x, y, width, height, check, cohesiveForce, separationDistance, separationForce, alignForce, targetForceDampen, projectile, weapon, points, money){
        this.sprite = sprite
        this.target = target
        this.parent = parent
        this.maxHp = maxHp
        this.damage = damage
        this.currentHp = this.maxHp
        this.minDistanceFromTarget = minDistanceFromTarget
        this.backOff = backOff
        this.detection = detection
        this.speed = speed
        this.color = color
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.allies = []
        this.check = check
        this.cohesiveForce = cohesiveForce
        this.separationDistance = separationDistance
        this.separationForce = separationForce
        this.alignForce = alignForce
        this.targetForceDampen = targetForceDampen
        this.projectileSpeed = projectile.speed
        this.projectileRadius = projectile.radius
        this.projectileColor = projectile.color
        this.projectileLifetime = projectile.lifetime 
        this.points = points
        this.money = money

        this.velocity = new Vector2(0, 0)
        this.currentRotation
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.gun = new Gun(this, weapon.shootCd, weapon.multishot, weapon.burst, weapon.burstCd, weapon.spread)
    }
    // loops through the parent's list of enemies and stores those that are within a provided distance into its own ally class for use in other calculation
    // also checks if any of the items stored in its allies class have left the range of detection and if so removes them from the class
    getAllies(){
        this.parent.enemies.forEach(enemy => {
            if(enemy !== this){
                if(!this.allies.includes(enemy) && (Vector2.distance(new Vector2(this.centerX, this.centerY), new Vector2(enemy.centerX, enemy.centerY)) <= this.detection)){
                    this.allies.push(enemy)
                }else if(this.allies.includes(enemy) && (Vector2.distance(new Vector2(this.centerX, this.centerY), new Vector2(enemy.centerX, enemy.centerY)) > this.detection)){
                    this.allies.splice(this.allies.indexOf(enemy), 1)
                }
            }
        })
    }
    // calculates the central position of all the class's allies
    // how much its movement is dependent on this value is dependent on the provided cohesive force
    getCentralBoidLocation(){
        let centralPos = new Vector2(0, 0)
        if(this.allies.length > 0){
            for(let i = 0; i < this.allies.length; i++){
                centralPos = Vector2.add(centralPos, new Vector2(this.allies[i].centerX, this.allies[i].centerY))
            }
            centralPos = Vector2.divide(centralPos, this.allies.length)
            centralPos = Vector2.multiply(Vector2.subtract(centralPos, new Vector2(this.centerX, this.centerY)), this.cohesiveForce)
            
            return centralPos
        }
        return centralPos
        
    }
    // if the distance between the enemy and its allies is too small then it calculates a vector to move away from its allies, attempting to maintain a certain distance
    // The separation force determines how strongly the enemy takes this into account
    getSeparationVector(){
        let sepVector = new Vector2(0, 0)
        if(this.allies.length > 0){
            for(let i = 0; i < this.allies.length; i++){
                let allyPos = new Vector2(this.allies[i].centerX, this.allies[i].centerY)
                if(Vector2.distance(allyPos, new Vector2(this.centerX, this.centerY)) <= this.separationDistance){
                    sepVector = Vector2.add(sepVector, Vector2.subtract(new Vector2(this.centerX, this.centerY),new Vector2(this.allies[i].centerX, this.allies[i].centerY)))
                }
            }
            return Vector2.multiply(sepVector, this.separationForce)
        }
        return sepVector        
    }
    // attempts to have its velocity match the average velocity of all its allies
    // how much this is taken into account is dependent on the aligh force
    getAlignmentVector(){
        let alignVector = new Vector2(0, 0)
        if(this.allies.length > 0){
            for(let  i = 0; i < this.allies.length; i++){
                alignVector = Vector2.add(alignVector, this.allies[i].velocity)
            }
            alignVector = Vector2.divide(alignVector, this.allies.length)
            return Vector2.multiply(alignVector, this.alignForce)
        }
        return alignVector
    }
    // moves the enemy towards the player if the distance between them is above a certain threshold
    // moves the enemy away from the player if the distance between them is below a certain threshold
    // the target force dampen determines how strongly this is taken into account
    getMoveVector(){
        var moveVector = new Vector2(0, 0)
        var transformPos = new Vector2(this.centerX, this.centerY)
        var targetPos = new Vector2(this.target.centerX, this.target.centerY)
        if(Vector2.distance(targetPos, transformPos) > this.minDistanceFromTarget){
            moveVector = Vector2.multiply(Vector2.subtract(this.target, transformPos), this.targetForceDampen)
        }else if(Vector2.distance(targetPos, transformPos) <= this.backOff){
            moveVector = Vector2.multiply(Vector2.subtract(transformPos, targetPos), this.targetForceDampen)
        }
        return moveVector
    }
    // prevents the enemy from leaving the bounds of the canvas
    constrain(){
        if(this.x > this.parent.canvas.width - this.width){
            this.x = this.parent.canvas.width - this.width
        }else if(this.x < 0){
            this.x = 0
        }
        if(this.y > this.parent.canvas.height - this.height){
            this.y = this.parent.canvas.height - this.height
        }else if(this.y < 0){
            this.y = 0
        }
    }
    // informs the parent class to instantiate a projectile with the provided attributes
    handleShoot(newAngle){
        this.parent.handleEnemyShoot(this.x + this.width / 2, this.y + this.height /2, this.damage, newAngle, this.projectileSpeed, this.projectileRadius, this.projectileColor, this.projectileLifetime)
    }
    // calls the class's gun's shoot function after updating the direction in which the gun should be facing
    shoot(){
        this.currentRotation = Math.atan2(this.target.centerY- this.centerY, this.target.centerX - this.centerX)
        this.gun.updateAngle(this.currentRotation)
        this.gun.shoot()
    }
    // destroys the class instance by having it removed from the scene by the parent
    explode(){
        this.gun.timer.clear()
        // on an enemy death several things can happen which are handled by the parent's handler function
        this.parent.handleEnemyDeath(this.points, this.money, this.centerX, this.centerY)
        this.parent.destroyEnemy(this)   
    }
    // applies damage to the enemy and destroys it if it reaches 0 health
    applyDamage(damage){
        this.currentHp -= damage
        if(this.currentHp <= 0){
            this.explode()
        }
    }
    // updates the center x and y positions of the class
    centerUpdate(){
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
    }
    // update method of the class
    update(){
        // gets all surrounding allies
        this.getAllies()
        // calculates the various vectors for determining movement
        let a = this.getAlignmentVector()
        let c = this.getCentralBoidLocation()
        let m = this.getMoveVector()
        let s = this.getSeparationVector()
        // sums the vectors
        var currentVel = Vector2.sum([s, c, a, m])
        // normalizes the vector and multiplies it by speed
        currentVel = Vector2.multiply(currentVel.normalized(), this.speed)
        // interpolates the velocity to meet the targhet velocity using an acceleration rate of 0.05
        this.velocity = Vector2.lerp(this.velocity, currentVel, 0.05)
        // update the position of the class
        this.x += this.velocity.x
        this.y += this.velocity.y
        // updates the center positions of the class
        this.centerUpdate()
        // shoots if possible
        this.shoot()
        // prevents enemy from leaving canvas bounds
        this.constrain()
    }
    // draw method of the class
    draw(){
        this.parent.ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
        this.parent.ctx.rotate(this.currentRotation)
        this.parent.ctx.drawImage(this.sprite, 0, 0, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height)
        this.parent.ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
        this.parent.ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
}