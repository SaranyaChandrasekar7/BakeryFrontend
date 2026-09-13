// =========================================
// LOGIN
// =========================================

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // =========================================
    // GET LOGIN VALUES
    // =========================================

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    // =========================================
    // EMPTY VALIDATION
    // =========================================

    if (email === "" || password === "") {

        alert("Please enter email and password.");

        return;
    }


    // =========================================
    // LOGIN API
    // =========================================

    try {

        const response = await fetch(
            "https://bakerybackend-7vre.onrender.com/api/user/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: email,

                    password: password

                })
            }
        );


        // =========================================
        // BACKEND RESPONSE
        // =========================================

        const result = await response.json();


        // =========================================
        // LOGIN FAILED
        // =========================================

        if (!result.success) {

            alert(result.message);

            return;
        }


        // =========================================
        // LOGIN SUCCESS
        // =========================================

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );


        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(result.user)
        );


        alert(
            "Login successful! Welcome " +
            result.user.name +
            " ❤️"
        );


        // =========================================
        // GO TO HOME
        // =========================================

        window.location.href = "index.html";


    } catch (error) {

        console.log(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to server. Please try again."
        );

    }

});

