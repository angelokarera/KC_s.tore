document.addEventListener("DOMContentLoaded", function() {
    // Check which page we're on
    if (document.getElementById("jersey-grid")) {
        loadDynamicJerseys(); // Main page
    } else if (document.getElementById("login")) {
        setupAdmin(); // Admin page
    }

    // Main page: Load dynamically added jerseys from localStorage
    function loadDynamicJerseys(filter = "all") {
        const jerseyGrid = document.getElementById("jersey-grid");
        const allJerseys = Array.from(jerseyGrid.getElementsByClassName("jersey-item")); // Get all jerseys (static and dynamic)
        const dynamicJerseys = JSON.parse(localStorage.getItem("jerseys")) || [];

        // Add dynamic jerseys to the grid
        dynamicJerseys.forEach(jersey => {
            const item = document.createElement("div");
            item.className = "jersey-item";
            item.setAttribute("data-created-at", jersey.createdAt);

            const isNew = (Date.now() - jersey.createdAt) < 3 * 24 * 60 * 60 * 1000; // 3 days
            const newBadge = isNew ? '<span class="new-badge">New</span>' : '';

            item.innerHTML = `
                ${newBadge}
                <img src="${jersey.image}" alt="${jersey.name}">
                <h3>${jersey.name}</h3>
                <p>${jersey.price.toLocaleString()} RWF</p>
                <a href="${jersey.link}" class="btn order-now">Order Now</a>
            `;
            jerseyGrid.appendChild(item);
        });

        // Filter jerseys
        const allItems = Array.from(jerseyGrid.getElementsByClassName("jersey-item")); // Re-fetch after adding dynamic jerseys
        allItems.forEach(item => {
            const createdAt = parseInt(item.getAttribute("data-created-at"));
            const isNew = (Date.now() - createdAt) < 3 * 24 * 60 * 60 * 1000; // 3 days

            if (filter === "new" && !isNew) {
                item.style.display = "none";
            } else if (filter === "others" && isNew) {
                item.style.display = "none";
            } else {
                item.style.display = "flex";
            }
        });

        // Show message if no jerseys match the filter
        const visibleItems = allItems.filter(item => item.style.display !== "none");
        if (visibleItems.length === 0) {
            jerseyGrid.innerHTML = '<p>No jerseys found in this category.</p>';
            // Re-add static jerseys if grid is cleared
            jerseyGrid.innerHTML += `
                <div class="jersey-item" data-created-at="1625097600000">
                    <img src="photos/barcelona_third_black.jpg" alt="Barcelona Third 2023">
                    <h3>Barcelona Third 2023</h3>
                    <p>20,000 RWF</p>
                    <a href="https://wa.me/250794100155" class="btn order-now">Order Now</a>
                </div>
                <div class="jersey-item" data-created-at="1625097600000">
                    <img src="photos/real_madrid_away_orange.jpg" alt="Real Madrid Away 2023">
                    <h3>Real Madrid Away 2023</h3>
                    <p>20,000 RWF</p>
                    <a href="https://www.instagram.com/kc__s.tore?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" class="btn order-now">Order Now</a>
                </div>
                <div class="jersey-item" data-created-at="1625097600000">
                    <img src="photos/man_utd_home_red.jpg" alt="Man Utd Home 2023">
                    <h3>Man Utd Home 2023</h3>
                    <p>20,000 RWF</p>
                    <a href="https://wa.me/250798600050" class="btn order-now">Order Now</a>
                </div>
            `;
            loadDynamicJerseys(filter); // Re-apply filter
        }
    }

    // Filter button event listeners
    if (document.getElementById("show-new")) {
        document.getElementById("show-new").addEventListener("click", () => {
            loadDynamicJerseys("new");
        });
    }
    if (document.getElementById("show-others")) {
        document.getElementById("show-others").addEventListener("click", () => {
            loadDynamicJerseys("others");
        });
    }

    // Shop Now button alert
    if (document.querySelector(".shop-now")) {
        document.querySelector(".shop-now").addEventListener("click", () => {
            alert("Ready to shop? Contact us now!");
        });
    }

    // Admin page: Password protection and upload
    function setupAdmin() {
        const password = "kcstore123"; // Change this to your desired password
        const loginSection = document.getElementById("login");
        const uploadSection = document.getElementById("upload-section");
        const loginBtn = document.getElementById("login-btn");
        const logoutBtn = document.getElementById("logout-btn");
        const uploadForm = document.getElementById("upload-form");

        // Check if already logged in
        if (localStorage.getItem("adminLoggedIn") === "true") {
            loginSection.style.display = "none";
            uploadSection.style.display = "block";
        }

        // Login button
        loginBtn.addEventListener("click", () => {
            const input = document.getElementById("password").value;
            if (input === password) {
                localStorage.setItem("adminLoggedIn", "true");
                loginSection.style.display = "none";
                uploadSection.style.display = "block";
            } else {
                alert("Incorrect password!");
            }
        });

        // Logout button
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("adminLoggedIn");
            loginSection.style.display = "block";
            uploadSection.style.display = "none";
        });

        // Upload form submission
        uploadForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newJersey = {
                name: document.getElementById("jersey-name").value,
                price: parseFloat(document.getElementById("jersey-price").value),
                image: document.getElementById("jersey-image").value,
                link: document.getElementById("jersey-link").value,
                createdAt: Date.now()
            };

            // Get existing jerseys or initialize empty array
            let jerseys = JSON.parse(localStorage.getItem("jerseys")) || [];
            
            // Append the new jersey to the existing list
            jerseys.push(newJersey);
            
            // Save updated list back to localStorage
            localStorage.setItem("jerseys", JSON.stringify(jerseys));
            
            alert("Jersey added successfully! Check the main page.");
            uploadForm.reset();
        });
    }
});