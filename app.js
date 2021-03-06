var interval;
var timer = 0;
var clock = 0;
const snackbar = document.getElementById("snackbar");
const timerSnack = document.getElementById("timerSnack");
const emailSnack = document.getElementById("emailSnack");
const elem = document.getElementById("main");
const login = document.getElementById("login");
var email;
var flag = 0;
var count = 0;
var count_paper = 0;
var uid;
var api_url = 'https://recruitment-app-rtr.herokuapp.com/posts/';

var mech_sets = ['https://docs.google.com/forms/d/e/1FAIpQLScA2KzKyBCJmVx_YYkjQuNrh5xW0KXhvm7WPYDCVPgWJNDO5A/viewform?usp=sf_link',
                 'https://docs.google.com/forms/d/e/1FAIpQLSek8j8N8WvYqGGLexyT8qUuIbP73HMs1ZRZykcH6-Nlzw7svA/viewform?usp=sf_link'];

var etc_sets = ['https://docs.google.com/forms/d/e/1FAIpQLSeCsbYvV1FesFjxsoM5j0I5YGrv5Ee47BfpmQd2R4W6OsG9FQ/viewform?usp=sf_link',
                'https://docs.google.com/forms/d/e/1FAIpQLSfKIUbAevErLFFd2DiRqMQaAlWyFXHtDZmvQKmfphPk24LjDA/viewform?usp=sf_link',
                'https://docs.google.com/forms/d/e/1FAIpQLSdnQp75R3v5k4bhQYhEeHUcEtP129Dzm3DTjEW8hHB9s8wcCA/viewform?usp=sf_link'];

var comp_sets = ['https://docs.google.com/forms/d/e/1FAIpQLSfP50zKLAu5y_CL1K2-f7iLU_C0KN7VlIJj2oD4-BX2-1KGtQ/viewform?usp=sf_link',
                 'https://docs.google.com/forms/d/e/1FAIpQLSeH9NmTcPBQQAPVqckq08e4KpGeQnDO8ojh5EpC77CXALZtPQ/viewform?usp=sf_link',
                 'https://docs.google.com/forms/d/e/1FAIpQLSfd7w_hE5Jxi13_OxY6afjzfJZJWOG5mcIqKyvyLj7R9KmEog/viewform?usp=sf_link'];

interval = setInterval(checkFocus, 100);

setInterval(handleTimer, 60000);

setInterval(updateDB, 600000);

function handleTimer(){
    clock += 1;
    console.log(clock);
    if(clock < 90){
        document.getElementById('timerMsg').innerHTML ="<i class='fa fa-clock'>  🕑  "+ clock.toString() +" / 90 Mins </i>";
    } else {
        document.getElementById('timerMsg').innerHTML ="<i class='fa fa-exclamation-triangle'>     Time Up! Submit The Test Now. Extended time is being recorded </i>";
    }
    
}


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
        timerSnack.classList.add('show');
        document.getElementById('timerMsg').innerHTML ="<i class='fa fa-clock'>    "+ clock.toString() +" / 90 Mins </i>";
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
    document.getElementById('main').innerHTML =
    "<iframe id='FORM' title='g-Form' src='" + mech_sets[count_paper] + "' width='100%' height='943' frameborder='0' marginheight='0' marginwidth='0'> Loading… </iframe>"
    // document.getElementById('FORM').src = mech_sets[count_paper];
   
}

function getETC(){
    if (!count_paper) {
        count_paper = Math.floor(Math.random() * etc_sets.length);
    }
    document.getElementById('main').innerHTML =
        "<iframe id='FORM' title='g-Form' src='" + etc_sets[count_paper] + "' width='100%' height='943' frameborder='0' marginheight='0' marginwidth='0'> Loading… </iframe>"
    // document.getElementById('FORM').src = etc_sets[count_paper];
}

function getComp(){
    if (!count_paper) {
       count_paper = Math.floor(Math.random() * comp_sets.length);
    }
    document.getElementById('main').innerHTML =
    "<iframe id='FORM' title='g-Form' src='" + comp_sets[count_paper] + "' width='100%' height='943' frameborder='0' marginheight='0' marginwidth='0'> Loading… </iframe>"
    // document.getElementById('FORM').src = comp_sets[count_paper];
}
