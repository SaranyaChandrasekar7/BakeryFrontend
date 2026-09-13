// =========================================
// CONTACT FORM
// =========================================

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validation
        if (!name || !email || !phone || !message) {
            alert("Please fill all the fields.");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/message",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        message
                    })
                }
            );

            const result = await response.json();

            if (!result.success) {
                alert(result.message);
                return;
            }

            alert("Message sent successfully! 😊");

            contactForm.reset();

        } catch (error) {

            console.log("Message Error:", error);

            alert("Unable to connect to server.");

        }

    });

}


// =========================================
// CATEGORY DROPDOWN
// =========================================

const categoryBtn = document.getElementById("categoryBtn");
const categoryDropdown = document.getElementById("categoryDropdown");

if (categoryBtn && categoryDropdown) {

    categoryBtn.addEventListener("click", function () {

        if (categoryDropdown.style.display === "block") {
            categoryDropdown.style.display = "none";
        } else {
            categoryDropdown.style.display = "block";
        }

    });

}