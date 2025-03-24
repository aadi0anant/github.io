/**
 File: eventPlanning.ts
 Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 Date: 2025-03-22
 Description: This is the typescript functionalities to display event planning and interact with them
 */
"use strict";
import { CheckLogin } from './header.js';
import { router } from "./main.js";
/**
 * Event Planning page typescript functionalities to display content and interact with them
 *
 */
export function DisplayEventPlanningPage() {
    console.log("Calling DisplayEventPlanningPage...");
    // Check if the user is logged in
    const user = CheckLogin();
    if (!user) {
        router.navigate("/login"); // Redirect to login page
        return;
    }
    /**
     * Getting the html elements to enable handling the form in the event planning page with event handlers
     */
    const createButton = document.getElementById("createButton");
    const cancelButton = document.getElementById("cancelButton");
    const messageArea = document.getElementById('messageAreaIndex');
    const username = typeof user === 'object' && user !== null ? user.username : '';
    console.log("User logged in: ", username);
    /**
     * Function to load events from local storage and display them in the event planning page
     */
    async function loadEvents(query = "") {
        console.log("loadEvents Function called...");
        // Load events from local storage
        const events = JSON.parse(localStorage.getItem(username + '_events') || '[]');
        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';
        if (events.length === 0) {
            eventsList.innerHTML = '<p>No events created yet.</p>';
        }
        else { // Display events in the event planning page
            events.forEach((event, index) => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item border-right p-3 mb-3';
                if (event.eventCategory.toLowerCase().includes(query.toLowerCase())
                    || event.eventLocation.toLowerCase().includes(query.toLowerCase())
                    || event.eventDescription.toLowerCase().includes(query.toLowerCase())
                    || event.eventName.toLowerCase().includes(query.toLowerCase())) {
                    eventItem.innerHTML = `
                    <h3>${event.eventName}</h3>
                    <p><strong>Date:</strong> ${event.eventDate}</p>
                    <p><strong>Time:</strong> ${event.eventTime}</p>
                    <p><strong>Location:</strong> ${event.eventLocation}</p>
                    <p><strong>Category:</strong> ${event.eventCategory}</p>
                    <p><strong>Description:</strong> ${event.eventDescription}</p>
                    <button class="btn btn-danger deleteButton" data-index="${index}">Delete</button>
                `;
                    // Append the event item to the events list
                    eventsList.appendChild(eventItem);
                }
            });
            /**
             * Event listener to delete an event from the list of events
             */
            document.querySelectorAll('.deleteButton').forEach(button => {
                button.addEventListener('click', async function () {
                    const index = this.getAttribute('data-index');
                    events.splice(Number(index), 1);
                    localStorage.setItem(username + '_events', JSON.stringify(events));
                    loadEvents().then().catch(console.error);
                });
            });
        }
    }
    // Call loadEvents when the page loads
    loadEvents();
    /**
     * Event listener to create a new event
     */
    createButton.addEventListener("click", async (e) => {
        console.log("Create button clicked");
        e.preventDefault();
        // Get the event data from the form
        try {
            const eventName = document.getElementById("eventName").value.trim();
            const eventDate = document.getElementById("eventDate").value.trim();
            const eventTime = document.getElementById("eventTime").value.trim();
            const eventLocation = document.getElementById("eventLocation").value.trim();
            const eventDescription = document.getElementById("eventDescription").value.trim();
            const eventCategory = document.getElementById("eventCategory").value.trim();
            const [hours, minutes] = eventTime.split(':').map(Number);
            // Validate the event data
            if (!eventName || !eventDate || !eventTime || !eventLocation || !eventDescription || !eventCategory) {
                throw new Error("All fields are required.");
            }
            if (hours < 9 || (hours === 17 && minutes > 0) || hours > 17) {
                throw new Error("Event time must be between 9:00 AM and 5:00 PM.");
            }
            // Create an EventData object
            const eventData = {
                eventName,
                eventDate,
                eventTime,
                eventLocation,
                eventDescription,
                eventCategory
            };
            // Store event data in local storage
            const events = JSON.parse(localStorage.getItem(username + '_events') || '[]');
            events.push(eventData);
            localStorage.setItem(username + '_events', JSON.stringify(events));
            alert("Event created successfully!");
            document.getElementById("eventPlanningForm").reset();
            loadEvents(); // Reload events after creating a new one
            // Remove any previous error message
            messageArea.classList.add('d-none');
            messageArea.classList.remove('d-block', 'alert', 'alert-danger');
            messageArea.textContent = '';
        }
        catch (error) {
            messageArea.classList.remove('d-none');
            messageArea.classList.add('d-block', 'alert', 'alert-danger');
            const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
            messageArea.textContent = `Error creating the event. ${errorMessage}`;
        }
    });
    /**
     * Event listener to cancel the event creation
     */
    cancelButton.addEventListener("click", () => {
        console.log("Cancel button clicked");
        document.getElementById("eventPlanningForm").reset();
        messageArea.classList.add('d-none');
    });
    /**
     * Event listener to set the minimum and maximum date for the event date input
     */
    document.addEventListener('DOMContentLoaded', function () {
        const dateInput = document.getElementById('eventDate');
        dateInput.setAttribute('min', '2025-01-01');
        dateInput.setAttribute('max', '2025-03-31');
    });
    // Gets the search input from the page
    const searchInput = document.getElementById("searchInput");
    // Searches for news based on users search input
    searchInput.addEventListener("input", async function (e) {
        const query = e.target.value;
        console.log("Search query:", query);
        await loadEvents(query);
    });
}
//# sourceMappingURL=eventPlanning.js.map