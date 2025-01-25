/**
File: index.html
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-01-25
Description: This is the user javascript file that contains the User class. This class is responsible for creating a new user object with the user details.
*/

"use strict";

class User {

    // Declare private fields
    #fullName;
    #email;
    #preferredRole;
    
    /**
     * The constructor that signs up new users when created with attributes
     * @param fullName
     * @param email
     * @param preferredRole
     */
    constructor(fullName="", email = "", preferredRole = "") {
        this.#setFullName(fullName);
        this.#setEmail(email);
        this.#setPreferredRole(preferredRole);
    }

    /**
     * Sets the full name of the contact. Validates input to ensure it is a non-empty string
     * @param fullName 
     */
    #setFullName(fullName) {
        if(typeof fullName !== "string" || fullName.trim() === "" || fullName.length <=2) {
            throw new Error("Invalid fullName: must be non-empty string");
        }
        this.#fullName = fullName;
    }

    /**
     * Sets the emailAddress of the contact. Validate to ensure it matches right email format
     * @param address
     */
    #setEmail(address) {
        const emailRegex = /[^\s@]+@[^\s@]+.[^\s@]+$/;
        if(!emailRegex.test(address)) {
            throw new Error("Invalid email address: must be a valid email address format.");
        }
        this.#email = address;
    }

    /**
     * Sets the preferred role of the user. Validates input to ensure it is a non-empty string
     * @param preferredRole
     */
    #setPreferredRole(preferredRole) {
        if(typeof preferredRole !== "string" || preferredRole.trim() === "") {
            throw new Error("Invalid preferred role: must be non-empty string");
        }
        this.#preferredRole = preferredRole;
    }

    /**
     * Serialize the contact details into a string format suitable for storage
     * @returns {string/null}
     */
    serialize(){
        if(!this.#fullName || !this.#email || !this.#preferredRole) {
            return null;
        }
        return `${this.#fullName} with ${this.#email} as ${this.#preferredRole} registered`;
    }

}