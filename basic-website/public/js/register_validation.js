const togglePassword = document.getElementById("toggleRegisterPassword");

function togglePasswordVisibility(){
    const registerPassword = document.getElementById('register_password');
    const registerCpassword = document.getElementById('register_cpassword');
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
    
    if(registerCpassword.value){
        if (registerCpassword.type === "password") {
            registerCpassword.type = "text";
            togglePassword.classList.add("fa-eye-slash");
            togglePassword.classList.remove("fa-eye");
        } else {
            registerCpassword.type = "password";
            togglePassword.classList.add("fa-eye");
            togglePassword.classList.remove("fa-eye-slash");
        }
    }  
}