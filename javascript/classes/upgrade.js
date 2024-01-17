// class for the upgrade menu
export class UpgradeMenu{
    // requires a reference to the parent class
    constructor(parent){
        this.parent = parent
        // keeps track of all maxed out upgrades
        this.maxed = []
        // object for upgrade menu
        // keeps track of the cost of the upgrades and the value associated with each level of upgrade
        this.upgrades = {
            "damage": {
                name: "DAMAGE",
                currentLevel: 0,
                levels: [
                    {cost: 1000, value: 1.5},
                    {cost: 2000, value: 2},
                    {cost: 3000, value: 2.5},
                    {cost: 6000, value: 3},
                    {cost: 12000, value: 4}
                ]
            },
            "speed": {
                name: "MOVE SPD",
                currentLevel: 0,
                levels: [
                    {cost: 500, value: 5.5},
                    {cost: 1500, value: 6},
                    {cost: 3000, value: 6.5},
                    {cost: 4500, value: 7},
                    {cost: 10000, value: 8}
                ]
            },
            "bulletSpeed": {
                name: "BULLET SPD",
                currentLevel: 0,
                levels: [
                    {cost: 1000, value: 6.5},
                    {cost: 2000, value: 8},
                    {cost: 4000, value: 9.5},
                    {cost: 8000, value: 11},
                    {cost: 20000, value: 12.5}
                ]
            },
            "bulletRadius": {
                name: "BULLET SIZE",
                currentLevel: 0,
                levels: [
                    {cost: 1500, value: 13},
                    {cost: 4500, value: 16},
                    {cost: 6000, value: 19},
                    {cost: 10500, value: 21},
                    {cost: 20000, value: 24}
                ]
            },
            "dashMulti": {
                name: "DASH POWER",
                currentLevel: 0,
                levels: [
                    {cost: 250, value: 2.25},
                    {cost: 500, value: 2.5},
                    {cost: 2000, value: 2.75},
                    {cost: 4000, value: 3},
                    {cost: 5000, value: 3.5}
                ]
            },
            "dashCd": {
                name: "DASH CD",
                currentLevel: 0,
                levels: [
                    {cost: 100, value: 2.75},
                    {cost: 500, value: 2.5},
                    {cost: 1000, value: 2.25},
                    {cost: 2000, value: 2},
                    {cost: 6000, value: 1.75},
                ]
            },
            "burst": {
                name: "BURST",
                currentLevel: 0,
                levels: [
                    {cost: 3000, value: 2},
                    {cost: 9000, value: 3},
                ]
            },
            "multishot": {
                name: "MULTISHOT",
                currentLevel: 0,
                levels: [
                    {cost: 4500, value: 2},
                    {cost: 10000, value: 3},
                ]
            },
            "shootCd": {
                name: "SHOOT SPD",
                currentLevel: 0,
                levels: [
                    {cost: 1500, value: 0.8},
                    {cost: 3000, value: 0.75},
                    {cost: 6000, value: 0.7},
                    {cost: 9000, value: 0.65},
                    {cost: 12000, value: 0.6}
                ]
            },
            "spreadAngle": {
                name: "SPREAD",
                currentLevel: 0,
                levels: [
                    {cost: 200, value: 10},
                    {cost: 500, value: 15},
                    {cost: 1000, value: 20},
                    {cost: 3000, value: 25},
                    {cost: 5000, value: 30}
                ]
            }
        }
        // populates the html menu to display the upgrades and their costs
        this.buildMenu()
    }
    // updates the html to reflect the new amount of money the player has left
    updateMoney(newMoney){
        let moneyDisplay = document.getElementsByClassName("game-menu-display-money")[0]
        moneyDisplay.innerHTML = "MONEY REMAINING: "+newMoney
    }
    // resets the html menu to its default values
    defaultMenu(){
        let menuOptions = document.getElementsByClassName("game-menu-manager-panel")
        let keys = Object.keys(this.upgrades)
        for(let i = 0; i < keys.length; i++){
            menuOptions[i].firstElementChild.innerHTML = "LEVEL: "+0
            menuOptions[i].lastElementChild.innerHTML = "COST: "+this.upgrades[keys[i]].levels[0].cost
            if(menuOptions[i].classList.contains("locked")){
                menuOptions[i].classList.remove("locked")
            }
        }   
    }
    // updates the information depicted on the upgrade menu to reflect the appropriate cost and level
    updateMenu(upgradeType){
        if(this.upgrades[upgradeType].currentLevel + 1 < this.upgrades[upgradeType].levels.length){
            let menuOptions = document.getElementsByClassName("game-menu-manager-panel")
            let keys = Object.keys(this.upgrades)
            let idx = keys.indexOf(upgradeType)
            menuOptions[idx].firstElementChild.innerHTML = "LEVEL: "+(this.upgrades[upgradeType].currentLevel + 1)
            menuOptions[idx].lastElementChild.innerHTML = "COST: "+this.upgrades[upgradeType].levels[this.upgrades[upgradeType].currentLevel + 1].cost
        }else{
            // sets the upgrade menu item as maxed and makes it inoperable from there on
            this.setMenuMaxed(upgradeType)
        }  
    }
    // makes an upgrade menu item maxed and therefore inaccessible
    setMenuMaxed(upgradeType){
        if(!(this.maxed.includes(upgradeType))){
            let menuOptions = document.getElementsByClassName("game-menu-manager-panel")
            let keys = Object.keys(this.upgrades)
            let idx = keys.indexOf(upgradeType)
            this.maxed.push(upgradeType)
            menuOptions[idx].classList.add("locked")
            menuOptions[idx].firstElementChild.innerHTML = "MAXED"
            menuOptions[idx].lastElementChild.innerHTML = ""
        }
    }
    // if the game is running it allows the user to purchase ugprades
    attemptUpgrade(upgradeType){
        if(this.parent.isGameStarted() && !this.parent.isGameEnded()){
            if(this.upgrades[upgradeType].currentLevel < this.upgrades[upgradeType].levels.length){
                let money = this.parent.getPlayerFunds()
                let idx = this.upgrades[upgradeType].currentLevel
                if(money >= this.upgrades[upgradeType].levels[idx].cost){
                    // has the parent class update the players to reflect the changes
                    this.parent.handleUpgrade(upgradeType, this.upgrades[upgradeType].levels[idx].value)
                    this.updateMenu(upgradeType)
                    this.upgrades[upgradeType].currentLevel += 1
                    this.parent.setPlayerFunds(money - this.upgrades[upgradeType].levels[idx].cost)
                }
            }
        }        
    }
    // builds each panel item
    buildCard(upgradeType){
        let card = document.createElement("div")
        card.className = "game-menu-manager-panel"

        let level = document.createElement("div")
        level.className = "game-menu-manager-panel-level"
        level.innerHTML = "LEVEL: "+(this.upgrades[upgradeType].currentLevel)

        let item = document.createElement("div")
        item.className = "game-menu-manager-panel-item"
        item.innerHTML = this.upgrades[upgradeType].name

        let cost = document.createElement("div")
        cost.className = "game-menu-manager-panel-cost"
        cost.innerHTML = "COST: "+this.upgrades[upgradeType].levels[this.upgrades[upgradeType].currentLevel].cost

        card.appendChild(level)
        card.appendChild(item)
        card.appendChild(cost)

        return card
    }
    // resets entire HTML page to default state
    resetDefaults(){
        this.updateMoney(this.parent.getPlayerStartingFunds())
        this.defaultMenu()
    }
    // clones element to remove existing event listeners
    refreshItem(elem){
        let clonedItem = elem.cloneNode(true)
        elem.parentNode.replaceChild(clonedItem, elem)
    }
    // builds the initial menu
    buildMenu(){
        let root = document.getElementsByClassName("game-menu-manager")[0]
        // if the menu is being built for the first time it is set up as such
        if(root.childElementCount == 0){
            let moneyDisplay = document.createElement("div")
            moneyDisplay.className = "game-menu-display-money"
            moneyDisplay.innerHTML = "MONEY REMAINING: "+this.parent.getPlayerFunds()
            root.appendChild(moneyDisplay)
            let keys = Object.keys(this.upgrades)
            for(let k in  keys){
                let card = this.buildCard(keys[k])
                card.addEventListener("click", (e)=>{
                    this.attemptUpgrade(keys[k])
                })
                root.appendChild(card)
            }
        }else{
            // otherwise only listeners on the children are refreshed
            let children = root.children
            let keys = Object.keys(this.upgrades)
            for(let i = 1; i < children.length; i++){
                this.refreshItem(children[i])
                children[i].addEventListener("click", (e)=>{
                    this.attemptUpgrade(keys[i - 1])
                })
            }
        }
    }
}