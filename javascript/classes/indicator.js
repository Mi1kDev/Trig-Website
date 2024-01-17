// this class draws indicators for where enemies will be spawned
export class Indicator{
    // class requires a reference to the parent, both of its possible sprites as well as the enemy it is meant to instance, the type of enemy and a position (x, y)
    constructor(parent, sprite, altSprite, enemy, enemyType, x, y){
        this.parent = parent
        this.sprite = sprite
        this.altSprite = altSprite
        this.enemy = enemy
        this.enemyType = enemyType
        this.x = x
        this.y = y
        this.width = this.enemy.width * 2
        this.height = this.enemy.height * 2
        this.scale = 1
        this.scaleSpeed = 0.0025
        this.blink = 200
    }
    // informs the parent class to instantiate the provided enemy
    releaseEnemy(){
        this.parent.handleSpawn(this.enemy, this.x, this.y, this.enemyType)
        this.parent.destroyIndicator(this)
    }
    // update function for the  class
    // each cycle the indicator is scaled down and once it is small enough it is removed from the scene and the enemy is instanced at its position
    update(){
        this.width *= this.scale
        this.height *= this.scale

        if(this.scale > 0){
            this.scale -= this.scaleSpeed
        }
        if(this.width < 5){
            this.releaseEnemy()
        }
    }
    // draws the sprite at the provided position
    // the blink variable determines how quickly it switches between sprites
    draw(){
        if(Math.floor(Date.now() / this.blink) % 2){
            this.parent.ctx.drawImage(this.sprite, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height)
        }else{
            this.parent.ctx.drawImage(this.altSprite, this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height)
        }        
    }
}