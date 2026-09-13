// =================================
// GET PRODUCT FROM URL
// =================================

const urlParams = new URLSearchParams(window.location.search);
const productKey = urlParams.get("product");

// =================================
// LOAD CHOCOLATE FROM BACKEND
// =================================

async function loadChocolateProduct() {

    try {

        const response = await fetch("http://localhost:5000/api/product");
        const products = await response.json();

        const product = products.find(item => {

            const key = item.name
                .toLowerCase()
                .replace(/\s+/g, "");

            return (
                item.category &&
                item.category
                    .toLowerCase()
                    .replace(/\s+/g, "") === "chocolate"
                &&
                key === productKey
            );

        });

        // =================================
        // PRODUCT NOT FOUND
        // =================================

        if (!product) {

            alert("Chocolate not found");
            return;

        }

        // =================================
        // IMAGE
        // =================================

      document.querySelector(".cake-product-image img").src =
    product.image.startsWith("http")
        ? product.image
        : "http://localhost:5000" + product.image;

document.querySelector(".cake-product-image img").alt =
    product.name;


        // =================================
        // PRODUCT NAME
        // =================================

        document.querySelector(".cake-product-content h1").textContent =
            product.name;


        // =================================
        // DESCRIPTION
        // =================================

        document.querySelector(".product-description").textContent =
            product.description;


        // =================================
        // CATEGORY
        // =================================

        document.getElementById("productCategory").textContent =
            product.category.toUpperCase();


        // =================================
        // PRICE OPTIONS
        // =================================

        const weightOptions =
            document.getElementById("weightOptions");

        const selectedPrice =
            document.getElementById("selectedPrice");

        weightOptions.innerHTML = "";


        let currentWeight = product.prices[0].weight;
        let currentPrice = product.prices[0].price;


        // FIRST PRICE
        selectedPrice.textContent =
            "₹" + currentPrice;


        // =================================
        // CREATE PRICE BUTTONS
        // =================================

        product.prices.forEach((p, index) => {

            const btn = document.createElement("button");

            btn.className = "weight-btn";


            if (index === 0) {
                btn.classList.add("active");
            }


            btn.innerHTML = `
                <span>${p.weight}</span>
                ₹${p.price}
            `;


            btn.onclick = () => {

                currentWeight = p.weight;
                currentPrice = p.price;


                selectedPrice.textContent =
                    "₹" + currentPrice;


                document
                    .querySelectorAll(".weight-btn")
                    .forEach(b =>
                        b.classList.remove("active")
                    );


                btn.classList.add("active");

            };


            weightOptions.appendChild(btn);

        });


        // =================================
        // ADD TO CART
        // =================================

        document.getElementById("addToCart").onclick = () => {

            let cart = JSON.parse(localStorage.getItem("cart"));

if (!Array.isArray(cart)) {
    cart = [];
}


            cart.push({

                name: product.name,

                image:
    "http://localhost:5000" + product.image,

                weight: currentWeight,

                price: currentPrice,

                quantity: 1,

                productType: "chocolate"

            });


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            alert(
                `${product.name} (${currentWeight}) added to cart!`
            );

        };


        // =================================
        // ORDER NOW
        // =================================

        document.getElementById("orderNow").onclick = () => {

            window.location.href = "cart.html";

        };

    }

    catch (err) {

        console.log("Chocolate product error:", err);

        alert("Backend connection failed");

    }

}


// =================================
// CALL FUNCTION
// =================================

loadChocolateProduct();