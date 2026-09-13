// =========================================
// FORGOT PASSWORD
// =========================================

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");


forgotPasswordForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    // =========================================
    // GET VALUES
    // =========================================

    const email =
        document.getElementById("forgotEmail").value.trim();

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // =========================================
    // EMPTY VALIDATION
    // =========================================

    if (
        email === "" ||
        newPassword === "" ||
        confirmPassword === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    // =========================================
    // PASSWORD MATCH
    // =========================================

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match.");

        return;
    }


    // =========================================
    // RESET PASSWORD API
    // =========================================

    try {

        const response = await fetch(
            "https://bakerybackend-7vre.onrender.com/api/user/forgot-password",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: email,

                    newPassword: newPassword

                })
            }
        );


        // =========================================
        // BACKEND RESPONSE
        // =========================================

        const result =
            await response.json();


        // =========================================
        // FAILED
        // =========================================

        if (!result.success) {

            alert(result.message);

            return;
        }


        // =========================================
        // SUCCESS
        // =========================================

        alert(
            "Password reset successfully! ❤️"
        );


        // =========================================
        // GO TO LOGIN
        // =========================================

        window.location.href =
            "login.html";


    } catch (error) {

        console.log(
            "Forgot password error:",
            error
        );

        alert(
            "Unable to connect to server. Please try again."
        );

    }

});

