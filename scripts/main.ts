"use strict";
/**
File: main.ts
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-01-25
Description: This is the main typescript file for the website. It contains the functionalities for the home page, opportunities page, events page, and contact page.
It also contains the footer section and back to top button functionalities.
*/


import {Router} from "./router.js";
import {LoadFooter} from "./footer.js";
import {DisplayOpportunitiesPage} from "./opportunities.js";
import {AuthGuard} from "./authguard.js";
import {DisplayEventsPage} from "./events.js";
import {DisplayContactPage} from "./contactUs.js";
import {DisplayGalleryPage} from "./gallery.js";
import {DisplayNewsPage} from "./news.js";
import {DisplayLoginPage} from "./login.js";
import {LoadHeader, UpdateNavLink} from "./header.js";
import {DisplayStatisticsPage} from "./statistics.js";
import { DisplayEventPlanningPage } from "./eventPlanning.js";

const routes:{[Key:string]:string} = {
    "/": "views/content/home.html",
    "/home": "views/content/home.html",
    "/opportunities": "views/content/opportunities.html",
    "/events": "views/content/events.html",
    "/contact": "views/content/contact.html",
    "/gallery": "views/content/gallery.html",
    "/login": "views/content/login.html",
    "/news": "views/content/news.html",
    "/statistics": "views/content/statistics.html",
    "/eventPlanning": "views/content/eventPlanning.html",
    "/404": "views/content/404.html"
}

const pageTitle:Record<string, string> = {
    "/": "Home",
    "/home": "Home",
    "/opportunities": "Opportunities",
    "/events": "Events",
    "/contact": "Contact Us",
    "/gallery": "Gallery",
    "/about": "About",
    "/login": "Login",
    "/news": "News",
    "/statistics": "Statistics",
    "/eventPlanning": "Event Planning",
    "/404": "Page Not Found",
}

export const router:Router = new Router(routes);
(function () {

    /**
     * The display home page function that gives functionalities get involved button to redirect to the opportunities pages.
     */
    function DisplayHomePage():void {
        console.log("Calling DisplayHomePage...");

        let getInvolvedButton = document.getElementById("getInvolvedBtn") as HTMLButtonElement;
        getInvolvedButton.addEventListener("click", function ():void {
            router.navigate("/opportunities");
        });
    }

    // back to top button that stays on every page to enable the user scroll back up
    let backTopButton = document.createElement('button') as HTMLButtonElement;
    backTopButton.className = 'back-top-button p-2 bg-primary';
    backTopButton.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`
    backTopButton.style.display = 'none';

    // An event handler that shows the button when scrolling down
    window.addEventListener('scroll', ():void => {
        if (window.scrollY > 70) {
            backTopButton.style.display = 'block';
        }
        else {
            backTopButton.style.display = 'none';
        }
    });

    // Scroll smoothly to the top when clicking the button
    backTopButton.addEventListener('click', ():void => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });

    document.body.appendChild(backTopButton);

    /**
     * Listen for changes and update the navigation links
     */
    document.addEventListener("routeLoaded", (event)  => {
        const customEvent = event as CustomEvent<string>
        const newPath:string = customEvent.detail; //extract the route from the event passed
        console.log(`[INFO] Route Loaded in main js: ${newPath}`);

        LoadHeader().then(():void => {
            handlePageLogic(newPath);
        })
    })

    /**
     * Listens for when the session has expired to redirect user to login page
     */
    window.addEventListener("sessionExpired", ():void => {
        console.warn("[SESSION] Redirecting the user due to inactivity.");
        router.navigate("/login");
    });



    function handlePageLogic(path:string):void {
        const navLinks = document.querySelectorAll("nav a") as NodeListOf<HTMLAnchorElement>;
        let currentPage:string = pageTitle[path] || "Untitled Page";
        const protectedRoutes:string[] = ['/statistics'];

        if(path === "/opportunities"){
            currentPage = "Volunteer Now";
        }
        if (protectedRoutes.includes(path)) {
            console.log(protectedRoutes.includes(path));
            AuthGuard(); //redirected to /login if not authenticated
        }

        document.title = currentPage;
        navLinks.forEach(link => {
            if(link.textContent){
                if(link.textContent.trim() === currentPage){
                    link.classList.add("active");
                    link.setAttribute("aria-current","page")
                }else {
                    link.classList.remove("active");
                    link.removeAttribute("aria-current");
                }
            }else {
                console.warn("[INFO] No link with text content Found");
            }
        })

        switch (path) {
            case "/":
                DisplayHomePage();
                break;
            case "/home":
                DisplayHomePage();
                break;
            case "/opportunities":
                DisplayOpportunitiesPage();
                break;
            case "/events":
                DisplayEventsPage();
                break;
            case "/contact":
                DisplayContactPage();
                break;
            case "/gallery":
                DisplayGalleryPage();
                break;
            case "/news":
                DisplayNewsPage();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/statistics":
                DisplayStatisticsPage();
                break;
            case "/eventPlanning":
                DisplayEventPlanningPage();
                break;
            default:
                console.warn(`[WARNING] No display logic found for: ${path}`);

        }

    }

    /**
     * The start function that determine which page the user is currently in and navigates to load its content
     * @returns {Promise<void>}
     */
    async function Start():Promise<void> {
        console.log("Starting App...");

        await LoadHeader();
        LoadFooter();
        AuthGuard();

        const currentPath:string = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);

        handlePageLogic(currentPath);
    }

    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start().then().catch(console.error);
    });

})()