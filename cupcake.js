const cupcakeContainer = document.getElementById("cupcakeContainer");

console.log("Cupcake JS loaded");

async function loadCupCakes() {

    try {

        const response = await fetch("https://bakerybackend-7vre.onrender.com/api/product");
        const products = await response.json();

        const cupcakes = products.filter(
           product =>
    product.category &&
    product.category
        .toLowerCase()
        .replace(/\s+/g, "") === "cupcake"
        );

        cupcakeContainer.innerHTML = "";

        cupcakes.forEach(product => {

            const imageName = product.image.split("/").pop();

            const productKey = product.name
                .toLowerCase()
                .replace(/\s+/g, "");

            cupcakeContainer.innerHTML += `

                <div class="cupcake-card">

                     <img src="https://bakerybackend-7vre.onrender.com${product.image}" 
     alt="${product.name}">

                    <h2>${product.name}</h2>

                    <p>${product.description}</p>

                    <h3 class="cupcake-price">
                        ₹${product.prices[0].price}
                    </h3>

                    <div class="cupcake-buttons">

                        <a href="cupcakeproduct.html?product=${productKey}"
                           class="view-product">
                            VIEW PRODUCT →
                        </a>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.log("Error loading cupcakes:", error);

        cupcakeContainer.innerHTML =
            "<h2>Products not loaded</h2>";

    }

}

loadCupCakes();