/**
 File: router.ts
 Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 Date: 2025-03-15
 Description: This is the typescript functionalities to handle how the SPA navigates
 to each page without having to reload
 */

"use strict";


import { LoadHeader } from "./header.js";

type RouteMap = {[key: string]: string};
export class Router{

    private readonly routes:RouteMap;

    constructor(routes:RouteMap){
        this.routes = routes;
        this.init();
    }

    init():void{

        window.addEventListener("DOMContentLoaded", ():void => {
            const path:string = location.hash.slice(1) || "/";
            console.log(`[INFO] Initial Page Load ${path}`);
            this.loadRoute(path);
        })
        window.addEventListener("popstate", ()=> {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        })
        ///TODO
    }

    navigate(path:string):void{
        location.hash = path;
        ///TODO
    }

    loadRoute(path:string):void{
        console.log(`[INFO] loading route: ${path}`);

        //basepath="/edit#contact_121344"
        const basePath:string = path.split("#")[0];
        if(!this.routes[basePath]){
            console.log(`[WARNING] Route not found ${basePath}, redirecting to 404`);
            location.hash = "/404";
            // path = "/404";
        }

        fetch(this.routes[basePath])
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${this.routes[basePath]}`);
                return response.text();
            })
            .then(html => {
                const mainElement = document.querySelector("main") as HTMLElement;
                if (mainElement) {
                    mainElement.innerHTML = html
                }else {
                    console.error("[ERROR] <main> element not found in DOM");
                }

                // Ensure the for example the header is "reloaded" in "every" page change
                LoadHeader().then(()=>{
                    document.dispatchEvent(new CustomEvent('routeLoaded', {detail:basePath}));
                })
            })
            .catch(error => {console.error("[ERROR] Error loading page;", error);
            })
    }
}