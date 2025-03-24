/**
File: gallery.ts
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-02-23
Description: This is the gallery typescript file that contains the functionalities for the gallery page.
            It fetches images from the JSON file and displays them on the page. It also allows users to search for images based on the image name.
*/

import { responseCodes } from './responseCodes.js';

interface IImageMap{
    id: number,
    name: string,
    src: string,
    alt: string
}

export function DisplayGalleryPage():void {
    /**
     * Get all the elements by their ID which  will be used to load the content of the page
     * @type {HTMLElement}
     */
    const galleryContainer: HTMLElement = document.getElementById("gallery") as HTMLElement;
    const lightboxImage = document.getElementById("lightboxImage") as HTMLImageElement;
    const lightboxTitle = document.getElementById("title") as HTMLElement;
    const lightboxModal = new (window as any).bootstrap.Modal(document.getElementById("lightboxModal") as HTMLElement);
    const errorMessage = document.getElementById("errorMessage") as HTMLElement;


    /**
     * Fetch images from JSON and display the contents on the page with appropriate styles
     * @param name the search parameter, which is set to empty string on default
     * @returns {Promise<void>}
     */
    async function GetEvents(name:string="" ):Promise<void> {
        console.log(name);
        const emptyArrayLength:number = 0;
        await fetch(`./data/image.json`)
            .then(response =>{
                if(response.status === responseCodes.NOT_FOUND){
                    throw new Error("Error: Wrong API Request! We are working on it come back later");
                } else if(response.status === responseCodes.BAD_REQUEST){
                    throw new Error("Error: Network Issue Please try again later");
                }
                return response.json();
            })
            .then(images => {

                // Hide error messages because data is fetched successfully
                errorMessage.classList.remove("d-block");
                errorMessage.classList.add("d-none");
                // To empty the grid of images
                galleryContainer.innerHTML = "";
                // Filter and display images based on search query
                const filteredImages = (images as IImageMap[]).filter(image => image.name.toLowerCase().includes(name.toLowerCase()));
                console.log(filteredImages);
                if (filteredImages.length === emptyArrayLength) {
                    errorMessage.classList.add("d-block", "alert-info");
                    errorMessage.classList.remove("d-none", "alert-danger");
                    errorMessage.textContent = "No Results found";
                }

                filteredImages.forEach(image => {
                    const col = document.createElement("div") as HTMLDivElement;
                    const title = document.createElement("p") as HTMLElement;
                    title.classList.add("py-0", "text-center");
                    col.classList.add("col-md-4", "mb-3");

                    const img = document.createElement("img") as HTMLImageElement;
                    img.src = image.src;
                    img.alt = image.alt;
                    img.classList.add("img-thumbnail", "gallery-img");
                    img.style.cursor = "pointer";
                    title.textContent = image.name;

                    // Click event to open lightbox
                    img.addEventListener("click", () => {
                        lightboxImage.src = image.src;
                        lightboxTitle.textContent = image.name;
                        lightboxModal.show();
                    });

                    col.appendChild(title);
                    col.appendChild(img);
                    galleryContainer.appendChild(col);
                });

            })
            .catch(error => {
                // Displays meaningful error messages
                errorMessage.textContent = error.message;
                errorMessage.classList.add("d-block", "alert-danger");
                errorMessage.classList.remove("d-none");
            } );
    }

    GetEvents().then().catch(console.error);

    // Gets the search input at the nav bar
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    // Searches for events based on users search input

    searchInput.addEventListener("input", async function (e): Promise<void> {
        const query = (e.target as HTMLInputElement).value;
        console.log("Search query:", query);
        await GetEvents(query);
    });


}


