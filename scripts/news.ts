/**
 * File: news.ts
 * Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 * Date: 2025-02-23
 * Description: This is the news javascript file that contains the functionalities for the news page.
 *              It fetches the latest news on Ontario from the NewsAPI and displays it on the page. It also fetches news at an interval of 10 seconds.
 */

"use strict";

import {responseCodes} from "./responseCodes.js";

interface INewsMap {
    organization: { name: string, logo: string, url: string };
    title: string;
    description: string;
    url: string;
    dates: string;
}

export function DisplayNewsPage() {
    let volunteerApi = "https://www.volunteerconnector.org/api/search/";
    // To get all the html elements
    const timer = document.querySelector(".badge") as HTMLElement;
    const errorMessage = document.getElementById("errorMessage") as HTMLDivElement;
    const articleBody = document.querySelector("article") as HTMLElement;
    const newsMain = document.getElementById("newsMain") as HTMLElement;

    // Declared and initialized variables
    let count: number = 30;
    timer.textContent = count + ' mins';

    // fetch news to display on loading of the page
    GetNews().then().catch(console.error);

    // Gets the search input from the page
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;

    // Searches for news based on users search input
    searchInput.addEventListener("input", async function (e) {
        const query:string = (e.target as HTMLInputElement).value;
        console.log("Search query:", query);
        await GetNews(query);
    });

    /**
     * To fetch news from the newAPi at interval of 10 seconds
     * @type {number}
     */
    const counter: number = setInterval(async (): Promise<void> => {
        // Counter
        timer.textContent = count + ' mins';
        count--;

        // Stop the counter after 10 seconds
        if (count === 1) {
            count = 30
            await GetNews();
        }
    }, 180000)

    /**
     * A function to fetch the latest news on ontario using the API keys
     * @returns {Promise<void>}
     */
    async function GetNews(query: string = ""): Promise<void> {
        await fetch(`${volunteerApi}`)
            .then(response => {
                if (response.status === responseCodes.BAD_REQUEST) {
                    throw new Error("Error: Network Issue Please try again later");
                } else if (response.status === responseCodes.NOT_FOUND) {
                    throw new Error("Error: There is no news for now");
                }
                return response.json();
            })
            .then(data => {
                let emptyArrayLength = 0;
                if (data?.count === emptyArrayLength) {
                    // remove error message div
                    articleBody.classList.add("d-none");
                    errorMessage.classList.add("d-block", "alert-danger");
                    errorMessage.classList.remove("d-none");
                } else {
                    // remove error message div
                    articleBody.classList.remove("d-none");
                    errorMessage.classList.remove("d-block", "alert-danger");
                    errorMessage.classList.add("d-none");

                    console.log(data)
                    console.log(data?.results);

                    let displayNews: INewsMap[] = data?.results;

                    newsMain.innerHTML = "";
                    let card: string = "";

                    const filteredData = displayNews.filter(eachnews =>
                        eachnews.title.toLowerCase().includes(query.toLowerCase()) ||
                        eachnews.description.toLowerCase().includes(query.toLowerCase())
                    );

                    for (const element of filteredData) {
                        card += `
                        <div class="card m-2 col-md-3 col-sm-12 object-fit-contain">
                            <div class="card-body d-flex flex-column justify-content-between align-items-start">
                                <h5 class="card-text text-center">${element.organization.name}</h5>
                                <div class="d-flex mx-auto w-100 justify-content-center align-items-center">
                                    <img class="rounded-2 w-75" style="height: 70px" src="${element.organization.logo}" alt="${element.organization.name} Logo">
                                </div>
                                <h6 class="card-title">${element.title}</h6>
                                <p class="card-text">${element.description.slice(0, 150)}....</p>
                                <a class="btn btn-primary mt-2" href="${element.url}" target="_blank">
                                    Visit Site
                                </a>
                                <p class="my-2">Date: ${element.dates}</p>
                            </div>
                        </div>`;
                    }
                    newsMain.innerHTML = card;
                }

            })
            .catch(error => {
                // Displays meaningful error messages
                articleBody.classList.add("d-none");
                errorMessage.textContent = error.message;
                errorMessage.classList.add("d-block", "alert-danger");
                errorMessage.classList.remove("d-none");
                clearInterval(counter);
            });
    }
}