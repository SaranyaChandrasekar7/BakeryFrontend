// =========================================
// AUTHENTICATION + LOGIN PROTECTION
// =========================================

const authLinks = document.querySelector(".auth-links");

const isLoggedIn = localStorage.getItem("isLoggedIn");
const loggedInUser = localStorage.getItem("loggedInUser");

const currentPage = window.location.pathname.split("/").pop();

// =========================================
// PROTECT HOME PAGE
// =========================================

if (
    (currentPage === "index.html" || currentPage === "") &&
    isLoggedIn !== "true"
) {
    window.location.href = "signup.html";
}

// =========================================
// NAVBAR
// =========================================

if (authLinks) {

    if (isLoggedIn === "true" && loggedInUser) {

        const user = JSON.parse(loggedInUser);

        authLinks.innerHTML = `
            <span class="welcome-user">
                Welcome, ${user.name}
            </span>

            <span>|</span>

            <a href="#" id="logoutBtn">
                Logout
            </a>
        `;

        // Logout
        document
            .getElementById("logoutBtn")
            .addEventListener("click", function (e) {

                e.preventDefault();

                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("loggedInUser");

                alert("You have been logged out.");

                window.location.href = "signup.html";

            });

    } else {

        authLinks.innerHTML = `
            <a href="login.html">Login</a>
            <span>|</span>
            <a href="signup.html">Sign Up</a>
        `;

    }

}