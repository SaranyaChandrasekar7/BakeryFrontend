// =================================
// COOKIES CONTAINER
// =================================

const cookieContainer =
    document.getElementById("cookiecakeContainer");

console.log("Cookie JS loaded");


// =================================
// LOAD COOKIES
// =================================

async function loadCookie() {

    try {

        const response =
            await fetch("http://localhost:5000/api/product");

        const products = await response.json();

        // =================================
        // FILTER COOKIES
        // =================================

        const cookies = products.filter(product =>
            product.category &&
            product.category
                .toLowerCase()
                .replace(/\s+/g, "") === "cookies"
        );


        cookieContainer.innerHTML = "";


        // =================================
        // CREATE COOKIE CARDS
        // =================================

        cookies.forEach(product => {

            const imageName =
                product.image.split("/").pop();

            const productKey =
                product.name
                    .toLowerCase()
                    .replace(/\s+/g, "");


            cookieContainer.innerHTML += `

                <div class="cookies-card">

                    <img src="http://localhost:5000${product.image}" 
     alt="${product.name}">

                    <h2>
                        ${product.name}
                    </h2>

                    <p>
                        ${product.description}
                    </p>

                    <h3>
                        ₹${product.prices[0].price}
                    </h3>


                    <!-- VIEW PRODUCT -->

                    <a
                        href="./cookiesproduct.html?product=${productKey}"
                        class="view-product"
                    >
                        VIEW PRODUCT →
                    </a>

                </div>

            `;

        });


        // =================================
        // NO PRODUCTS
        // =================================

        if (cookies.length === 0) {

            cookieContainer.innerHTML =
                "<h2>No cookies found</h2>";

        }


        console.log(
            "Cookies loaded:",
            cookies
        );

    }

    catch (error) {

        console.error(
            "Error loading cookie:",
            error
        );

        if (cookieContainer) {

            cookieContainer.innerHTML =
                "<h2>Products not loaded</h2>";

        }

    }

}


// =================================
// CALL FUNCTION
// =================================

loadCookie();