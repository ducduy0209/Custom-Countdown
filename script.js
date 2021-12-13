const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let saveCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set date input Min with Today's Date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate countdown / Complete UI
const updateDOM = () => {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // Hide input
        inputContainer.hidden = true;

        if (distance <= 0) {
            completeEl.hidden = false;
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
        } else {
            // Show countdown in progress
            countdownElTitle.innerText = countdownTitle;
            timeElements[0].innerText = days;
            timeElements[1].innerText = hours;
            timeElements[2].innerText = minutes;
            timeElements[3].innerText = seconds;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }

    }, second);
}

// take value from Form input
const updateCountdown = (e) => {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    saveCountdown = {
        title: countdownTitle,
        date: countdownDate,
    }
    localStorage.setItem("countdown", JSON.stringify(saveCountdown));
    if (!countdownDate) {
        alert("Please select a date for the countdown!");
    } else {
        // Get number version of current Date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

const reset = () => {
    inputContainer.hidden = false;
    completeEl.hidden = true;
    countdownEl.hidden = true;
    clearInterval(countdownActive);
    localStorage.removeItem('countdown');
}

const restorePreviousCountdown = () => {
    // Get countdown from localstorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        saveCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = saveCountdown.title;
        countdownDate = saveCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// Event submit form countdown
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// Onload check local storage 
restorePreviousCountdown();