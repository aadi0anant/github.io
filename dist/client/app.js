"use strict";
import { LoadHeader } from "./header.js";
import { Router } from "./router.js";
import { LoadFooter } from "./footer.js";
import { AuthGuard } from "./authguard.js";
import { validateForm, addEventListenerOnce, attachValidationListeners, DisplayWeather, handleEditClick, AddContact } from "./utils.js";
import { deleteContact, fetchContact, fetchContacts } from "./api/index.js";
const routes = {
    "/": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact": "views/pages/contact.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/404": "views/pages/404.html"
};
const pageTitle = {
    "/": "Home",
    "/home": "Home",
    "/about": "About Us",
    "/products": "Products",
    "/services": "Services",
    "/contact": "Contact",
    "/contact-list": "Contact List",
    "/edit": "Edit Contact",
    "/login": "Login",
    "/register": "Register",
    "/404": "Page Not Found",
};
const router = new Router(routes);
(function () {
    /**
     * Loads the login page
     */
    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage called....");
        if (sessionStorage.getItem("user")) {
            router.navigate("/contact-list");
            return;
        }
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("submitButton");
        const cancelButton = document.getElementById("cancelButton");
        const loginForm = document.getElementById("loginForm");
        // Hide message area initially
        // messageArea.style.display = "none";
        if (!loginButton) {
            console.error("[ERROR] loginButton not found in the DOM");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                // const response = await fetch("data/users.json");
                const response = await fetch("/users");
                if (!response.ok) {
                    console.error(`[ERROR] HTTP error!. Status: ${response.status}`);
                }
                const jsonData = await response.json();
                //console.log("[DEBUG] JSON data", jsonData)
                const users = jsonData.users;
                let authenticatedUser = users.find((user) => user.Username === username && user.Password === password);
                if (authenticatedUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser?.DisplayName,
                        EmailAddress: authenticatedUser?.EmailAddress,
                        Username: authenticatedUser?.Username
                    }));
                    if (messageArea) {
                        messageArea.style.display = "none";
                        messageArea.classList.remove("alert-danger");
                    }
                    LoadHeader().then(() => {
                        router.navigate("/contact-list");
                    });
                }
                else {
                    if (messageArea) {
                        messageArea.style.display = "block";
                        messageArea.classList.add("aller", "alert-danger");
                        messageArea.textContent = "Invalid Username or password, Please try again";
                    }
                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            }
            catch (error) {
                console.error("[ERROR] Login failed", error);
            }
        });
        if (cancelButton && loginForm) {
            cancelButton.addEventListener("click", () => {
                loginForm.reset();
                router.navigate("/");
            });
        }
        else {
            console.warn(`[WARNING] Login failed...]`);
        }
    }
    /**
     * Loads the register page
     *
     */
    function DisplayRegisterPage() {
        console.log("[INFO] DisplayRegisterPage called....");
    }
    /**
     * loads the edit page and updates the list when the values on the input are updated
     *
     */
    async function DisplayEditPage() {
        console.log("Called DisplayEditPage() .....");
        const hashParts = location.hash.split("#");
        //http://localhost:3000/#/edit#add
        const page = hashParts.length > 2 ? hashParts[2] : "add";
        // Add a new contact
        const pageTitle = document.querySelector("main>h1");
        const editButton = document.getElementById("editButton");
        const cancelButton = document.getElementById("cancelButton");
        if (!pageTitle || !editButton || !cancelButton) {
            console.error("[ERROR] pageTitle element not found");
            return;
        }
        if (page === "add") {
            document.title = "Add Contact";
            pageTitle.textContent = "Add Contact";
            editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i> Add Contact`;
            editButton.classList.remove("btn-primary");
            editButton.classList.add("btn-success");
        }
        else {
            editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit`;
            editButton.classList.remove("btn-success");
            editButton.classList.add("btn-primary");
            try {
                document.title = "Edit Contact";
                pageTitle.textContent = "Edit Contact";
                //prepopulate the form with current values
                const contact = await fetchContact(page);
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;
            }
            catch (error) {
                console.error(`[ERROR] Failed to fetch contact: ${error}`);
                router.navigate("/contact-list");
            }
        }
        // attach event listeners for edit and cancel
        addEventListenerOnce("editButton", "click", async (event) => {
            event.preventDefault();
            if (page === "add") {
                const fullName = document.getElementById("fullName").value.trim();
                const contactNumber = document.getElementById("contactNumber").value.trim();
                const emailAddress = document.getElementById("emailAddress").value.trim();
                await AddContact(fullName, contactNumber, emailAddress, router);
            }
            else {
                await handleEditClick(event, page, router);
            }
        });
        addEventListenerOnce("cancelButton", "click", (event) => {
            event.preventDefault();
            router.navigate("/contact-list");
        });
        attachValidationListeners();
    }
    /**
     * Loads the contact list page to edit or add or display contacts stored
     */
    async function DisplayContactListPage() {
        console.log("DisplayContactListPage");
        const contactList = document.getElementById("contactList");
        if (!contactList) {
            console.warn(`[WARNING] Element with ID 'contactList' not found`);
            return;
        }
        try {
            const contacts = await fetchContacts();
            let data = "";
            let index = 1;
            contacts.forEach((contact) => {
                data += `<tr>
                            <th scope="row" class="text-center">${index}</th>
                            <td>${contact.fullName}</td>
                            <td>${contact.contactNumber}</td>
                            <td>${contact.emailAddress}</td>
                            <td class="text-center">
                                <button value="${contact.id}" class="btn btn-warning btn-sm edit">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                    Edit
                                </button>
                            </td>
                            <td class="text-center">
                                <button value="${contact.id}" class="btn btn-danger btn-sm delete">
                                    <i class="fa-solid fa-trash"></i>
                                    Delete
                                </button>
                            </td>
                         </tr>`;
                index++;
            });
            contactList.innerHTML = data;
            const addButton = document.getElementById("addButton");
            addButton.addEventListener("click", () => {
                router.navigate("/edit#add");
            });
            document.querySelectorAll("button.delete").forEach((button) => {
                button.addEventListener("click", async function (event) {
                    const targetButton = event.target;
                    const contactId = targetButton.value;
                    if (confirm("Delete contact, please confirm")) {
                        try {
                            await deleteContact(contactId);
                            await DisplayContactListPage();
                            router.navigate("/contact-list");
                        }
                        catch (error) {
                            console.error(`[ERROR] failed to delete contact: ${error}`);
                        }
                    }
                });
            });
            document.querySelectorAll("button.edit").forEach((button) => {
                button.addEventListener("click", function (event) {
                    const targetButton = event.target;
                    const contactKey = targetButton.value;
                    router.navigate(`/edit#${contactKey}`);
                });
            });
        }
        catch (error) {
            console.error(`[ERROR] Failed to display contact: ${error}`);
        }
    }
    /**
     * Loads the home page
     */
    function DisplayHomePage() {
        console.log("Calling DisplayHomePage...");
        const aboutUsButton = document.getElementById("AboutusBtn");
        if (aboutUsButton) {
            aboutUsButton.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        DisplayWeather().then().catch(console.error);
    }
    /**
     * Loads the products page
     */
    function DisplayProductsPage() {
        console.log("Calling DisplayProductsPage...");
    }
    /**
     * Loads the service page
     */
    function DisplaySerivcesPage() {
        console.log("Calling DisplaySerivcesPage...");
    }
    /**
     * Loads the About page
     */
    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage...");
    }
    /**
     * Loads the contact page to create new contact
     */
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        const contactListButton = document.getElementById("showContactList");
        if (!sendButton) {
            console.warn("[WARNING] Element By ID sendButton not found.");
            return;
        }
        sendButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (!validateForm()) {
                alert("Please fix errors before submitting");
                return;
            }
            if (subscribeCheckbox.checked) {
                const fullName = document.getElementById("fullName").value;
                const contactNumber = document.getElementById("contactNumber").value;
                const emailAddress = document.getElementById("emailAddress").value;
                AddContact(fullName, contactNumber, emailAddress, router);
            }
            alert("Form submitted successfully");
        });
        if (contactListButton) {
            contactListButton.addEventListener("click", function (event) {
                event.preventDefault();
                router.navigate("/contact-list");
            });
        }
    }
    /**
     * Handles the process of adding a new contact
     * @param event - the event object to prevent default form submission
     */
    function handleAddClick(event) {
        event.preventDefault();
        if (!validateForm()) {
            alert("Form contains errors. Please correct them before submitting");
            return;
        }
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;
        // Create and save new contact
        AddContact(fullName, contactNumber, emailAddress, router);
        // Redirect to contact list
        router.navigate("/contact-list");
    }
    /**
     * Listen for changes and update the navigation links
     */
    document.addEventListener("routeLoaded", (event) => {
        if (!(event instanceof CustomEvent) || typeof event.detail !== "string") {
            console.warn("[WARNING] Received an invalid ''routeLoaded' event'");
            return;
        }
        const newPath = event.detail; //extract the route from the event passed
        console.log(`[INFO] Route Loaded: ${newPath}`);
        LoadHeader().then(() => {
            handlePageLogic(newPath);
        });
    });
    window.addEventListener("sessionExpired", () => {
        console.warn("[SESSION] Redirecting the user due to inactivity.");
        router.navigate("/login");
    });
    function handlePageLogic(path) {
        document.title = pageTitle[path] || "Untitled Page";
        const protectedRoutes = ["/contact-list", "/edit"];
        if (protectedRoutes.includes(path)) {
            AuthGuard(); //redirected to /login if not authenticated
        }
        switch (path) {
            case "/":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/products":
                DisplayProductsPage();
                break;
            case "/services":
                DisplaySerivcesPage();
                break;
            case "/contact":
                DisplayContactPage();
                attachValidationListeners();
                break;
            case "/contact-list":
                DisplayContactListPage();
                break;
            case "/edit":
                DisplayEditPage();
                attachValidationListeners();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            default:
                console.warn(`[WARNING] No display logic found for: ${path}`);
        }
    }
    async function Start() {
        console.log("Starting App...");
        // Load header first then run CheckLogin
        await LoadHeader();
        await LoadFooter();
        AuthGuard();
        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);
        handlePageLogic(currentPath);
    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start().then().catch(console.error);
    });
})();
//# sourceMappingURL=app.js.map