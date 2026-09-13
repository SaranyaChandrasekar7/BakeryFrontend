const cakeContainer = document.getElementById("cakeContainer");

console.log("Cake JS loaded");

async function loadCakes() {
    try {

        const response = await fetch("https://bakerybackend-7vre.onrender.com/api/product");
        const products = await response.json();

        const cakes = products.filter(
            product => product.category === "Cake"
        );

        cakeContainer.innerHTML = "";

        cakes.forEach(product => {

            const imageName = product.image.split("/").pop();

            const productKey = product.name
                .toLowerCase()
                .replace(/\s+/g, "");

            cakeContainer.innerHTML += `
                <div class="cake-card">

                     <img src="https://bakerybackend-7vre.onrender.com${product.image}" 
     alt="${product.name}">
     
                    <h2>${product.name}</h2>

                    <p>${product.description}</p>

                    <h3 class="cake-price">
                        ₹${product.prices[0].price}
                    </h3>

                    <div class="cake-buttons">

                        <a href="cakeproduct.html?product=${productKey}" 
                           class="view-product">
                            VIEW PRODUCT →
                        </a>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.log("Error loading cakes:", error);

        cakeContainer.innerHTML =
            "<h2>Products not loaded</h2>";
    }
}

loadCakes();