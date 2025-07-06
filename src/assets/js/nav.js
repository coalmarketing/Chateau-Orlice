// Select DOM elements
const bodyElement = document.querySelector("body");
const navbarMenu = document.querySelector("#navigation");
const hamburgerMenu = document.querySelector("#navigation .toggle");
const sidebarMenu = document.querySelector("#sidebar .toggle");

// Function to toggle the aria-expanded attribute
function toggleAriaExpanded(element) {
    const isExpanded = element.getAttribute("aria-expanded") === "true";
    element.setAttribute("aria-expanded", (!isExpanded).toString());
}

// Function to toggle the menu open or closed
function toggleMenu() {
    hamburgerMenu.classList.toggle("active");
    sidebarMenu.classList.toggle("active");
    navbarMenu.classList.toggle("active");
    bodyElement.classList.toggle("menu");
    toggleAriaExpanded(hamburgerMenu);
}

// Add click event listener to the hamburger and sidebar menu
hamburgerMenu.addEventListener("click", toggleMenu);
sidebarMenu.addEventListener("click", toggleMenu);

// Add click event listener to the navbar menu to handle clicks on the pseudo-element
navbarMenu.addEventListener("click", function (event) {
    if (event.target === navbarMenu && navbarMenu.classList.contains("active")) {
        toggleMenu();
    }
});

// Close sidebar when clicking outside
document.addEventListener("click", function (event) {
    const isMenuOpen = navbarMenu.classList.contains("active");

    const clickedInsideNav = navbarMenu.contains(event.target);
    const clickedInsideSidebar = document.querySelector("#sidebar").contains(event.target);
    const clickedToggle = hamburgerMenu.contains(event.target) || sidebarMenu.contains(event.target);

    // If menu is open and click is NOT in nav, sidebar, or toggles, close it
    if (
        isMenuOpen &&
        !clickedInsideNav &&
        !clickedInsideSidebar &&
        !clickedToggle
    ) {
        toggleMenu();
    }
});

// Function to handle dropdown toggle
function toggleDropdown(element, event) {
    // Prevent the event from bubbling up to parent dropdowns
    event?.stopPropagation();

    // Toggle the active class
    element.classList.toggle("active");

    // Find and toggle the dropdown button's aria-expanded state
    const dropdownButton = element.querySelector(".dropdown-button");
    if (dropdownButton) {
        toggleAriaExpanded(dropdownButton);
    }

    // Find and toggle the dropdown content's visibility
    const dropdownContent = element.querySelector(".dropdown-content");
    if (dropdownContent) {
        const isVisible = element.classList.contains("active");
        dropdownContent.setAttribute("aria-hidden", (!isVisible).toString());
    }
}

// Function to close dropdown
function closeDropdown(element) {
    element.classList.remove("active");
    const dropdownButton = element.querySelector(".dropdown-button");
    const dropdownContent = element.querySelector(".dropdown-content");

    if (dropdownButton) {
        dropdownButton.setAttribute("aria-expanded", "false");
    }

    if (dropdownContent) {
        dropdownContent.setAttribute("aria-hidden", "true");
    }
}

// Initialize dropdowns
const dropdownElements = document.querySelectorAll(".dropdown");
dropdownElements.forEach(dropdown => {
    const dropdownButton = dropdown.querySelector(".dropdown-button");
    const dropdownContent = dropdown.querySelector(".dropdown-content");

    // Set initial ARIA attributes
    if (dropdownButton) {
        dropdownButton.setAttribute("aria-expanded", "false");
        dropdownButton.setAttribute("aria-haspopup", "true");
    }

    if (dropdownContent) {
        dropdownContent.setAttribute("aria-hidden", "true");
    }

    // Handle click events on dropdown buttons
    dropdownButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleDropdown(dropdown, event);
    });

    // Handle keyboard navigation
    dropdown.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeDropdown(dropdown);
            dropdownButton?.focus();
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleDropdown(dropdown, event);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target)) {
            closeDropdown(dropdown);
        }
    });
});

// Handle dropdown links
const dropdownLinks = document.querySelectorAll(".drop-li > .li-link");
dropdownLinks.forEach(link => {
    link.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            window.location.href = this.href;
        }
    });
});

// Close mobile menu on Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && hamburgerMenu.classList.contains("active")) {
        toggleMenu();
    }
});

// Add scroll class to body element
document.addEventListener('scroll', () => {
    const scroll = document.documentElement.scrollTop;
    bodyElement.classList.toggle('scroll', scroll >= 100);
});

// Toggle language switcher
const languageContainer = document.querySelector("header #languageContainer");
const languageSwitch = document.querySelector("header #languageSwitch");

// Show/hide languages on language toggle click
languageSwitch.addEventListener('click', function () {
    // Check whether the language switch is expanded
    const isExpanded = languageSwitch.getAttribute("aria-expanded") === "true";

    // Toggle the language switch and update the aria-expanded
    languageContainer.classList.toggle("active");
    languageSwitch.setAttribute("aria-expanded", (!isExpanded).toString());
});

// Close languages when clicking outside of language switcher
document.addEventListener('click', function (event) {
    const isClickInsideContainer = languageContainer.contains(event.target);
    const isClickOnSwitch = languageSwitch.contains(event.target);

    if (!isClickInsideContainer && !isClickOnSwitch) {
        // Remove active class if open
        if (languageContainer.classList.contains("active")) {
            languageContainer.classList.remove("active");
            languageSwitch.setAttribute("aria-expanded", "false");
        }
    }
});