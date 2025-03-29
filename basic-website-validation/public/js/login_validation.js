// Patterns used for validation
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email pattern

/* Script for client-side validation */

let isValid = true; // Flag used to confirm whether the form passes the validation checks or not.

const togglePassword = document.getElementById("toggleLoginPassword");

function togglePasswordVisibility(){
    const loginPassword = document.getElementById('password');
    if(loginPassword.value){
        if (loginPassword.type === "password") {
            loginPassword.type = "text";
            togglePassword.classList.add("fa-eye-slash");
            togglePassword.classList.remove("fa-eye");
        } else {
            loginPassword.type = "password";
            togglePassword.classList.add("fa-eye");
            togglePassword.classList.remove("fa-eye-slash");
        }
    }   
}

// Function to show error messages and to highlight the input field(in red)
function showError(field, message) {
    let errorDiv = document.getElementById(field + "-error");

    errorDiv.innerText = message; // Shows the error message below the input field
    errorDiv.classList.add("show-error");
}

// Function to remove error messages and red highlight in the input field
function removeError(field){
    let errorDiv = document.getElementById(field + "-error");

    errorDiv.innerText = ""; // Clear error if valid
    errorDiv.classList.remove("show-error");
}

// Function to check for valid email(with proper format) and email is not empty
function validateEmail(email){
    if (!email){
        showError("email", "Email is required.");return false;
    } else if(!emailPattern.test(email)){
        showError("email", "Enter a valid email address.");return false;
    } else {
        removeError("email");return true;
    }
}

// Function to check for valid Password(minimum 6 characters) and should not be empty
function validatePassword(password){
    if (!password){
        showError("password", "Password is required.");  return false;
    } else {
        removeError("password");  return true;
    }
}

function validateForm(e){
    e.preventDefault(); // Prevents form submission

    let emailVaild, passwordValid = true;

    // Input values
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();

    emailVaild = validateEmail(email);

    passwordValid = validatePassword(password);

    if(!emailVaild || !passwordValid ){
        isValid = false;
    }

    if (isValid){
        console.log('success');
        // clear previous error messages
        document.querySelectorAll('.error').forEach(el => el.innerText = '');
        document.getElementById("loginForm").submit();   // The form gets submitted to the server-side route "/login"
    }
}

// Input event (validation occurs while typing) to validate Email
document.getElementById("email").addEventListener("input", function() {
    let email = this.value.trim();
    if(!validateEmail(email)){
        isValid = false;
    }else{
        isValid = true;
    }
});

// Input and Blur events to validate Password and Confirm Password fields
document.getElementById("password").addEventListener("input", function() {
    let password = this.value.trim();
    if(!validatePassword(password)){
        isValid = false; // Sets the isValid to false
    }else{
        isValid = true;
    }
});

document.getElementById("password").addEventListener("blur", function() {
    let password = this.value.trim();
    if(!validatePassword(password)){
        isValid = false; // Sets the isValid to false
    }else{
        isValid = true;
    }
});