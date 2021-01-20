
function transition() {
    let titleScreen = document.getElementById("title_page");
    let content = document.getElementById("nonTitleContent");
    let inputBox = document.getElementById("input");
    inputBox.placeholder = "Add more tasks";
    inputBox.value = "";
    inputBox.style.left = "34px";
    inputBox.style.fontSize = "1.5em";
    inputBox.style.width = "25em";
    content.style.textAlign = "left";
    titleScreen.style.minHeight = "10vh";
}

let trans = false;
var input = document.getElementById("form");


input.addEventListener("submit", function(e) {
    e.preventDefault();
    let textInputted = document.getElementById('input').value;
    let textMeat = textInputted.trim();
    //window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    if (textMeat != "") {
        listItem = document.createElement('li');
        listItem.className = "entry";
        textMeat = textMeat.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        listItem.innerHTML = "<span class = 'entrytext'>" + textMeat;
        listItem.innerHTML += "<form class='check'><input type='checkbox' class='cbox' name='cbox' onclick='handleClick(this)' /></form>"
        listElement = document.getElementById("tasks");
        listElement.appendChild(listItem);
        if(!trans) {
            transition();
        } else {
            document.getElementById("input").value = "";
        }
        trans = true;
    }
});

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
