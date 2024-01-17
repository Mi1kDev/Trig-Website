// javascript to build a functional footer
window.addEventListener("load", ()=>{
    const body = document.body
    let footer = document.createElement("div")
    footer.className ="footer"
    let footerIconBar = document.createElement("div")
    footerIconBar.className = "footer-icon-bar"
    let github = document.createElement("img")
    github.src = "../image/github.png"
    github.alt = "Github"
    github.className = "iconButton"
    let youtube = document.createElement("img")
    youtube.src = "../image/youtube.png"
    youtube.alt = "Youtube"
    youtube.className = "iconButton"
    let linkedin = document.createElement("img")
    linkedin.src = "../image/linkedin.png"
    linkedin.alt = "LinkedIn"
    linkedin.className = "iconButton"

    let copyright = document.createElement("p")
    copyright.className = "footerText paragraph-text"
    copyright.innerHTML = "&copy2023 - Mi1kDev"

    let a1 = document.createElement("a")
    a1.href= "https://www.github.com/"
    
    let a2 = document.createElement("a")
    a2.href = "https://www.youtube.com/"
    
    let a3 = document.createElement("a")
    a3.href = "https://www.linkedin.com/"

    if(window.location.pathname.split("/").pop() == "index.html"){
        github.src = "./image/github.png"
        youtube.src = "./image/youtube.png"
        linkedin.src = "./image/linkedin.png"
    }

    a1.appendChild(github)
    a2.appendChild(youtube)
    a3.appendChild(linkedin)

    footerIconBar.appendChild(a1)
    footerIconBar.appendChild(a2)
    footerIconBar.appendChild(a3)

    footer.appendChild(copyright)
    footer.appendChild(footerIconBar)
    

    body.appendChild(footer)
})