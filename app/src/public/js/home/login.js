"use strict";

 console.log("Hello!");

const id = document.querySelector("#id"),
    password = document.querySelector("#password"),
    loginBtn = document.querySelector("button");

loginBtn.addEventListener("click", login);

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
        body: JSON.stringify(req),
    }).then( (res) => res.json())
    .then( (res) => {
        if(res.success){
            alert(`환영합니다, ${id.value} 님!`);
            location.href = "/";
        }else{
            alert("올바른 정보를 입력하세요!");
        }
    });
}


