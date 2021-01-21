const canWidth = window.innerWidth;
const canHeight = window.innerHeight;
canvas = document.getElementById('canvas');
canvas.width  = canWidth;
canvas.height = canHeight;
const ctx = canvas.getContext('2d');
var blockerRect = new Blocker(-canWidth/2,-canHeight, "rgb(48, 47, 45)")


var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed, transCall;
var initEntries = [];
// initialize the timer variables and start the animation

let trans = false;
var input = document.getElementById("form");

function startAnimating(fps) {
    canvas.style.zIndex = "1";
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {

    // stop
    if (stop) {
        return;
    }

    // request another frame

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;
    console.log(elapsed);
    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        then = now - (elapsed % fpsInterval);

        // draw stuff here
        ctx.clearRect(0,0, canvas.width, canvas.height);
        blockerRect.animate();

        var xCord = blockerRect.x;

        if (xCord > canWidth*2) {
            stop = true;
            canvas.style.zIndex = "0";
            ctx.clearRect(0,0, canWidth, canHeight);
        } else if (xCord > canWidth * .3 && !transCall) {
            transition();
            transCall = true;
        }

    }
}

function transition() {
    let titleScreen = document.getElementById("title_page");
    let content = document.getElementById("nonTitleContent");
    let inputBox = document.getElementById("input");
    inputBox.placeholder = "Add more tasks";
    inputBox.style.left = "34px";
    inputBox.style.fontSize = "1.5em";
    inputBox.style.width = "25em";
    content.style.textAlign = "left";
    titleScreen.style.minHeight = "10vh";
    initEntries.forEach(item => addList(item));
}

function Blocker (x,y,c) {
    this.x = x;
    this.y = y;
    this.c = c;

    this.dx = 50;

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.save();
        ctx.rotate(Math.PI/6);
        ctx.fillRect(this.x,this.y,canWidth/2, canHeight*2)
        ctx.restore();
    }
    
    this.animate = function() {
        this.x += this.dx
        this.draw();
    }
}

input.addEventListener("submit", function(e) {
    e.preventDefault();
    let textInputted = document.getElementById('input').value;
    let textMeat = textInputted.trim();
    //window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    if (textMeat != "") {
        document.getElementById("input").value = "";
        if(!trans) {
            initEntries.push(textMeat);
            startAnimating(80);
        } else if (!transCall) {
            initEntries.push(textMeat);
        }else {
            addList(textMeat);
        }
        trans = true;
    }
});

function addList(text) {
    listItem = document.createElement('li');
    listItem.className = "entry";
    text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    listItem.innerHTML = "<span class = 'entrytext'>" + text;
    listItem.innerHTML += "<form class='check'><input type='checkbox' class='cbox' name='cbox' onclick='handleClick(this)' ondblclick='handleDblClick(this)'/></form>"
    listElement = document.getElementById("tasks");
    listElement.appendChild(listItem);
}

function handleClick(cb) {
    var form = cb.form;
    var entry = form.parentElement;
    let decoration = entry.getElementsByClassName("entrytext")[0].style.textDecoration;
    if (decoration == "line-through") {
        entry.getElementsByClassName("entrytext")[0].style.textDecoration = "none";
    } else {
        entry.getElementsByClassName("entrytext")[0].style.textDecoration = "line-through";
    }
  }

function handleDblClick(cb) {
    var form = cb.form;
    var entry = form.parentElement;
    entry.remove();
}

