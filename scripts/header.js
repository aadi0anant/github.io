/**
 * File: header.ts
 * Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 * Date: 2025-03-14
 * Description: This is the header TypeScript file that contains the functionalities for the header.
 *              It fetches the header component, updates the navbar links, and also checks for login.
 */
/**
 * A function that loads the header component from the header.html file and appends it to the index.html.
 * @returns {Promise<void>}
 */
export async function LoadHeader() {
    console.log("[INFO] LoadHeader called...");
    return await fetch("views/components/header.html")
        .then(response => response.text())
        .then(data => {
        document.querySelector("header").innerHTML = data;
        UpdateNavLink();
        CheckLogin();
    })
        .catch(error => console.error("[ERROR] Unable to load header", error));
}
/**
 * A function that updates the nav link to convert "Opportunities" link to "Donate" link
 * and also sets the link to the current page to active.
 * @returns {Promise<void>}
 */
export async function UpdateNavLink() {
    // Get or create all the HTML elements in the header
    const navbarLinks = document.getElementById('navbarLinks');
    const donateLink = document.createElement('li');
    const opportunitiesLink = document.getElementById('opportunitiesLink');
    // Add "Donate" link dynamically to the navbar
    donateLink.className = 'nav-item';
    donateLink.innerHTML = `<a class="nav-link" href="#"><i class="fa-solid fa-circle-dollar-to-slot"></i> Donate</a>`;
    navbarLinks.appendChild(donateLink);
    // Change "Opportunities" link text to "Volunteer Now"
    opportunitiesLink.innerHTML = `<i class="fa-solid fa-briefcase"></i> Volunteer Now`;
}
/**
 * A function that checks if the user is logged in by checking the session storage.
 * If the user is logged in, it updates the navbar accordingly.
 * @returns {boolean | object} - Returns the user object if logged in, otherwise returns false.
 */
export function CheckLogin() {
    console.log("[INFO] Checking user login status");
    const loginNavItem = document.getElementById('login');
    const messageArea = document.getElementById('messageAreaIndex');
    const statNavItem = document.getElementById('statNavLink');
    if (!loginNavItem) {
        console.warn("[WARNING] loginNav element not found. Skipping CheckLogin().");
        return false;
    }
    const userSession = sessionStorage.getItem('userSession');
    if (userSession) {
        statNavItem.style.display = 'block';
        const user = JSON.parse(userSession);
        loginNavItem.innerHTML = `<a class="nav-link" href="#">Logout</a>`;
        loginNavItem.addEventListener('click', function (event) {
            event.preventDefault();
            messageArea.classList.remove('d-none');
            messageArea.classList.add('d-block', 'alert', 'alert-success');
            messageArea.textContent = `Goodbye ${user?.name}`;
            setTimeout(() => {
                location.hash = '/';
            }, 2000);
            sessionStorage.removeItem('userSession');
        });
        return user; // Return the full user object, not just the username
    }
    else {
        statNavItem.style.display = 'none';
        return false;
    }
}
//# sourceMappingURL=header.js.map