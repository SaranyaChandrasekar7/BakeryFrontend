// =================================
// BREAD CONTAINER
// =================================

const breadContainer = document.getElementById("breadContainer");

console.log("Bread JS loaded");

// =================================
// LOAD BREAD FROM BACKEND
// =================================

async function loadBread() {

    try {

        const response = await fetch("http://localhost:5000/api/product");
        const products = await response.json();

        const breads = products.filter(
            product => product.category === "Bread"
        );

        breadContainer.innerHTML = "";

        breads.forEach(product => {

            const imageName = product.image.split("/").pop();

            const productKey = product.name
                .toLowerCase()
                .replace(/\s+/g, "");

            breadContainer.innerHTML += `

                <div class="bread-card">

                     <img src="http://localhost:5000${product.image}" 
     alt="${product.name}">
                    <h2>${product.name}</h2>

                    <p>${product.description}</p>

                    <h3 class="bread-price">
                        ₹${product.prices[0].price}
                    </h3>

                    <div class="bread-buttons">

                        <a href="breadproduct.html?product=${productKey}"
                           class="view-product">
                            VIEW PRODUCT →
                        </a>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.log("Error loading breads:", error);

        breadContainer.innerHTML =
            "<h2>Products not loaded</h2>";

    }

}

// =================================
// CALL FUNCTION
// =================================

loadBread();

