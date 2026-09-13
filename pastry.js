const pastryContainer = document.getElementById("pastryContainer");

console.log("Pastry JS loaded");

async function loadPastry() {

    try {

        const response = await fetch("http://localhost:5000/api/product");
        const products = await response.json();

        const pastries = products.filter(
            product => product.category === "Pastry"
        );

        pastryContainer.innerHTML = "";

        pastries.forEach(product => {

            const imageName = product.image.split("/").pop();

            const productKey = product.name
                .toLowerCase()
                .replace(/\s+/g, "");

            pastryContainer.innerHTML += `
                <div class="pastry-card">

                    <img src="http://localhost:5000${product.image}" 
     alt="${product.name}">

                    <h2>${product.name}</h2>

                    <p>${product.description}</p>

                    <h3 class="cake-price">
                        ₹${product.prices[0].price}
                    </h3>

                    <div class="cake-buttons">

                        <a href="pastryproduct.html?product=${productKey}"
                           class="view-product">
                            VIEW PRODUCT →
                        </a>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.log("Error loading pastry:", error);

        pastryContainer.innerHTML =
            "<h2>Products not loaded</h2>";
    }
}

loadPastry();