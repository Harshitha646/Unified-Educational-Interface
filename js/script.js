// --- LOGIN FUNCTION ---
function loginCheck(event) {
    if (event) event.preventDefault(); 
    const loginUser = document.getElementById('loginUser');
    const usernameInput = loginUser ? loginUser.value : "";

    if (usernameInput.trim() !== "") {
        localStorage.setItem("studentName", usernameInput);
        window.location.href = "index.html"; 
    } else if (loginUser) {
        loginUser.placeholder = "Username Required!";
        loginUser.style.borderColor = "red";
    }
}

// --- LOGOUT FUNCTION ---
function logout() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("studentName");
        window.location.href = "login.html";
    }
}

// --- INITIALIZE ALL PAGES ---
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. PERSISTENT USER NAME DISPLAY
    const user = localStorage.getItem("studentName");
    // Looks for both common ID names used in your different pages
    const display = document.getElementById("studentNameDisplay") || document.getElementById("studentName");
    
    if (user && display) {
        display.innerText = "👤 " + user;
    }

    // 2. FACULTY SEARCH LOGIC (Teachers Portal)
    const searchInput = document.getElementById('searchInput');
    const facultyGrid = document.getElementById('facultyGrid');
    
    if (searchInput && facultyGrid) {
        searchInput.addEventListener('keyup', () => {
            const filter = searchInput.value.toLowerCase();
            const teacherCards = document.querySelectorAll('.teacher-card');
            let hasResults = false;

            teacherCards.forEach(card => {
                const teacherName = card.querySelector('h3').innerText.toLowerCase();
                const specialty = card.querySelector('.specialty').innerText.toLowerCase();
                
                if (teacherName.includes(filter) || specialty.includes(filter)) {
                    card.style.display = ""; 
                    hasResults = true;
                } else {
                    card.style.display = "none"; 
                }
            });

            // Toggle the "No Results" message
            let noResultsMsg = document.getElementById('noResults');
            if (!hasResults && filter !== "") {
                if (!noResultsMsg) {
                    const msg = document.createElement('div');
                    msg.id = 'noResults';
                    msg.style.gridColumn = "1 / -1";
                    msg.style.textAlign = "center";
                    msg.style.padding = "20px";
                    msg.innerHTML = `<h3>🔍 No faculty found for "${filter}"</h3>`;
                    facultyGrid.appendChild(msg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
    }

    // 3. ASSIGNMENT PORTAL SUBMISSION
    const assignmentForm = document.getElementById("assignmentForm");
    if (assignmentForm) {
        assignmentForm.addEventListener("submit", (e) => {
            e.preventDefault(); 
            const subject = document.getElementById("subjectSelect").value;
            const status = document.getElementById("uploadStatus");
            
            if (status) {
                status.innerText = "✅ " + subject + " Assignment Submitted!";
                status.style.color = "#27ae60";
                status.style.fontWeight = "bold";
                status.style.display = "block";
            }
            assignmentForm.reset(); 
        });
    }

    // 4. FEEDBACK PORTAL SUBMISSION
    const feedbackForm = document.getElementById("feedbackForm");
    if (feedbackForm) {
        feedbackForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const status = document.getElementById("feedbackStatus") || document.getElementById("feedbackMessage");
            if (status) {
                status.innerText = "✅ Feedback Submitted Successfully!";
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
});

// --- STUDY MATERIALS FILTERING ---
function filterMaterials(category) {
    const cards = document.querySelectorAll('.material-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update button visual state
    buttons.forEach(btn => {
        btn.classList.remove('active');
        // Check text content or data-filter attribute
        const btnText = btn.innerText.toLowerCase();
        if (category === 'all' && btnText.includes('all')) {
            btn.classList.add('active');
        } else if (btnText.includes(category)) {
            btn.classList.add('active');
        }
    });

    // Show or hide cards
    cards.forEach(card => {
        if (category === 'all') {
            card.style.display = "block";
        } else {
            const cardCategory = card.getAttribute('data-category');
            card.style.display = (cardCategory === category) ? "block" : "none";
        }
    });
}

// --- TEACHER MODAL & TOAST FUNCTIONS ---
function openMessageModal(teacherName) {
    const modal = document.getElementById('messageModal');
    const modalName = document.getElementById('modalTeacherName');
    if (modal && modalName) {
        modalName.innerText = teacherName;
        modal.style.display = "block";
    }
}

function closeModal() {
    const modal = document.getElementById('messageModal');
    if (modal) modal.style.display = "none";
}

function sendMessage() {
    const msgInput = document.getElementById('teacherMessage');
    const teacherElement = document.getElementById('modalTeacherName');
    const teacher = teacherElement ? teacherElement.innerText : "Teacher";

    if (!msgInput || msgInput.value.trim() === "") {
        showToast("Please type a message first!", "❌");
        return;
    }
    
    closeModal();
    showToast(`Message sent successfully to ${teacher}!`, "✅");
    msgInput.value = "";
}

function showToast(text, icon) {
    const toast = document.getElementById('successToast');
    const toastText = document.getElementById('toastMessage');
    
    if (toast && toastText) {
        toastText.innerText = icon + " " + text;
        toast.className = "toast-notification show"; 
        
        setTimeout(() => { 
            toast.className = "toast-notification"; 
        }, 3000);
    } else {
        // Fallback if toast elements aren't in HTML
        alert(icon + " " + text);
    }
}

// Global Theme Toggle Logic
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    
    // Save preference
    localStorage.setItem('uei-theme', isDark ? 'dark' : 'light');
    
    // Update button text if it exists
    const btn = document.getElementById('tBtn');
    if(btn) btn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Load preference on every page
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('uei-theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('tBtn');
        if(btn) btn.innerText = "☀️ Light Mode";
    }
});
// --- GLOBAL MODAL CONTROLLER ---
function showProfessionalModal(title, message, icon = "🚀") {
    const modal = document.getElementById('customModal');
    if (modal) {
        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalMessage').innerText = message;
        document.getElementById('modalIcon').innerText = icon;
        modal.style.display = 'flex';
    } else {
        alert(icon + " " + message);
    }
}

function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) modal.style.display = 'none';
}

// --- LOGIN FUNCTION ---
function loginCheck(event) {
    if (event) event.preventDefault(); 
    const loginUser = document.getElementById('loginUser');
    const usernameInput = loginUser ? loginUser.value : "";

    // Specific logic for your student 'harshi'
    if (usernameInput.trim().toLowerCase() === "harshi") {
        localStorage.setItem("studentName", "harshi");
        window.location.href = "index.html"; 
    } else if (loginUser) {
        loginUser.placeholder = "Invalid User!";
        loginUser.style.borderColor = "#ef4444";
    }
}

// --- INITIALIZE ALL PAGES ---
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Display Logged-in User
    const user = localStorage.getItem("studentName");
    const display = document.getElementById("studentNameDisplay") || document.getElementById("studentName");
    if (user && display) {
        display.innerText = "👤 " + user;
    }

    // 2. Assignment Form Logic
    const assignmentForm = document.getElementById("assignmentForm");
    if (assignmentForm) {
        assignmentForm.addEventListener("submit", (e) => {
            e.preventDefault(); 
            showProfessionalModal("Assignment Uploaded", "Your work has been submitted to the faculty.", "✅");
            assignmentForm.reset(); 
        });
    }

    // 3. Career Portal / Placement Logic
    const placementForm = document.getElementById("placementForm") || document.querySelector('.confirm-btn');
    if (placementForm && !placementForm.onclick) { // Only if not using inline onclick
        placementForm.addEventListener("click", (e) => {
            e.preventDefault();
            showProfessionalModal("Application Sent!", "Google has received your technical profile.", "🚀");
        });
    }
});

// --- LOGOUT ---
function logout() {
    if(confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("studentName");
        window.location.href = "login.html";
    }
}