/**
 * File: footer.ts
 * Author: Ritik Sharma(100952840), Brendan Obilo(100952871)
 * Date: 2025-03-14
 * Description: TThis is the footer typescript file that contains the functionalities for the footer.
 *
 */
/**
 * Footer Section that styles the footer and displays it at the base of our page
 */
export function LoadFooter() {
    const footerName = ["Privacy Policy", "Terms of Service"];
    let footer = document.createElement('div');
    footer.className = "container-fluid mb-0 p-4 fs-5 position-sticky bottom-0 bg-primary d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top";
    let footerParagraph = document.createElement('p');
    footerParagraph.className = 'col-md-4 mb-0 text-body-secondary';
    footerParagraph.innerHTML = '&copy; 2024 Company, Inc';
    footer.appendChild(footerParagraph);
    let footerGroup = document.createElement('ul');
    footerGroup.className = "nav col-md-4 justify-content-end";
    // Loops through a list footer links to display at the base of the page
    for (const elements in footerName) {
        let footerListTerm = document.createElement('li');
        footerListTerm.className = "nav-item";
        let footerLink = document.createElement('a');
        footerLink.className = "nav-link px-2 text-body-secondary";
        footerLink.href = "#";
        footerLink.textContent = footerName[elements];
        footerListTerm.appendChild(footerLink);
        footerGroup.appendChild(footerListTerm);
    }
    footer.appendChild(footerGroup);
    document.querySelector("footer").appendChild(footer);
    // document.body.appendChild(footer);
}
//# sourceMappingURL=footer.js.map