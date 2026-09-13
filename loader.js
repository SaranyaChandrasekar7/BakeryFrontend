// =================================
// COMMON PAGE LOADER
// =================================

document.addEventListener("DOMContentLoaded", function () {

    let loader = document.getElementById("pageLoader");

    if (!loader) {
        return;
    }

    setTimeout(function () {

        loader.style.opacity = "0";

        setTimeout(function () {

            loader.style.display = "none";

        }, 500);

    }, 500);

});