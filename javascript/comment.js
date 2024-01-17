window.addEventListener("load", ()=>{
    // gets a reference to the comment post button
    const commentPost = document.getElementById("commentPost")
    // when the button is clicked it will upload the comment stored in the text area field
    // this will only happen if the provided text is not empty
    commentPost.addEventListener("click", ()=>{
        const commentBar = document.getElementsByClassName("commentBar")[0]
        const val = commentBar.value.trim()
        if(val != ""){
            uploadComment(val, commentBar)
        }
    }) 
    // loads previously stored comments
    initCommentList()
})

// iterates through existing comments stored in localStorage and displays them in a list on the loaded comments section
function initCommentList(){
    const commentCollection = JSON.parse(localStorage.getItem("comments"))
    if(commentCollection != null){
        const loadedComments = document.getElementById("loadedComments")
        commentCollection.forEach(comment => {
            let commentDiv = document.createElement("div")
            commentDiv.className = "comment paragraph-text"
            commentDiv.innerHTML = comment

            loadedComments.appendChild(commentDiv)
        })
    }
}

// updates the comment list once a new comment has been uploaded
function updateCommentList(commentText){
    const loadedComments = document.getElementById("loadedComments")
    let commentDiv = document.createElement("div")
    commentDiv.className = "comment"
    commentDiv.innerHTML = commentText
    loadedComments.appendChild(commentDiv)

}

// stores the new comment in local storgae
// uses the user's username if they are signed in, otherwise it is prepended as anonymous
function  uploadComment(comment, commentBar){
    commentBar.value = ""
    var commentCollection = JSON.parse(localStorage.getItem("comments"))
    if(commentCollection == null){
        var comments = []
        if(localStorage.getItem("signedIn")){
            comment = JSON.parse(localStorage.getItem("signedIn")).username.toUpperCase()+": "+comment
            comments.push(comment)
        }else{
            comment = "ANONYMOUS: "+comment
            comments.push(comment)
        }
        localStorage.setItem("comments", JSON.stringify(comments))
        updateCommentList(comment)
    }else{
        var comments = commentCollection
        if(localStorage.getItem("signedIn")){
            comment = JSON.parse(localStorage.getItem("signedIn")).username.toUpperCase()+": "+comment
            comments.push(comment)
        }else{
            comment = "ANONYMOUS: "+comment
            comments.push(comment)
        }
        localStorage.setItem("comments", JSON.stringify(commentCollection))
        updateCommentList(comment)
    }
}