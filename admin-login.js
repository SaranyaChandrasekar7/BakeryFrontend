// ==========================
// ADMIN LOGIN
// ==========================

document
    .getElementById("adminLoginForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const errorMessage =
            document.getElementById("errorMessage");

        try {

            const response = await fetch(
                "https://bakerybackend-7vre.onrender.com/api/admin/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            const result =
                await response.json();

            if (result.success) {

                localStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );

                window.location.href =
                    "admin.html";

            } else {

                errorMessage.textContent =
                    result.message ||
                    "Invalid username or password";

            }

        } catch (error) {

            console.log(
                "Admin login error:",
                error
            );

            errorMessage.textContent =
                "Backend connection failed.";

        }

    });