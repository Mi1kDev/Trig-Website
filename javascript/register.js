// checks if the user is signed in
var signedIn = localStorage.getItem("signedIn")
if(signedIn){
    // if the user is signed in and attempting to access the register page, then they are redirected to the home page
    window.location.replace("../index.html")
}
// initializes the verification booleans
let emailVerified = false
let cEmailVerified = false
let passwordVerified = false
let cPasswordVerified = false
let submitAllowed = false
window.addEventListener("load", ()=>{
    //get refernce tto the relevant registration forms
    if(signedIn){
        return
    }else{
        // gets references to the various input fields, error message locations and the submit button
        let email = document.getElementsByClassName("email")[0]
        let cEmail = document.getElementsByClassName("confirmEmail")[0]
        let pwd = document.getElementsByClassName("password")[0]
        let cPwd = document.getElementsByClassName("confirmPassword")[0]
        let unspecialInput = [document.getElementsByClassName("uname")[0], document.getElementsByClassName("fname")[0], document.getElementsByClassName("lname")[0], document.getElementsByClassName("dob")[0]]
        let errorMessages = document.getElementsByClassName("registerErrorText")
        let submitButton = document.getElementsByClassName("registerButton")[0]

        // applies a listener common to the provided list of elements
        // this listener simply checks that some form of information has been input
        unSpecialListeners(unspecialInput, [errorMessages[0], errorMessages[1], errorMessages[2], errorMessages[3]])
        // checks the validation of the email and confirmed email as well as the register button
        email.addEventListener("keyup", ()=>{
            emailCheck(email, errorMessages[4])
            confirmEmailCheck(email, cEmail, errorMessages[5])
            registerButtonCheck(unspecialInput, errorMessages)
        })
        // checks the validation of the confirmed email as well as the register button
        cEmail.addEventListener("keyup", ()=>{
            confirmEmailCheck(email, cEmail, errorMessages[5])
            registerButtonCheck(unspecialInput, errorMessages)
        })
        // checks the validation of the password, confirmed password as well as register button
        pwd.addEventListener("keyup", ()=>{
            passwordCheck(pwd, errorMessages[6])
            confirmPasswordCheck(pwd, cPwd, errorMessages[7])
            registerButtonCheck(unspecialInput, errorMessages)
        })
        // checks the validation of the confirmed password as well as register button
        cPwd.addEventListener("keyup", ()=>{
            confirmPasswordCheck(pwd, cPwd, errorMessages[7])
            registerButtonCheck(unspecialInput, errorMessages)
        })
        // allows the submit button to run the submit function when clicked
        submitButton.addEventListener("click", submit)
        // removes css class upon animation end
        submitButton.addEventListener("animationend", ()=>{
            if(submitButton.classList.contains("shaking-relative")){
                submitButton.classList.remove("shaking-relative")
            }
        })
    }
})

// adds event lister for register button check
function unSpecialListeners(inputFields, errorMessageList){
    for(i = 0; i < inputFields.length; i++){
        inputFields[i].addEventListener("keyup", ()=>{
            registerButtonCheck(inputFields, errorMessageList)
        })
    }
}

// tests if a provided email matches the appropriate pattern
// if it does then the email is verified
// otherwise an error message is displayed
function emailCheck(email, emailError){
    const emailPattern = new RegExp("[a-zA-Z0-9]+@{1}[a-zA-Z0-9]+(\\.{1}[a-zA-Z]+){1,}")
    if(emailPattern.test(email.value) != true){
        if(!email.classList.contains("registerError")){
            email.classList.add("registerError")
            emailError.innerHTML = "Invalid email address"
        }
        emailVerified = false
    }else{
        if(email.classList.contains("registerError")){
            email.classList.remove("registerError")
            emailError.innerHTML = ""
        }
        emailVerified = true
    }
}

// tests whether the confirm email and email fields are identical
// if they are not then an error message is displayed
function confirmEmailCheck(emailVal, cEmailVal, cEmailError){
    if(emailVal.value != cEmailVal.value){
        if(!cEmailVal.classList.contains("registerError")){
            cEmailVal.classList.add("registerError")
            cEmailError.innerHTML = "Emails must be the same"
        }
        cEmailVerified = false
    }else{
        if(cEmailVal.classList.contains("registerError")){
            cEmailVal.classList.remove("registerError")
            cEmailError.innerHTML = ""
        }
        cEmailVerified = true
    }
}

// checks if the provided password has a length greater than or equal to 8
// if it does not then an error message is displayed
function passwordCheck(pwd, passwordError){
    if(pwd.value.length < 8){
        if(!pwd.classList.contains("registerError")){
            pwd.classList.add("registerError")
            passwordError.innerHTML = "Password must be at least 8 characters long"
        }
        passwordVerified = false
    }else{
        if(pwd.classList.contains("registerError")){
            pwd.classList.remove("registerError")
            passwordError.innerHTML = ""
        }
        passwordVerified = true
    }

}

