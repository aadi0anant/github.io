/**
File: user.ts
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-01-25
Description: This is the user typescript file that contains the User class.
This class is responsible for creating a new user object with the user details.
*/

"use strict";

export class User {

    // Declare private fields
    private _fullName: string = "";
    private _email: string= "";
    private _preferredRole: string = "";
    
    /**
     * The constructor that signs up new users when created with attributes
     * @param fullName full name of the user
     * @param email email of the user
     * @param preferredRole preferred role of the user
     */
    constructor(fullName:string="", email:string= "", preferredRole:string = "") {
        this.fullName = fullName;
        this.email = email;
        this.preferredRole = preferredRole;
    }

    /**
     * Sets the full name of the contact. Validates input to ensure it is a non-empty string
     * @param fullName 
     */
    set fullName(fullName:string) {
        if(fullName.trim() === "" || fullName.length <=2) {
            throw new Error("Invalid fullName: must be non-empty string");
        }
        this._fullName = fullName;
    }

    /**
     * Sets the emailAddress of the contact. Validate to ensure it matches right email format
     * @param address
     */
    set email(address:string) {
        const emailRegex = /[^\s@]+@[^\s@]+.[^\s@]+$/;
        if(!emailRegex.test(address)) {
            throw new Error("Invalid email address: must be a valid email address format.");
        }
        this._email = address;
    }

    /**
     * Sets the preferred role of the user. Validates input to ensure it is a non-empty string
     * @param preferredRole
     */
    set preferredRole(preferredRole:string) {
        if(preferredRole.trim() === "") {
            throw new Error("Invalid preferred role: must be non-empty string");
        }
        this._preferredRole = preferredRole;
    }

    /**
     * Serialize the contact details into a string format suitable for storage
     * @returns {string/null}
     */
    serialize():string|null {
        if(!this._fullName || !this._email || !this._preferredRole) {
            return null;
        }
        return `${this._fullName} with ${this._email} as ${this._preferredRole} registered`;
    }

}