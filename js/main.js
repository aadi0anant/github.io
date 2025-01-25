/**
File: index.html
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-01-25
Description: This is the main javascript file for the website. It contains the functionalities for the home page, opportunities page, events page, and contact page. 
It also contains the footer section and back to top button functionalities.
*/

"use strict";

(function () {

    /**
     * The display home page function that gives functionalities get involved button to redirect to the opportunities pages.
     */
    function DisplayHomePage() {
        console.log("Calling DisplayHomePage...");

        let getInvolvedButton = document.getElementById("getInvolvedBtn");
        getInvolvedButton.addEventListener("click", function () {
            location.href = "opportunities.html";
        });
    }

    /**
     * Opportunities page javascript functionalities to display content and interact with them
     */
    function DisplayOpportunitiesPage() {
        console.log("Calling DisplayOpportunitiesPage...");
        const opportunities = [
            {
                title: "Beach Cleanup",
                description: "Join us in cleaning up our local beach and help protect marine life.",
                dateTime: "March 15, 2025, 10:00 AM"
            },
            {
                title: "Community Garden Project",
                description: "Help us plant and maintain a community garden for fresh produce.",
                dateTime: "March 20, 2025, 9:00 AM"
            },
            {
                title: "Soup Kitchen Assistance",
                description: "Assist in preparing and serving meals to those in need.",
                dateTime: "March 25, 2025, 5:00 PM"
            },
            {
                title: "Park Restoration",
                description: "Help restore the beauty of our local park by planting trees and clearing debris.",
                dateTime: "April 5, 2025, 8:00 AM"
            },
            {
                title: "Animal Shelter Support",
                description: "Assist in caring for animals and maintaining shelter facilities.",
                dateTime: "April 10, 2025, 1:00 PM"
            },
            {
                title: "Library Book Drive",
                description: "Organize and distribute books to promote literacy in the community.",
                dateTime: "April 15, 2025, 11:00 AM"
            },
            {
                title: "Senior Home Visits",
                description: "Spend quality time with senior residents and participate in activities.",
                dateTime: "April 20, 2025, 3:00 PM"
            },
            {
                title: "Recycling Workshop",
                description: "Educate the community about recycling and sustainable practices.",
                dateTime: "April 25, 2025, 10:00 AM"
            },
            {
                title: "Charity Run Assistance",
                description: "Help with organizing and managing a charity run event.",
                dateTime: "April 30, 2025, 6:00 AM"
            }
        ];
        let card = "";
        const opportunitiesMain = document.getElementById('opportunities');
        for (const elements of opportunities) {
            card += `<div class="card m-2" style="width: 18rem;">
                        <div class="card-body d-flex flex-column justify-content-between align-items-start">
                            <h5 class="card-title">${elements.title}</h5>
                            <p class="card-text">${elements.description}</p>
                            <p class="card-text">${elements.dateTime}</p>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                Sign Up
                            </button>
                        </div>
                    </div>`

        }
        opportunitiesMain.innerHTML = card;

        let signUpButton = document.getElementById("modalSubmitButton");
        let modalInfoSpan = document.getElementById("modalInfo");
        let openModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
        signUpButton.addEventListener("click", function (e) {
            e.preventDefault();
            try {
                let newUser = new User(fullName.value, emailAddress.value, role.value);
                modalInfoSpan.className = "alert alert-success";
                modalInfoSpan.textContent = newUser.serialize();
                setTimeout(() => {
                    // Clear the form
                    fullName.value = "";
                    emailAddress.value = "";
                    role.value = "";
                    openModal.hide();
                    modalInfoSpan.className = "";
                    modalInfoSpan.textContent = "";
                }, 1000); // 6000 ms = 6 seconds
            } catch (error) {
                modalInfoSpan.className = "alert alert-danger";
                modalInfoSpan.textContent = `Error occurred while signing up! ${error.message}`;

            }


        })

    }

    /**
     * Events page javascript functionalities to display content and interact with them
     *
     */
    function DisplayEventsPage() {
        console.log("Calling DisplayEventsPage...");

        const events = {
            'January': [
                {date: 1, category: 'fundraisers', name: 'Delpark Fundraiser'},
                {date: 1, category: 'workshops', name: 'New Volunteer Workshop'},
                {date: 7, category: 'cleanups', name: 'Lakeview Park Cleanup'},
                {date: 13, category: 'fundraisers', name: 'Cancer Patient Fundraiser'},
                {date: 18, category: 'workshops', name: 'Drugs Awareness Workshop'},
                {date: 23, category: 'cleanups', name: 'Campus Cleanup Day'},
                {date: 26, category: 'fundraisers', name: 'Education Fundraiser Event'},
                {date: 30, category: 'workshops', name: 'Public Safety Workshop'}
            ],
            'February': [
                {date: 3, category: 'fundraisers', name: 'Delpark Fundraiser'},
                {date: 7, category: 'workshops', name: 'New Volunteer Workshop'},
                {date: 12, category: 'cleanups', name: 'Lakeview Park Cleanup'},
                {date: 17, category: 'fundraisers', name: 'Cancer Patient Fundraiser'},
                {date: 21, category: 'workshops', name: 'Public Safety Workshop'},
                {date: 25, category: 'cleanups', name: 'Campus Cleanup Day'},
                {date: 28, category: 'fundraisers', name: 'Education Fundraiser Event'}
            ],
            'March': [
                {date: 1, category: 'fundraisers', name: 'Delpark Fundraiser'},
                {date: 5, category: 'workshops', name: 'New Volunteer Workshop'},
                {date: 9, category: 'cleanups', name: 'Campus Cleanup Day'},
                {date: 14, category: 'fundraisers', name: 'Education Fundraiser Event'},
                {date: 20, category: 'workshops', name: 'Public Safety Workshop'},
                {date: 24, category: 'cleanups', name: 'Lakeview Park Cleanup'},
                {date: 31, category: 'fundraisers', name: 'Cancer Patient Fundraiser'}
            ]
        };

        const months = ['January', 'February', 'March'];
        let currentMonthIndex = 0;

        function RenderCalendar(month) {
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

        document.getElementById('prevMonth').addEventListener('click', () => {
            if (currentMonthIndex > 0) {
                currentMonthIndex--;
                document.getElementById('calendarMonth').textContent = months[currentMonthIndex];
                RenderCalendar(months[currentMonthIndex]);
            }
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            if (currentMonthIndex < months.length - 1) {
                currentMonthIndex++;
                document.getElementById('calendarMonth').textContent = months[currentMonthIndex];
                RenderCalendar(months[currentMonthIndex]);
            }
        });

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
        RenderCalendar(months[currentMonthIndex]);
    }

    /**
     * Contact page javascript functionalities to display content and interact with them
     *
     */
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");

        let sendButton = document.getElementById('sendButton');
        let contactMain = document.getElementById('contactMain');
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                let sentMessage = new Contact(contactFullName.value, contactEmailAddress.value, subject.value, message.value);
                console.log(sentMessage.serialize());
                // Initialize and show the modal
                // Show confirmation modal
                const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
                modal.show();
                contactFullName.value = '';
                contactEmailAddress.value = '';
                subject.value = '';
                message.value = '';
                // Redirect to Home Page after 5 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 5000);
            } catch (error) {
                console.log(error);
            }
        })
    }

    // Add "Donate" link dynamically to the navbar
    const navbarLinks = document.getElementById('navbarLinks');
    const donateLink = document.createElement('li');
    donateLink.className = 'nav-item';
    donateLink.innerHTML = '<a class="nav-link" href="#">Donate</a>';
    navbarLinks.appendChild(donateLink);

    // Change "Opportunities" link text to "Volunteer Now"
    document.getElementById('opportunitiesLink').textContent = 'Volunteer Now';

    // back to top button
    let backTopButton = document.createElement('button');
    backTopButton.className = 'back-top-button p-2 bg-primary';
    backTopButton.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`
    backTopButton.style.display = 'none';

    // Show the button when scrolling down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 70) {
            backTopButton.style.display = 'block';
        }
        else {
            backTopButton.style.display = 'none';
        }
    });

    // Scroll smoothly to the top when clicking the button
    backTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    document.body.appendChild(backTopButton);

    /**
     * Footer Section
     */
    const footerName = ["Privacy Policy", "Terms of Service"];
    let footer = document.createElement('footer');
    footer.className = "container-fluid mb-0 p-4 fs-5 position-sticky bottom-0 bg-primary d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top";
    let footerParagraph = document.createElement('p');
    footerParagraph.className = 'col-md-4 mb-0 text-body-secondary';
    footerParagraph.textContent = '&copy; 2024 Company, Inc';
    footer.appendChild(footerParagraph);
    let footerGroup = document.createElement('ul')
    footerGroup.className = "nav col-md-4 justify-content-end";
    for (const elements in footerName) {
        let footerListTerm = document.createElement('li');
        footerListTerm.className = "nav-item";
        let footerLink = document.createElement('a');
        footerLink.className = "nav-link px-2 text-body-secondary";
        footerLink.href = "#";
        footerLink.textContent = footerName[elements];
        footerListTerm.appendChild(footerLink);
        footerGroup.appendChild(footerListTerm);
    }
    footer.appendChild(footerGroup);
    document.body.appendChild(footer);

    function Start() {
        console.log("Starting App...");
        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Opportunities":
                DisplayOpportunitiesPage();
                break;
            case "Events":
                DisplayEventsPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
        }
    }

    window.addEventListener("load", Start);

})()