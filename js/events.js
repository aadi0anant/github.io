/**
 * File: events.js
 * Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 * Date: 2025-02-23
 * Description: This is the events javascript file that contains the functionalities for the events page.
 *             It displays the upcoming events in a calendar format and allows users to filter events by category.
 */

"use strict";

import {responseCodes} from "./responseCodes.js";

/**
 * To launch and display the upcoming events in a calendar when the page loads
 */
window.addEventListener("load", async function () {
    // Getting the error message element
    const errorMessage = document.getElementById("errorMessage");

    // Declared constant and variables to get the dates and months
    const months = ['January', 'February', "March"];
    let currentMonthIndex = 2;

    /**
     * The function that gets the list of upcoming events from the JSON file using the fetch command
     * and also displays appropriate error messages
     * @returns {Promise<any>}
     */
    async function GetEvents(){
         return fetch("./jsonDB/events.json")
            .then(response =>{
                if(response.status === responseCodes.NOT_FOUND){
                    throw new Error("Error: Wrong API Request! We are working on it come back later");
                } else if(response.status === responseCodes.BAD_REQUEST){
                    throw new Error("Error: Network Issue Please try again later");
                }
                return response.json();
            })
            .catch(error => {
                    // Displays meaningful error messages
                    errorMessage.textContent = error.message;
                    errorMessage.classList.add("d-block", "alert-danger");
                    errorMessage.classList.remove("d-none");
                } );
    }

    /**
     * Function that takes the current month input to display the events
     * it uses the list of events in each month gotten from the getEvents() and maps each event to suit the
     * required date
     * @param month the current data input
     * @returns {Promise<void>}
     */
    async function RenderCalendar(month) {
        const events = await GetEvents();

        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';
        const daysInMonth = new Date(2025, months.indexOf(month) + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.innerHTML = `<div class="date">${day}</div>`;

            const dayEvents = events[month].filter(event => event.date === day);
            dayEvents.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                eventDiv.setAttribute('data-category', event.category);
                eventDiv.textContent = event.name;
                dayDiv.appendChild(eventDiv);
            });

            calendar.appendChild(dayDiv);
        }
    }

    /**
     * An event listener for the previous month button to slide to the previous month
     */
    document.getElementById('prevMonth').addEventListener('click', () => {
        if (currentMonthIndex > 0) {
            currentMonthIndex--;
            document.getElementById('calendarMonth').textContent = months[currentMonthIndex];
            RenderCalendar(months[currentMonthIndex]);
        }
    });

    /**
     * An event listener for the next month button to slide to the next month
     */
    document.getElementById('nextMonth').addEventListener('click', () => {
        if (currentMonthIndex < months.length - 1) {
            currentMonthIndex++;
            document.getElementById('calendarMonth').textContent = months[currentMonthIndex];
            RenderCalendar(months[currentMonthIndex]);
        }
    });

    /**
     * An event listener to determine if user searched by any category
     */
    document.getElementById('eventCategory').addEventListener('change', function () {
        const selectedCategory = this.value;
        const events = document.querySelectorAll('.event');
        events.forEach(event => {
            if (selectedCategory === 'all' || event.getAttribute('data-category') === selectedCategory) {
                event.style.display = 'block';
            } else {
                event.style.display = 'none';
            }
        });
    });

    // Initial render
    document.getElementById('calendarMonth').textContent = months[currentMonthIndex];
    await RenderCalendar(months[currentMonthIndex]);
})