const API_URL = "https://crud-test-hqdn.onrender.com";

const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const usersList = document.getElementById("usersList");


// GET USERS
async function loadUsers() {
    const response = await fetch(API_URL);
    const users = await response.json();

    usersList.innerHTML = "";

    users.forEach(user => {
        const div = document.createElement("div");

        div.className = "user";

        div.innerHTML = `
            <strong>${user.name}</strong>
            <p>${user.email}</p>

            <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">
                Edit
            </button>

            <button onclick="deleteUser(${user.id})">
                Delete
            </button>
        `;

        usersList.appendChild(div);
    });
}


// CREATE USER
userForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = nameInput.value;
    const email = emailInput.value;

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email
        })
    });

    nameInput.value = "";
    emailInput.value = "";

    loadUsers();
});


// DELETE USER
async function deleteUser(id) {
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    loadUsers();
}


// EDIT USER
async function editUser(id, oldName, oldEmail) {
    const name = prompt("Enter new name:", oldName);
    const email = prompt("Enter new email:", oldEmail);

    if (!name || !email) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email
        })
    });

    loadUsers();
}


// LOAD USERS WHEN PAGE OPENS
loadUsers();
