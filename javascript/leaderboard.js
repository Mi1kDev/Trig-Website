window.addEventListener("load", ()=>{
    let ascend = document.getElementById("asc")
    let descend = document.getElementById("desc")
    let rankingCont = document.getElementsByClassName("rankingContainer")[0]

    // loads already saved scores onto the leaderboard
    initLoad()
    // sorts the leaderboard by ascending 
    ascend.addEventListener("click", sortAsc)
    // sorts the leaderboard by descending
    descend.addEventListener("click", sortDesc)
    // resets style once the animation has stopped playing
    rankingCont.addEventListener("animationend", ()=>{
        if(rankingCont.classList.contains("shaking")){
            rankingCont.classList.remove("shaking")
        }
    })
})

// builds and returns a div that has the profile, username and score displayed
function buildCard(profile, userDetails, score){
    let card = document.createElement("div")
    card.className = "rankingCard"
    let rankProf = document.createElement("div")
    rankProf.className = "rankingProfile"
    rankProf.innerHTML = profile
    let uDetails = document.createElement("div")
    uDetails.className = "userDetails"
    uDetails.innerHTML = userDetails
    let scoreElem = document.createElement("div")
    scoreElem.className = "score"
    scoreElem.innerHTML = score
    card.appendChild(rankProf)
    card.appendChild(uDetails)
    card.appendChild(scoreElem)
    return card
}
// loads all existing and previously stored high scores
function initLoad(){
    let container = document.getElementsByClassName("rankingContainer")[0]
    let localData = localStorage.getItem("users")
    // if no users have signed up, then there are no scores to display and a message explaining this is depicted
    if(!localData){
        let unavailable = document.createElement("div")
        unavailable.className = "rankUnavailable"
        let text = document.createElement("p")
        text.innerHTML = ":( No Player Scores Available"
        text.className = "typewriter"
        unavailable.appendChild(text)
        container.appendChild(unavailable)
        return
    }
    // parses the users
    let userList = JSON.parse(localStorage.getItem("users")) 
    let userListKeys = Object.keys(userList)
    let validPlayerList = []
    // stores all users who have played at least a single game
    for(i = 0; i < userListKeys.length; i++){
        if(userList[userListKeys[i]].gamesPlayed > 0){
            validPlayerList.push(userList[userListKeys[i]])
        }
    }
    // creates and displays a card for each user who has played at least once
    if(validPlayerList.length > 0){
        // sorts all the users
        var users = sortRanks(validPlayerList)
        for(i = 0; i < users.length; i++){
            card = buildCard(users[i].username[0], users[i].username, users[i].highscore)
            position = document.createElement("div")
            position.className = "position"
            position.innerHTML = "#"+(i+1)
            card.appendChild(position)

            container.appendChild(card)
        }
                        
    }else{
        // if no user has played at least a single game then a message informing that no scores are available is provided
        unavailable = document.createElement("div")
        unavailable.className = "rankUnavailable"
        text = document.createElement("p")
        text.innerHTML = ":( No Player Scores Available"
        text.className = "typewriter"
        unavailable.appendChild(text)
        container.appendChild(unavailable)
    }
}
// sorts users based on their highscore. The highest score taking the smallest index
function sortRanks(leaderBoardRanks){
    for(i = 0; i < leaderBoardRanks.length; i++){
        for(j = 0; j < leaderBoardRanks.length - i - 1; j++){
            if(leaderBoardRanks[j].highscore < leaderBoardRanks[j + 1].highscore){
                var temp = leaderBoardRanks[j]
                leaderBoardRanks[j] = leaderBoardRanks[j + 1]
                leaderBoardRanks[j + 1] = temp
            }
        }
    }
    return leaderBoardRanks
}
// resets order of rank display to normal
function sortAsc(){
    let rankingCont = document.getElementsByClassName("rankingContainer")[0]
    if(rankingCont.children.length > 0){
        if(rankingCont.firstElementChild.className != "rankUnavailable"){
            rankingCont.classList.add("shaking")
            if(rankingCont.style.flexDirection != "column"){
                rankingCont.style.flexDirection = "column"
            }
        }
    } 
}
// reverses the order of the rank display
function sortDesc(){
    let rankingCont = document.getElementsByClassName("rankingContainer")[0]
    if(rankingCont.children.length > 0){
        if(rankingCont.firstElementChild.className != "rankUnavailable"){
            rankingCont.classList.add("shaking")
            if(rankingCont.style.flexDirection != "column-reverse"){
                rankingCont.style.flexDirection = "column-reverse"
            }
        }
    }
}