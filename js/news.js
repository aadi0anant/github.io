/**
 * File: news.js
 * Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 * Date: 2025-02-23
 * Description: This is the news javascript file that contains the functionalities for the news page.
 *              It fetches the latest news on Ontario from the NewsAPI and displays it on the page. It also fetches news at an interval of 10 seconds.
 */

"use strict";

import {responseCodes} from "./responseCodes.js";

window.addEventListener("load", async function () {
    // To get all the html elements
    const newsImage = document.querySelector(".card>img");
    const newsTitle = document.querySelector(".card-title");
    const newsText = document.querySelector(".card-text");
    const newsLink = document.querySelector(".card-body>a");
    const timer = document.querySelector(".badge");
    const errorMessage = document.getElementById("errorMessage");
    const articleBody = document.querySelector("article");

    // Declared and initialized variables
    let count = 30;
    timer.textContent = count + ' mins';
    let nextNews = 1;
    let dataSize = 0;

    // fetch news to display on loading of the page
    await GetNews();

    /**
     * To fetch news from the newAPi at interval of 10 seconds
     * @type {number}
     */
    const counter = setInterval(async () => {
        // Counter
        timer.textContent = count  + ' mins';
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
    async function GetNews(){
        await fetch(`https://api.thenewsapi.com/v1/news/top?api_token=1b9WyqTiaAFj1cYoBJyDjfyPKxvYZtwyYz4OLBbp&locale=ca&limit=3`)
            .then(response => {
                if(response.status === responseCodes.BAD_REQUEST){
                    throw new Error("Error: Network Issue Please try again later");
                }else if(response.status === responseCodes.NOT_FOUND){
                    throw new Error("Error: There is no news for now");
                }
                return response.json();
            })
            .then(data => {
                let emptyArrayLength = 0;
                if(data?.data?.length === emptyArrayLength){
                    dataSize = 1;
                }else{
                    // remove error message div
                    articleBody.classList.remove("d-none");
                    errorMessage.classList.remove("d-block", "alert-danger");
                    errorMessage.classList.add("d-none");

                    dataSize = data?.data?.length;
                    nextNews = Math.floor(Math.random()  * dataSize);
                    console.log(data?.data[nextNews]);

                    let displayNews = data?.data[nextNews];

                    newsImage.src = displayNews?.image_url;
                    newsImage.alt = displayNews?.title;
                    newsTitle.textContent = displayNews?.title;
                    newsText.textContent = displayNews?.description;
                    newsLink.href = displayNews?.url;
                }

            })
            .catch(error => {
                // Displays meaningful error messages
                articleBody.classList.add("d-none");
                errorMessage.textContent = error.message;
                errorMessage.classList.add("d-block", "alert-danger");
                errorMessage.classList.remove("d-none");
                clearInterval(counter);
            } );
    }
})