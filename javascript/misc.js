window.addEventListener("load", ()=>{
    // changes the color fo the game title text on the home page each time it is moused over
    const gameTitle = document.getElementsByClassName("trailerTitle")[0]
    const colors = ["red", "blue", "green", "cyan", "purple", "pink", "orange"]
    gameTitle.addEventListener("mouseenter", ()=>{
        let rng = Math.floor(Math.random() * colors.length)
        gameTitle.style["color"] = colors[rng]
    })
    gameTitle.addEventListener("mouseleave", ()=>{
        gameTitle.style["color"] = "white"
    })
})
//Source of reveal function https://www.youtube.com/watch?v=VplDlwLTR50
// checks if items with the relevant query are in range of the reveal point and then chanegs the class to reveal the element
function reveal(){
    let reveals = document.querySelectorAll(".reveal, .pop")
    for(var i = 0; i < reveals.length; i++){
        var windowHeight = window.innerHeight
        var revealTop = reveals[i].getBoundingClientRect().top
        var revealPoint = 150

        if(revealTop < windowHeight - revealPoint){
            reveals[i].classList.add("active");
        }else{
            reveals[i].classList.remove("active")
        }
    }
}

window.addEventListener("scroll", reveal)