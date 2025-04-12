"use strict";

/**
 * Represents a contact with a name, contact number and email number
 */

export class Contact {

    private _id: string;
    private _fullName: string;
    private _contactNumber: string;
    private _emailAddress: string;

    /**
     * Constructs a new contact instance
     * @param id
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     */
    constructor(id:string="",fullName:string = "", contactNumber:string = "", emailAddress:string = "") {
        this._id = id;
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._emailAddress = emailAddress;
    }

    /**
     * Gets id for the Contact
     */
    get id(): string {
        return this._id;
    }
    /**
     * Gets the full name of the contact
     * @returns {string}
     */
    get fullName():string {
        return this._fullName;
    }

    /**
     * Sets the id of the contact
     * @param id
     */
    set id(id: string) {
        this._id = id;
    }
    /**
     * Sets the full name of the contact. validates the input to ensure its non-empty string
     * @param fullName
     */
    set fullName(fullName:string) {
        if (fullName.trim() === "") {
            throw new Error("Invalid fullName: must be non-empty string");
        }
        this._fullName = fullName;
    }

    /**
     * Gets the contact number for the Contact
     * @returns {string}
     */
    get contactNumber():string {
        return this._contactNumber;
    }

    /**
     * Sets the contact number the Contact. Validate to ensure it matches a 10-digit number format
     * @param contactNumber
     */
    set contactNumber(contactNumber: string) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;   //905-555-5555
        if (!phoneRegex.test(contactNumber)) {
            throw new Error("Invalid Contact Number: must be 10 digit number");
        }
        this._contactNumber = contactNumber;
    }

    /**
     * Gets the email address for the contact
     * @returns {string}
     */
    get emailAddress():string {
        return this._emailAddress;
    }

    set emailAddress(address:string) {
        const emailRegex = /[^\s@]+@[^\s@]+.[^\s@]+$/;
        if (!emailRegex.test(address)) {
            throw new Error("Invalid email address: must be a valid email address format.");
        }
        this._emailAddress = address;
    }

    /**
     * Converts the contact details into a human-readable string
     * @returns {string}
     */
    toString():string {
        return `Full Name: ${this._fullName}\n
                    Contact Number: ${this._contactNumber}\n 
                    Email Address: ${this._emailAddress}`;
    }

    /**
     * Serializes the contact details into a string (csv) format suitable for storage
     * @returns {string|null}
     */
    serialize():string|null {
        if (!this._fullName || !this._contactNumber || !this._emailAddress) {
            console.error("One or more Contact Properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this.contactNumber},${this.emailAddress}`;
    }

    /**
     * Deserialize a csv string of contact details and updates the contact properties
     * @param data
     */
    deserialize(data:string) {
        if (data.split(",").length !== 3) {
            console.error("Invalid data format for deserialization")
            return;
        }
        const propArray = data.split(",");
        this._fullName = propArray[0];
        this._contactNumber = propArray[1];
        this._emailAddress = propArray[2];
    }
}
