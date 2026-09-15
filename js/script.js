// ======================================================
// UNIFIED EDUCATIONAL INTERFACE - MAIN JAVASCRIPT
// ======================================================


// ---------------- LOGIN FUNCTION ----------------
function loginCheck(event) {
    if (event) {
        event.preventDefault();
    }

    const usernameElement = document.getElementById("loginUser");
    const passwordElement = document.getElementById("loginPassword");

    const username = usernameElement
        ? usernameElement.value.trim()
        : "";

    const password = passwordElement
        ? passwordElement.value
        : "";

    // Check empty fields
    if (username === "" || password === "") {
        alert("Please enter username and password.");
        return false;
    }

    // Connect to deployed Render backend
    fetch("https://unified-educational-interface.onrender.com/api/login", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    .then(response => {
        return response.json().then(data => ({
            status: response.status,
            data: data
        }));
    })

    .then(result => {

        if (
            result.status === 200 &&
            result.data.message === "Login Successful"
        ) {

            // Save username
            localStorage.setItem("studentName", username);

            // Open student dashboard
            window.location.href = "student.html";

        } else {

            alert(
                result.data.message ||
                "Invalid username or password."
            );
        }
    })

    .catch(error => {

        console.error("Login Error: - script.js:74", error);

        alert(
            "Cannot connect to backend. Please try again."
        );
    });

    return false;
}


// ---------------- LOGOUT FUNCTION ----------------
function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("studentName");

        window.location.href = "login.html";
    }
}


// ======================================================
// PAGE INITIALIZATION
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // ---------------- DISPLAY STUDENT NAME ----------------

    const user = localStorage.getItem("studentName");

    const display =
        document.getElementById("studentNameDisplay") ||
        document.getElementById("studentName");

    if (user && display) {

        display.innerText = "👤 " + user;
    }


    // ---------------- WELCOME USER ----------------

    const welcome = document.getElementById("welcomeUser");

    if (user && welcome) {

        welcome.innerText = "Welcome " + user + " 👋";
    }


    // ==================================================
    // FACULTY SEARCH
    // ==================================================

    const searchInput = document.getElementById("searchInput");
    const facultyGrid = document.getElementById("facultyGrid");

    if (searchInput && facultyGrid) {

        searchInput.addEventListener("keyup", function () {

            const filter =
                searchInput.value.toLowerCase();

            const teacherCards =
                document.querySelectorAll(".teacher-card");

            let hasResults = false;

            teacherCards.forEach(function (card) {

                const nameElement =
                    card.querySelector("h3");

                const specialtyElement =
                    card.querySelector(".specialty");

                const teacherName =
                    nameElement
                        ? nameElement.innerText.toLowerCase()
                        : "";

                const specialty =
                    specialtyElement
                        ? specialtyElement.innerText.toLowerCase()
                        : "";

                if (
                    teacherName.includes(filter) ||
                    specialty.includes(filter)
                ) {

                    card.style.display = "";
                    hasResults = true;

                } else {

                    card.style.display = "none";
                }
            });


            // No results message

            let noResults =
                document.getElementById("noResults");

            if (!hasResults && filter !== "") {

                if (!noResults) {

                    noResults =
                        document.createElement("div");

                    noResults.id = "noResults";

                    noResults.style.gridColumn = "1 / -1";
                    noResults.style.textAlign = "center";
                    noResults.style.padding = "20px";

                    noResults.innerHTML =
                        `<h3>🔍 No faculty found for "${filter}"</h3>`;

                    facultyGrid.appendChild(noResults);
                }

            } else {

                if (noResults) {
                    noResults.remove();
                }
            }
        });
    }


    // ==================================================
    // ASSIGNMENT SUBMISSION
    // ==================================================

    const assignmentForm =
        document.getElementById("assignmentForm");

    if (assignmentForm) {

        assignmentForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const subjectElement =
                document.getElementById("subjectSelect");

            const status =
                document.getElementById("uploadStatus");

            const subject =
                subjectElement
                    ? subjectElement.value
                    : "Assignment";

            if (status) {

                status.innerText =
                    "✅ " + subject + " Assignment Submitted!";

                status.style.color = "#27ae60";
                status.style.fontWeight = "bold";
                status.style.display = "block";
            }

            assignmentForm.reset();
        });
    }


    // ==================================================
    // FEEDBACK SUBMISSION
    // ==================================================

    const feedbackForm =
        document.getElementById("feedbackForm");

    if (feedbackForm) {

        feedbackForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const status =
                document.getElementById("feedbackStatus") ||
                document.getElementById("feedbackMessage");

            if (status) {

                status.innerText =
                    "✅ Feedback Submitted Successfully!";

                status.style.color = "#27ae60";
                status.style.backgroundColor = "#e8f5e9";
                status.style.padding = "10px";
                status.style.borderRadius = "8px";
                status.style.textAlign = "center";
                status.style.marginTop = "15px";
                status.style.display = "block";
            }

            feedbackForm.reset();
        });
    }


    // ==================================================
    // CAREER / PLACEMENT
    // ==================================================

    const placementForm =
        document.getElementById("placementForm");

    const confirmButton =
        document.querySelector(".confirm-btn");

    const placementElement =
        placementForm || confirmButton;

    if (
        placementElement &&
        !placementElement.dataset.listenerAdded
    ) {

        placementElement.dataset.listenerAdded = "true";

        placementElement.addEventListener("click", function (e) {

            e.preventDefault();

            showProfessionalModal(
                "Application Sent!",
                "Your technical profile has been submitted successfully.",
                "🚀"
            );
        });
    }


    // ==================================================
    // DARK MODE
    // ==================================================

    if (
        localStorage.getItem("uei-theme") === "dark"
    ) {

        document.body.classList.add("dark-mode");

        const themeButton =
            document.getElementById("tBtn");

        if (themeButton) {

            themeButton.innerText =
                "☀️ Light Mode";
        }
    }
});


