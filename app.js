var interval;
var timer = 0;
const snackbar = document.getElementById("snackbar");
const emailSnack = document.getElementById("emailSnack");
const elem = document.getElementById("main");
const login = document.getElementById("login");
var email;
var flag = 0;
var count = 0;
var count_paper = 0;
var uid;
var api_url = 'https://recruitment-app-rtr.herokuapp.com/posts/';

var mech_sets = ['https://forms.gle/ZTPvgHdM5CXrrzbA6',
                 'https://forms.gle/fPxvJ2gXCCFBhfPz8',
                 'https://forms.gle/EkqJ1nmKdFT6V4MA6'];

var etc_sets = ['https://forms.gle/tFeTsh8g2E6mk63V9',
                'https://forms.gle/ERzWkYS4ptN4tBPQ8',
                'https://forms.gle/vsMGHufm8oEJJAAq9'];

var comp_sets = ['https://forms.gle/SRfE6NoGFErAUNMe8',
                 'https://forms.gle/4KeTitce5Q6LfkNYA'];

interval = setInterval(checkFocus, 100);

setInterval(updateDB, 600000);

function checkFocus() {
    if (!document.hasFocus()) {
        timer += 0.1;
        handleSnack();
    }
}

function handleSnack() {
    snackbar.classList.add('show');
    setTimeout(function () { snackbar.classList.remove('show') }, 3000);
}

function authToggle() {
    // document.getElementById('FORM').src = "https://docs.google.com/forms/d/e/1FAIpQLSeyKdF_X0uXxtpdsl29bWzUtM8uYk718Tm_q2GAg-NQv9_6sQ/viewform?embedded=true";
    if (elem.style.display === "none") {
        elem.style.display = "block";
        login.style.display = "none";
        email = document.getElementById("user-email").value;
        document.getElementById("user-email").value = "";
    } else {
        elem.style.display = "none";
        login.style.display = "block";
    }
    var data = {
        email: email,
        timerCount: timer.toString(),
        paperCount: count_paper
    }
    count++;
    if(count === 2){
        fetch(`${api_url}${email}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            uid = res._id;
            count_paper = res.paperCount;
            timer = parseInt(res.timerCount);
        })
    }
}

function handleAuth() {
    var user = document.getElementById("user-email").value;
    validateEmail(user);
    // console.log(flag);
    if(flag === 69 || flag === 0){
        emailError();
    } else {
        closeError();
        if(flag === 1){
            authToggle();
            getETC();
            console.log("Elect or Etc");
        } else if(flag === 2){
            authToggle();
            getMech();
            console.log("Mech");
        } else if(flag === 3){
            authToggle();
            getComp();
            console.log("comp or it");
        }
    }
}

function emailError(){
    emailSnack.classList.add('show');
}

function closeError(){
    emailSnack.classList.remove('show');
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email)){
        if((email.indexOf("etc@mmcoe.edu.in", email.length - "etc@mmcoe.edu.in".length) !== -1) || (email.indexOf("elect@mmcoe.edu.in", email.length - "elect@mmcoe.edu.in".length) !== -1) ){
            flag = 1;
        } else if(email.indexOf("mech@mmcoe.edu.in", email.length - "mech@mmcoe.edu.in".length) !== -1) {
            flag = 2;
        } else if((email.indexOf("comp@mmcoe.edu.in", email.length - "comp@mmcoe.edu.in".length) !== -1) || (email.indexOf("it@mmcoe.edu.in", email.length - "it@mmcoe.edu.in".length) !== -1)){
            flag = 3;
        } else {
            flag = 69;
        }
    }
}

function updateDB(){
    var data = {
        email: email,
        timerCount: timer.toString(),
        paperCount: count_paper
    }
    fetch(`https://recruitment-app-rtr.herokuapp.com/posts/up/${uid}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "PATCH",
        body: JSON.stringify(data)
    }).then(console.log(timer));
}

function getMech(){
    if(!count_paper){
        count_paper = Math.floor(Math.random() * mech_sets.length);
    } 
    document.getElementById('FORM').src = mech_sets[count_paper];
   
}

function getETC(){
    if (!count_paper) {
        count_paper = Math.floor(Math.random() * etc_sets.length);
    }
    document.getElementById('FORM').src = etc_sets[count_paper];
}

function getComp(){
    if (!count_paper) {
       count_paper = Math.floor(Math.random() * comp_sets.length);
    }
    document.getElementById('FORM').src = comp_sets[count_paper];
}
