"use strict";

//IIFE - Immediately Invoked Functional Expression
(function () {

    function DisplayHomePage(){
        console.log("Displaying Home Page...");

        let aboutUsButton = document.getElementById("AboutUsBtn");
        aboutUsButton.addEventListener("click", function(){
            location.href = "about.html";
        });

        let MainContent = document.getElementsByTagName("main")[0];
        let MainParagraph = document.createElement("p");

        //<p id="MainParagraph">This is my first main paragraph</p>
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "This is my first main paragraph.";

        //Display to screen
        MainContent.appendChild(MainParagraph);

        let FistString = "This is";
        let SecondString = `${FistString} my second string`;
        MainParagraph.textContent = SecondString;

        //Display to screen
        MainContent.appendChild(MainParagraph);

        let DocumentBody = document.body;

        //<article><p></p></article>
        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">This is my first article paragraph.</p>`
        Article.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);
    }


    function DisplayProductPage(){
        console.log("Displaying Product Page...");
    }

    function DisplayServicesPage(){
        console.log("Displaying Services Page...");
    }

    function DisplayContactPage(){
        console.log("Displaying Contact Page...");
    }

    function DisplayAboutPage(){
        console.log("Displaying About Page...");
    }

    function Start() {
        console.log("Starting App...");

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
        }
    }
    window.addEventListener("load", Start);



})()