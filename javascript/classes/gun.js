// imports the timer class to handle the timeout events for the gun
import { Timer } from "./timer.js"

// class defined to hold the values which determine how and when either a player or enemy can instantiate projectiles (shoot)
export class Gun{
    // The class needs a reference to its parent as well as the unique values used to determine how it shoots and when it is allowed to shoot
    constructor(parent, shootCooldown, multiShot, burst, burstCd, spreadAngle){
        this.parent = parent
        this.canShoot = true
        this.shootCooldown = shootCooldown
        this.multiShot = multiShot
        this.burst = burst
        this.burstCd = burstCd
        this.spreadAngle = spreadAngle
        this.cooldownTimer
        this.timer
        this.currentAngle
    }
    // Pauses the burst cooldown timer for the gun if it exists, this is done to prevent bullets being created when the game is meant to be paused
    // Also pauses the shoot cooldown timer for the gun, making it so the player's cooldown is reset while the game is meant to be paused
    toggleShots(bool){
        if(!bool){
            if(this.timer){
                this.timer.pause()
            }
            if(this.cooldownTimer){
                this.cooldownTimer.pause()
            }
        }else{
            if(this.timer){
                this.timer.resume()
            }
            if(this.cooldownTimer){
                this.cooldownTimer.resume()
            }
        }
    }
    // As the upgrades a player can purchase will affect the values stored in the gun, there needs to be a method which can update the gun's values without the object to be reinstantiated
    // The following function fulfills that purpose
    updateValues(shootCd, multishot, burst, spreadAngle){
        this.shootCooldown = shootCd
        this.multiShot = multishot
        this.burst = burst
        this.spreadAngle = spreadAngle
    }
    // Adjusts the current angle at which a projectile should be deployed with
    updateAngle(angle){
        this.currentAngle = angle
    }
    // converts degrees to radian
    deg2rad(deg){
        return deg * (Math.PI/180)
    }
    // calculates the angle each projectile should be fired at
    calculateSpread(){
        var angle = 0
        var rads = []
        for(let i = 0; i < this.multiShot; i++){
            if(i % 2 == 0){
                rads.push(-angle)
                angle += this.deg2rad(this.spreadAngle)
            }else{
                rads.push(angle)
                if(i == 0){
                    angle += this.deg2rad(this.spreadAngle)
                }
            }
        }
        return rads
    }
    // resets the ability for the gun to fire
    resetCooldown(){
        this.canShoot = true
    }
    // recursively loops and instantiates the number of projectiles that make up the guns burst value
    shootAction(i, angles){
        // A timer is used to allow for pausing and resuming of method execution if necessary
        this.timer = new Timer(()=>{
            if(i < this.burst - 1){
                for(let j= 0; j < angles.length; j++){
                    // calls the parents handle function which informs the parent to inform their parent (the root) to instantiate a projectile that is fired at the provided angle
                    this.parent.handleShoot(this.currentAngle + angles[j])
                    // once the burst cooldown time has passed this function is called once more, this keeps happening until the appropriate number of projectiles have been instanced
                    this.shootAction((i + 1), angles)
                }
            }else{
                return
            }
        },this.burstCd * 1000)
    }
    // main function of the class, instantiates bullets in the appropriate travel direction
    // This function also controls when the player or enemy is allowed to shoot
    shoot(){
        if(this.canShoot){
            var angles = this.calculateSpread()
            this.canShoot = false
            this.cooldownTimer = new Timer(()=>{
                this.resetCooldown()
            }, this.shootCooldown * 1000)
            if(this.multiShot > 0){
                if(this.burst > 0){
                    for(let j = 0; j < angles.length; j++){
                        this.parent.handleShoot(this.currentAngle + angles[j])
                    }
                    this.shootAction(0, angles)
                }
            }
        }
    }
}