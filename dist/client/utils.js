import { Contact } from "./contact.js";
import { createContact, updateContact } from "./api/index.js";
/**
 * centralized validation rules for input fields
 * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber: {regex: RegExp, errorMessage: string}, emailAddress: {regex: RegExp}, catch(*): void}}
 */
const VALIDATION_RULES = {
    fullName: {
        regex: /^[A-Za-z\s]+$/, // Allows for only letters amd spaces
        errorMessage: "Full Name must contain only letter and spaces"
    },
    contactNumber: {
        regex: /^\d{3}-\d{3}-\d{4}$/,
        errorMessage: "Contact Number must be in format ###-###-####"
    },
    emailAddress: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: "Invalid email address format"
    }
};
/**
 * Validates an input based on predefined validation rule
 * @param fieldId
 * @returns {boolean} -  returns true of valid, false otherwise
 */
export function validateInput(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    const rule = VALIDATION_RULES[fieldId];
    if (!field || !errorElement || !rule) {
        console.warn(`[WARN] Validation rules not found for : ${fieldId}`);
        return false;
    }
    // Check if the input is empty
    if (field.value.trim() === "") {
        errorElement.textContent = "This field is required";
        errorElement.style.display = "block";
        return false;
    }
    // check field against regular expression
    if (!rule.regex.test(field.value)) {
        errorElement.textContent = rule.errorMessage;
        errorElement.style.display = "block";
        return false;
    }
    errorElement.textContent = "";
    errorElement.style.display = "none";
    return true;
}
/**
 * Validate the entire form by checking the validity of each input field
 * @return {boolean} - return true if all fields pass validation, false otherwise
 */
export function validateForm() {
    return (validateInput("fullName") &&
        validateInput("contactNumber") &&
        validateInput("emailAddress"));
}
/**
 * Attaches validation event listeners to form input fields dynamically
 * @param elementId
 * @param event
 * @param handler
 */
export function addEventListenerOnce(elementId, event, handler) {
    // retrieve the element from the DOM
    const element = document.getElementById(elementId);
    if (element) {
        element.removeEventListener(event, handler);
        element.addEventListener(event, handler);
    }
    else {
        console.warn(`[WARN] Element with ID '${elementId}' not found`);
    }
}
export function attachValidationListeners() {
    console.log("[INFO] Attaching validation listeners.......");
    Object.keys(VALIDATION_RULES).forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (!field) {
            console.warn(`[WARN] field ${fieldId} not found. Skipping listener`);
            return;
        }
        //Attach event listener using the centralized validation method
        addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));
    });
}
/**
 * Calls api that displays the current weather of the day
 */
export async function DisplayWeather() {
    const apiKey = "aed8a2ea573812f57f424e31770b7114";
    const city = "Oshawa";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Failed to fetch weather data");
        }
        const data = await response.json();
        console.log(data);
        const weatherDataElement = document.getElementById('weather-data');
        if (weatherDataElement) {
            weatherDataElement.innerHTML = `<strong>City:</strong> ${data.name}<br>
                                            <strong>Temperature:</strong> ${data.main.temp}°C<br>
                                             <strong>Weather:</strong> ${data.weather[0].description}`;
        }
        else {
            console.error(`[ERROR] Weather data could not be found.`);
        }
    }
    catch (error) {
        console.error(`Error calling openweathermap for weather`);
        const weatherDataElement = document.getElementById("weather-data");
        if (weatherDataElement) {
            weatherDataElement.textContent = "Unable to fetch weather data at this time";
        }
        else {
            console.warn(`[ERROR] Weather data could not be found.`);
        }
    }
}
/**
 * Redirect the user back to contact-list.html
 */
export function handleCancelClick(router) {
    router.navigate("/contact-list");
}
/**
 * Handle the process of editing an existing contact
 * @param event
 * @param contactId
 * @param router
 */
export async function handleEditClick(event, contactId, router) {
    // prevent default form submission
    event.preventDefault();
    console.log("[INFO] Edit button clicked");
    if (!validateForm()) {
        alert("Invalid data! Please check your inputs");
        return;
    }
    console.log("[INFO] Form validation passed");
    // Retrieve update values from the form fields
    const fullName = document.getElementById("fullName").value;
    const contactNumber = document.getElementById("contactNumber").value;
    const emailAddress = document.getElementById("emailAddress").value;
    try {
        await updateContact(contactId, { fullName, contactNumber, emailAddress });
        router.navigate("/contact-list");
    }
    catch (error) {
        console.error(`[ERROR] failed to update contact list`);
    }
}
/**
 * Creates new contacts
 * @param fullName the full name of the contact
 * @param contactNumber the phone number of the contact
 * @param emailAddress the email address of the contact
 *
 * @param router
 */
export async function AddContact(fullName, contactNumber, emailAddress, router) {
    console.log("[DEBUG] AddContact() triggered...");
    if (!validateForm()) {
        alert("Form contains errors. Please correct them before submitting");
        return;
    }
    try {
        const newContact = { fullName, contactNumber, emailAddress };
        await createContact(newContact);
        router.navigate("/contact-list");
    }
    catch (error) {
        console.log(`[ERROR] failed to add contact: ${error}`);
    }
}
// CRUD - Create, Editing Contact, Get Contacts, Deleting Contact
export function saveToStorage(key, value) {
    let storageValue;
    try {
        if (key.startsWith("contact_") && value instanceof Contact) {
            const serialized = value.serialize();
            if (!serialized) {
                console.error(`[ERROR] Failed to serialize contact for ${key}`);
                return;
            }
            storageValue = serialized;
        }
        else {
            storageValue = JSON.stringify(value);
        }
        localStorage.setItem(key, storageValue);
        console.log(`[INFO] Data saved to with key '${key}' stored to local storage`);
    }
    catch (error) {
        console.error(`[ERROR] Failed to save storage : ${error}`);
    }
}
export function removeFromStorage(key) {
    try {
        if (localStorage.getItem(key) !== null) {
            localStorage.removeItem(key);
            console.log(`[INFO] Successfully Remove contact from local storage`);
        }
        else {
            console.warn(`[WARN] Key ${key} not found in local storage`);
        }
    }
    catch (error) {
        console.error(`[ERROR] Failed to remove from storage storage: ${Error}`);
    }
}
export function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        if (!data)
            return null;
        if (key.startsWith("contact_")) {
            const contact = new Contact();
            contact.deserialize(data);
            return contact;
        }
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`[ERROR] Failed to retrieve data associated with '${key}'`);
        return null;
    }
}
//# sourceMappingURL=utils.js.map