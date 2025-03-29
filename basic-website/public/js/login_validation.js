const togglePassword = document.getElementById("toggleLoginPassword");

function togglePasswordVisibility(){
    const loginPassword = document.getElementById('login_password');
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