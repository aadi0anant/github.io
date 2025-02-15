"use strict";

/**
 * Represents a Contact with a name, contact number and email address
 */
(function (core){


    class Contact {

        /**
         * Constructs a new Contact instance
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */
        constructor(fullName="", contactNumber="", emailAddress="") {

            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        /**
         * Get the full name of the contact
         * @returns {string}
         */
        get fullName() {
            return this._fullName;
        }

        /**
         * Sets the full name of the contact. Validates input to ensure its non-empty string
         * @param fullName
         */
        set fullName(fullName) {
            if(typeof fullName !== "string" || fullName.trim() === "") {
                throw new Error("Invalid fullName: must be non-empty string");
            }

            this._fullName = fullName;
        }

        /**
         * Gets the contactNumber for the contact
         * @returns {string}
         */
        get contactNumber() {
            return this._contactNumber;
        }

        /**
         * Sets the contactNumber of the contact. Validate to ensure it matches a 10-digit number format
         * @param contactNumber
         */
        set contactNumber(contactNumber) {
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;    //905-647-8947
            if(!phoneRegex.test(contactNumber)) {
                throw new Error("Invalid Contact Number: must be 10 digit number");
            }
            this._contactNumber = contactNumber;
        }

        /**
         * Gets the emailAddress for the contact
         * @returns {string}
         */
        get emailAddress() {
            return this._emailAddress;
        }

        /**
         * Sets the emailAddress of the contact. Validate to ensure it matches right email format
         * @param address
         */
        set emailAddress(address) {
            const emailRegex = /[^\s@]+@[^\s@]+.[^\s@]+$/;
            if (!emailRegex.test(address)) {
                throw new Error("Invalid email address: must be a valid email address format");
            }

            this._emailAddress = address;
        }

        /**
         * Converts the contact details into a human-readable string
         * @returns {string}
         */
        toString(){
            return `Full Name: ${this._fullName}\n
            Contact Number: ${this._contactNumber}\n
            Email Address: ${this._emailAddress}`;
        }

        /**
         * Serialize the contact details into a string (csv) format suitable for storage
         * @returns {string|null}
         */
        serialize(){
            if(!this._fullName || !this._contactNumber || !this._emailAddress) {
                console.error("One or more Contact Properties are missing or invalid");
                return null;
            }
            return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
        }


        /**
         * Deserializes a (csv) string of contact details and updates the contact properties
         * @param data
         */
        deserialize(data){
            if(typeof data !== "string" || data.split(",").length !== 3){
                console.error("Invalid data format for deserialization")
                return;
            }

            const propArray = data.split(",");
            this._fullName = propArray[0];
            this._contactNumber = propArray[1];
            this._emailAddress = propArray[2];
        }
    }

    core.Contact = Contact;

})(core || (core = {}));