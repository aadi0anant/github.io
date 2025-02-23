/**
File: login.js
Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
Date: 2025-02-23
Description: This is the login javascript file that contains the functionalities for the login page. 
            It authenticates the user based on the username and password provided and checks against the users.json file.
*/


window.addEventListener("load", function() {
    const loginButton = document.getElementById('loginButton');
    const cancelButton = document.getElementById('cancelButton');
    const loginForm = document.getElementById('loginForm');
    const messageArea = document.getElementById('messageArea');

    // Check if user is already logged in. If so, update the navbar
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
        location.href = 'index.html';
    }

    /**
     * Event listener for the login button to authenticate the user
     */
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        authenticateUser(username, password);
    });

    /**
     * Event listener for the cancel button to reset the form
     */
    cancelButton.addEventListener('click', function(event) {
        event.preventDefault();
        loginForm.reset();
    });

    /**
     * This function authenticates the user based on the username and password provided and checks against the users.json file.
     * @param {*} username 
     * @param {*} password 
     */
    function authenticateUser(username, password) {
        fetch('./jsonDB/users.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.username === username && user.password === password);
                if (user) {
                    // If user is authenticated, store user session in sessionStorage and redirect to home page
                    sessionStorage.setItem('userSession', JSON.stringify(user));
                    showMessage(`Welcome, ${user.name}!`, 'success');
                    // Redirect to home page after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
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
    function showMessage(message, type) {
        messageArea.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
    }


});