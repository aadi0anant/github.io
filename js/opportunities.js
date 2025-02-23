/**
File: opportunities.js
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-02-23
Description: This is the opportunities javascript file that contains the functionalities for the opportunities page.
            It fetches the opportunities.json file and displays the opportunities on the page. 
            It also contains the search functionality to search for opportunities based on the user input.
*/

import { responseCodes } from './responseCodes.js';

window.addEventListener("load", async function () {

    // To get the required elements by ID to display on the page
    const opportunitiesMain = document.getElementById('opportunities');
    const errorMessage = document.getElementById("errorMessage");

    /**
     * The function call the gets the JSON file from opportunities.json and displays it on the page
     * It also helps to search for any opportunity based on the required user search input
     * @param query a parameter used to search gotten from the user input in the search bar
     * @returns {Promise<void>}
     */
    async function GetOpportunities(query = ""){
        const emptyArrayLength = 0;
        let card = "";

        await fetch(`./jsonDB/opportunities.json`)
            .then(response =>{
                if(response.status === responseCodes.NOT_FOUND){
                    throw new Error("Error: Wrong API Request! We are working on it come back later");
                } else if(response.status === responseCodes.BAD_REQUEST){
                    throw new Error("Error: Network Issue Please try again later");
                }
                return response.json();
            })
            .then(data => {
                // Hide error messages because data is fetched successfully
                errorMessage.classList.remove("d-block");
                errorMessage.classList.add("d-none");

                console.log(data)
                opportunitiesMain.innerHTML = "";

                const filteredData = data.filter(opportunity =>
                    opportunity.title.toLowerCase().includes(query.toLowerCase()) ||
                    opportunity.description.toLowerCase().includes(query.toLowerCase())
                );

                if (filteredData.length === emptyArrayLength) {
                    errorMessage.classList.add("d-block", "alert-info");
                    errorMessage.classList.remove("d-none", "alert-danger");
                    errorMessage.textContent = "No Results found";
                }
                console.log(filteredData);
                for (const elements of filteredData) {
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
            })
            .catch(error => {
                // Displays meaningful error messages
                errorMessage.textContent = error.message;
                errorMessage.classList.add("d-block", "alert-danger");
                errorMessage.classList.remove("d-none");
            } );

        // this helps to get the modal div, pops it up and styles them according to each opportunity on the page
        let signUpButton = document.getElementById("modalSubmitButton");
        let modalInfoSpan = document.getElementById("modalInfo");
        let openModal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
        /**
         * when the signup button is clicked on any of the modal popped up for the list of opportunities listed
         * It validates input and submits or throws an error
         */
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
                modalInfoSpan.textContent = `Error occurred while signing up!`;

            }


        })

    }

    // Initial call to populate the opportunity page
    await GetOpportunities();

    // Gets the search input from the page
    const searchInput = document.getElementById("searchInput");
    console.log(searchInput);

    // Searches for events based on users search input
    searchInput.addEventListener("input", async function (e) {
        const query = e.target.value;
        console.log("Search query:", query);
        await GetOpportunities(query);
    });
})