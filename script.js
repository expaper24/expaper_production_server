const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');


registerLink.onclick = () => {
    wrapper.classList.add('active');
}

loginLink.onclick = () => {
    wrapper.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePasswordLength(password) {
        return password.length >= 8;
    }

    function isUsernameExists(username) {
        // Replace this with your logic to check if the username already exists
        // For simplicity, I'm just checking if the username is 'existingUser'
        return username.toLowerCase() === 'existinguser';
    }

    function showError(message) {
        showNotificationModal(message);
    }

    function validateLoginForm() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (username.trim() === '' || password.trim() === '') {
            showError('Username and password are required. ');
            return false;
        }

        return true;
    }

    function validateRegisterForm() {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (username.trim() === '' || email.trim() === '' || password.trim() === '') {
            showError('All fields are required. ');
            return false;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address. ');
            return false;
        }

        if (!validatePasswordLength(password)) {
            showError('Password must be at least 8 characters long. ');
            return false;
        }

        if (isUsernameExists(username)) {
            showError('Username already exists. Please choose another one. ');
            return false;
        }

        return true;
    }

    loginForm.addEventListener('submit', function (e) {
        if (!validateLoginForm()) {
            e.preventDefault();
        }
    });

    registerForm.addEventListener('submit', function (e) {
        if (!validateRegisterForm()) {
            e.preventDefault();
        }
    });
});
