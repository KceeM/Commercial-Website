document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');
    const checkboxes = document.querySelectorAll('input[name="updates"]');
    const checkboxError = document.getElementById('checkboxError');

    // patterns
    const namePattern = /^[a-zA-Z\s]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|icloud|yahoo|hotmail)\.com$/;
    const phonePattern = /^\d{10}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // name validation
        if (!namePattern.test(nameInput.value)) {
            showError(nameInput, 'nameError');
            isValid = false;
        } else {
            hideError('nameError');
        }

        // email validation
        if (!emailPattern.test(emailInput.value)) {
            showError(emailInput, 'emailError');
            isValid = false;
        } else {
            hideError('emailError');
        }

        // phone no. validation
        if (!phonePattern.test(phoneInput.value)) {
            showError(phoneInput, 'phoneError');
            isValid = false;
        } else {
            hideError('phoneError');
        }

        // password validation
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

        // Checkbox validation & it ensures at least one is checked
        let isCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
        if (!isCheckboxChecked) {
            showError(null, 'checkboxError');
            isValid = false;
        } else {
            hideError('checkboxError');
        }

        // If complete, show success message
        if (isValid) {
            successMessage.style.display = 'block';
            form.reset(); // reset option
        }
    });

    function showError(input, errorId) {
        if (input) {
            input.classList.add('error-border');
        }
        document.getElementById(errorId).style.display = 'block';
    }

    function hideError(errorId) {
        document.getElementById(errorId).style.display = 'none';
    }
});