/**
 File: contactUs.ts
 Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 Date: 2025-03-15
 Description: This is the typescript functionalities to display content and interact with them
 */

import {router} from "./main.js";
import {Contact} from "./contact.js";


/**
 * Contact page typescript functionalities to display content and interact with them
 *
 */
export function DisplayContactPage():void {
    console.log("Calling DisplayContactPage...");

    /**
     * Getting the html elements to enable handling the form in the contact page with event handlers
     */
    const sendButton = document.getElementById('sendButton') as HTMLButtonElement;
    const cancelButton = document.getElementById('cancelButton') as HTMLButtonElement;
    const messageArea = document.getElementById('messageAreaIndex') as HTMLDivElement;

    /**
     * An event handler that validates the form input before submission when clicked and displays the details of the
     * user inputted in the form
     */
    sendButton.addEventListener('click', async (e:Event):Promise<void> => {
        e.preventDefault();
        try {
            let contactFullName = document.getElementById('contactFullName') as HTMLInputElement;
            console.log(contactFullName.value);
            let contactEmailAddress= document.getElementById('contactEmailAddress') as HTMLInputElement;
            let subject = document.getElementById('subject') as HTMLInputElement;
            let message = document.getElementById('message') as HTMLInputElement;
            let sentMessage:Contact = new Contact(contactFullName.value, contactEmailAddress.value, subject.value, message.value);
            console.log(sentMessage.serialize());
            await sentMessage.submitForm();
            // Initialize and show the modal
            // Show confirmation modal
            const modal = new (window as any).bootstrap.Modal(document.getElementById('confirmationModal') as HTMLElement);
            const modalBody = document.getElementById('modalInfoBody') as HTMLElement;
            // Display the submitted details in the modal
            modalBody.innerHTML = `
                    <p><strong>Full Name:</strong> ${contactFullName.value}</p>
                    <p><strong>Email Address:</strong> ${contactEmailAddress.value}</p>
                    <p><strong>Subject:</strong> ${subject.value}</p>
                    <p><strong>Message:</strong> ${message.value}</p>
                `;
            modal?.show();
            // Redirect to Home Page after 5 seconds
            setTimeout(():void => {
                router.navigate("/home");
                contactFullName.value = '';
                contactEmailAddress.value = '';
                subject.value = '';
                message.value = '';
                modal.hide();
            }, 5000);
        } catch (error) {
            messageArea.classList.remove('d-none');
            messageArea.classList.add('d-block', 'alert', 'alert-danger');
            messageArea.textContent = `Error saving the feedback please try again. ${error}`;
        }
    })

    cancelButton.addEventListener('click', async function ():Promise<void> {
        messageArea.classList.add('d-none');
    })
}
