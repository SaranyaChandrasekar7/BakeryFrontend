// =========================================
// SIGN UP
// =========================================

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // =========================================
    // GET VALUES
    // =========================================

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const phone =
        document.getElementById("signupPhone").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms =
        document.getElementById("terms").checked;


    // =========================================
    // NAME VALIDATION
    // =========================================

    if (name.length < 3) {

        alert("Please enter a valid name.");

        return;
    }


    // =========================================
    // PHONE VALIDATION
    // =========================================

    const phonePattern = /^[6-9][0-9]{9}$/;

    if (!phonePattern.test(phone)) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        return;
    }


    // =========================================
    // PASSWORD VALIDATION
    // =========================================

    if (password.length < 6) {

        alert(
            "Password must contain at least 6 characters."
        );

        return;
    }


    // =========================================
    // CONFIRM PASSWORD
    // =========================================

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }


    // =========================================
    // TERMS & CONDITIONS
    // =========================================

    if (!terms) {

        alert(
            "Please agree to the Terms & Conditions."
        );

        return;
    }


    // =========================================
    // SEND USER TO BACKEND
    // =========================================

    try {

        const response = await fetch(
           "https://bakerybackend-7vre.onrender.com/api/user/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    password: password

                })
            }
        );


        // =========================================
        // GET BACKEND RESPONSE
        // =========================================

        const result = await response.json();


        // =========================================
        // REGISTRATION FAILED
        // =========================================

        if (!result.success) {

            alert(result.message);

            return;
        }


        // =========================================
        // REGISTRATION SUCCESS
        // =========================================

        alert(
            "Account created successfully! Please login."
        );


        // =========================================
        // GO TO LOGIN PAGE
        // =========================================

        window.location.href = "login.html";


    } catch (error) {

        console.log(
            "Signup error:",
            error
        );

        alert(
            "Unable to connect to server. Please try again."
        );

    }

});