// ======================================================
// STUDY MATERIAL FILTER
// ======================================================

function filterMaterials(category) {

    const cards =
        document.querySelectorAll(".material-card");

    const buttons =
        document.querySelectorAll(".filter-btn");


    // Update active button

    buttons.forEach(function (button) {

        button.classList.remove("active");

        const text =
            button.innerText.toLowerCase();

        if (
            category === "all" &&
            text.includes("all")
        ) {

            button.classList.add("active");

        } else if (
            text.includes(category)
        ) {

            button.classList.add("active");
        }
    });


    // Filter cards

    cards.forEach(function (card) {

        if (category === "all") {

            card.style.display = "block";

        } else {

            const cardCategory =
                card.getAttribute("data-category");

            if (cardCategory === category) {

                card.style.display = "block";

            } else {

                card.style.display = "none";
            }
        }
    });
}


// ======================================================
// TEACHER MESSAGE MODAL
// ======================================================

function openMessageModal(teacherName) {

    const modal =
        document.getElementById("messageModal");

    const modalName =
        document.getElementById("modalTeacherName");

    if (modal && modalName) {

        modalName.innerText = teacherName;

        modal.style.display = "block";
    }
}


// ======================================================
// CLOSE MESSAGE MODAL
// ======================================================

function closeMessageModal() {

    const modal =
        document.getElementById("messageModal");

    if (modal) {

        modal.style.display = "none";
    }
}


// Keep compatibility with existing HTML
function closeModal() {

    const messageModal =
        document.getElementById("messageModal");

    const customModal =
        document.getElementById("customModal");

    if (messageModal) {
        messageModal.style.display = "none";
    }

    if (customModal) {
        customModal.style.display = "none";
    }
}


// ======================================================
// SEND TEACHER MESSAGE
// ======================================================

function sendMessage() {

    const messageInput =
        document.getElementById("teacherMessage");

    const teacherElement =
        document.getElementById("modalTeacherName");

    const teacher =
        teacherElement
            ? teacherElement.innerText
            : "Teacher";


    if (
        !messageInput ||
        messageInput.value.trim() === ""
    ) {

        showToast(
            "Please type a message first!",
            "❌"
        );

        return;
    }


    closeMessageModal();

    showToast(
        `Message sent successfully to ${teacher}!`,
        "✅"
    );

    messageInput.value = "";
}


// ======================================================
// TOAST MESSAGE
// ======================================================

function showToast(text, icon) {

    const toast =
        document.getElementById("successToast");

    const toastText =
        document.getElementById("toastMessage");


    if (toast && toastText) {

        toastText.innerText =
            icon + " " + text;

        toast.className =
            "toast-notification show";


        setTimeout(function () {

            toast.className =
                "toast-notification";

        }, 3000);

    } else {

        alert(icon + " " + text);
    }
}


// ======================================================
// THEME TOGGLE
// ======================================================

function toggleTheme() {

    const body =
        document.body;

    const isDark =
        body.classList.toggle("dark-mode");


    // Save preference

    localStorage.setItem(
        "uei-theme",
        isDark ? "dark" : "light"
    );


    // Change button text

    const button =
        document.getElementById("tBtn");

    if (button) {

        button.innerText =
            isDark
                ? "☀️ Light Mode"
                : "🌙 Dark Mode";
    }
}


// ======================================================
// PROFESSIONAL MODAL
// ======================================================

function showProfessionalModal(
    title,
    message,
    icon = "🚀"
) {

    const modal =
        document.getElementById("customModal");


    if (modal) {

        const titleElement =
            document.getElementById("modalTitle");

        const messageElement =
            document.getElementById("modalMessage");

        const iconElement =
            document.getElementById("modalIcon");


        if (titleElement) {
            titleElement.innerText = title;
        }

        if (messageElement) {
            messageElement.innerText = message;
        }

        if (iconElement) {
            iconElement.innerText = icon;
        }


        modal.style.display = "flex";

    } else {

        alert(icon + " " + message);
    }
}