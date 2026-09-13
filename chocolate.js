const chocolateContainer = document.getElementById("chocolateContainer");

console.log("Chocolate JS loaded");

async function loadChocolate() {
    try {

        const response = await fetch("https://bakerybackend-7vre.onrender.com/api/product");
        const products = await response.json();

        const chocolates = products.filter(
            product => product.category === "Chocolate"
        );

        chocolateContainer.innerHTML = "";

        chocolates.forEach(product => {

            const imageName = product.image.split("/").pop();

            const productKey = product.name
                .toLowerCase()
                .replace(/\s+/g, "");

            chocolateContainer.innerHTML += `
                <div class="chocolate-card">

                    <img src="https://bakerybackend-7vre.onrender.com${product.image}" 
     alt="${product.name}">

                    <h2>${product.name}</h2>

                    <p>${product.description}</p>

                    <h3 class="chocolate-price">
                        ₹${product.prices[0].price}
                    </h3>

                    <div class="chocolate-buttons">

                        <a href="chocolateproduct.html?product=${productKey}" 
                           class="view-product">
                            VIEW PRODUCT →
                        </a>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.log("Error loading chocolate:", error);

        chocolateContainer.innerHTML =
            "<h2>Products not loaded</h2>";
    }
}

loadChocolate();