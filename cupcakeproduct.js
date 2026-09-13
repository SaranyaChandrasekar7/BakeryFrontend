// =================================
// GET PRODUCT FROM URL
// =================================

const urlParams = new URLSearchParams(window.location.search);
const productKey = urlParams.get("product");


// =================================
// LOAD CUPCAKE FROM BACKEND
// =================================

async function loadCupcakeProduct() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/product"
            );

        const products =
            await response.json();


        // =================================
        // FIND PRODUCT
        // =================================

        const product =
            products.find(item => {

                const key =
                    item.name
                        .toLowerCase()
                        .replace(/\s+/g, "");

                return (
                    item.category &&
                    item.category
                        .toLowerCase()
                        .replace(/\s+/g, "") === "cupcake"
                    &&
                    key === productKey
                );

            });


        // =================================
        // PRODUCT NOT FOUND
        // =================================

        if (!product) {

            alert("Cup Cake not found");

            return;

        }


        // =================================
        // PRODUCT IMAGE
        // =================================

        const productImage =
            document.querySelector(
                ".cake-product-image img"
            );


        productImage.src =
            product.image.startsWith("http")
                ? product.image
                : "http://localhost:5000" +
                  product.image;


        productImage.alt =
            product.name;


        // =================================
        // PRODUCT NAME
        // =================================

        document.querySelector(
            ".cake-product-content h1"
        ).textContent =
            product.name;


        // =================================
        // DESCRIPTION
        // =================================

        document.querySelector(
            ".product-description"
        ).textContent =
            product.description;


        // =================================
        // CATEGORY
        // =================================

        document.getElementById(
            "productCategory"
        ).textContent =
            product.category.toUpperCase();


        // =================================
        // PRICE OPTIONS
        // =================================

        const weightOptions =
            document.getElementById(
                "weightOptions"
            );


        const selectedPrice =
            document.getElementById(
                "selectedPrice"
            );


        weightOptions.innerHTML = "";


        let currentWeight =
            product.prices[0].weight;


        let currentPrice =
            product.prices[0].price;


        selectedPrice.textContent =
            "₹" + currentPrice;


        // =================================
        // CREATE PRICE BUTTONS
        // =================================

        product.prices.forEach(
            (p, index) => {

                const btn =
                    document.createElement(
                        "button"
                    );


                btn.className =
                    "weight-btn";


                if (index === 0) {

                    btn.classList.add(
                        "active"
                    );

                }


                btn.innerHTML = `
                    <span>${p.weight}</span>
                    ₹${p.price}
                `;


                btn.onclick = () => {

                    currentWeight =
                        p.weight;


                    currentPrice =
                        p.price;


                    selectedPrice.textContent =
                        "₹" + currentPrice;


                    document
                        .querySelectorAll(
                            ".weight-btn"
                        )
                        .forEach(
                            b => {

                                b.classList.remove(
                                    "active"
                                );

                            }
                        );


                    btn.classList.add(
                        "active"
                    );

                };


                weightOptions.appendChild(
                    btn
                );

            }
        );


        // =================================
        // ADD TO CART
        // =================================

        document.getElementById(
            "addToCart"
        ).onclick = () => {

            let cart =
                JSON.parse(
                    localStorage.getItem("cart")
                );


            if (!Array.isArray(cart)) {

                cart = [];

            }


            cart.push({

                name:
                    product.name,


                image:
                    product.image.startsWith("http")
                        ? product.image
                        : "http://localhost:5000" +
                          product.image,


                weight:
                    currentWeight,


                price:
                    currentPrice,


                quantity:
                    1,


                productType:
                    "cupcake"

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

        document.getElementById(
            "orderNow"
        ).onclick = () => {

            window.location.href =
                "cart.html";

        };

    }


    catch (err) {

        console.log(
            "Cupcake product error:",
            err
        );


        alert(
            "Backend connection failed"
        );

    }

}


// =================================
// CALL FUNCTION
// =================================

loadCupcakeProduct();