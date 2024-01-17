// This class keeps track of all the inputs needed for the game
export class InputHandler{
    // the class requires a reference to the root game class
    constructor(game){
        this.parent = game
        // the mouse position is logged twice for calculations
        this.mouse = {
            x: 0,
            y: 0
        }
        this.cursorPos = {
            x: 0,
            y: 0
        }
        // this is the allowed mouse button for interaction "Left Mouse Button"
        this.mouseButton = 0
        this.mouseHold
        // keeps track of all the valid keys being pressed at the moment
        this.keys = []
        // boolean to keep track of other whether the allowed mouse button is being held or not
        this.held

        // The mousedown and mouseup listeners together make seamless starting and stopping of the shoot function
        // Rather than having to constantly click to shoot, the player can just hold down and aim
        this.parent.canvas.addEventListener("mousedown", e => {
            // checks to see if the game has started and is not paused before executing logic
            if (this.parent.isGameStarted() && !this.parent.gamePaused) {
                // if the button being pressed is the valid button then the mouse position is updated
                if (e.button == this.mouseButton) {
                    this.mouse.x = e.clientX
                    this.mouse.y = e.clientY
                    // if the button is not being held then it creates an interval to call the shoot function of the player class
                    if (!this.held) {
                        this.mouseHold = setInterval(() => {
                            this.parent.player.shoot(this.mouse.x, this.mouse.y)
                        }, 0)
                    }
                    // the button is being held so the boolean is changed to reflect that
                    this.held = true

                }
            }
        })
        this.parent.canvas.addEventListener("mouseup", e => {
            // checks whether the game is started and not paused before applying logic
            if (this.parent.isGameStarted() && !this.parent.gamePaused) {
                // If the button being released is the valid button then the value of the held boolean is reset and the stored interval is 2topped
                if (e.button == this.mouseButton) {
                    if (this.held == true) {
                        this.held = false
                        clearInterval(this.mouseHold)
                    }
                }
            }
        })
        this.parent.canvas.addEventListener("mousemove", e => {
            // checks whether the game is started and not paused
            if (this.parent.isGameStarted() && !this.parent.gamePaused) {
                // if the mouse button is being held then the current cursor position is updated to match
                // this is done so the player is always shooting towards the cursor position
                if (this.held) {
                    this.mouse.x = e.clientX
                    this.mouse.y = e.clientY
                }
                // the cursor position is also updated when the mouse moves as it is needed to calculate how the player should rotate
                this.cursorPos.x = e.clientX
                this.cursorPos.y = e.clientY
            }
        })

        this.parent.canvas.addEventListener("keydown", e => {
            // checks whether the game is started and has not ended
            if (this.parent.isGameStarted() && !this.parent.isGameEnded()) {
                // the default functionaity of the key is halted
                e.preventDefault()
                // The controls for when the player is playing the game are implemented
                // Pressing P will either pause or resume the game
                if (e.key.toLowerCase() == "p") {
                    this.parent.togglePause()
                }
                // if the game is paused then the escape key will return the user to the main menu
                if (this.parent.isGamePaused()) {
                    if (e.key == "Escape") {
                        this.parent.backToMainMenuFromGame()
                    }
                } else {
                    // Otherwise if the game is running we store the keys that are currently being pressed into a list
                    // This list can be used to control movement of the player
                    if ((e.key.toLowerCase() == "a" ||
                        e.key.toLowerCase() == "w" ||
                        e.key.toLowerCase() == "s" ||
                        e.key.toLowerCase() == "d" ||
                        e.key == " ")
                        && !this.keys.includes(e.key.toLowerCase())) {
                        this.keys.push(e.key.toLowerCase())
                    }
                }
                // if the game hasn't ended also hasn't started and the help menu is not active, it means the user is currently seeing the main menu
            } else if (!this.parent.isGameEnded() && !this.parent.isGameStarted() && !this.parent.isHelpMenu()) {
                // The controls for the main menu are checked
                // If the player hits Enter then the game will start
                if (e.key == "Enter") {
                    this.parent.startGame()
                }
                // If the player pressed H then they will be taken to view the help menu
                if (e.key.toLowerCase() == "h") {
                    this.parent.showHelp()
                }
                // if the help menu is active then the appropriate controls are made
            } else if (this.parent.isHelpMenu()) {
                // The player pressing escape will transport them back to the main menu, from there they can begin the game or if they choose, they can access the help menu again
                if (e.key == "Escape") {
                    this.parent.backToMainMenuFromHelp()
                }
                // if the game has ended then the player has died and is viewing the game over menu
            } else if (this.parent.isGameEnded()) {
                if (e.key.toLowerCase() == "r") {
                    this.parent.restart(true)
                }
            }
        })
        // removes keys from the keys list if the player releases them
        this.parent.canvas.addEventListener("keyup", e => {
            if (this.keys.includes(e.key.toLowerCase())) {
                this.keys.splice(this.keys.indexOf(e.key.toLowerCase()), 1)
            }
        })

    }
    // clones and replaces the canvas in order to remove all attached event listeners
    clearListeners(){
        let clonedCanvas = this.parent.canvas.cloneNode(true)
        this.parent.canvas.parentNode.replaceChild(clonedCanvas, this.parent.canvas)
    }
}