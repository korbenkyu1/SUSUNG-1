let hours = 0;
let minutes = 0;
let seconds = 0;
let tenMillis = 0;
const appendHours = document.getElementById("hours");
const appendTens = document.getElementById("tenMillis");
const appendSeconds = document.getElementById("seconds");
const appendMinutes = document.getElementById("minutes");
const buttonStart = document.getElementById("bt__start");
const buttonStop = document.getElementById("bt__stop");
const buttonReset = document.getElementById("bt__reset");
let intervalId;

buttonStart.onclick = function(){
    clearInterval(intervalId)
    intervalId = setInterval(operateTimer, 10)
}

buttonReset.onclick = function(){
    clearInterval(intervalId)
    hours = 0; tenMillis = 0; seconds = 0; minutes = 0;
    appendHours.textContent = "00"
    appendTens.textContent = "00"
    appendSeconds.textContent = "00"
    appendMinutes.textContent = "00"
}

buttonStop.onclick = function(){
    clearInterval(intervalId)
}


function operateTimer(){
    tenMillis++;
    appendTens.textContent = tenMillis > 9 ? tenMillis : '0' + tenMillis
    if(tenMillis > 99){
        seconds++;
        appendSeconds.textContent = seconds > 9 ? seconds : '0' + seconds
        tenMillis = 0
        appendTens.textContent = "00"
    }
    if (seconds > 59){
        minutes++;
        appendMinutes.textContent = minutes > 9 ? minutes : '0' + minutes
        seconds = 0
        appendSeconds.textContent = "00"

    }
    if (minutes > 59){
        hours++;
        appendHours.textContent = hours > 9 ? hours : '0' + hours
        minutes = 0
        appendMinutes.textContent = "00"
    }
}