// checks if the password and confirm password fields are identical
// if they are not then an error message is displayed
function confirmPasswordCheck(pwd, cPwd, cPasswordError){
    if(pwd.value != cPwd.value){
        if(!cPwd.classList.contains("registerError")){
            cPwd.classList.add("registerError")
            cPasswordError.innerHTML = "Passwords are not the same"
        }
        cPasswordVerified = false
    }else{
        if(cPwd.classList.contains("registerError")){
            cPwd.classList.remove("registerError")
            cPasswordError.innerHTML = ""
        }
        cPasswordVerified = true;
    }
}

// checks if the registration button should display itself as active
function registerButtonCheck(unSpecial, errorMessages){
    let rButton = document.getElementsByClassName("registerButton")[0]
    let unSpecialVerifiedList = [];
    let count = 0
    // checks that all unspecial elements at least have some data input
    // an error message is displayed if there is no data provided
    for(e of unSpecial){
        if(e.value == ""){
            unSpecialVerifiedList.push(true)
            if(!e.classList.contains("registerError")){
                e.classList.add("registerError")
                errorMessages[count].innerHTML = "This field must be provided text"
            }
        }else{
            unSpecialVerifiedList.push(false)
            if(e.classList.contains("registerError")){
                e.classList.remove("registerError")
                errorMessages[count].innerHTML = ""
            }
        }
        count++
    }
    // if any of the unspecial elements do not have data then they are not verified
    let unSpecialVerified = !unSpecialVerifiedList.includes(true)
    // if all inputs are verified then the locked css class is removed from the register button and submits are made available
    if(unSpecialVerified && emailVerified && cEmailVerified && passwordVerified && cPasswordVerified){
        if(rButton.classList.contains("locked")){
            rButton.classList.remove("locked")
        }
        submitAllowed = true
    }else{
        if(!rButton.classList.contains("locked")){
            rButton.classList.add("locked")
        }
        submitAllowed = false
    }
}

// submits data from input fields into storage
function submit(){
    if(submitAllowed){
        // gets a reference to all fields that need to be stored
        let username = document.getElementsByClassName("uname")[0]
        let fname = document.getElementsByClassName("fname")[0]
        let lname = document.getElementsByClassName("lname")[0]
        let dob = document.getElementsByClassName("dob")[0]
        let email = document.getElementsByClassName("email")[0]
        let password = document.getElementsByClassName("password")[0]
        // creates an object representing the user
        let user = {
                username: username.value,
                fname: fname.value,
                lname: lname.value,
                dob: dob.value,
                email: email.value.toLowerCase(),
                password: password.value,
                gamesPlayed: 0,
                highscore: 0,
        } 
        let promptValid = true
        // if other users are already in storage then those users are extracted and parsed
        if(localStorage.getItem("users") != null){
            let users = JSON.parse(localStorage.getItem("users"))
            let errorText = document.getElementsByClassName("registerErrorText")[8]
            // if the provided email is in use by another account then an error message is displayed
            if(user.email in users){
                errorText.innerHTML = "Email address already in use."
                promptValid = false
                let button = document.getElementsByClassName("registerButton")[0]
                button.classList.add("shaking-relative")
            }else{
                let keyList = Object.keys(users)
                let duplicateUsername = false
                // checks if there exists any duplicate username
                for(key of keyList){
                    if(users[key].username.toLowerCase() == user.username.toLowerCase()){
                        duplicateUsername = true
                        break
                    }
                }
                // if there is no duplicate username then the user data is stored in localStorage
                if(!duplicateUsername){
                    if(errorText.innerHTML !== ""){
                        errorText.innerHTML = ""
                    }
                    // if there exists a temporary score in sessionStorage it is set as the user's highscore
                    let tempData = sessionStorage.getItem("tempScore")
                    if(tempData){
                        user.highscore = JSON.parse(tempData)
                        user.gamesPlayed = 1
                        sessionStorage.removeItem("tempScore")
                    }
                    users[email.value] = user
                    localStorage.setItem("users", JSON.stringify(users))
                }else{
                    // if there is a duplicate username then an error message is displayed
                    errorText.innerHTML = "Username already in use"
                    promptValid = false
                    let button = document.getElementsByClassName("registerButton")[0]
                    button.classList.add("shaking-relative")
                }
                
            }
        }else{
            // if local storage does not yet exist then the user data is put directly into storage
            let tempData = sessionStorage.getItem("tempScore")
            // if there is a temporary score in storage then it is set to the user's highscore
            if(tempData){
                user.highscore = JSON.parse(tempData)
                user.gamesPlayed = 1
                sessionStorage.removeItem("tempScore")
            }
            let users = {}
            users[email.value] = user
            localStorage.setItem("users", JSON.stringify(users)) 
        }
        // if all is well and storage has been populated then another localstorage is created to represent the user that is signed in
        if(promptValid){
            var signedIn = {
                username: user.username,
                email: user.email
            }
            localStorage.setItem("signedIn", JSON.stringify(signedIn))
            // the user is redirected to the home page after being signed in
            window.location.replace("../index.html")
        }      
    }else{
        let button = document.getElementsByClassName("registerButton")[0]
        button.classList.add("shaking-relative")
    }
}