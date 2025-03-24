/**
 File: authguard.ts
 Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 Date: 2025-03-18
 Description: This is a typescript file that checks for session timeout
 and determine if the user will be logged out or the time will refresh if the user is actively engaging the site
 */
"use strict";

let sessionTimeout: number;

function resetSessionTimeout():void {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(():void=> {
        console.warn("[WARNING] session expired due to inactivity.")
        sessionStorage.removeItem("userSession");
        window.dispatchEvent(new CustomEvent("sessionExpired"))
    }, 15 * 60 * 1000); // session timeout of 15 minutes
}

// Reset the session based on user activity
document.addEventListener("mousemove", resetSessionTimeout);
document.addEventListener("keypress", resetSessionTimeout);

export function AuthGuard():void{

    const user:string|null = sessionStorage.getItem("userSession");
    const protectedRoutes:string[] = ['/statistics'];

    if(!user && protectedRoutes.includes(location.hash.slice(1))){
        console.warn("[AUTHGUARD] Unauthorized access detected. Redirected to login page.");
        window.dispatchEvent(new CustomEvent("sessionExpired"));
    }else {
        resetSessionTimeout();
    }
}