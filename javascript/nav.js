// javascript implementation of a navbar
window.addEventListener("load", e=>{
    const signedIn = JSON.parse(localStorage.getItem("signedIn"))
    let navbar = document.createElement("div")
    navbar.className = "navbar"
    let logo = document.createElement("img")
    logo.id = "logo"
    logo.alt = "logo"
    logo.src = "../image/Logo.png"
    navbar.appendChild(logo)
    let whiteRect = document.createElement("div")
    whiteRect.id = "whiteRect"
    let mainPages = document.createElement("div")
    mainPages.className = "navMainPages"
    let registrButtons = document.createElement("div")
    registrButtons.className = "navRegistration"

    let link1 = document.createElement("a")
    link1.className = "linkless"
    link1.href = "../html/index.html"
    let link2 = document.createElement("a")
    link2.className = "linkless"
    link2.href = "../html/game.html"
    let link3 = document.createElement("a")
    link3.className = "linkless"
    link3.href = "../html/leaderboard.html"
    let link4
    let link5
    // if the user is not signed in then buttons for login and register are created
    if(!signedIn){
        link4 = document.createElement("a")
        link4.className = "linkless"
        link4.href = "../html/login.html"
        link5 = document.createElement("a")
        link5.className = "linkless"
        link5.href = "../html/register.html"
    }

    let button1 = document.createElement("div")
    button1.className = "navButton nav-text"
    let button2 = document.createElement("div")
    button2.className = "navButton nav-text"
    let button3 = document.createElement("div")
    button3.className = "navButton nav-text"
    let dropDown
    let button4
    let button5
    if(!signedIn){
        button4 = document.createElement("div")
        button4.className = "navButton nav-text"
        button5 = document.createElement("div")
        button5.className = "navButton nav-text"
    }else{
        // if the user is signed in then an element displaying their username is created
        // elements for a dropdown menu are also created
        dropDown = document.createElement("div")
        dropDown.className = "nav-dropdown"
        button4 = document.createElement("div")
        button4.className = "navButton nav-text navProfile"
        button4Name = document.createTextNode(signedIn.username)
        button4.appendChild(button4Name)
        dropDown.appendChild(button4)

        let dropDownContentHolder = document.createElement("div")
        dropDownContentHolder.className = "nav-dropdown-content"
        let profileA = document.createElement("a")
        profileA.href = "../html/profile.html"
        let profileDiv = document.createElement("div")
        profileDiv.innerHTML = "View Profile"
        profileA.appendChild(profileDiv)
        let logout = document.createElement("div")
        logout.innerHTML = "Logout"
        // when the logout element is clicked it signs the user out
        logout.addEventListener("click",()=>{
            if(localStorage.getItem("signedIn")){
                localStorage.removeItem("signedIn")
                location.reload()
            }
        })
        dropDownContentHolder.appendChild(profileA)
        dropDownContentHolder.appendChild(logout)
        dropDown.appendChild(dropDownContentHolder)
    }

    button1Name = document.createTextNode("Home")
    button2Name = document.createTextNode("Game")
    button3Name = document.createTextNode("Rank")
    if(!signedIn){
        button4Name = document.createTextNode("Login")
        button5Name = document.createTextNode("Register")
    }
    console.log(window.location.pathname.split("/").pop())
    if(window.location.pathname.split("/").pop() == "index.html"){
        link1.href = "./html/index.html"
        link2.href = "./html/game.html"
        link3.href = "./html/leaderboard.html"
        logo.src = "./image/Logo.png"

        if(!signedIn){
            link4.href="./html/login.html"
            link5.href="./html/register.html"
        }else{
            
        }
    }

    button1.appendChild(button1Name)
    button2.appendChild(button2Name)
    button3.appendChild(button3Name)
    if(!signedIn){
        button4.appendChild(button4Name)
        button5.appendChild(button5Name)
    }

    link1.appendChild(button1)
    link2.appendChild(button2)
    link3.appendChild(button3)
    if(!signedIn){
        link4.appendChild(button4)
        link5.appendChild(button5)
    }
    
    if(!signedIn){
        registrButtons.appendChild(link4)
        registrButtons.appendChild(link5)
    }else{
        registrButtons.appendChild(dropDown)
    }

    mainPages.appendChild(link1)
    mainPages.appendChild(link2)
    mainPages.appendChild(link3)

    whiteRect.appendChild(mainPages)
    whiteRect.appendChild(registrButtons)

    navbar.appendChild(whiteRect)

    mainSect = document.getElementsByClassName("mainSection")[0]
    document.body.insertBefore(navbar, mainSect)
})