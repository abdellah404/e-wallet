import {finduserbymail} from "../Model/database.js";

const email = document.getElementById("mail");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submitbtn");

submitBtn.addEventListener("click", handleSubmit);

function handleSubmit() {
 
    if (!email.value || !password.value) {
        alert("bad credentials");
        return;
    }   

    setTimeout(() => {
        const user = finduserbymail(email.value, password.value);
        if (user) {
            sessionStorage.setItem("currentUser", JSON.stringify(user));
            window.location = "../View/dashboard.html";
        } else {
            alert("bad credentials");
        }
    }, 2000);
}