// Login Form Validation and AJAX Request
// document.getElementById("loginForm").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const email = document.getElementById("loginEmail").value.trim();
//     const password = document.getElementById("loginPassword").value.trim();
//     const loginMessage = document.getElementById("loginMessage");

//     // Validate input fields
//     if (!email || !password) {
//         loginMessage.textContent = "Please fill in all fields.";
//         return;
//     }

//     // Login AJAX request
//     try {
//         const response = await fetch("http://localhost:3000/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         const result = await response.text();
//             console.log('Response status:', response.ok);
//             console.log('Response text:', result);

//             if (response.ok) {
//                 document.cookie = `userEmail=${encodeURIComponent(email)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=None; Secure`;

//                 loginMessage.textContent = "Logging in... Please wait.";

//                 // Loading effect before redirecting
//                 setTimeout(() => (window.location.href = "index.html"), 2000);
//             } else {
//                 loginMessage.textContent = result;
//             }

//     } catch (error) {
//         loginMessage.textContent = "Error: Could not log in. Please try again later.";
//     }
    
// });




document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const loginMessage = document.getElementById("loginMessage");

    if (!email || !password) {
        loginMessage.textContent = "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const result = await response.json();
            
            // Save name and email to cookies
            document.cookie = `userName=${encodeURIComponent(result.name)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=None; Secure`;
            document.cookie = `userEmail=${encodeURIComponent(result.email)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=None; Secure`;

            loginMessage.textContent = "Logging in... Please wait.";

            setTimeout(() => (window.location.href = "profile.html"), 2000);
        } else {
            const errorText = await response.text();
            loginMessage.textContent = errorText;
        }
    } catch (error) {
        loginMessage.textContent = "Error: Could not log in. Please try again later.";
    }
});





// Registration Form Validation and AJAX Request


document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("message");

    // Form Validation
    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters long.";
        return;
    }
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    // Registration AJAX request
    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.text();
        if (response.ok) {
            message.textContent = "Registration successful!";
            setTimeout(() => (window.location.href = "login.html"), 2000);
        } else {
            message.textContent = result;
        }
    } catch (error) {
        message.textContent = "Error: Could not register.";
    }
});








