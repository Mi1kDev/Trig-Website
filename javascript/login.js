// checks if user is signed in and attempting to access the login page
var signedIn = localStorage.getItem("signedIn")
if(signedIn){
    // if the user is signed in and attempting to access the login page then they are redirected to the home page
    window.location.replace("../index.html")
}

// intializes the verified states of username and password verification
let usernameVerified = false
let passwordVerified = false

window.addEventListener("load", ()=>{
    if(signedIn){
        return
    }else{
        // adds event listeners to the input fields in order to check whether the input provided is valid or not
        let usernameInput = document.getElementById("usernameInput")
        let passwordInput = document.getElementById("passwordInput")
        usernameInput.addEventListener("keyup", ()=>{
            usernameCheck(usernameInput.value)
        })
        passwordInput.addEventListener("keyup", ()=>{
            passwordCheck(passwordInput.value)
        })
    }
})

// requires that the entered username has at least one character
function usernameCheck(username){
    if(username.length > 0){
        usernameVerified = true
    }else{
        usernameVerified = false
    }
}

// requires that at the entered password has at least one character
function passwordCheck(password){
    if(password.length > 0){
        passwordVerified = true
    }else{
        passwordVerified = false
    }
}

// checks if the username provided already exists somewhere in localStorage
function checkUsername(username, users){
    let keys = Object.keys(users)
    for(k of keys){
        if(users[k].username == username){
            return [true, k]
        } 
    }
    return [false, null]
}

// main login function
function login(){
    // if the username and password have been verified as having at least a single character each
    if(usernameVerified && passwordVerified){
        let users = localStorage.getItem("users")
        if(users !== null){
            let usersData = JSON.parse(users)
            const username = document.getElementById("usernameInput").value
            // checks if the username exists in the list of user accounts
            let userInfo = checkUsername(username, usersData)
            if(userInfo[0]){
                const password = document.getElementById("passwordInput").value
                // if the username does exist we check if the passwords in storage and the provided passwords match
                if(usersData[userInfo[1]].password === password){
                    var signedIn = {
                        username: usersData[userInfo[1]].username,
                        email: usersData[userInfo[1]].email
                    }
                    localStorage.setItem("signedIn", JSON.stringify(signedIn))
                    window.location.replace("../index.html")
                }else{
                    // if the passwords do not match then an error mesage is displayed
                    let usernameError = document.getElementsByClassName("user")[0]
                    if(usernameError.innerHTML !== ""){
                        usernameError.innerHTML = ""
                    }
                    let passwordError = document.getElementsByClassName("pwd")[0]
                    passwordError.innerHTML = "Incorrect Password."
                }
            }else{
                // if the username does not exist then an error message is displayed
                let passwordError = document.getElementsByClassName("pwd")[0]
                if(passwordError.innerHTML !== ""){
                    passwordError.innerHTML = ""
                }
                let usernameError = document.getElementsByClassName("user")[0]
                usernameError.innerHTML = "This user is not registered."
            }
        }else{
            // if there are no users in storage then there is no account for the user to login to
            let usernameError = document.getElementsByClassName("user")[0]
            usernameError.innerHTML = "No users have been registered yet."
        }
    }else{
        // if the username and or password have not been verified then a relevant error message is displayed
        let usernameError = document.getElementsByClassName("user")[0]
        if(usernameError.innerHTML != ""){
            usernameError.innerHTML = ""
        }
        let passwordError = document.getElementsByClassName("pwd")[0]
        passwordError.innerHTML = "Required field missing"
    }
}