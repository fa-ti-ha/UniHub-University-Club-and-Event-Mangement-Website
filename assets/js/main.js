function showMessage() {
    alert("Welcome to UniHub! Sprint 1 project foundation is ready.");
}

const BASE_URL = "http://localhost/unihub/backend/api";

document.addEventListener("DOMContentLoaded", function () {
    loadClubs();
    loadEvents();
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