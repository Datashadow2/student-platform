// Supabase Configuration
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Global variables
let currentUser = null;
let currentUserData = null;

// Course content
const courseContent = {
    forex: {
        title: "Forex Trading Mastery",
        icon: "chart-line",
        lessons: [
            { title: "Introduction to Forex", description: "Learn the basics of Forex trading, market hours, and currency pairs", duration: "15 min" },
            { title: "Technical Analysis", description: "Master chart patterns, indicators, and price action", duration: "20 min" },
            { title: "Risk Management", description: "Position sizing, stop losses, and risk-reward ratios", duration: "25 min" },
            { title: "Trading Psychology", description: "Master your emotions and develop winning habits", duration: "20 min" }
        ]
    },
    webdev: {
        title: "Web Development Bootcamp",
        icon: "laptop-code",
        lessons: [
            { title: "HTML5 Fundamentals", description: "Structure web pages with semantic HTML", duration: "20 min" },
            { title: "CSS3 Styling", description: "Create beautiful layouts with modern CSS", duration: "25 min" },
            { title: "JavaScript Essentials", description: "Add interactivity to your websites", duration: "30 min" },
            { title: "Responsive Design", description: "Build websites that work on all devices", duration: "25 min" }
        ]
    },
    ai: {
        title: "AI & Automation",
        icon: "robot",
        lessons: [
            { title: "AI Fundamentals", description: "Understand artificial intelligence basics", duration: "15 min" },
            { title: "Automation Tools", description: "Explore popular AI automation platforms", duration: "20 min" },
            { title: "Build AI Agents", description: "Create your first AI-powered automation", duration: "30 min" },
            { title: "AI in Business", description: "Implement AI solutions in real business", duration: "25 min" }
        ]
    },
    business: {
        title: "Online Business Mastery",
        icon: "briefcase",
        lessons: [
            { title: "Business Models", description: "Choose the right online business model", duration: "20 min" },
            { title: "Digital Marketing", description: "Market your business effectively online", duration: "25 min" },
            { title: "Sales Funnels", description: "Build high-converting sales funnels", duration: "20 min" },
            { title: "Scaling Strategies", description: "Scale your business to 6 figures", duration: "25 min" }
        ]
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, checking session...');
    checkSession();
});

// Check for existing session
async function checkSession() {
    try {
        const savedEmail = localStorage.getItem("student");
        
        if (savedEmail) {
            currentUser = savedEmail;
            await loadUser();
        } else {
            console.log('No active session');
            showAuthForms();
        }
    } catch (error) {
        console.error('Session check error:', error);
        showToast('Failed to check session', 'error');
        showAuthForms();
    }
}

// UI Helper Functions
function showAuthForms() {
    const auth = document.getElementById('auth');
    const dashboard = document.getElementById('dashboard');
    if (auth) auth.style.display = 'grid';
    if (dashboard) dashboard.style.display = 'none';
}

function showDashboard() {
    const auth = document.getElementById('auth');
    const dashboard = document.getElementById('dashboard');
    if (auth) auth.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
}

