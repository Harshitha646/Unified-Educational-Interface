function loginCheck(){

const username = document.querySelector('input[type="text"]').value
const password = document.querySelector('input[type="password"]').value

fetch("https://unified-educational-interface.onrender.com/api/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username:username,
password:password
})
})
.then(res => res.json())
.then(data => {

if(data.message === "Login Successful"){

localStorage.setItem("studentName", username)

window.location.href = "student.html"

}else{

alert("Invalid Login")

}

})

return false

}

}

}
function logout(){
localStorage.removeItem("studentName");
window.location.href = "login.html";
}

function submitFeedback(event){
    event.preventDefault();
    alert("Thank you! Your feedback has been submitted.");
    event.target.reset();
}


/* Show student name in navbar */

const studentName = localStorage.getItem("studentName");

if(studentName){
document.getElementById("studentName").innerText = "👤 " + studentName;
}

const name = localStorage.getItem("studentName");

if(name){
const welcome = document.getElementById("welcomeUser");

if(welcome){
welcome.innerText = "Welcome " + name + " 👋";
}
}

