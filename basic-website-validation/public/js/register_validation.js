// Patterns used for validation
const namePattern = /^[A-Za-z\s]*$/; // Allows only letters and spaces
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email pattern
const phonePattern = /^\d+$/; // Only digits allowed
const countryPhonePatterns = {
    "+1": /^\d{10}$/, // USA - 10 digits
    "+91": /^\d{10}$/, // India - 10 digits
    "+44": /^\d{10}$/, // UK - 10 digits
    "+61": /^\d{9}$/,  // Australia - 9 digits
    "+81": /^\d{10}$/, // Japan - 10 digits
};

/* Script for client-side validation */

let isValid = true; // Flag used to confirm whether the form passes the validation checks or not.

function togglePasswordVisibility(){
    const togglePassword = document.getElementById("toggleRegisterPassword");
    const registerPassword = document.getElementById('password');
    if(registerPassword.value){
        if (registerPassword.type === "password") {
            registerPassword.type = "text";
            togglePassword.classList.add("fa-eye-slash");
            togglePassword.classList.remove("fa-eye");
        } else {
            registerPassword.type = "password";
            togglePassword.classList.add("fa-eye");
            togglePassword.classList.remove("fa-eye-slash");
        }
    }    
}

function toggleCpasswordVisibility(){
    const toggleRegisterCpassword = document.getElementById("toggleRegisterCpassword");
    const registerCpassword = document.getElementById('confirmPassword');
    
    if(registerCpassword.value){
        if (registerCpassword.type === "password") {
            registerCpassword.type = "text";
            toggleRegisterCpassword.classList.add("fa-eye-slash");
            toggleRegisterCpassword.classList.remove("fa-eye");
        } else {
            registerCpassword.type = "password";
            toggleRegisterCpassword.classList.add("fa-eye");
            toggleRegisterCpassword.classList.remove("fa-eye-slash");
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

// Function to check for valid name(must not contain numbers) and name is not empty
function validateName(name){
    if (!name){
        showError("name", "Name is required.");return false;
    } else if(!namePattern.test(name)){
        showError("name", "Name must not contain numbers.");return false;
    } else {
        removeError("name");return true;
    }
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

// Function to check for valid age(only digits, must be between 18 and 100) and age is not empty
function validateAge(age){
    if (!age){
        showError("age", "Age is required."); return false;
    } else if(isNaN(age)){
        showError("age", "Age must contain only digits.");  return false;
    } else if(parseInt(age) < 18 || parseInt(age) > 100){
        showError("age", "Age must be between 18 and 100.");  return false;
    } else {
        removeError("email");  return true;
    }
}

// Function to check for valid Phone Number(only digits and match the selected country code) and should not be empty
function validatePhone(phone, countryCode){
    if (!phone){
        showError("phone", "Phone Number is required."); return false;
    } else if(!phonePattern.test(phone)){
        showError("phone", "Phone Number must contain only digits."); return false;
    } else if(!countryPhonePatterns[countryCode].test(phone)){
        showError("phone", "Phone Number does not match the selected country code."); return false;
    }else {
        removeError("phone"); return true;
    }
}

// Function to check for valid address(not empty)
function validateAddress(address){
    if (!address){ 
        showError("address", "Address is required.");  return false;
    } else { 
        removeError("address");  return true;
    }
}

// Password Strength Indicator
function passwordStrength(password){
    let strength = {lower: 0, upper: 0, numbers: 0, symbols: 0 };
    const strengthMeter = document.getElementById('password-strength');

    if(password.match(/[a-z]/)) strength.lower++; // Lowercase
    if(password.match(/[A-Z]/)) strength.upper++; // Uppercase
    if(password.match(/[0-9]/)) strength.numbers++; // Numbers
    if(password.match(/^[a-zA-Z0-9]/)) strength.symbols++; // Special Characters
    const score = Object.values(strength).reduce((acc, strength) => acc + strength, 0);
    
    if (score <= 2) {
        strengthMeter.innerText = 'Weak';
        if(strengthMeter.classList.contains('medium')) strengthMeter.classList.remove('medium');
        if(strengthMeter.classList.contains('strong')) strengthMeter.classList.remove('strong');
        strengthMeter.classList.add('weak');
    } else if (score === 3) {
        strengthMeter.innerText = 'Medium';
        if(strengthMeter.classList.contains('weak')) strengthMeter.classList.remove('weak');
        if(strengthMeter.classList.contains('strong')) strengthMeter.classList.remove('strong');
        strengthMeter.classList.add('medium');
    } else if (score >= 4) {
        strengthMeter.innerText = 'Strong';
        if(strengthMeter.classList.contains('weak')) strengthMeter.classList.remove('weak');
        if(strengthMeter.classList.contains('medium')) strengthMeter.classList.remove('medium');
        strengthMeter.classList.add('strong');
    }
    return password.length;
}

// Function to check for valid Password(minimum 6 characters) and should not be empty
function validatePassword(password){
    if (!password){
        showError("password", "Password is required.");  return false;
    } else if(!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)){
        showError("password", "Password must contain letters(uppercase and lowercase), numbers, and symbols.");  return false;
    } else if(passwordStrength(password) < 6){
        showError("password", "Only 6 characters allowed.");  return false;
    }else {
        removeError("password");  return true;
    }
}

// Function to check for confirm Password(must match with Password) and should not be empty
function validateConfirmPassword(password, confirmpassword){
    if(password !== '' && confirmpassword !== '' && password !== confirmpassword){
        showError("confirmPassword", "Passwords do not match.");  return false;
        } else {
            removeError("confirmPassword");  return true;
        }
}

// Function to validate the user inputs on clicking the "Submit" button.
function validateForm(e){
    e.preventDefault(); // Prevents form submission

    let nameVaild, emailVaild, ageVaild, phoneVaild, addressVaild, passwordValid, confirmPasswordValid = true;

    // Input values
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let confirmPassword = document.getElementById('confirmPassword').value.trim();
    let age = document.getElementById('age').value.trim();
    let countryCode = document.getElementById('countryCode').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let address = document.getElementById('address').value.trim();

    nameVaild = validateName(name);

    emailVaild = validateEmail(email);

    passwordValid = validatePassword(password);

    confirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    ageVaild = validateAge(age);

    phoneVaild = validatePhone(phone, countryCode);

    addressVaild = validateAddress(address);

    if(!nameVaild || !emailVaild || !ageVaild || !phoneVaild || !addressVaild || !passwordValid || !confirmPasswordValid){
        isValid = false;
    }

    console.log(isValid);
    if (isValid){
        console.log('success');
        // clear previous error messages
        document.querySelectorAll('.error').forEach(el => el.innerText = '');
        document.getElementById("registerForm").submit();   // The form gets submitted to the server-side route "/register"
    }
}

// Input event (validation occurs while typing) to validate Name
document.getElementById("name").addEventListener("input", function() {
    let name = this.value.trim();
    if(!validateName(name)){
        isValid = false; // Sets the isValid to false
    }else{
        isValid = true;
    }
});

// Input event (validation occurs while typing) to validate Email
document.getElementById("email").addEventListener("input", function() {
    let email = this.value.trim();
    if(!validateEmail(email)){
        isValid = false;
    }else{
        isValid = true;
    }
});

// Input event to validate Age
document.getElementById("age").addEventListener("input", function() {
    let age = this.value.trim();

    // If the Age field has some value in it, please remove the already showing error message
    if(age){
        removeError("age"); return true;
    }

    // And, do validation again.
    if (!age){
        showError("age", "Age is required."); return false;
    } else if(isNaN(age)){
        showError("age", "Age must contain only digits."); return false;
    }
});

// The blur event to validate the entire value(age) when the user moves out of the input field.
document.getElementById("age").addEventListener("blur", function() {
    let age = this.value.trim();
    if(!validateAge(age)){
        isValid = false; // Sets the isValid to false
    }else{
        isValid = true;
    }
});

// Input event to validate Phone Number and it's country code
document.getElementById("phone").addEventListener("input", function() {
    let phone = this.value.trim();
    let countryCode = document.getElementById('countryCode').value.trim();
    if(!validatePhone(phone, countryCode)){
        isValid = false; // Sets the isValid to false
    }else{
        isValid = true;
    }
});

// Input event to validate Address
document.getElementById("address").addEventListener("input", function() {
    let address = this.value.trim();
    if(!validateAddress(address)){
        isValid = false; // Sets the isValid to false
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

document.getElementById("confirmPassword").addEventListener("input", function() {
    let confirmPassword = this.value.trim();
    let password = document.getElementById('password').value.trim();
    if(!validateConfirmPassword(password, confirmPassword)){
        isValid = false; // Sets the isValid to false
    }else{
        isValid = true;
    }
});

document.getElementById("confirmPassword").addEventListener("blur", function() {
    let confirmPassword = this.value.trim();
    let password = document.getElementById('password').value.trim();
    if(!validateConfirmPassword(password, confirmPassword)){
        isValid = false; // Sets the isValid to false
    }else{
        isValid = true;
    }
});