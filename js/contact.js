/**
File: contact.js
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-01-25
Description: This is the contact javascript file that contains the Contact class. This class is responsible for creating a new contact object with the contact details. 
The contact details include the full name, email address, subject, and message. The class also has methods to validate the contact details and serialize the contact details into a string format suitable for storage.
*/

"use strict";

class Contact {

    // Declare private fields
    #fullName;
    #email;
    #subject;
    #message;
    /**
     * The constructor that takes the contact details when created with attributes
     * @param fullName
     * @param email
     * @param subject
     * @param message
     */
    constructor(fullName="", email = "", subject = "", message = "") {
        this.#setFullName(fullName);
        this.#setEmail(email);
        this.#setSubject(subject);
        this.#setMessage(message);
    }

    /**
     * A function that submits the form to the json file for storage using the async await
     * @returns {Promise<void>}
     */
    async submitForm() {
        const formData = {
            fullName: this.#fullName,
            email: this.#email,
            subject: this.#subject,
            message: this.#message
        };

        console.log("Submitting form:", formData);

        try {
            // Retrieve existing feedbacks from Local Storage
            let feedbacks = await JSON.parse(localStorage.getItem("feedbacks")) || [];
            console.log(feedbacks);

            // Add new feedback to the array
            feedbacks.push(formData);

            // Save the updated array back to Local Storage
            localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

            console.log("Form submitted successfully.");

            return formData;
        } catch (error) {
            console.error("Submission Error:", error);
        }
    }


    /**
     * Sets the full name of the contact
     * @param fullName 
     */
    #setFullName(fullName) {
        if(typeof fullName !== "string" || fullName.trim() === "" || fullName.length <=2) {
            throw new Error("Invalid fullName: must be non-empty string");
        }
        this.#fullName = fullName;
    }

    /**
     * Sets the email address of the contact
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
     * Sets the subject of the contact
     * @param subject 
     */
    #setSubject(subject) {
        if(typeof subject !== "string" || subject.trim() === "") {
            throw new Error("Invalid subject: must be non-empty string");
        }
        this.#subject = subject;
    }

    /**
     * Sets the message of the contact
     * @param message 
     */
    #setMessage(message) {
        if(typeof message !== "string" || message.trim() === "") {
            throw new Error("Invalid message: must be non-empty string");
        }
        this.#message = message;
    }

    /**
     * Serialize the contact details into a string format suitable for storage
     * @returns {string/null}
     */
    serialize(){
        if(!this.#fullName || !this.#email || !this.#message || !this.#subject) {
            return null;
        }
        return `${this.#fullName} with ${this.#email} has sent a message`;
    }

}