// script.js - FIXED VERSION
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

// FIX: Use a different variable name or check if supabase already exists
// The CDN already creates a global 'supabase' object, so we need to use it differently

let currentUser = null;

// Initialize Supabase client - FIX: Check if supabase exists globally
if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Check your script tag order.');
} else {
    console.log('Supabase loaded successfully');
    // Create client using the global supabase object
    var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Alternative: If you prefer using const, you can do this:
// const { createClient } = supabase;
// const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

window.onload = function() {
    console.log('Page loaded, checking session...');
    checkSession();
};

function checkSession(){
    const saved = localStorage.getItem("student");
    if(saved){ 
        currentUser = saved; 
        loadUser(); 
    } else {
        console.log('No saved session found');
    }
}

// ---------------------------
// Register new user
// ---------------------------
async function register(){
    try {
        const name = document.getElementById("reg_name").value;
        const email = document.getElementById("reg_email").value;
        const pass = document.getElementById("reg_pass").value;
        const course = document.getElementById("reg_course").value;

        if(!name || !email || !pass || !course){ 
            alert("Fill all fields"); 
            return; 
        }

        if (pass.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        // Check if email exists
        const { data: existingUsers, error: checkError } = await supabaseClient
            .from("users")
            .select("email")
            .eq("email", email);

        if (checkError) {
            console.error('Error checking existing user:', checkError);
        }

        if (existingUsers && existingUsers.length > 0) {
            alert("Email already exists");
            return;
        }

        // Insert new user
        const { data, error } = await supabaseClient
            .from("users")
            .insert([{
                name,
                email,
                password: pass, // Note: In production, use Supabase Auth instead
                course,
                progress: 0,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        localStorage.setItem("student", email);
        currentUser = email;
        await loadUser();
        
        // Clear registration fields
        document.getElementById("reg_name").value = '';
        document.getElementById("reg_email").value = '';
        document.getElementById("reg_pass").value = '';
        document.getElementById("reg_course").value = '';
        
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + error.message);
    }
}

// ---------------------------
// Login existing user
// ---------------------------
async function login(){
    try {
        const email = document.getElementById("log_email").value;
        const pass = document.getElementById("log_pass").value;

        if (!email || !pass) {
            alert("Please enter email and password");
            return;
        }

        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("password", pass); // Note: In production, use Supabase Auth

        if (error) throw error;

        if (!data || data.length === 0) {
            alert("Invalid login credentials");
            return;
        }

        localStorage.setItem("student", email);
        currentUser = email;
        await loadUser();
        
        // Clear login fields
        document.getElementById("log_email").value = '';
        document.getElementById("log_pass").value = '';
        
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

// ---------------------------
// Logout
// ---------------------------
function logout(){
    localStorage.removeItem("student");
    currentUser = null;
    
    // Hide dashboard, show auth
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("auth").style.display = "grid";
    
    // Clear any fields
    document.getElementById("log_email").value = '';
    document.getElementById("log_pass").value = '';
}

// ---------------------------
// Load user dashboard
// ---------------------------
async function loadUser(){
    try {
        document.getElementById("auth").style.display = "none";
        
        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", currentUser);

        if (error) throw error;

        if (!data || data.length === 0) {
            alert("User not found");
            logout();
            return;
        }

        let user = data[0];
        openDashboard(user);
        
    } catch (error) {
        console.error('Error loading user:', error);
        alert('Failed to load user data');
        document.getElementById("auth").style.display = "grid";
    }
}

function openDashboard(user){
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcome").innerText = `Welcome ${user.name}`;
    document.getElementById("courseTitle").innerText = `Course: ${getCourseTitle(user.course)}`;
    loadNotes(user.course);
    loadProgress(user);
}

function getCourseTitle(course) {
    const titles = {
        forex: "Forex Trading",
        webdev: "Web Development",
        ai: "AI Automation",
        business: "Online Business"
    };
    return titles[course] || course;
}

// ---------------------------
// Load course-specific notes
// ---------------------------
function loadNotes(course){
    const notes = {
        forex: [
            { title: "Lesson 1: What is Forex", content: "Introduction to Forex trading, market hours, and currency pairs." },
            { title: "Lesson 2: Currency pairs", content: "Major, minor, and exotic currency pairs explained." },
            { title: "Lesson 3: Charts & Analysis", content: "Technical analysis, chart patterns, and indicators." },
            { title: "Lesson 4: Risk Management", content: "Position sizing, stop losses, and risk-reward ratios." }
        ],
        webdev: [
            { title: "Lesson 1: HTML Basics", content: "Structure of web pages, tags, and elements." },
            { title: "Lesson 2: CSS Styling", content: "Styling websites with colors, layouts, and animations." },
            { title: "Lesson 3: JavaScript Intro", content: "Variables, functions, and DOM manipulation." },
            { title: "Lesson 4: Responsive Design", content: "Mobile-first design and media queries." }
        ],
        ai: [
            { title: "Lesson 1: What is AI", content: "Introduction to Artificial Intelligence and Machine Learning." },
            { title: "Lesson 2: Automation Tools", content: "Popular AI tools and automation platforms." },
            { title: "Lesson 3: AI Applications", content: "Real-world AI applications in business." },
            { title: "Lesson 4: Building AI Agents", content: "Creating your first AI-powered automation." }
        ],
        business: [
            { title: "Lesson 1: Online income models", content: "Different ways to generate income online." },
            { title: "Lesson 2: Marketing Basics", content: "Digital marketing fundamentals and strategies." },
            { title: "Lesson 3: Scaling Strategies", content: "How to scale your online business." },
            { title: "Lesson 4: Automation & Systems", content: "Building systems for passive income." }
        ]
    };

    let container = document.getElementById("lessonsContainer");
    if (!container) return;
    
    container.innerHTML = "<h3>Course Lessons</h3>";
    
    const courseLessons = notes[course] || notes.webdev; // Default to webdev if course not found
    
    courseLessons.forEach((lesson, i) => {
        let div = document.createElement("div");
        div.className = "lesson-card";
        div.innerHTML = `
            <h4>${lesson.title}</h4>
            <p>${lesson.content}</p>
            <p class="lesson-status" id="lesson${i}">Not started</p>
        `;
        container.appendChild(div);
    });
}

// ---------------------------
// Complete a lesson
// ---------------------------
async function completeLesson(){
    try {
        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", currentUser);

        if (error) throw error;

        let user = data[0];
        let progress = user.progress || 0;
        
        // Calculate progress based on total lessons
        const totalLessons = 4; // We have 4 lessons per course
        progress += Math.round(100 / totalLessons);
        
        if(progress > 100) progress = 100;
        
        const { error: updateError } = await supabaseClient
            .from("users")
            .update({ progress })
            .eq("email", currentUser);

        if (updateError) throw updateError;

        // Update UI
        user.progress = progress;
        loadProgress(user);
        
        // Update lesson status
        const lessonIndex = Math.floor(progress / (100 / totalLessons)) - 1;
        if (lessonIndex >= 0) {
            const lessonElement = document.getElementById(`lesson${lessonIndex}`);
            if (lessonElement) {
                lessonElement.innerText = "Completed ✓";
                lessonElement.style.color = "green";
            }
        }
        
        alert('Lesson completed! Progress updated.');
        
    } catch (error) {
        console.error('Error completing lesson:', error);
        alert('Failed to complete lesson: ' + error.message);
    }
}

function loadProgress(user){
    let progress = user.progress || 0;
    let progressBar = document.getElementById("progressBar");
    if (progressBar) {
        progressBar.style.width = progress + "%";
        progressBar.innerText = progress + "%";
    }
}

// ---------------------------
// Payment submission
// ---------------------------
async function submitPayment(){
    try {
        let code = document.getElementById("mpesa").value;
        if(!code || code.trim() === ''){ 
            alert("Enter MPESA code"); 
            return; 
        }

        if (code.length < 5) {
            alert("Please enter a valid MPESA code");
            return;
        }

        const { data, error } = await supabaseClient
            .from("payments")
            .insert([{
                email: currentUser,
                code: code.trim(),
                status: "pending",
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        document.getElementById("paymentStatus").innerText = "Payment Submitted. Await admin approval.";
        document.getElementById("paymentStatus").style.color = "green";
        document.getElementById("mpesa").value = '';
        
        alert('Payment submitted successfully!');
        
    } catch (error) {
        console.error('Payment error:', error);
        alert('Failed to submit payment: ' + error.message);
    }
}

// Add some CSS for the lesson cards (you can add this to your style.css)
const style = document.createElement('style');
style.textContent = `
    .lesson-card {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
    }
    
    .lesson-card h4 {
        color: #667eea;
        margin-bottom: 0.5rem;
    }
    
    .lesson-status {
        font-weight: bold;
        margin-top: 0.5rem;
        color: #dc3545;
    }
    
    #progressBar {
        transition: width 0.3s ease;
        background: linear-gradient(90deg, #667eea, #764ba2);
        color: white;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        border-radius: 10px;
    }
`;
document.head.appendChild(style);
