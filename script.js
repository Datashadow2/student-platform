// -----------------------------
// Supabase Client (safe)
var SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

// Only create supabase client once
if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

var supabase = window.supabaseClient;

// -----------------------------
// Elements
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const dashboard = document.getElementById("dashboard");
const auth = document.getElementById("auth");
const username = document.getElementById("username");
const trialInfo = document.getElementById("trialInfo");
const lessonsDiv = document.getElementById("lessons");

let currentUser;

// -----------------------------
// Register
registerBtn.onclick = async () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Fill all fields");
        return;
    }

    const { data, error } = await supabase
        .from("users")
        .insert([{
            name: name,
            email: email,
            password: password,
            signup_date: new Date(),
            payment_status: "trial"
        }])
        .select()
        .single();

    if (error) {
        console.log(error);
        alert("Registration failed");
        return;
    }

    currentUser = data;
    showDashboard();
};

// -----------------------------
// Login
loginBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

    if (error) {
        console.log(error);
        alert("Login failed");
        return;
    }

    currentUser = data;
    showDashboard();
};

// -----------------------------
// Dashboard
function showDashboard() {
    auth.style.display = "none";
    dashboard.style.display = "block";

    username.textContent = currentUser.name;

    const signupDate = new Date(currentUser.signup_date);
    const now = new Date();
    const days = (now - signupDate) / (1000 * 60 * 60 * 24);

    lessonsDiv.innerHTML = "";

    if (days < 2) {
        trialInfo.textContent = "Free trial active";
        showLessons(false);
    } else {
        if (currentUser.payment_status === "paid") {
            trialInfo.textContent = "Payment verified";
            showLessons(true);
        } else {
            trialInfo.textContent = "Trial expired";
            lessonsDiv.innerHTML = `
                <h3>Pay 200 KSh</h3>
                <p>Send money to:</p>
                <h2>0798880808</h2>
                <p>Enter M-Pesa Code</p>
                <input id="mpesaCode" placeholder="Enter M-Pesa Code">
                <button onclick="submitPayment()">Submit</button>
            `;
        }
    }
}

// -----------------------------
// Payment
async function submitPayment() {
    const code = document.getElementById("mpesaCode").value;

    const { error } = await supabase
        .from("users")
        .update({ payment_status: "pending", mpesa_code: code })
        .eq("id", currentUser.id);

    if (error) {
        console.log(error);
        alert("Error submitting payment");
        return;
    }

    alert("Payment submitted for verification");
}

// -----------------------------
// Lessons
function showLessons(paid) {
    const lessons = [
        { title: "Forex Basics", type: "text" },
        { title: "Trading Psychology", type: "text" },
        { title: "Chart Analysis", type: "video", video: "dQw4w9WgXcQ" },
        { title: "Web Development Intro", type: "text" },
        { title: "HTML & CSS", type: "video", video: "UB1O30fR-EE" }
    ];

    lessons.forEach(l => {
        if (l.type === "video" && !paid) return;

        const div = document.createElement("div");

        if (l.type === "video") {
            div.innerHTML = `
                <h3>${l.title}</h3>
                <iframe width="100%" height="200"
                src="https://www.youtube.com/embed/${l.video}"
                frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            div.innerHTML = `<h3>${l.title}</h3><p>Trial notes available.</p>`;
        }

        lessonsDiv.appendChild(div);
    });
}