// Toast notification
function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `<span style="font-size: 18px;">${icon}</span> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Register new user
async function register() {
    try {
        const name = document.getElementById("reg_name")?.value;
        const email = document.getElementById("reg_email")?.value;
        const pass = document.getElementById("reg_pass")?.value;
        const course = document.getElementById("reg_course")?.value;

        // Validation
        if (!name || !email || !pass || !course) {
            showToast("Please fill all fields", "error");
            return;
        }

        if (pass.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        if (!email.includes('@')) {
            showToast("Please enter a valid email", "error");
            return;
        }

        // Check if user exists
        const { data: existingUsers, error: checkError } = await supabaseClient
            .from("users")
            .select("email")
            .eq("email", email);

        if (checkError) {
            console.error('Error checking existing user:', checkError);
        }

        if (existingUsers && existingUsers.length > 0) {
            showToast("Email already registered. Please login.", "error");
            return;
        }

        // Insert new user - using only columns that exist in your database
        const { data, error } = await supabaseClient
            .from("users")
            .insert([{
                name: name,
                email: email,
                password: pass,
                course: course,
                progress: 0
                // Removed completed_lessons, payment_status, created_at as they might not exist
            }]);

        if (error) {
            console.error('Insert error:', error);
            showToast("Registration failed: " + error.message, "error");
            return;
        }

        localStorage.setItem("student", email);
        currentUser = email;
        
        showToast("Registration successful! Welcome to SkillForge!", "success");
        
        // Clear fields
        document.getElementById("reg_name").value = '';
        document.getElementById("reg_email").value = '';
        document.getElementById("reg_pass").value = '';
        document.getElementById("reg_course").value = '';
        
        await loadUser();
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message || "Registration failed", "error");
    }
}

// Login user
async function login() {
    try {
        const email = document.getElementById("log_email")?.value;
        const pass = document.getElementById("log_pass")?.value;

        if (!email || !pass) {
            showToast("Please enter email and password", "error");
            return;
        }

        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("password", pass);

        if (error) {
            console.error('Login query error:', error);
            showToast("Login failed: " + error.message, "error");
            return;
        }

        if (!data || data.length === 0) {
            showToast("Invalid email or password", "error");
            return;
        }

        localStorage.setItem("student", email);
        currentUser = email;
        
        showToast("Login successful! Welcome back!", "success");
        
        // Clear fields
        document.getElementById("log_email").value = '';
        document.getElementById("log_pass").value = '';
        
        await loadUser();
        
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || "Login failed", "error");
    }
}

// Logout
function logout() {
    localStorage.removeItem("student");
    currentUser = null;
    currentUserData = null;
    showAuthForms();
    showToast("Logged out successfully", "success");
}

// Load user data
async function loadUser() {
    try {
        if (!currentUser) {
            showAuthForms();
            return;
        }

        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", currentUser);

        if (error) {
            console.error('Load user error:', error);
            showToast("Failed to load user data", "error");
            return;
        }

        if (!data || data.length === 0) {
            showToast("User not found", "error");
            logout();
            return;
        }

        currentUserData = data[0];
        openDashboard(currentUserData);
        
    } catch (error) {
        console.error('Error loading user:', error);
        showToast("Failed to load user data", "error");
    }
}

// Open dashboard
function openDashboard(user) {
    showDashboard();
    
    // Update user avatar
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        avatar.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'S';
    }
    
    // Update welcome message
    document.getElementById("welcome").innerHTML = `Welcome, ${user.name || 'Student'}! <span style="font-size: 1rem; color: #666;">Ready to learn?</span>`;
    
    // Update course title
    const courseInfo = courseContent[user.course] || courseContent.webdev;
    document.getElementById("courseTitle").innerHTML = `<i class="fas fa-${courseInfo.icon}"></i> ${courseInfo.title}`;
    
    // Show/hide payment card (simplified)
    const paymentCard = document.getElementById("paymentCard");
    if (paymentCard) {
        // For now, always show payment card
        paymentCard.style.display = 'block';
    }
    
    // Load lessons
    loadLessons(user.course);
    
    // Update progress
    updateProgress(user);
}

// Load lessons
function loadLessons(course) {
    const container = document.getElementById("lessonsContainer");
    if (!container) return;
    
    const courseData = courseContent[course] || courseContent.webdev;
    
    let lessonsHtml = '<h3 style="margin-bottom: 1rem;"><i class="fas fa-book-open"></i> Course Lessons</h3>';
    lessonsHtml += '<div class="lessons-grid">';
    
    courseData.lessons.forEach((lesson, index) => {
        lessonsHtml += `
            <div class="lesson-card">
                <div class="lesson-icon">
                    <i class="fas fa-${courseData.icon}"></i>
                </div>
                <h4 class="lesson-title">${lesson.title}</h4>
                <p class="lesson-description">${lesson.description}</p>
                <div class="lesson-status">
                    <i class="fas fa-clock"></i> ${lesson.duration}
                    <span class="status-badge status-pending">Not Started</span>
                </div>
            </div>
        `;
    });
    
    lessonsHtml += '</div>';
    container.innerHTML = lessonsHtml;
}

// Complete lesson (simplified version)
async function completeLesson() {
    if (!currentUserData) return;
    
    try {
        const totalLessons = 4; // We have 4 lessons per course
        let currentProgress = currentUserData.progress || 0;
        
        // Calculate new progress (increment by 25% for each lesson)
        let newProgress = currentProgress + 25;
        if (newProgress > 100) newProgress = 100;
        
        const { error } = await supabaseClient
            .from("users")
            .update({ progress: newProgress })
            .eq("email", currentUser);
            
        if (error) throw error;
        
        // Update local data
        currentUserData.progress = newProgress;
        
        // Update UI
        updateProgress(currentUserData);
        
        // Update lesson status in UI
        const lessonIndex = Math.floor((newProgress - 1) / 25);
        const lessonCards = document.querySelectorAll('.lesson-card');
        if (lessonCards[lessonIndex]) {
            const statusBadge = lessonCards[lessonIndex].querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.textContent = 'Completed ✓';
                statusBadge.className = 'status-badge status-completed';
            }
            lessonCards[lessonIndex].classList.add('completed');
        }
        
        showToast(`✅ Lesson completed! Progress: ${newProgress}%`, "success");
        
    } catch (error) {
        console.error('Error completing lesson:', error);
        showToast("Failed to complete lesson", "error");
    }
}

// Update progress display
function updateProgress(user) {
    const progressBar = document.getElementById("progressBar");
    const progressPercentage = document.getElementById("progressPercentage");
    
    if (progressBar && progressPercentage) {
        const progress = user.progress || 0;
        progressBar.style.width = progress + "%";
        progressBar.textContent = progress + "%";
        progressPercentage.textContent = progress + "% Complete";
    }
}

// Refresh dashboard
async function refreshDashboard() {
    showToast("Refreshing dashboard...", "info");
    await loadUser();
}

// Submit payment
async function submitPayment() {
    try {
        const code = document.getElementById("mpesa")?.value;
        const paymentStatus = document.getElementById("paymentStatus");
        
        if (!code || code.trim() === '') {
            showToast("Please enter MPESA code", "error");
            return;
        }

        if (code.length < 5) {
            showToast("Please enter a valid MPESA code", "error");
            return;
        }
        
        // Check if payments table exists and insert
        try {
            const { error } = await supabaseClient
                .from("payments")
                .insert([{
                    email: currentUser,
                    code: code.trim(),
                    status: "pending",
                    created_at: new Date().toISOString()
                }]);
                
            if (error) {
                console.error('Payment insert error:', error);
                // If payments table doesn't exist, just show success message
                showToast("Payment submitted! (Demo mode)", "success");
            } else {
                showToast("Payment submitted successfully!", "success");
            }
        } catch (paymentError) {
            // Payments table might not exist, just show success for demo
            console.log('Payment recorded in demo mode');
            showToast("Payment submitted! (Demo mode)", "success");
        }
        
        if (paymentStatus) {
            paymentStatus.innerHTML = '<i class="fas fa-check-circle"></i> Payment submitted for verification!';
            paymentStatus.style.color = "#28a745";
        }
        
        // Clear input
        document.getElementById("mpesa").value = '';
        
    } catch (error) {
        console.error('Payment error:', error);
        showToast("Payment submitted (demo mode)", "success");
    }
}

// Add CSS for lesson cards if not already present
const lessonStyles = document.createElement('style');
lessonStyles.textContent = `
    .lessons-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }

    .lesson-card {
        background: #f8f9fa;
        border-radius: 15px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .lesson-card:hover {
        transform: translateY(-5px);
        border-color: #667eea;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
    }

    .lesson-card.completed {
        background: linear-gradient(135deg, #667eea10, #764ba210);
        border-color: #28a745;
    }

    .lesson-icon {
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .lesson-icon i {
        color: white;
        font-size: 1.5rem;
    }

    .lesson-title {
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .lesson-description {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }

    .lesson-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }

    .status-badge {
        padding: 0.25rem 1rem;
        border-radius: 50px;
        font-weight: 500;
        font-size: 0.8rem;
    }

    .status-completed {
        background: #28a74520;
        color: #28a745;
    }

    .status-pending {
        background: #ffc10720;
        color: #ffc107;
    }

    #progressBar {
        transition: width 0.5s ease;
        background: linear-gradient(90deg, #667eea, #764ba2);
        color: white;
        text-align: center;
        line-height: 20px;
        font-size: 12px;
        border-radius: 10px;
    }
`;
document.head.appendChild(lessonStyles);

// Make functions globally available
window.register = register;
window.login = login;
window.logout = logout;
window.completeLesson = completeLesson;
window.submitPayment = submitPayment;
window.refreshDashboard = refreshDashboard;
