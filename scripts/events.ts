"use strict";
/**
 * File: events.ts
 * Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 * Date: 2025-02-23
 * Description: This is the events typescript file that contains the functionalities for the events page.
 *             It displays the upcoming events in a calendar format and allows users to filter events by category.
 */

import { router } from "./main.js";

interface Event {
    date: number;
    category: string;
    name: string;
    location: string;
}
interface IGEventMap {
    [key: string]: Event[]
}

/**
 * A function To launch and display the upcoming events in a calendar when the page loads
 */
export function DisplayEventsPage() {
    console.log("[WARNING] DisplayEvents page");
    // Getting the error message element
    const errorMessage = document.getElementById("errorMessage") as HTMLElement;

    // Declared constant and variables to get the dates and months
    const months:string[] = ['January', 'February', "March"];
    let currentMonthIndex:number = 1;

    /**
     * The function that gets the list of upcoming events from the JSON file using the fetch command
     * and also displays appropriate error messages
     * @returns {Promise<any>}
     */
    async function GetEvents():Promise<IGEventMap|null> {
        try {
            const response = await fetch("./data/events.json");

            const data = await response.json();
            console.log("Fetched Data:", data);
            return data;
        } catch (error:any) {
            console.error("Fetch error:", error);

            if (errorMessage) {
                errorMessage.textContent = error.message;
                errorMessage.classList.add("d-block", "alert-danger");
                errorMessage.classList.remove("d-none");
            }

            return null;
        }
    }

    // Gets the search input from the page
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const selectedCategoryElement = document.getElementById('eventCategory') as HTMLInputElement;
    const selectedDateElement = document.getElementById('eventDate') as HTMLInputElement;
    const selectedLocationElement = document.getElementById('eventLocation') as HTMLInputElement;
    /**
     * Function that takes the current month input to display the events and also a sorting parameter to search to event
     * it uses the list of events in each month gotten from the getEvents() and maps each event to suit the
     * required date
     * @param month the current data input
     * @param sorting to search event by
     * @returns {Promise<void>}
     */
    async function RenderCalendar(month:string, sorting:string=""):Promise<void> {
        const events:IGEventMap|null =  await GetEvents();
        console.log(events);

        const calendar = document.getElementById('calendar') as HTMLElement;
        calendar.innerHTML = '';
        const daysInMonth:number = new Date(2025, months.indexOf(month) + 1, 0).getDate();


        for (let day:number = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div') as HTMLDivElement;
            dayDiv.className = 'calendar-day';
            dayDiv.innerHTML = `<div class="date">${day}</div>`;

            let dayEvents = (events as IGEventMap)[month].filter(event => event.date === day);

            // Apply filters for Category
            if (selectedCategoryElement.value !== 'all' && sorting === "byCategory") {
                dayEvents = dayEvents.filter(event => event.category === selectedCategoryElement.value);
            }
            // Apply filters for Date
            if (selectedDateElement.value && sorting === "byDate") {
                dayEvents = dayEvents.filter(event => event.date === parseInt(selectedDateElement.value, 10));
            }

            // Apply filters for Location
            if(selectedLocationElement.value && sorting === "byLocation") {
                dayEvents = dayEvents.filter(event => event.location.toLowerCase().includes(selectedLocationElement.value.trim().toLowerCase()));
            }
            if(searchInput.value !== '' && sorting === "searchBar") {
                dayEvents = dayEvents.filter(event => event.date === parseInt(searchInput.value, 10)
                    || event.name.toLowerCase().includes(searchInput.value.trim().toLowerCase())
                    || event.location.toLowerCase().includes(searchInput.value.trim().toLowerCase()));
            }

            dayEvents.forEach(event => {
                const eventDiv = document.createElement('div') as HTMLDivElement;
                eventDiv.className = 'event';
                eventDiv.setAttribute('data-category', event.category);
                eventDiv.setAttribute('data-date', String(event.date));
                eventDiv.textContent = event.name;
                dayDiv.appendChild(eventDiv);
            });

            calendar.appendChild(dayDiv);
        }
    }

    const calendarMonth = document.getElementById('calendarMonth') as HTMLElement;
    /**
     * An event listener for the previous month button to slide to the previous month
     */
    (document.getElementById('prevMonth') as HTMLElement).addEventListener('click', () => {
        if (currentMonthIndex > 0) {
            currentMonthIndex--;
            calendarMonth.textContent = months[currentMonthIndex];
            RenderCalendar(months[currentMonthIndex]).then().catch(console.error);
        }
    });

    /**
     * An event listener for the next month button to slide to the next month
     */
    (document.getElementById('nextMonth') as HTMLElement).addEventListener('click', () => {
        if (currentMonthIndex < months.length - 1) {
            currentMonthIndex++;
            calendarMonth.textContent = months[currentMonthIndex];
            RenderCalendar(months[currentMonthIndex]).then().catch(console.error);
        }
    });

    const getcreateEventButton = document.getElementById("createEventButton") as HTMLElement;
    getcreateEventButton.addEventListener("click", function () {
    router.navigate("/eventPlanning");
    });
    
    /**
     * An event listener to determine if user searched by any category, date, location
     */
    selectedCategoryElement.addEventListener('change', () => RenderCalendar(months[currentMonthIndex], "byCategory"));
    selectedDateElement.addEventListener('input', () => RenderCalendar(months[currentMonthIndex], "byDate"));
    searchInput.addEventListener('input', () => RenderCalendar(months[currentMonthIndex], "searchBar"));
    selectedLocationElement.addEventListener('input', () => RenderCalendar(months[currentMonthIndex], "byLocation"));    

    // Initial render
    calendarMonth.textContent = months[currentMonthIndex];
    RenderCalendar(months[currentMonthIndex]).then().catch(console.error);
}