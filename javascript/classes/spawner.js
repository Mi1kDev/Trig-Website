import { enemyTypes } from "./enemyType.js"
import { Timer } from "./timer.js"

// This class control the speed, number and limits for the spawning of enemies
export class Spawner{
    // the class requires a reference to its parent class
    constructor(parent){
        this.parent = parent
        this.countDownTime = 3
        this.isCountDownEnded = false

        this.waveCount
        this.spawnCount = 0
        this.spawnSpeed
        this.spawnCap
        this.playerDead = false    
        this.canSpawn = true
        this.spawnCapped = false
        this.maxPointCalc = 20000
        // sets the upper and lower limits for the main properties of the spawner
        this.spawnSpeedRange = {y2: 0.25, y1: 3}
        this.waveCountRange = {y1: 1, y2: 5}
        this.spawnCapRange = {y1: 5, y2: 30}
        this.countDownTimer
        this.spawnTimer
    }
    // uses the player's current points to determine what various values of the spawner should be set to
    lineEquation(points, range){
        let m = (range.y2 - range.y1) / this.maxPointCalc
        return m * points + range.y1
    }
    // calculates the new spawning speed based on the current points
    getSpawnSpeed(points){
        let newSpeed = this.lineEquation(points, this.spawnSpeedRange)
        if(newSpeed <= this.spawnSpeedRange.y2){
            newSpeed = this.spawnSpeedRange.y2
        }
        return newSpeed
    }
    // calculates the new number of enemies in a wave based on the current points
    getWaveCount(points){
        let newCount = this.lineEquation(points, this.waveCountRange)
        newCount = Math.max(Math.min(newCount, Math.max(this.waveCountRange.y1, this.waveCountRange.y2)), Math.min(this.waveCountRange.y1, this.waveCountRange.y2))
        return Math.floor(newCount)
    }
    // calculates the maximum number of enemies allowed on screen at once, based on the current points
    getSpawnCap(points){
        let newCap = this.lineEquation(points, this.spawnCapRange)
        newCap = Math.max(Math.min(newCap, Math.max(this.spawnCapRange.y1, this.spawnCapRange.y2)), Math.min(this.spawnCapRange.y1, this.spawnCapRange.y2))
        return Math.floor(newCap)
    }
    // initiates a countdown before enemies start being spawned
    startCountDown(points){
        this.countDownTimer = new Timer(()=>{
            this.parent.startTimer()
            this.spawn(points)
            this.isCountDownEnded = true
        }, this.countDownTime * 1000)
    }
    // updates values of the spawwner based on the current points
    setSpawnValues(points){
        this.spawnCap = this.getSpawnCap(points)
        this.spawnSpeed = this.getSpawnSpeed(points)
        this.waveCount = this.getWaveCount(points)
    }
    // determines whether spawning should be allowed or not based on the current amount spawned as well as the maximum allowed number of spawns
    capSpawner(){
        if(this.spawnCount >= this.spawnCap){
            this.spawnCapped = true   
        }
        if(this.spawnCount <= this.spawnCap - this.waveCount){
            this.spawnCapped = false
        }
    }
    // toggles all timers regarding the spawner class
    toggleSpawn(bool){
        if(!bool){
            if(this.countDownTimer){
                this.countDownTimer.pause()
            }
            if(this.spawnTimeout){
                this.spawnTimeout.pause()
            }
        }else{
            if(this.countDownTimer /*&& !this.isCountDownEnded*/){
                this.countDownTimer.resume()
            }
            if(this.spawnTimeout){
                this.spawnTimeout.resume()
            }
        }
    }
    // if the maximum number of spawns has not been reached then this function instantiates enemies based on the wave count
    spawn(points){
        this.canSpawn = true
        if(this.spawnCapped){
            return
        }
        // update the spawn values
        this.setSpawnValues(points)      
        let keyList = Object.keys(enemyTypes)
        for (let i = 0; i < this.waveCount; i++) {
            // selects a random type of enemy
            let rng = Math.floor(Math.random() * keyList.length)
            let e = enemyTypes[keyList[rng]]
            // selects a random location on the canvas to place the enemy
            var x = Math.floor(Math.random() * this.parent.width)
            var y = Math.floor(Math.random() * this.parent.height)
            // informs the parent class to instantiate the indicator for the enemy
            this.parent.handleIndicator(e, x, y, keyList[rng])
            // increment the number of enemies currently spawned
            this.spawnCount += 1
        }
    }
    // update method for the spawner class
    update(points){
        // if the countdown has ended the countdown can commence
        if(this.isCountDownEnded){
            // clears and deletes the countdown timer as it is no longer needed
            if(this.countDownTimer){
                this.countDownTimer.clear()
                this.countDownTimer = null
            }
            // caps the spawn values if necessary
            this.capSpawner()
            // if the spawner is allowed to spawn then it starts a timer using the given spawn speed and on timeout an indicator will be instanced
            if (this.canSpawn) {
                this.canSpawn = false
                this.spawnTimeout = new Timer(() => {
                    this.spawn(points)
                }, this.spawnSpeed * 1000)
            }
            
        }
    }
}