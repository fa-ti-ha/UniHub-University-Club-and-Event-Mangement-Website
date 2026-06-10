function showMessage() {
    alert("Welcome to UniHub! Sprint 2 authentication is ready.");
}

const BASE_URL = "http://localhost/unihub/backend/api";

document.addEventListener("DOMContentLoaded", function () {
    const clubsContainer = document.getElementById("clubsContainer");
    const eventsContainer = document.getElementById("eventsContainer");
    const loginForm = document.getElementById("loginForm");
    const profileForm = document.getElementById("profileForm");
    const logoutLink = document.getElementById("logoutLink");

    if (clubsContainer) {
        loadClubs();
    }

    if (eventsContainer) {
        loadEvents();
    }

    if (loginForm) {
        handleLogin();
    }

    if (profileForm) {
        loadProfile();
        handleProfileUpdate();
    }

    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            logoutUser();
        });
    }
});

function loadClubs() {
    const clubsContainer = document.getElementById("clubsContainer");

    fetch(`${BASE_URL}/clubs.php`)
        .then(response => response.json())
        .then(result => {
            clubsContainer.innerHTML = "";

            if (!result.status || result.data.length === 0) {
                clubsContainer.innerHTML = "<p>No clubs found.</p>";
                return;
            }

            result.data.forEach(club => {
                const clubCard = document.createElement("div");
                clubCard.className = "card";

                clubCard.innerHTML = `
                    <h3>${club.club_name}</h3>
                    <p>${club.description}</p>
                    <p><strong>Category:</strong> ${club.category}</p>
                `;

                clubsContainer.appendChild(clubCard);
            });
        })
        .catch(error => {
            clubsContainer.innerHTML = `
                <p class="error">Failed to load clubs. Please check backend server.</p>
            `;
            console.error("Club loading error:", error);
        });
}

function loadEvents() {
    const eventsContainer = document.getElementById("eventsContainer");

    fetch(`${BASE_URL}/events.php`)
        .then(response => response.json())
        .then(result => {
            eventsContainer.innerHTML = "";

            if (!result.status || result.data.length === 0) {
                eventsContainer.innerHTML = "<p>No events found.</p>";
                return;
            }

            result.data.forEach(event => {
                const eventCard = document.createElement("div");
                eventCard.className = "card";

                eventCard.innerHTML = `
                    <h3>${event.event_title}</h3>
                    <p>${event.event_description}</p>
                    <p><strong>Club:</strong> ${event.club_name ?? "General"}</p>
                    <p><strong>Date:</strong> ${event.event_date}</p>
                    <p><strong>Time:</strong> ${event.event_time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                `;

                eventsContainer.appendChild(eventCard);
            });
        })
        .catch(error => {
            eventsContainer.innerHTML = `
                <p class="error">Failed to load events. Please check backend server.</p>
            `;
            console.error("Event loading error:", error);
        });
}

function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        loginMessage.textContent = "Logging in...";
        loginMessage.className = "form-message";

        fetch(`${BASE_URL}/login.php`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(response => response.json())
            .then(result => {
                loginMessage.textContent = result.message;

                if (!result.status) {
                    loginMessage.className = "form-message error";
                    return;
                }

                localStorage.setItem("unihub_user", JSON.stringify(result.data.user));
                loginMessage.className = "form-message success";

                setTimeout(function () {
                    window.location.href = "profile.html";
                }, 800);
            })
            .catch(error => {
                loginMessage.textContent = "Login failed. Please check backend server.";
                loginMessage.className = "form-message error";
                console.error("Login error:", error);
            });
    });
}

function loadProfile() {
    const profileMessage = document.getElementById("profileMessage");

    profileMessage.textContent = "Loading profile...";
    profileMessage.className = "form-message";

    fetch(`${BASE_URL}/profile.php`, {
        method: "GET",
        credentials: "include"
    })
        .then(response => response.json())
        .then(result => {
            if (!result.status) {
                profileMessage.textContent = result.message;
                profileMessage.className = "form-message error";

                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1000);

                return;
            }

            document.getElementById("profileName").value = result.data.full_name ?? "";
            document.getElementById("profileEmail").value = result.data.email ?? "";
            document.getElementById("profileRole").value = result.data.role ?? "";
            document.getElementById("profilePhone").value = result.data.phone ?? "";
            document.getElementById("profileDepartment").value = result.data.department ?? "";
            document.getElementById("profileBio").value = result.data.bio ?? "";

            profileMessage.textContent = "Profile loaded successfully.";
            profileMessage.className = "form-message success";
        })
        .catch(error => {
            profileMessage.textContent = "Failed to load profile. Please check backend server.";
            profileMessage.className = "form-message error";
            console.error("Profile loading error:", error);
        });
}

function handleProfileUpdate() {
    const profileForm = document.getElementById("profileForm");
    const profileMessage = document.getElementById("profileMessage");

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("profileName").value.trim();
        const phone = document.getElementById("profilePhone").value.trim();
        const department = document.getElementById("profileDepartment").value.trim();
        const bio = document.getElementById("profileBio").value.trim();

        profileMessage.textContent = "Updating profile...";
        profileMessage.className = "form-message";

        fetch(`${BASE_URL}/profile.php`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name: fullName,
                phone: phone,
                department: department,
                bio: bio
            })
        })
            .then(response => response.json())
            .then(result => {
                profileMessage.textContent = result.message;
                profileMessage.className = result.status ? "form-message success" : "form-message error";
            })
            .catch(error => {
                profileMessage.textContent = "Profile update failed. Please check backend server.";
                profileMessage.className = "form-message error";
                console.error("Profile update error:", error);
            });
    });
}

function logoutUser() {
    fetch(`${BASE_URL}/logout.php`, {
        method: "POST",
        credentials: "include"
    })
        .then(response => response.json())
        .then(result => {
            localStorage.removeItem("unihub_user");
            alert(result.message);
            window.location.href = "login.html";
        })
        .catch(error => {
            console.error("Logout error:", error);
        });
}