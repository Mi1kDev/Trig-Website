// checks if the user is signed in
var signedIn = localStorage.getItem("signedIn")
if(!signedIn){
    // if the user is not signed in but attempting to access the profile page, then they are redirected to the home page
    window.location.replace("./home.html")
}else{
    // loads data on the signed in user and uses this information to display various details about the user
    signedIn = JSON.parse(signedIn)
    window.addEventListener("load", ()=>{
        var userData = JSON.parse(localStorage.getItem("users"))
        const profileData = userData[signedIn.email]
        const profileUsername = document.getElementById("profile-username")
        profileUsername.innerHTML = "Stats For: "+profileData.username
        const profileFname = document.getElementById("profile-fname")
        profileFname.innerHTML = "First Name: "+profileData.fname
        const dob = document.getElementById("profile-dob")
        dob.innerHTML = "D.O.B: "+profileData.dob;
        const highscore = document.getElementById("profile-highscore")
        highscore.innerHTML = "Highscore: "+profileData.highscore
        const gamesPlayed = document.getElementById("profile-gamesPlayed")
        gamesPlayed.innerHTML = "Games Played: "+profileData.gamesPlayed
    })
}