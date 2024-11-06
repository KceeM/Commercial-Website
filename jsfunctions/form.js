document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');

    // patterns
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|icloud|yahoo|hotmail)\.com$/;
    const phonePattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // name
        if (!namePattern.test(nameInput.value)) {
            showError(nameInput, 'nameError');
            isValid = false;
        } else {
            hideError('nameError');
        }

        // email
        if (!emailPattern.test(emailInput.value)) {
            showError(emailInput, 'emailError');
            isValid = false;
        } else {
            hideError('emailError');
        }

        // phone no.
        if (!phonePattern.test(phoneInput.value)) {
            showError(phoneInput, 'phoneError');
            isValid = false;
        } else {
            hideError('phoneError');
        }

        // password
        if (!passwordPattern.test(passwordInput.value)) {
            showError(passwordInput, 'passwordError');
            isValid = false;
        } else {
            hideError('passwordError');
        }

        // for the length of the message
        if (messageInput.value.length > 250) {
            showError(messageInput, 'messageError');
            isValid = false;
        } else {
            hideError('messageError');
        }

        // If complete, show success message
        if (isValid) {
            successMessage.style.display = 'block';
            form.reset(); // reset option
        }
    });

    function showError(input, errorId) {
        document.getElementById(errorId).style.display = 'block';
        input.classList.add('error-border');
    }

    function hideError(errorId) {
        document.getElementById(errorId).style.display = 'none';
    }
});