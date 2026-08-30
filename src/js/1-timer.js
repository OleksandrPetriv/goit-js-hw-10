"use strict";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dataStart = document.querySelector("[data-start]"); 
const dateTimePicker = document.querySelector("#datetime-picker");
const dataDays = document.querySelector("[data-days]");
const dataHours = document.querySelector("[data-hours]");
const dataMinutes = document.querySelector("[data-minutes]");
const dataSeconds = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let timerId = null;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (!selectedDate || selectedDate.getTime() <= Date.now()) {
            userSelectedDate = null;
            dataStart.disabled = true;

            iziToast.error({
                message: `Please choose a date in the future`,
            });
            return;
        }
        userSelectedDate = selectedDate;
        dataStart.disabled = false;
    },
};

flatpickr(dateTimePicker, options);

dataStart.addEventListener("click", () => {
    if (!userSelectedDate) {
        return;
    }
    dataStart.disabled = true;
    dateTimePicker.disabled = true;

    updateTimer();

    timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const currentTime = Date.now();
  const targetTime = userSelectedDate.getTime();
  const deltaTime = targetTime - currentTime;

  if (deltaTime <= 0) {
    clearInterval(timerId);
    timerId = null;

    updateTimerInterface(0);

    dateTimePicker.disabled = false;

    return;
  }

  updateTimerInterface(deltaTime);
}

function updateTimerInterface(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  dataDays.textContent = addLeadingZero(days);
  dataHours.textContent = addLeadingZero(hours);
  dataMinutes.textContent = addLeadingZero(minutes);
  dataSeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

