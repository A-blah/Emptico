// 🔥 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDkm6ZuTo5w7185ql17uim_wOs1nc0UMV0",
    authDomain: "emptikko.firebaseapp.com",
    projectId: "emptikko",
};

function closeSearchDropdown() {
    // Do nothing for now
}


document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (email && password) {

        // Hide login
        document.getElementById('loginPage').style.display = "none";

        // Show dashboard
        document.getElementById('dashboard').style.display = "block";

        console.log("✅ Dashboard is now visible");

    } else {
        alert("Please enter valid credentials.");
    }
});
// ─── Page Navigation ─────────────────────────────────────────
const pageMap = {
    'overview': 'overviewPage',
    'bins': 'binsPage',
    'manual_bin': 'manual_binPage',
    'collections': 'collectionsPage',
    'routes': 'routesPage',
    'users': 'usersPage',
    'requests': 'requestsPage',
    'transactions': 'transactionsPage'
};
function showPage(pageName, navEl) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

    // Remove active from all menu items
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

    // Show target page
    const pageId = pageMap[pageName];
    if (pageId) {
        const page = document.getElementById(pageId);
        if (page) page.classList.remove('hidden');
    }

    // Mark nav item active
    if (navEl) {
        navEl.classList.add('active');
    }

    // Close search dropdown if open
    closeSearchDropdown();
}

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("🔥 Firebase Connected Successfully!");


// ─────────────────────────────────────────────
// 🚀 Collectors Live Listener
// ─────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {

    console.log("🚀 Starting collectors listener...");

    db.collection("collectors").onSnapshot(
        function (snapshot) {

            console.log("🔥 Snapshot triggered");
            console.log("📦 Collector count:", snapshot.size);

            // ✅ Update count
            const countEl = document.getElementById("stat-users-collectors");
            if (countEl) {
                countEl.textContent = snapshot.size;
            }

            // ✅ Update table
            const tbody = document.querySelector("#collectorsTable tbody");
            if (!tbody) return;

            tbody.innerHTML = "";

            if (snapshot.empty) {
                tbody.innerHTML =
                    '<tr><td colspan="4" style="text-align:center;color:#888">No collectors found</td></tr>';
                return;
            }

            snapshot.forEach(function (doc) {
                const data = doc.data();

                tbody.innerHTML += `
                    <tr>
                        <td>${data.name || "-"}</td>
                        <td>${data.email || "-"}</td>
                        <td>${data.phone || "-"}</td>
                        <td>${data.city || "-"}</td>
                    </tr>
                `;
            });

            console.log("✅ Collectors table updated");
        },
        function (error) {
            console.error("❌ Firestore error:", error);
        }
    );


    // ─────────────────────────────────────────────
// 👥 Total Users Live Count
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 👥 Load Users Table (Realtime)
// ─────────────────────────────────────────────

db.collection("users").onSnapshot(
    function (snapshot) {
         console.log("👥 Users count:", snapshot.size);

        const el = document.getElementById('stat-users-total');
        const el2 = document.getElementById('stat-overview-users');

        if (el) {
            el.innerHTML = snapshot.size;
        }
        if (el2) {
            el2.innerHTML = snapshot.size;
        }


        const tableBody = document.querySelector("#usersTable tbody");
        tableBody.innerHTML = ""; // Clear table before reloading

        snapshot.forEach(function (doc) {

            const data = doc.data();

            const name = data.name || "N/A";
            const email = data.email || "N/A";
            const role = data.role || "User";
            const plan = data.plan || "Free";
            const status = data.status || "Active";

            // Convert Firestore timestamp to readable date
            let joined = "N/A";
            if (data.createdAt) {
                joined = data.createdAt.toDate().toLocaleDateString();
            }

            const row = `
                <tr>
                    <td>${name}</td>
                    <td>${email}</td>
                    <td>${role}</td>
                    <td>${plan}</td>
                    <td>${status}</td>
                    <td>${joined}</td>
                    <td>
                        <button onclick="deleteUser('${doc.id}')">Delete</button>
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

        console.log("✅ Users table updated");

    },
    function (error) {
        console.error("❌ Users table error:", error);
    }
);
}
);