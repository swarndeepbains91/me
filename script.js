function validatePIN() {
    const correctPIN = "1234"; // Set your desired PIN here
    const enteredPIN = document.getElementById("pinInput").value;
    const errorMessage = document.getElementById("errorMessage");

    if (enteredPIN === correctPIN) {
        // Redirect to the protected page
        window.location.href = "main.html";
    } else {
        errorMessage.textContent = "Incorrect PIN. Please try again.";
    }
}
