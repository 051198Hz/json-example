"use strict";

 console.log("Hello!");

const id = document.querySelector("#id"),
    password = document.querySelector("#password"),
    loginBtn = document.querySelector("button");

function login() {
    const req = {
        id: id.value,
        password: password.value,
    };
    fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(req),
    });

}

loginBtn.addEventListener("click",login);

