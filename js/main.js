/**
File: main.js
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-01-25
Description: This is the main javascript file for the website. It contains the functionalities for the home page, opportunities page, events page, and contact page. 
It also contains the footer section and back to top button functionalities.
*/

"use strict";

(function () {


    async function LoadHeader(){
        console.log("[INFO]  LoadHeader called...");


        return await fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector("header").innerHTML = data;
            })
            .catch(error => console.error("[ERROR] Unable to load header"));

    }

    function UpdateNavLink(){
        // To get or create all the html elements in the header
        const navbarLinks = document.getElementById('navbarLinks');
        const donateLink = document.createElement('li');
        const opportunitiesLink = document.getElementById('opportunitiesLink')

        const loginNavItem = document.getElementById('login');
        const messageArea = document.getElementById('messageAreaIndex');

        console.log(messageArea)
        console.log(loginNavItem)
        // Add "Donate" link dynamically to the navbar

        donateLink.className = 'nav-item';
        donateLink.innerHTML = '<a class="nav-link" href="#">Donate</a>';
        navbarLinks.appendChild(donateLink);

        // Change "Opportunities" link text to "Volunteer Now"
        opportunitiesLink.textContent = 'Volunteer Now';
        if(document.title === "Opportunities"){
            document.title = opportunitiesLink.textContent;
        }

        // Check if user is already logged in. If so, update the navbar
        const userSession = sessionStorage.getItem('userSession');
        if (userSession) {
            let user = JSON.parse(userSession);
            console.log(user);
            if (loginNavItem) {
                loginNavItem.innerHTML = `<a class="nav-link" href="#" >Logout</a>`;
                document.getElementById('login').addEventListener('click', function(event) {
                    event.preventDefault();
                    messageArea.classList.remove('d-none');
                    messageArea.classList.add('d-block', 'alert', 'alert-success');
                    messageArea.textContent = `Goodbye ${user?.name}`;
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                    sessionStorage.removeItem('userSession');
                });
            }
        }

        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll("nav a");

        navLinks.forEach(link => {

            if(link.textContent.trim() === currentPage){
                link.classList.add("active");
                link.setAttribute("aria-current","page")
            }else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        })
    }

    function UpdateNavbar(user) {

    }

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

    }

    /**
     * Events page javascript functionalities to display content and interact with them
     *
     */
    function DisplayEventsPage() {
        console.log("Calling DisplayEventsPage...");

    }

    /**
     * Contact page javascript functionalities to display content and interact with them
     *
     */
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");

        const sendButton = document.getElementById('sendButton');
        const cancelButton = document.getElementById('cancelButton');
        const messageArea = document.getElementById('messageAreaIndex');
        sendButton.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                let sentMessage = new Contact(contactFullName.value, contactEmailAddress.value, subject.value, message.value);
                console.log(sentMessage.serialize());
                await sentMessage.submitForm();
                // Initialize and show the modal
                // Show confirmation modal
                const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
                const modalBody = document.getElementById('modalInfoBody');
                // Display the submitted details in the modal
                modalBody.innerHTML = `
                    <p><strong>Full Name:</strong> ${contactFullName.value}</p>
                    <p><strong>Email Address:</strong> ${contactEmailAddress.value}</p>
                    <p><strong>Subject:</strong> ${subject.value}</p>
                    <p><strong>Message:</strong> ${message.value}</p>
                `;
                modal.show();
                // Redirect to Home Page after 5 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                    contactFullName.value = '';
                    contactEmailAddress.value = '';
                    subject.value = '';
                    message.value = '';
                }, 5000);
            } catch (error) {
                messageArea.classList.remove('d-none');
                messageArea.classList.add('d-block', 'alert', 'alert-danger');
                messageArea.textContent = `Error saving the feedback please try again.`;
            }
        })

        cancelButton.addEventListener('click', async function (e) {
            messageArea.classList.add('d-none');
        })
    }


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
     * Footer Section that styles the footer and displays it at the base of our page
     */
    function LoadFooter(){
        const footerName = ["Privacy Policy", "Terms of Service"];
        let footer = document.createElement('footer');
        footer.className = "container-fluid mb-0 p-4 fs-5 position-sticky bottom-0 bg-primary d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top";
        let footerParagraph = document.createElement('p');
        footerParagraph.className = 'col-md-4 mb-0 text-body-secondary';
        footerParagraph.innerHTML = '&copy; 2024 Company, Inc';
        footer.appendChild(footerParagraph);
        let footerGroup = document.createElement('ul')
        footerGroup.className = "nav col-md-4 justify-content-end";

        // Loops through a list footer links to display at the base of the page
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

    }

    /**
     * The start function that determine which page the user is currently in and navigates to load its content
     * @returns {Promise<void>}
     * @constructor
     */
    async function Start() {
        console.log("Starting App...");

        await LoadHeader();
        await UpdateNavLink();
        await LoadFooter();

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
            case "Contact Us":
                DisplayContactPage();
                break;
        }
    }

    window.addEventListener("DOMContentLoaded", Start);

})()