var canWidth = window.innerWidth;
var canHeight = window.innerHeight;
canvas = document.getElementById('canvas');
canvas.width  = canWidth;
canvas.height = canHeight;
const ctx = canvas.getContext('2d');
var blockerRect = new Blocker(-698,-canHeight * 2, "rgb(48, 47, 45)");

var isPlay;
var arrMusic = [];
var currMusic = 0;

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed, transCall, reminderTextCall, trans, loading;
var initEntries = [];

var entriesArray = [];
if (localStorage.getItem('toDoList')) {
    entriesArray = JSON.parse(localStorage.getItem('toDoList'));
    localStorage.setItem('toDoList', JSON.stringify(entriesArray));
    transition();
    trans = true;
    transCall = true;
    loading = true;
    for (let i = 0; i < entriesArray.length; i++) {
        addList(entriesArray[i][0],entriesArray[i][1]);
    }
    loading = false;
}

// initialize the timer variables and start the animation

var input = document.getElementById("form");

arrMusic.push('jazz1.mp3');
arrMusic.push('jazz2.mp3');
arrMusic.push('jazz3.mp3');
var audioHTML = document.getElementById('music');
audioHTML.volume = .5;
//var audio = new Audio('clickNoise.mp3');
shuffle(arrMusic);

function startAnimating(fps) {
    canWidth = window.innerWidth + 2;
    canHeight = window.innerHeight;
    canvas.width  = canWidth;
    canvas.height = canHeight;
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
    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        then = now - (elapsed % fpsInterval);

        // draw stuff here
        ctx.clearRect(0,0, canvas.width, canvas.height);
        blockerRect.animate();

        var xCord = blockerRect.x;

        if (xCord > canWidth*1.5) {
            stop = true;
            ctx.clearRect(0,0, canWidth, canHeight);
        } else if (xCord > canWidth * .4 && !reminderTextCall) {
            reminderUpdate();
            reminderTextCall = true;
        }
        else if (xCord > canWidth * .3 && !transCall) {
            transition();
            transCall = true;
        }

    }
}

function reminderUpdate() {
    let reminderText = document.getElementById("reminderText");
    reminderText.classList.add('notransition'); // Disable transitions
    reminderText.style.opacity = 1;
    reminderText.offsetHeight; // Trigger a reflow, flushing the CSS changes
    reminderText.classList.remove('notransition'); // Re-enable transitions
    requestAnimationFrame(function() {
        reminderText.style.opacity = 0;
    });
}

function transition() {
    //window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    let titleScreen = document.getElementById("title_page");
    let content = document.getElementById("nonTitleContent");
    let inputBox = document.getElementById("input");
    inputBox.placeholder = "Add more tasks";
    inputBox.style.left = "34px";
    inputBox.style.fontSize = "1.5em";
    inputBox.style.width = "25em";
    content.style.textAlign = "left";
    titleScreen.style.minHeight = "10vh";
    initEntries.forEach(item => addList(item, 1));
}

function Blocker (x,y,c) {
    this.x = x;
    this.y = y;
    this.c = c;

    this.dx = 25;

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.c;
        ctx.save();
        ctx.rotate(Math.PI/6);
        ctx.fillRect(this.x,this.y,698, canHeight*5);
        ctx.restore();
    };
    
    this.animate = function() {
        this.x += this.dx;
        this.draw();
    };
}

function playClick() {
    let audio = new Audio('clickNoise.mp3');
    audio.volume = .5;
    audio.play(); 
}

function editMusic() {
    if (isPlay) {
        audioHTML.pause();
        isPlay = false;
        document.getElementById('musicControl').style.opacity = 0;
        document.getElementById('musicControl').style.pointerEvents = "none";
    } else {
        audioHTML.play();
        isPlay = true;
        document.getElementById('musicControl').style.opacity = 1;
        document.getElementById('musicControl').style.pointerEvents = "auto";
    }
    
}

function volumeUp() {
    if(audioHTML.volume!= 1) {
        audioHTML.volume= Math.round((audioHTML.volume+ .1) * 10) / 10;
        playClick();
    }
}

function volumeDown() {
    if(audioHTML.volume!= .1) {
        audioHTML.volume= Math.round((audioHTML.volume- .1) * 10) / 10;
        playClick();
    }
}

function queueNext() {
    currMusic = (currMusic + 1) % arrMusic.length;
    audioHTML.src = arrMusic[currMusic];
    audioHTML.play();
}


input.addEventListener("submit", function(e) {
    e.preventDefault();
    let textInputted = document.getElementById('input').value;
    let textMeat = textInputted.trim();
    if (textMeat !== "") {
        document.getElementById("input").value = "";
        if(!trans) {
            initEntries.push(textMeat);
            startAnimating(60);
        } else if (!transCall) {
            initEntries.push(textMeat);
        }else {
            addList(textMeat, 1);
        }
        trans = true;
    }
});

function updateUl() {
    let tempArray = document.getElementsByClassName('entry');
    if (tempArray.length > 0) {
        let tempArray2 = [];
        for (let i = 0; i < tempArray.length; i++) {
            tempArray2.push([tempArray[i].firstChild.textContent, tempArray[i].firstChild.style.textDecoration]);
        }
        entriesArray = tempArray2;
        localStorage.setItem('toDoList', JSON.stringify(entriesArray));
    } else {
        localStorage.clear();
    }
}

function addList(text, textDec) {
    let listItem = document.createElement('li');
    listItem.className = "entry";
    text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    listItem.innerHTML = "<span class = 'entrytext'>" + text;
    listItem.innerHTML += "<form class='check'><input type='checkbox' class='cbox' name='cbox' onclick='handleClick(this)' ondblclick='handleDblClick(this)'/><div class='checkmark'></div></form>";
    let listElement = document.getElementById("tasks");
    listElement.appendChild(listItem);
    if(textDec != 1) {
        if (textDec == "line-through") {
            listItem.firstChild.style.textDecoration = textDec;
            listItem.getElementsByClassName("checkmark")[0].style.opacity = 1;
            listItem.lastElementChild.firstChild.checked = true;
        }
    }
    if(transCall && !loading) {
        updateUl();
        var margin = listItem.clientHeight;
        listItem.classList.add('notransition'); // Disable transitions
        listItem.style.marginBottom = "-" + margin + "px";
        listItem.style.opacity = 0;
        listItem.offsetHeight; // Trigger a reflow, flushing the CSS changes
        listItem.classList.remove('notransition'); // Re-enable transitions
        requestAnimationFrame(function() {
            listItem.style.opacity = 1;
            listItem.style.marginBottom = 0;
        })
    }
}

function handleClick(cb) {
    var form = cb.form;
    var entry = form.parentElement;
    playClick();
    let entryStyle = entry.firstChild;
    let decoration = entryStyle.style.textDecoration;
    if (decoration == "line-through") {
        entryStyle.style.textDecoration = "";
        entry.getElementsByClassName("checkmark")[0].style.opacity = 0;
    } else {
        entryStyle.style.textDecoration = "line-through";
        entry.getElementsByClassName("checkmark")[0].style.opacity = 1;
    }
    updateUl();
  }

function handleDblClick(cb) {
    var form = cb.form;
    var entry = form.parentElement;
    var margin = entry.clientHeight;
    entry.style.opacity = 0;
    entry.style.marginBottom = "-" + margin + "px";
    setTimeout(function() { entry.remove(); updateUl(); }, 2000);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    audioHTML.src = array[0];
    return array;
  }