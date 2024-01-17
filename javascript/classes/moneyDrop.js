import { Vector2 } from "./datatypes.js"
import { Timer } from "./timer.js"

// This class is instantiated sometimes when an enemy dies. It is the player's means of obtaining money 
export class MoneyDrop{
    // The class needs a reference to the parent (root) an x and y position as well as range for which it determines its value
    constructor(parent, x, y, moneyRange){
        this.parent = parent
        this.x = x
        this.y = y
        this.width = 24
        this.height = 24
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.moneyRange = moneyRange
        // The amount of money stored within the object is equal to a random number between the provided money range
        this.money = Math.floor(Math.random() * (this.moneyRange.rangeEnd - this.moneyRange.rangeStart) + this.moneyRange.rangeStart)
        this.color = this.getColor()
        this.speed = 3
        this.initialDir = this.getRandomDir()
        this.currentRotation = 0
        this.lifetime = 10
        this.velocity = Vector2.multiply(this.initialDir, this.speed)
        this.deathTimer = this.initiateDeath()
    }
    // toggles the deathtimer on and off
    toggleDrops(bool){
        if(!bool){
            if(this.deathTimer){
                this.deathTimer.pause()
            }
        }else{
            if(this.deathTimer){
                this.deathTimer.resume()
            }
        }
    }
    // removes the object from the parent scene
    destroy(){
        this.deathTimer.clear()
        this.parent.destroyDrop(this)
    }
    // starts when the object is instantiated and provides a set amount of time for which the object will remain on the scene if not interacted with
    initiateDeath(){
        return new Timer(()=>{this.destroy()}, this.lifetime * 1000)
    }
    // randomizes the direction the object will travel it
    getRandomDir(){
        var plusOrMinus1 = Math.random() > 0.5 ? -1 : 1
        var plusOrMinus2 = Math.random() > 0.5 ? -1 : 1
        var dir = new Vector2(Math.random() * plusOrMinus1, Math.random() * plusOrMinus2)
        return dir        
    }
    // determines the color of the object based on its money value
    getColor(){
        if(this.money > 0 && this.money <1000){
            return "cyan"
        }else if(this.money >= 1000 && this.money < 1500){
            return "green"
        }else if (this.money >= 1500 && this.money < 2500){
            return "yellow"
        }else{
            return "red"
        }
    }
    // checks for contact with the player
    // If the player interacts with the object then the amount of money the player has is increased and the money drop is destroyed
    getContact(player){
        if(Vector2.distance(new Vector2(this.centerX, this.centerY), new Vector2(player.centerX, player.centerY)) < (this.width / 2 + player.width / 2)){
            this.parent.setPlayerFunds(player.money + this.money)
            clearTimeout(this.deathTimer)
            this.destroy()
        }
    }
    // Limits the movement of the money drop, it cannot go outside the bounds of the canvas
    constrain(){
        if(this.x + this.width > this.parent.width){
            this.x = this.x - this.width
        }else if(this.x < 0){
            this.x = 0
        }

        if(this.y + this.height > this.parent.height){
            this.y = this.y - this.height
        }else if(this.y < 0){
            this.y = 0
        }

    }
    // update function of the drop, called in the root class
    update(player){
        this.getContact(player)
        // Interpolates the velocity towards a zero vector to simulate slowing down as time goes by
        this.velocity = Vector2.lerp(this.velocity, new Vector2(0, 0), 0.0125)

        // increments the rotation by a given factor if the object is in motion
        if(this.velocity.x != 0 && this.velocity.y != 0){
            this.currentRotation += 0.25
        }
        // updates the money drops position depending on its current velocity
        this.x += this.velocity.x
        this.y += this.velocity.y
        // constrain in case the drop has exceeded its bounds
        this.constrain()
        // update the centerX and centerY which are used in the getContact calculation
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
    }
    // draw method of the class
    draw(){
        this.parent.ctx.shadowColor = this.color
        this.parent.ctx.shadowBlur = 10
        this.parent.ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
        this.parent.ctx.rotate(this.currentRotation % 360 * Math.PI / 180)
        this.parent.ctx.beginPath()
        this.parent.ctx.fillStyle = this.color
        this.parent.ctx.rect(0, 0, this.width, this.height)
        this.parent.ctx.fill()
        this.parent.ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2))
        this.parent.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.parent.ctx.shadowColor = "transparent"
    }
}