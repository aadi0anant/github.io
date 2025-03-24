/**
File: contact.ts
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-01-25
Description: This is the contact typescript file that contains the Contact class. This class is responsible for creating a new contact object with the contact details.
The contact details include the full name, email address, subject, and message. The class also has methods to validate the contact details and serialize the contact details into a string format suitable for storage.
*/
"use strict";
export class Contact {
    // Declare private fields
    _fullName = "";
    _email = "";
    _subject = "";
    _message = "";
    /**
     * The constructor that takes the contact details when created with attributes
     * @param fullName
     * @param email
     * @param subject
     * @param message
     */
    constructor(fullName = "", email = "", subject = "", message = "") {
        this.fullName = fullName;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }
    /**
     * A function that submits the form to the json file for storage using the async await
     * @returns {Promise<void>}
     */
    async submitForm() {
        const formData = {
            fullName: this._fullName,
            email: this._email,
            subject: this._subject,
            message: this._message
        };
        console.log("Submitting form:", formData);
        try {
            const localStorageData = localStorage.getItem("feedbacks");
            let feedbacks = [];
            // Retrieve existing feedbacks from Local Storage
            if (localStorageData) {
                feedbacks = await JSON.parse(localStorageData);
            }
            console.log(feedbacks);
            // Add new feedback to the array
            feedbacks.push(formData);
            // Save the updated array back to Local Storage
            localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
            console.log("Form submitted successfully.");
        }
        catch (error) {
            console.error("Submission Error:", error);
        }
    }
    /**
     * Sets the full name of the contact
     * @param fullName
     */
    set fullName(fullName) {
        if (fullName.length <= 2) {
            throw new Error("Invalid fullName: must be non-empty string");
        }
        this._fullName = fullName;
    }
    /**
     * Sets the email address of the contact
     * @param address
     */
    set email(address) {
        const emailRegex = /[^\s@]+@[^\s@]+.[^\s@]+$/;
        if (!emailRegex.test(address)) {
            throw new Error("Invalid email address: must be a valid email address format.");
        }
        this._email = address;
    }
    /**
     * Sets the subject of the contact
     * @param subject
     */
    set subject(subject) {
        if (subject.trim() === "") {
            throw new Error("Invalid subject: must be non-empty string");
        }
        this._subject = subject;
    }
    /**
     * Sets the message of the contact
     * @param message
     */
    set message(message) {
        if (message.trim() === "") {
            throw new Error("Invalid message: must be non-empty string");
        }
        this._message = message;
    }
    /**
     * Serialize the contact details into a string format suitable for storage
     * @returns {string/null}
     */
    serialize() {
        if (!this._fullName || !this._email || !this._message || !this._subject) {
            return null;
        }
        return `${this._fullName} with ${this._email} has sent a message`;
    }
}
//# sourceMappingURL=contact.js.map