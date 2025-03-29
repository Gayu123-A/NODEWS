// API endpoint where users are stored
const API_URL = "http://127.0.0.1:8001/api/users";

/**
 * Function to fetch users from the API and display them in the UI
 */
async function fetchUsers() {
    // Send a GET request to fetch all users from the server
    let response = await fetch(API_URL);

    // Convert the JSON response into a JavaScript object
    let users = await response.json();

    // Get the `<ul>` element where users will be listed
    let userList = document.getElementById('userList');

    // Clear the user list before appending new users to avoid duplicates
    userList.innerHTML = '';

    // Loop through each user in the response and create a list item (`<li>`)
    users.forEach(user => {
        let li = document.createElement('li');

        // Set the inner HTML of the list item with user details and action buttons
        li.innerHTML = `<div class="row">
                            <div class="col-md-8">${user.name} (${user.email})</div>
                            <div class="col-md-4">
                                <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
                                <button onclick="deleteUser(${user.id})">Delete</button>
                            </div>
                        </div>`;

        // Append the list item to the user list
        userList.appendChild(li);
    });
}

// Attach an event listener to the form submission event
document.getElementById('userForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior (page reload)

    // Get user input values from form fields
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const submitId = document.getElementById('submitId');

    // Request data
    const requestData = { name, email };

    if(userId){
        // Update user if ID exists
        updateUser(userId, requestData);
    }else{
        // Add new user if ID does not exists
        addUser(requestData);
    }

    // Reset form and update button text back to "Add User"
    document.getElementById('submitId').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = "";

    fetchUsers(); // Refresh the users list
});

async function addUser(requestData){
    try {
        // Send a POST request to add a new user to the API
        let response = await fetch(API_URL, {
            method: 'POST', // Specify HTTP method as POST (sending data)
            headers: { "Content-Type": "application/json" }, // Specify *content type* as JSON (i.e) *Tells the server, that the "request data send is in JSON format"*
            body: JSON.stringify(requestData) // Convert the user data into JSON format
        });

        // Convert the JSON response into a JavaScript object
        const newUser = await response.json();

        console.log("User added:", newUser); // Log the newly added user to the console

    } catch (error) {
        console.error("Error adding user:", error); // Log any errors that occur
    }
}

async function updateUser(userId, requestData){
    try {
        // Send a PUT request to update an existing user detail
        let response = await fetch(`${API_URL}/${userId}`, {
            method: 'PUT', // Specify HTTP method as PUT (sending data)
            headers: { "Content-Type": "application/json" }, // Specify *content type* as JSON (i.e) *Tells the server, that the "request data send is in JSON format"*
            body: JSON.stringify(requestData) // Convert the user data into JSON format
        });

        // Convert the JSON response into a JavaScript object
        const updatedUser = await response.json();

        console.log("User updated:", updatedUser); // Log the updated user detail to the console

    } catch (error) {
        console.error("Error updating user:", error); // Log any errors that occur
    }
}

// Function to populate the form for editing an existing user
function editUser(id, name, email){
    document.getElementById('userId').value = id;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;
    document.getElementById('submitId').textContent = 'Update User';    // Change button text to "Update User"
}

// Function to delete a user
async function deleteUser(id){

    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    fetchUsers(); // Refresh user list after deletion
}

// Fetch users when the page loads to display the user list
fetchUsers();
