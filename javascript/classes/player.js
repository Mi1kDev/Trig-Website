import { Vector2 } from "./datatypes.js"
import { Gun } from "./gun.js"
import { Timer } from "./timer.js"
//class containing all initial player data
export class Player{
    // the class requires a reference to its parent (root) and a sprite to draw
    constructor(game, sprite){
        this.parent = game

        this.sprite = sprite

        // initialize some of the variables used in the class

        this.width = 32
        this.height = 32

        this.x = this.parent.width / 2 - this.width
        this.y = this.parent.height / 2 - this.height

        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2

        this.speed = 5
        this.velocity = new Vector2(0, 0)
        this.acceleration = 0.15
        this.friction = 0.0625

        this.projectileSpeed = 5
        this.projectileRadius = 10
        this.projectileColor = "cyan"
        this.projectileLifetime = 2
        this.damage = 1

        this.dashCd = 3
        this.dashMulti = 2
        this.dashTime = 0.5
        this.canDash = true
        this.isDashing = false

        this.maxHp = 5
        this.currentHp = this.maxHp
        this.canDamage = true
        this.iframes = 0.35
        
        this.shootCd = 0.85
        this.multishot = 1
        this.burst = 1
        this.burstCd = 0.125,
        this.spreadAngle = 5
        this.gun = new Gun(this, this.shootCd, this.multishot, this.burst, this.burstCd, this.spreadAngle)        
        this.isMoving = false

        this.currentRotation
        this.money = 0
        this.startMoney = this.money
        
        this.dashingTimer
        this.dashResetTimer
        this.invincibleTimer
    }
    // toggles all active timers on the player between paused and playing
    togglePlayer(bool){
        if(!bool){
            if(this.dashingTimer){
                this.dashingTimer.pause()
            }
            if(this.dashResetTimer){
                this.dashResetTimer.pause()
            }
            if(this.invincibleTimer){
                this.invincibleTimer.pause()
            }
        }else{
            if(this.dashingTimer){
                this.dashingTimer.resume()
            }
            if(this.dashResetTimer){
                this.dashResetTimer.resume()
            }
            if(this.invincibleTimer){
                this.invincibleTimer.resume()
            }
        }
    }
    // main shoot function of the class
    // calls the guns shoot function after updating the direction the gun should shoot in
    shoot(mouseX, mouseY){
        this.gun.updateAngle(Math.atan2(mouseY - this.y, mouseX - this.x))
        this.gun.shoot(mouseX, mouseY)
    }
    // calls the parent and tells it to instantiate a projectile with the given values
    handleShoot(newAngle){
        this.parent.handleShoot(this.x + this.width / 2, this.y + this.height / 2, this.damage, newAngle, this.projectileSpeed, this.projectileRadius, this.projectileColor, this.projectileLifetime)
    }
    // increases the speed of the player for a short time
    dash(){
        if(this.canDash){
            this.canDash = false
            this.isDashing = true
            this.dashingTimer = new Timer(()=>{this.isDashing = false}, this.dashTime * 1000)
            this.dashResetTimer = new Timer(()=>{this.canDash = true}, this.dashCd * 1000)
        }
    }
    // applies damage to the player and stops the game if the player's health becomes 0
    applyDamage(damage){
        if(this.canDamage && !this.isDashing){
            this.canDamage = false
            this.invincibleTimer = new Timer(()=>{this.canDamage = true}, this.iframes * 1000)
            this.currentHp -= damage
            this.parent.updateHealthUI(this.maxHp, this.currentHp)
            if(this.currentHp <= 0){
                this.parent.onGameEnd()
            }
        }
    }
    // changes various value of a player variable based on a supplied upgrade
    applyUpgrade(upgrade, value){
        if(upgrade == "damage"){
            this.damage = value
        }else if(upgrade == "speed"){
            this.speed = value
        }else if(upgrade == "bulletSpeed"){
            this.projectileSpeed = value
        }else if(upgrade == "bulletRadius"){
            this.projectileRadius = value
        }else if(upgrade == "dashMulti"){
            this.dashMulti = value
        }else if(upgrade == "dashCd"){
            this.dashCd = value
        }else if(upgrade == "burst"){
            this.burst = value
            this.gun.updateValues(this.shootCd, this.multishot, this.burst, this.spreadAngle)
        }else if(upgrade == "multishot"){
            this.multishot = value
            this.gun.updateValues(this.shootCd, this.multishot, this.burst, this.spreadAngle)
        }else if(upgrade == "shootCd"){
            this.shootCd = value
            this.gun.updateValues(this.shootCd, this.multishot, this.burst, this.spreadAngle)
        }else if(upgrade == "spreadAngle"){
            this.spreadAngle = value
            this.gun.updateValues(this.shootCd, this.multishot, this.burst, this.spreadAngle)
        }
    }
    // updates the centerX and centerY of the player which are used in various calculations such as collision detection
    centerUpdate(){
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
    }
    // player update method
    update(keys){
        var dir = new Vector2(0, 0) 
        // calculates the player's current rotation based on the direction from the player to the cursors current position
        this.currentRotation = Math.atan2(this.parent.input.cursorPos.y - this.centerY, this.parent.input.cursorPos.x - this.centerX)
        // updates the direction vector based on the keys the user is currently pressing
        if(keys.includes("a")){
            dir.x -= 1
        }
        if(keys.includes("d")){
            dir.x += 1
        }
        if(keys.includes("w")){
            dir.y -= 1
        }
        if(keys.includes("s")){
            dir.y += 1
        }
        if(keys.includes(" ")){
            this.dash()
        }
        // moves the player in the direction determined by their key inputs
        let targetVelocity = Vector2.multiply(dir, this.speed)
        // if the target velocity is zeroed it means the player isnt moving and we can slow down the player's movement
        //by interpolating their velocity towards a zeroed vector
        if(targetVelocity.x == 0 && targetVelocity.y == 0){
            this.isMoving = false
            this.velocity = Vector2.lerp(this.velocity, new Vector2(0, 0), this.friction)
        }else{
            // if the player is moving then we interpolate towards the target velocity using a given acceleration value. Is doen to provide a smooth increase in speed rather than instantly reaching max speed
            this.isMoving = true
            this.velocity = Vector2.lerp(this.velocity, targetVelocity, this.acceleration)
        }
        // if the player is dashing then we increase the amount of distance traveled by a factor of the dash multiplier
        if(this.isDashing){
            this.x += this.velocity.x * this.dashMulti
            this.y += this.velocity.y * this.dashMulti    
        }else{
            // otherwise we update the position using the previously calculated velocity
            this.x += this.velocity.x
            this.y += this.velocity.y
        }
        // update the center x and center y variables
        this.centerUpdate()

        // prevents the player from going outside the bounds of the canvas
        if(this.x + this.width> this.parent.width){
            this.x = this.parent.width - this.width
        }else if(this.x < 0){
            this.x = 0
        }

        if(this.y + this.height > this.parent.height){
            this.y = this.parent.height - this.height
        }else if(this.y < 0){
            this.y = 0
        }
    }
    // draw method of the player
    draw(){
        this.parent.ctx.shadowColor = "cyan"
        this.parent.ctx.shadowBlur = 15
        this.parent.ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
        this.parent.ctx.rotate(this.currentRotation)
        // if the player is in a state of invincibility (this occurs for a short time after the player is hit) then it only draws the sprite on some iterations
        // this results in a sort of blinking effect
        if(this.canDamage || Math.floor(Date.now() / 200) % 2){
            this.parent.ctx.drawImage(this.sprite, 0, 0, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height)
        }
        
        this.parent.ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
        this.parent.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.parent.ctx.shadowColor = "transparent"
    }
}