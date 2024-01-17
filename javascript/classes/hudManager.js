// class is in charge of drawing various menus and UI based on the state of the game
export class HudManager{
    // The class needs a reference to its parent (root) as well as reference to certain sprites used
    constructor(parent, sprites){
        this.parent = parent
        this.sprites = sprites
        this.timePassed = 0
        this.timeOut
        this.name
        // if the user is signed in we store their name for use later
        if(localStorage.getItem("signedIn")){
            this.name = JSON.parse(localStorage.getItem("signedIn")).username
        }
        // keeps track of the current position of elements on the main menu
        this.menuPos = {x: this.parent.width / 2, y: this.parent.height / 2}
        // determines the speed at which the main menu moves while animating
        this.menuAnimateSpeed = 2.5
        // the maximum allowed width of the health UI element
        this.maxHpWidth = 400
        // depicts the width of the player's current health out of the maximum health
        this.currentHpWidth = this.maxHpWidth
        // helps produce the white effect of a shrinking rectangle once the player takes damage
        this.tweenVal = this.currentHpWidth
        // the speed at which that white effect decreases
        this.tweenSpeed = 0.75
        // keeps track of the state of the classes timer
        this.timerPaused = false
        // initial difficulty message and the colour it should be drawn to the screen in
        this.difficulty = {
            message: "Easy",
            color: "cyan",
        }
    }
    // Pauses and resumes elements of the hud, namely the updating of seconds elapsed
    toggleHud(bool){
        if(!bool){
            if(this.timeOut && !this.timerPaused){
                clearInterval(this.timeOut)
                this.timeOut = null
                this.timerPaused = true
            }
        }else{
            if(this.timerPaused){
                this.timeOut = setInterval(()=>{
                    this.timePassed += 1
                }, 1000)
                this.timerPaused = false
            }
        }
    }
    // starts updating the elapsed playtime
    startTimer(){
        this.timerInitiated = true
        this.timeOut = setInterval(()=>{
            this.timePassed += 1
        }, 1000)
    }
    // function stops running code once the game has ended
    gameEnd(){
        clearInterval(this.timeOut)
    }
    // updates the UI to reflect the player's remaining health compared to their maximum health
    updateHealth(maxHp, currentHp){
        let pct = currentHp / maxHp * this.maxHpWidth
        this.currentHpWidth = pct
    }
    // draws the main menu to the screen
    drawMainMenu(){
        this.parent.ctx.textAlign = "center"
        this.parent.ctx.fillStyle = "cyan"
        this.parent.ctx.font = "36px Nasalization"
        this.parent.ctx.fillText("Trig", this.menuPos.x, this.menuPos.y)
        if(this.menuPos.y > 100){
            this.menuPos.y -= this.menuAnimateSpeed
        }else if(this.menuPos.y <= 100){
            this.parent.ctx.fillText("-Press [ENTER] to start-", this.parent.width / 2, this.parent.height / 2)
            this.parent.ctx.fillText("-     Press [H] for help     -", this.parent.width / 2 , this.parent.height  / 2 + 36)
        }
    }
    // draws the help menu to the screen
    drawHelp(){
        this.parent.ctx.fillStyle = "cyan"
        this.parent.ctx.font = "36px Nasalization"
        this.parent.ctx.textAlign = "center"
        this.parent.ctx.fillText("How to Play", this.parent.width / 2, 30)
        this.parent.ctx.textAlign = "left"
        this.parent.ctx.fillText("Controls:", 50, 66)
        this.parent.ctx.fillText("W A S D to Move", 50, 102)
        this.parent.ctx.fillText("LMB to Shoot", 50, 138)
        this.parent.ctx.fillText("SPACE to Dash", 50, 174)
        this.parent.ctx.fillText("P to Pause", 50, 210)
        this.parent.ctx.fillText("Goal:", 50, 282)
        this.parent.ctx.fillText("Survive as long as you can", 50, 318)
        this.parent.ctx.fillText("Killing enemies rewards points", 50, 354)
        this.parent.ctx.fillText("Enemies will sometimes drop money", 50, 390)
        this.parent.ctx.fillText("which can be used for upgrades", 50, 426)
        this.parent.ctx.fillText("Press ESC to leave this menu", 50, this.parent.height - 36)
    }
    // draws the elapsed time onto the screen
    drawTimer(){
        this.parent.ctx.textAlign = "center"
        this.parent.ctx.fillStyle = "white"
        this.parent.ctx.font = "24px Nasalization"
        this.parent.ctx.fillText(this.timePassed, this.parent.width / 2, 30)
    }
    // draws the health UI element
    drawHP(){
        let xOrigin = (this.parent.width / 2) - (this.maxHpWidth / 2)
        let yOrigin = this.parent.height - 35
        this.parent.ctx.beginPath()
        this.parent.ctx.strokeStyle = "white"
        this.parent.ctx.strokeRect(xOrigin - 1, yOrigin - 1, this.maxHpWidth + 2, 25 + 2)
        if(this.tweenVal > this.currentHpWidth && !this.parent.gamePaused){
            this.tweenVal -= this.tweenSpeed
        }
        let currentX = (this.parent.width / 2) - (this.currentHpWidth / 2)
        let tweenX = (this.parent.width / 2) - (this.tweenVal / 2)
        this.parent.ctx.fillStyle = "white"
        this.parent.ctx.fillRect(tweenX, yOrigin, this.tweenVal, 25)
        this.parent.ctx.fillStyle = "green"
        this.parent.ctx.fillRect(currentX, yOrigin, this.currentHpWidth, 25)
        this.parent.ctx.strokeStyle = "transparent"
    }
    // draws the pause menu
    drawPause(){
        this.parent.ctx.fillStyle = "rgba(18, 18, 18, 0.45)"
        this.parent.ctx.fillRect(0, 0, this.parent.width, this.parent.height)
        this.parent.ctx.fillStyle = "white"
        this.parent.ctx.font = "Nasalization 24px"
        this.parent.ctx.fillText("Press ESC to return to main menu", 30, this.parent.height - 48)
        this.parent.ctx.drawImage(this.sprites["pause"], this.parent.width - 100, 20)
    }
    // used by other classes to determine the current difficulty message being displayed
    getDifficulty(){
        return this.difficulty
    }
    // sets the current difficulty message
    setDifficulty(message, color){
        this.difficulty = {message: message, color: color}
    }
    // draws the difficulty message in a provided colour
    drawDifficulty(){
        this.parent.ctx.textAlign = "left"
        this.parent.ctx.fillStyle = this.difficulty.color
        this.parent.ctx.font = "VT23 30px"
        this.parent.ctx.fillText(this.difficulty.message, 20, 40)
    }
    // encapsulates all drawing functions for when the game is running
    drawGame(){
        this.drawTimer()
        this.drawHP()
        this.drawDifficulty()
        if(this.parent.gamePaused){
            this.drawPause()
        }
    }
    // draws to the screen the game over menu
    drawGameOver(){
        this.parent.ctx.fillStyle = "white"
        this.parent.ctx.textAlign = "center"
        this.parent.ctx.font = "36px Nasalization"
        // If the user is signed in then their name will be displayed
        // Otherwise they are informed that they need to create an account in order to save their score
       if(this.name){
            this.parent.ctx.fillText(this.name, this.parent.width / 2, this.parent.height / 2 - 72)
        }else{
            this.parent.ctx.fillText("Create an account to save your score!", this.parent.width / 2, this.parent.height / 2 - 72)
        }
        this.parent.ctx.fillText("You survived "+this.timePassed+" seconds!", this.parent.width / 2, this.parent.height / 2 - 36)
        this.parent.ctx.fillText("You obtained a score of "+this.parent.points, this.parent.width / 2, this.parent.height / 2)
        this.parent.ctx.fillText("Press [R] to Restart", this.parent.width / 2, this.parent.height - 36)
        
    }
}