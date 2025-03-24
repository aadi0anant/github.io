/**
File: login.js
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-02-23
Description: This is the login javascript file that contains the functionalities for the login page. 
            It authenticates the user based on the username and password provided and checks against the users.json file.
*/


import {router} from "./main.js";
interface UserMap {
    username: string,
    password: string,
    name: string
}

export function DisplayLoginPage() {

    const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
    const cancelButton = document.getElementById('cancelButton') as HTMLButtonElement;
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    const messageArea = document.getElementById('messageArea') as HTMLElement;

    // Check if user is already logged in. If so, update the navbar
    const userSession:string|null = sessionStorage.getItem('userSession');
    if (userSession) {
        router.navigate('/home')
    }

    /**
     * Event listener for the login button to authenticate the user
     */
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        authenticateUser(username, password).then().catch(console.error);
    });

    /**
     * Event listener for the cancel button to reset the form
     */
    cancelButton.addEventListener('click', function(event:Event) {
        event.preventDefault();
        loginForm.reset();
    });

    /**
     * This function authenticates the user based on the username and password provided and checks against the users.json file.
     * @param {*} username 
     * @param {*} password 
     */
    async function authenticateUser(username:string, password:string) {
        await fetch('./data/users.json')
            .then(response => response.json())
            .then(users => {
                const user = (users as UserMap[]).find(user => user.username === username && user.password === password);
                if (user) {
                    console.log(user);
                    // If user is authenticated, store user session in sessionStorage and redirect to home page
                    const {password, ...userData} = user;
                    sessionStorage.setItem('userSession', JSON.stringify(userData));
                    showMessage(`Welcome, ${user.name}!`, 'success');
                    // Redirect to home page after 2 seconds
                    setTimeout(():void => {
                        router.navigate('/home');
                    }, 2000);
                } else {
                    showMessage('Invalid username or password.', 'danger');
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    /**
     * This function displays a message on the page based on the message and type provided.
     * @param {*} message 
     * @param {*} type 
     */
    function showMessage(message:string, type:string) {
        messageArea.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    }


}