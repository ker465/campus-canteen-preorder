// ========================
// SIGNUP
// ========================
function handleSignup(name, email, password) {
    const existingUser = JSON.parse(localStorage.getItem("user"));

    // Block creating a second account
    if (existingUser) {
        showToast("An account already exists. Please log in.", false);
        setTimeout(() => window.location.href = "login.html", 1800);
        return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    showToast("Account created! Please log in.");
    setTimeout(() => window.location.href = "login.html", 1800);
}


// ========================
// LOGIN
// ========================
function handleLogin(email, password) {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
        showToast("No account found. Please sign up first.", false);
        return;
    }

    if (email === storedUser.email && password === storedUser.password) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", storedUser.name);
        showToast("Welcome back, " + storedUser.name + "! 🎉");
        setTimeout(() => window.location.href = "choose.html", 1500);
    } else {
        showToast("Incorrect email or password.", false);

        // Shake the fields to indicate error
        ["email", "password"].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add("error");
                el.animate([
                    { transform: "translateX(0)" },
                    { transform: "translateX(-6px)" },
                    { transform: "translateX(6px)" },
                    { transform: "translateX(-4px)" },
                    { transform: "translateX(4px)" },
                    { transform: "translateX(0)" }
                ], { duration: 320, easing: "ease-in-out" });
            }
        });
    }
}


// ========================
// LOGOUT
// ========================
function logout() {
    // Only clears the session — account stays in localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("selectedCanteen");
    window.location.href = "login.html";
}