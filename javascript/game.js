// import all necessary classes
import { MoneyDrop } from "./classes/moneyDrop.js"
import { HudManager } from "./classes/hudManager.js"
import { InputHandler } from "./classes/inputhandler.js"
import { Player } from "./classes/player.js"
import { Projectile } from "./classes/projectile.js"
import { RangedEnemy } from "./classes/range_enemy.js"
import { Spawner } from "./classes/spawner.js"
import { UpgradeMenu } from "./classes/upgrade.js"
import { Particles } from "./classes/particle.js"
import { Indicator } from "./classes/indicator.js"
import { AudioManager } from "./classes/audioManager.js"

// start the game inside the on load function
window.addEventListener('load', function(){
    // reference to the player sprite
    var playerSprite = document.getElementById("player")
    // main game constructor
    // this class acts as the root and handles communication amongst other classes
    class Game{
        constructor(width, height){
            // sets the initial values of the class including instantiation of other classes
            this.width = width
            this.height = height
            this.canvas = document.getElementById("game")
            this.canvas.oncontextmenu = e=>{e.preventDefault(); e.stopPropagation()}
            this.ctx = this.canvas.getContext("2d")
            this.playerProjectiles = []
            this.enemyProjectiles = []
            this.particles = []
            this.indicators = []
            this.drops = []
            this.dropCap = 10
            this.backDrop = document.getElementById("background")
            this.player = new Player(this, playerSprite)
            this.indicatorSprite = document.getElementById("danger")
            this.indicatorSpriteAlt = document.getElementById("dangerAlt")
            this.uiSprites = {
                "pause": document.getElementById("pause")
            }
            this.enemySprites = {
                "square": document.getElementById("square"),
                "circle": document.getElementById("circle"),
                "kite": document.getElementById("kite"),
                "trapezoid": document.getElementById("trapezoid"),
            }
            this.input = new InputHandler(this)
            this.spawner = new Spawner(this)
            this.points = 0
            this.viewRadius = 300
            this.enemies = []
            this.menuManager = new UpgradeMenu(this)
            this.hudManager = new HudManager(this, this.uiSprites)
            this.audioManager = new AudioManager(this)
            // keeps track of the state the game is in
            this.gameStarted = false
            this.gameEnded = false
            this.gamePaused = false
            this.helpMenu = false

            this.canvas.width = this.width
            this.canvas.height = this.height
        }
        // toggles timers for all classes
        togglePause(){
            this.togglePlayer(this.gamePaused)
            this.toggleAllGuns(this.gamePaused)
            this.toggleAllSpawns(this.gamePaused)
            this.toggleAllProjectiles(this.gamePaused)
            this.toggleAllDrops(this.gamePaused)
            this.toggleGameHud(this.gamePaused)
            this.toggleAudio(this.gamePaused)
            this.gamePaused = !this.gamePaused
        }
        // toggles audio
        toggleAudio(bool){
            this.audioManager.toggleAudioTrack(bool)
        }
        // toggles player timers
        togglePlayer(bool){
            this.player.togglePlayer(bool)
        }
        // toggles all guns' timers
        toggleAllGuns(bool){
            for(let i = 0; i < this.enemies.length; i++){
                this.enemies[i].gun.toggleShots(bool)
            }
            this.player.gun.toggleShots(bool)
        }
        // toggles all projectiles' timers
        toggleAllProjectiles(bool){
            for(let i = 0; i < this.enemyProjectiles.length; i++){
                this.enemyProjectiles[i].toggleProjectiles(bool)
            }
            for(let i = 0; i < this.playerProjectiles.length; i++){
                this.playerProjectiles[i].toggleProjectiles(bool)
            }
        }
        // toggles all spawn timers
        toggleAllSpawns(bool){
            this.spawner.toggleSpawn(bool)
        }
        // toggles all drop timers
        toggleAllDrops(bool){
            for(let i = 0; i < this.drops.length; i++){
                this.drops[i].toggleDrops(bool)
            }
        }
        // toggles timers on the game hud
        toggleGameHud(bool){
            this.hudManager.toggleHud(bool)
        }
        // creates an instance of an indicator
        handleIndicator(enemy, posX, posY, enemyType){
            this.indicators.push(new Indicator(this, this.indicatorSprite, this.indicatorSpriteAlt, enemy, enemyType, posX, posY))
        }
        // creates an instance of a provided enemy
        handleSpawn(e, posX, posY, enemyType){
            var sprite = this.enemySprites[enemyType]
            let enemy = new RangedEnemy(this, 
                this.player, 
                sprite,
                e.maxHp,
                e.damage,
                e.minDist, 
                e.backOff, 
                e.detection, 
                e.speed, 
                e.color, 
                posX, 
                posY, 
                e.width, 
                e.height, 
                e.check, 
                e.cohesive, 
                e.separationDistance, 
                e.separationForce, 
                e.alignForce, 
                e.targetForceDampen, 
                e.projectile,
                e.gun,
                e.points,
                e.money,
                )
            this.enemies.push(enemy)
        }
        // handler function to remove particles from the scene
        cleanParticles(particle){
            this.particles.splice(this.enemies.indexOf(particle), 1)
        }
        // handler function to remove indicator from the scene
        destroyIndicator(indicator){
            this.indicators.splice(this.indicators.indexOf(indicator), 1)
        }
        // handler function to remove drop from the scene
        destroyDrop(drop){
            this.drops.splice(this.drops.indexOf(drop), 1)
        }
        // handler function to remove enemys from the scene
        destroyEnemy(enemy){
            this.enemies.splice(this.enemies.indexOf(enemy), 1)
            this.spawner.spawnCount -= 1
            // instantiates particles giving the effect of an enemy exploding
            this.handleParticle(4, enemy.color, enemy.centerX, enemy.centerY, enemy.width, 20)
        }
        // handler function to remove player projectiles from the scene
        destroyPlayerProjectile(projectile){
            this.playerProjectiles.splice(this.playerProjectiles.indexOf(projectile), 1)
        }
        // handler function to remove enemy projectiles from the scene
        destroyEnemyProjectile(projectile){
            this.enemyProjectiles.splice(this.enemyProjectiles.indexOf(projectile), 1)    
        }
        // handler function to instance particles
        handleParticle(particleAmount, color, x, y, radius, speedMax){
            for(let i = 0; i < particleAmount; i++){
                this.particles.push(new Particles(this, color, x, y, radius, speedMax))
            }
        }
        // handler function to instantiate player projectiles onto the sceen
        handleShoot(x, y, damage, angle, speed, radius, color, lifetime){
            this.playerProjectiles.push(new Projectile(this, true, damage, x, y, angle, speed, radius, color, lifetime))
        }
        // handler function to instantiate enemy projectiles onto the scren
        handleEnemyShoot(x, y, damage, angle, speed, radius, color, lifetime){
            this.enemyProjectiles.push(new Projectile(this, false, damage, x, y, angle, speed, radius, color, lifetime))
        }
        // handler function for when an enemy dies
        handleEnemyDeath(points, money, x, y){
            this.points += points
            const moneyDropChance = 0.75
            if(Math.random() <= moneyDropChance){
                this.drops.push(new MoneyDrop(this, x, y, money))
                if(this.drops.length > this.dropCap){
                    this.drops[0].destroy()
                }
            }
        }
        // updates the HUD manager with the new health value
        updateHealthUI(maxHp, currentHp){
            this.hudManager.updateHealth(maxHp, currentHp)
        }
        // handler function to apply upgrades to the player
        handleUpgrade(upgradeType, value){
            this.player.applyUpgrade(upgradeType, value)
        }
        // getter function for the current points
        getCurrentPoints(){
            return this.points
        }
        // getter function for the starting currency
        getPlayerStartingFunds(){
            return this.player.startMoney
        }
        // getter function for the players current money
        getPlayerFunds(){
            return this.player.money
        }
        // setter function for the players money
        setPlayerFunds(funds){
            this.player.money = funds
            this.menuManager.updateMoney(funds)
        }
        // initializes the actual game from the main menu page
        startGame(){
            this.gameStarted = true
            this.spawner.startCountDown(this.points)
            this.audioManager.play()
        }
        // displays the help menu
        showHelp(){
            this.helpMenu = true
        }
        // starts the hudmanager's timer
        startTimer(){
            this.hudManager.startTimer()
        }
        // getter function for whether the game is started or not
        isGameStarted(){
            return this.gameStarted
        }
        // getter function for whether the game is ended or not
        isGameEnded(){
            return this.gameEnded
        }
        // getter function for whether the game is paused or not
        isGamePaused(){
            return this.gamePaused
        }
        // getter function for whether the help menu is being displayed
        isHelpMenu(){
            return this.helpMenu
        }
        // returns the user to the main menu
        backToMainMenuFromGame(){
            this.restart(true)
        }
        // returns the user to the main menu from the help menu
        backToMainMenuFromHelp(){
            this.helpMenu = false
        }
        // handles what should occur when the game ends
        onGameEnd(){
            this.gameEnded = true
            // stops audio and displays game end screen
            this.audioManager.stop()
            this.hudManager.gameEnd()
            this.storeScore()
        }
        // stores the score if it is higher than the user's previous highscore
        storeScore(){
            let currentUser = JSON.parse(localStorage.getItem("signedIn"))
            if(currentUser){
                var users = JSON.parse(localStorage.getItem("users"))
                var userProf = users[currentUser.email]
                userProf.gamesPlayed += 1
                if(userProf.highscore < this.points){
                    userProf.highscore = this.points
                    localStorage.setItem("users", JSON.stringify(users))
                }                
            }else{
                //temporarily store highest score in session storage and post it to leaderboard once the user signs in
                var tempScore = sessionStorage.getItem("tempScore")
                if(tempScore){
                    if(tempScore < this.points){
                        sessionStorage.setItem("tempScore", this.points)
                    }
                }else{
                    sessionStorage.setItem("tempScore", this.points)
                }
                
            }
        }
        // updates hud to reflect current difficulty stage
        setDifficultyHUD(message, color){
            if(this.hudManager.getDifficulty().message == message){
                return
            }
            this.hudManager.setDifficulty(message, color)
        }
        // updates audio to reflect current difficulty stage
        setDifficultyAudio(audioTrackNum){
            if(this.audioManager.getCurrentTrack() == audioTrackNum){
                return
            }
            this.audioManager.switchTrack(audioTrackNum)
        }
        // assigns difficulty states based on current points
        difficultyHandle(){
            let points = this.points
            if(points < 5000){
                this.setDifficultyHUD("Easy", "cyan")
                this.setDifficultyAudio(0)
            }else if(points >= 5000 && points < 10000){
                this.setDifficultyHUD("Medium", "green")
                this.setDifficultyAudio(1)
            }else if(points >= 10000 && points < 15000){
                this.setDifficultyHUD("Hard", "yellow")
                this.setDifficultyAudio(2)
            }else if(points >= 15000 && points < 20000){
                this.setDifficultyHUD("Very Hard", "orange")
                this.setDifficultyAudio(3)
            }else{
                this.setDifficultyHUD("INSANE", "red")
                this.setDifficultyAudio(4)
            }
        }
        // draws the background as well as the radius around the player
        drawBg(){
            this.ctx.save()
            this.ctx.beginPath()
            this.ctx.arc(this.player.centerX, this.player.centerY, this.viewRadius, 0, Math.PI * 2)
            this.ctx.clip()
            this.ctx.drawImage(this.backDrop, 0, 0, this.width, this.height)
            this.ctx.restore()
        }
        // restarts the game
        restart(menu){
            // stops running audio
            this.audioManager.stop()
            // resets the main menu to default
            this.menuManager.resetDefaults()
            // clears listeners from the inputhandler
            this.input.clearListeners()
            restart(menu)
        }
        // main update method, all update functions are called here
        update(){
            if(!this.gameStarted){

            }
            else if(!this.gameEnded){
                if(!this.gamePaused){
                    this.difficultyHandle()
                    this.player.update(this.input.keys)
                    this.spawner.update(this.points)
                    this.particles.forEach(particle=>{
                        particle.update()
                    })
                    this.playerProjectiles.forEach(projectile => {
                        projectile.update(this.enemies)
                    })
                    this.enemyProjectiles.forEach(projectile => {
                        projectile.update([this.player])
                    })
                    this.indicators.forEach(indicator=>{
                        indicator.update()
                    })
                    this.enemies.forEach(enemy => {
                        enemy.update()
                    })
                    this.drops.forEach(drop => {
                        drop.update(this.player)
                    })
                }
            }     
        }
        
        //this function draws all elements, all elements are drawn here
        draw(){
            this.ctx.clearRect(0, 0, this.width, this.height)
            if(!this.gameStarted && !this.helpMenu){
                this.hudManager.drawMainMenu()
            }else if(!this.gameStarted && this.helpMenu){
                this.hudManager.drawHelp()
            }
            else if(!this.gameEnded){
                this.drawBg()
                this.player.draw()
                this.particles.forEach(particle=>{
                    particle.draw()
                })
                this.playerProjectiles.forEach(projectile =>{
                    projectile.draw()})
                this.enemyProjectiles.forEach(projectile =>{
                    projectile.draw()})
                this.indicators.forEach(indicator=>{
                    indicator.draw()
                })
                this.enemies.forEach(enemy =>{
                    enemy.draw()
                })
                this.drops.forEach(drop =>{
                    drop.draw()
                })    
                this.hudManager.drawGame()
            }else{
                this.hudManager.drawGameOver()
            }           
        }
    }
    // creates an instance of the game object
    let game = new Game(1024, 720)

    // restarts tthe game by creating a new instance of the game
    function restart(menu){
        game = new Game(1024, 720)
        game.canvas.focus()
        // if we do not want to see the main menu again then we call the game's start game method
        if(!menu){
            game.startGame()
        }
    }

    // animate loop calls the draw and update function of the game
    function animate(){
        game.draw()
        game.update() 
        requestAnimationFrame(animate)
    }
    animate()
})