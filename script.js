// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

// Initialize Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentUserData = null;
let countdownInterval = null;
let currentFlashcardIndex = 0;
let currentFlashcardSet = [];
let cardMastery = {};
let currentQuizQuestions = [];
let currentQuizIndex = 0;
let quizScore = 0;
let selectedQuizOption = null;
let userXP = 0;
let userLevel = 1;

// ===== RICH COURSE CONTENT =====
const courseContent = {
    forex: {
        title: "Forex Trading Mastery",
        icon: "chart-line",
        color: "#4CAF50",
        lessons: [
            {
                title: "Chapter 1: What is Forex?",
                description: "Understanding the largest financial market",
                pages: [
                    {
                        title: "Introduction to Forex",
                        content: `
                            <div class="lesson-page">
                                <h2>🌍 The Foreign Exchange Market</h2>
                                <p>Forex (Foreign Exchange) is the global marketplace for trading national currencies against one another.</p>
                                
                                <div class="highlight-box">
                                    <h3>📊 Key Facts:</h3>
                                    <ul>
                                        <li><strong>Daily Volume:</strong> $6.6 TRILLION (largest market in the world)</li>
                                        <li><strong>Market Hours:</strong> 24 hours a day, 5 days a week (Sunday 5pm - Friday 5pm EST)</li>
                                        <li><strong>Participants:</strong> Banks, institutions, hedge funds, retail traders</li>
                                        <li><strong>Liquidity:</strong> Extremely high - you can buy/sell instantly</li>
                                    </ul>
                                </div>
                                
                                <h3>🎯 Why Trade Forex?</h3>
                                <ul>
                                    <li>✅ Low barriers to entry (start with as little as $10)</li>
                                    <li>✅ Trade from anywhere in the world</li>
                                    <li>✅ Profit in rising OR falling markets</li>
                                    <li>✅ Leverage available (2x, 5x, 10x, even 100x!)</li>
                                </ul>
                            </div>
                        `
                    },
                    {
                        title: "Currency Pairs Explained",
                        content: `
                            <div class="lesson-page">
                                <h2>💱 Understanding Currency Pairs</h2>
                                <p>Currencies are always traded in pairs. You're buying one and selling the other simultaneously.</p>
                                
                                <div class="example-box">
                                    <h3>📝 Example: EUR/USD = 1.1000</h3>
                                    <p><strong>Base Currency:</strong> EUR (the one you're buying/selling)</p>
                                    <p><strong>Quote Currency:</strong> USD (the one you're using to buy)</p>
                                    <p>This means 1 Euro = 1.10 US Dollars</p>
                                </div>
                                
                                <h3>Major Currency Pairs:</h3>
                                <table>
                                    <tr><th>Pair</th><th>Nickname</th><th>Spread</th></tr>
                                    <tr><td>EUR/USD</td><td>"Fiber"</td><td>Lowest</td></tr>
                                    <tr><td>GBP/USD</td><td>"Cable"</td><td>Low</td></tr>
                                    <tr><td>USD/JPY</td><td>"Gopher"</td><td>Low</td></tr>
                                    <tr><td>USD/CHF</td><td>"Swissie"</td><td>Low</td></tr>
                                    <tr><td>AUD/USD</td><td>"Aussie"</td><td>Medium</td></tr>
                                    <tr><td>USD/CAD</td><td>"Loonie"</td><td>Medium</td></tr>
                                </table>
                                
                                <div class="warning-box">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <strong>Remember:</strong> The first currency is the BASE. You're always buying/selling the base currency.
                                </div>
                            </div>
                        `
                    },
                    {
                        title: "Pips and Lots",
                        content: `
                            <div class="lesson-page">
                                <h2>📏 Understanding Pips and Lots</h2>
                                
                                <div class="highlight-box">
                                    <h3>🔍 What is a PIP?</h3>
                                    <p>PIP = Percentage in Point. It's the smallest price movement in Forex.</p>
                                    <p><strong>For most pairs:</strong> 1 pip = 0.0001</p>
                                    <p><strong>For JPY pairs:</strong> 1 pip = 0.01</p>
                                    <p class="example">Example: If EUR/USD moves from 1.1000 to 1.1001, that's 1 pip.</p>
                                </div>
                                
                                <h3>💰 Pip Value by Lot Size:</h3>
                                <table>
                                    <tr><th>Lot Type</th><th>Units</th><th>Value per Pip (EUR/USD)</th></tr>
                                    <tr><td>Standard Lot</td><td>100,000</td><td>$10</td></tr>
                                    <tr><td>Mini Lot</td><td>10,000</td><td>$1</td></tr>
                                    <tr><td>Micro Lot</td><td>1,000</td><td>$0.10</td></tr>
                                    <tr><td>Nano Lot</td><td>100</td><td>$0.01</td></tr>
                                </table>
                                
                                <div class="example-box">
                                    <h4>🎮 Interactive Example:</h4>
                                    <p>You buy 1 STANDARD LOT of EUR/USD at 1.1000</p>
                                    <p>Price moves to 1.1010 (that's 10 pips!)</p>
                                    <p><strong>YOUR PROFIT = 10 pips × $10 = $100</strong></p>
                                </div>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What is the daily trading volume of the Forex market?",
                        options: ["$660 billion", "$6.6 trillion", "$66 trillion", "$660 million"],
                        correct: 1,
                        explanation: "Forex trades $6.6 TRILLION daily - it's the world's largest financial market!"
                    },
                    {
                        question: "In EUR/USD, which is the base currency?",
                        options: ["USD", "EUR", "Both", "Neither"],
                        correct: 1,
                        explanation: "EUR is the base currency. You're buying or selling Euros, using US Dollars."
                    },
                    {
                        question: "What is a pip in most currency pairs?",
                        options: ["0.1", "0.01", "0.001", "0.0001"],
                        correct: 3,
                        explanation: "For most pairs, 1 pip = 0.0001. For JPY pairs, it's 0.01."
                    },
                    {
                        question: "How much is 1 pip worth on a standard lot of EUR/USD?",
                        options: ["$1", "$10", "$100", "$1000"],
                        correct: 1,
                        explanation: "A standard lot is 100,000 units, so each pip movement is worth $10."
                    },
                    {
                        question: "Which is NOT a major currency pair?",
                        options: ["EUR/USD", "GBP/USD", "USD/TRY", "USD/JPY"],
                        correct: 2,
                        explanation: "USD/TRY (Turkish Lira) is an exotic pair, not a major."
                    },
                    {
                        question: "When does Forex market open?",
                        options: ["Monday 12am", "Sunday 5pm EST", "24/7", "Weekdays 9-5"],
                        correct: 1,
                        explanation: "Forex opens Sunday 5pm EST and runs until Friday 5pm EST."
                    }
                ]
            },
            {
                title: "Chapter 2: Technical Analysis",
                description: "Reading charts and identifying trends",
                pages: [
                    {
                        title: "Introduction to Charts",
                        content: `
                            <div class="lesson-page">
                                <h2>📊 Types of Charts</h2>
                                
                                <h3>1. Line Charts</h3>
                                <p>Simply connect closing prices. Good for seeing overall trends.</p>
                                
                                <h3>2. Bar Charts</h3>
                                <p>Show open, high, low, close for each period.</p>
                                
                                <h3>3. Candlestick Charts</h3>
                                <p>Most popular. Green/white = price went up, Red/black = price went down.</p>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What does a green candlestick indicate?",
                        options: ["Price went down", "Price went up", "Price didn't change", "Market closed"],
                        correct: 1,
                        explanation: "Green/white candlesticks mean the closing price was higher than the opening price."
                    },
                    {
                        question: "What is support in technical analysis?",
                        options: ["Price ceiling", "Price floor", "Trading volume", "Market news"],
                        correct: 1,
                        explanation: "Support is a price level where buying pressure is strong enough to prevent price from falling further."
                    }
                ]
            }
        ],
        flashcardBank: [
            { front: "What is Forex?", back: "Foreign Exchange - trading currencies globally", difficulty: 1 },
            { front: "What is a Pip?", back: "Percentage in Point - smallest price movement (0.0001 for most pairs)", difficulty: 1 },
            { front: "Major currency pairs?", back: "EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD", difficulty: 1 },
            { front: "What is a standard lot?", back: "100,000 units of base currency", difficulty: 2 },
            { front: "What is leverage?", back: "Borrowed capital to increase potential returns (and losses)", difficulty: 2 },
            { front: "What is a stop loss?", back: "Order to close trade at predetermined loss level", difficulty: 2 }
        ]
    },
    webdev: {
        title: "Web Development Bootcamp",
        icon: "laptop-code",
        color: "#2196F3",
        lessons: [
            {
                title: "Chapter 1: HTML Fundamentals",
                description: "Build the structure of websites",
                pages: [
                    {
                        title: "HTML Document Structure",
                        content: `
                            <div class="lesson-page">
                                <h2>🏗️ Basic HTML Template</h2>
                                
                                <pre style="background: #1e1e1e; color: #d4d4d4; padding: 20px; border-radius: 10px;">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;title&gt;My First Page&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
        &lt;h1&gt;Hello World!&lt;/h1&gt;
        &lt;p&gt;This is my first paragraph.&lt;/p&gt;
    &lt;/body&gt;
&lt;/html&gt;
                                </pre>
                                
                                <h3>📝 Explanation:</h3>
                                <ul>
                                    <li><strong>&lt;!DOCTYPE html&gt;</strong> - Tells browser it's HTML5</li>
                                    <li><strong>&lt;html&gt;</strong> - Root element of the page</li>
                                    <li><strong>&lt;head&gt;</strong> - Contains meta information</li>
                                    <li><strong>&lt;body&gt;</strong> - Contains visible content</li>
                                </ul>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What does HTML stand for?",
                        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
                        correct: 0,
                        explanation: "HTML = HyperText Markup Language, the standard language for creating web pages."
                    },
                    {
                        question: "Which tag is used for the largest heading?",
                        options: ["<h1>", "<heading>", "<h6>", "<head>"],
                        correct: 0,
                        explanation: "<h1> is the largest heading, <h6> is the smallest."
                    }
                ]
            }
        ],
        flashcardBank: [
            { front: "What is HTML?", back: "HyperText Markup Language - structure of web pages", difficulty: 1 },
            { front: "What is CSS?", back: "Cascading Style Sheets - makes websites beautiful", difficulty: 1 },
            { front: "What is JavaScript?", back: "Programming language for interactive websites", difficulty: 1 },
            { front: "What is a tag?", back: "<div>, <p>, <h1> - elements that define content", difficulty: 1 }
        ]
    },
    ai: {
        title: "AI & Automation",
        icon: "robot",
        color: "#FF5722",
        lessons: [
            {
                title: "Chapter 1: AI Fundamentals",
                description: "Understanding artificial intelligence",
                pages: [
                    {
                        title: "What is AI?",
                        content: `
                            <div class="lesson-page">
                                <h2>🤖 Artificial Intelligence Explained</h2>
                                <p>AI enables machines to mimic human intelligence - learning, problem-solving, and decision-making.</p>
                                
                                <h3>Types of AI:</h3>
                                <ul>
                                    <li><strong>Narrow AI:</strong> Designed for specific tasks (Siri, chess bots)</li>
                                    <li><strong>General AI:</strong> Human-like intelligence across domains (theoretical)</li>
                                    <li><strong>Super AI:</strong> Surpasses human intelligence (future concept)</li>
                                </ul>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What does AI stand for?",
                        options: ["Artificial Intelligence", "Automated Interface", "Advanced Integration", "Algorithmic Input"],
                        correct: 0,
                        explanation: "AI = Artificial Intelligence, the simulation of human intelligence in machines."
                    }
                ]
            }
        ],
        flashcardBank: [
            { front: "What is AI?", back: "Artificial Intelligence - machines mimicking human intelligence", difficulty: 1 },
            { front: "What is Machine Learning?", back: "Algorithms that learn from data", difficulty: 2 }
        ]
    },
    business: {
        title: "Online Business Mastery",
        icon: "briefcase",
        color: "#FF9800",
        lessons: [
            {
                title: "Chapter 1: Business Models",
                description: "Choose the right online business model",
                pages: [
                    {
                        title: "Types of Online Businesses",
                        content: `
                            <div class="lesson-page">
                                <h2>💼 Online Business Models</h2>
                                
                                <h3>1. E-commerce</h3>
                                <p>Selling physical products online (Shopify, Amazon FBA)</p>
                                
                                <h3>2. Digital Products</h3>
                                <p>Courses, ebooks, templates, software (high margin, no inventory)</p>
                                
                                <h3>3. Affiliate Marketing</h3>
                                <p>Earn commissions promoting others' products</p>
                                
                                <h3>4. Membership Sites</h3>
                                <p>Recurring revenue from exclusive content</p>
                            </div>
                        `
                    }
                ],
                questionBank: [
                    {
                        question: "What is a business model?",
                        options: ["How company makes money", "Company logo", "Office location", "Employee count"],
                        correct: 0,
                        explanation: "A business model describes how a company creates, delivers, and captures value."
                    }
                ]
            }
        ],
        flashcardBank: [
            { front: "What is a business model?", back: "How a company creates and delivers value", difficulty: 1 },
            { front: "What is digital marketing?", back: "Marketing through digital channels", difficulty: 1 }
        ]
    }
};

// ===== YOUTUBE TEACHERS =====
const youtubeTeachers = {
    forex: [
        { name: "Rayner Teo", url: "https://youtube.com/@RaynerTeo", specialty: "Price Action", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "ForexSignals", url: "https://youtube.com/@ForexSignals", specialty: "Daily Analysis", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "Trading Rush", url: "https://youtube.com/@TradingRush", specialty: "Beginners", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" }
    ],
    webdev: [
        { name: "Kevin Powell", url: "https://youtube.com/@KevinPowell", specialty: "CSS Master", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "Traversy Media", url: "https://youtube.com/@TraversyMedia", specialty: "Full Stack", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "Web Dev Simplified", url: "https://youtube.com/@WebDevSimplified", specialty: "JavaScript", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" }
    ],
    ai: [
        { name: "Sentdex", url: "https://youtube.com/@sentdex", specialty: "Python AI", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "Two Minute Papers", url: "https://youtube.com/@TwoMinutePapers", specialty: "AI Research", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "Nicholas Renotte", url: "https://youtube.com/@nicholasrenotte", specialty: "AI Projects", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" }
    ],
    business: [
        { name: "Alex Hormozi", url: "https://youtube.com/@AlexHormozi", specialty: "Scaling", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "Grant Cardone", url: "https://youtube.com/@GrantCardone", specialty: "Sales", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" },
        { name: "GaryVee", url: "https://youtube.com/@GaryVee", specialty: "Marketing", image: "https://i.ytimg.com/vi/UC8p1vwZvnIo/default.jpg" }
    ]
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, checking session...');
    checkSession();
});

// ===== SESSION MANAGEMENT =====
async function checkSession() {
    try {
        const savedEmail = localStorage.getItem("student");
        
        if (savedEmail) {
            currentUser = savedEmail;
            await loadUser();
        } else {
            showAuthForms();
        }
    } catch (error) {
        console.error('Session error:', error);
        showAuthForms();
    }
}

// ===== UI HELPERS =====
function showAuthForms() {
    document.getElementById('auth').style.display = 'grid';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
}

function showDashboard() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerCard').style.display = 'none';
    document.getElementById('loginCard').style.display = 'block';
}

function showRegister() {
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('registerCard').style.display = 'block';
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        ${message}
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== REGISTRATION =====
async function register() {
    try {
        const name = document.getElementById("reg_name")?.value;
        const email = document.getElementById("reg_email")?.value;
        const pass = document.getElementById("reg_pass")?.value;
        const course = document.getElementById("reg_course")?.value;

        if (!name || !email || !pass || !course) {
            showToast("Please fill all fields", "error");
            return;
        }

        if (pass.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        // Check if user exists
        const { data: existing } = await supabaseClient
            .from("users")
            .select("email")
            .eq("email", email);

        if (existing && existing.length > 0) {
            showToast("Email already registered", "error");
            return;
        }

        // Calculate trial dates (2 days from now)
        const now = new Date();
        const trialEnd = new Date(now);
        trialEnd.setDate(trialEnd.getDate() + 2);

        // Insert new user
        const { error } = await supabaseClient
            .from("users")
            .insert([{
                name: name,
                email: email,
                password: pass,
                course: course,
                progress: 0,
                completed_lessons: [],
                payment_status: 'trial',
                trial_start: now.toISOString(),
                trial_end: trialEnd.toISOString(),
                created_at: now.toISOString()
            }]);

        if (error) throw error;

        localStorage.setItem("student", email);
        currentUser = email;
        
        showToast("Registration successful! 2-day trial started!", "success");
        
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

// ===== LOGIN =====
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

        if (error) throw error;

        if (!data || data.length === 0) {
            showToast("Invalid email or password", "error");
            return;
        }

        localStorage.setItem("student", email);
        currentUser = email;
        
        showToast("Login successful!", "success");
        
        document.getElementById("log_email").value = '';
        document.getElementById("log_pass").value = '';
        
        await loadUser();
        
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || "Login failed", "error");
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("student");
    currentUser = null;
    currentUserData = null;
    if (countdownInterval) clearInterval(countdownInterval);
    showAuthForms();
    showToast("Logged out successfully", "success");
}

// ===== LOAD USER =====
async function loadUser() {
    try {
        if (!currentUser) return;

        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", currentUser);

        if (error) throw error;

        if (!data || data.length === 0) {
            showToast("User not found", "error");
            logout();
            return;
        }

        currentUserData = data[0];
        
        // Check if user is admin
        if (currentUserData.email === 'admin@skillforge.com') {
            loadAdminPanel();
            return;
        }
        
        renderDashboard();
        
    } catch (error) {
        console.error('Load user error:', error);
        showToast("Failed to load user", "error");
    }
}

// ===== CHECK ACCESS =====
function checkAccess(user) {
    const now = new Date();
    const trialEnd = new Date(user.trial_end);
    
    if (now > trialEnd && user.payment_status !== 'paid' && user.payment_status !== 'certified') {
        return {
            canAccess: false,
            status: 'locked',
            message: 'Trial ended. Pay KSH 200 to unlock.'
        };
    }
    
    if (user.payment_status === 'paid' || user.payment_status === 'certified') {
        return {
            canAccess: true,
            status: 'paid',
            message: 'Lifetime access',
            showYouTube: true
        };
    }
    
    return {
        canAccess: true,
        status: 'trial',
        message: `Trial ends in ${getRemainingTime(trialEnd)}`,
        showYouTube: false
    };
}

// ===== GET REMAINING TIME =====
function getRemainingTime(endDate) {
    const now = new Date();
    const diff = endDate - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days}d ${hours}h ${minutes}m`;
}

// ===== RENDER DASHBOARD =====
function renderDashboard() {
    showDashboard();
    
    const access = checkAccess(currentUserData);
    
    document.getElementById('userAvatar').textContent = currentUserData.name.charAt(0).toUpperCase();
    document.getElementById('welcome').textContent = `Welcome, ${currentUserData.name}!`;
    
    const courseInfo = courseContent[currentUserData.course] || courseContent.webdev;
    document.getElementById('courseTitle').innerHTML = `<i class="fas fa-${courseInfo.icon}"></i> ${courseInfo.title}`;
    
    if (access.status === 'trial') {
        document.getElementById('trialTimer').style.display = 'flex';
        document.getElementById('trialHeaderBadge').style.display = 'block';
        startCountdown(new Date(currentUserData.trial_end));
    } else {
        document.getElementById('trialTimer').style.display = 'none';
        document.getElementById('trialHeaderBadge').style.display = 'none';
    }
    
    if (access.status === 'locked') {
        document.getElementById('paymentWall').style.display = 'block';
        document.getElementById('dashboardContent').style.display = 'none';
        renderLockedProgress();
    } else {
        document.getElementById('paymentWall').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        
        if (access.showYouTube) {
            document.getElementById('youtubeSection').style.display = 'block';
            renderYouTubeTeachers();
        } else {
            document.getElementById('youtubeSection').style.display = 'none';
        }
        
        renderLessons();
        updateProgress();
        loadFlashcards();
        loadQuiz();
        
        if (currentUserData.progress === 100) {
            document.getElementById('certificateSection').style.display = 'block';
        }
    }
}

// ===== RENDER LOCKED PROGRESS =====
function renderLockedProgress() {
    document.getElementById('lockedProgressBar').style.width = `${currentUserData.progress || 0}%`;
    document.getElementById('lockedProgressBar').textContent = `${currentUserData.progress || 0}%`;
    
    const lessons = courseContent[currentUserData.course]?.lessons || [];
    const completed = currentUserData.completed_lessons || [];
    
    let html = '';
    lessons.forEach((lesson, index) => {
        const isCompleted = completed.includes(index);
        html += `
            <div class="locked-lesson-item">
                <span>${isCompleted ? '✅' : '📘'} ${lesson.title}</span>
                <span>${isCompleted ? 'Completed' : index === 0 ? '50% done' : '🔒 Locked'}</span>
            </div>
        `;
    });
    
    document.getElementById('lockedLessons').innerHTML = html;
}

// ===== RENDER YOUTUBE TEACHERS =====
function renderYouTubeTeachers() {
    const teachers = youtubeTeachers[currentUserData.course] || youtubeTeachers.webdev;
    
    let html = '';
    teachers.forEach(teacher => {
        html += `
            <div class="teacher-card">
                <img src="${teacher.image}" alt="${teacher.name}" onerror="this.src='https://via.placeholder.com/100?text=YT'">
                <h4>${teacher.name}</h4>
                <p>${teacher.specialty}</p>
                <a href="${teacher.url}" target="_blank">
                    <i class="fab fa-youtube"></i> Visit Channel
                </a>
            </div>
        `;
    });
    
    document.getElementById('teacherGrid').innerHTML = html;
}

// ===== RENDER LESSONS =====
function renderLessons() {
    const course = courseContent[currentUserData.course];
    if (!course) return;
    
    const lessons = course.lessons || [];
    const completed = currentUserData.completed_lessons || [];
    
    let html = '';
    lessons.forEach((lesson, lessonIndex) => {
        const isCompleted = completed.includes(lessonIndex);
        const isLocked = lessonIndex > 0 && !completed.includes(lessonIndex - 1) && !completed.includes(lessonIndex);
        
        html += `
            <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}">
                <div class="lesson-icon">
                    <i class="fas fa-${course.icon}"></i>
                </div>
                <h4>${lesson.title}</h4>
                <p>${lesson.description}</p>
                <div class="lesson-content">
                    ${lesson.pages[0]?.content || ''}
                </div>
                <div class="lesson-status">
                    <span class="status-badge ${isCompleted ? 'status-completed' : isLocked ? 'status-locked' : 'status-pending'}">
                        ${isCompleted ? '✓ Completed' : isLocked ? '🔒 Locked' : '📖 ' + lesson.pages.length + ' pages'}
                    </span>
                </div>
            </div>
        `;
    });
    
    document.getElementById('lessonsGrid').innerHTML = html;
}

// ===== UPDATE PROGRESS =====
function updateProgress() {
    const progress = currentUserData.progress || 0;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressBar').textContent = `${progress}%`;
    document.getElementById('progressPercent').textContent = `${progress}%`;
}

// ===== COMPLETE LESSON =====
async function completeLesson() {
    try {
        const completed = currentUserData.completed_lessons || [];
        const totalLessons = courseContent[currentUserData.course]?.lessons.length || 4;
        
        let nextLesson = 0;
        while (completed.includes(nextLesson) && nextLesson < totalLessons) {
            nextLesson++;
        }
        
        if (nextLesson >= totalLessons) {
            showToast("Congratulations! You've completed all lessons!", "success");
            return;
        }
        
        const newCompleted = [...completed, nextLesson];
        const newProgress = Math.round((newCompleted.length / totalLessons) * 100);
        
        const { error } = await supabaseClient
            .from("users")
            .update({ 
                completed_lessons: newCompleted,
                progress: newProgress
            })
            .eq("email", currentUser);
            
        if (error) throw error;
        
        currentUserData.completed_lessons = newCompleted;
        currentUserData.progress = newProgress;
        
        updateProgress();
        renderLessons();
        loadQuiz();
        
        showToast(`✅ Lesson ${nextLesson + 1} completed!`, "success");
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Failed to complete lesson", "error");
    }
}

// ===== FLASHCARDS =====
function loadFlashcards() {
    const cards = courseContent[currentUserData.course]?.flashcardBank || [];
    currentFlashcardSet = cards;
    currentFlashcardIndex = 0;
    displayFlashcard();
}

function displayFlashcard() {
    if (currentFlashcardSet.length === 0) return;
    
    const card = currentFlashcardSet[currentFlashcardIndex];
    
    document.getElementById('flashcardContainer').innerHTML = `
        <div class="flashcard" onclick="flipCard()">
            <div class="flashcard-content" id="flashcardContent">
                ${card.front}
            </div>
        </div>
    `;
}

function flipCard() {
    const card = currentFlashcardSet[currentFlashcardIndex];
    const content = document.getElementById('flashcardContent');
    const flashcard = document.querySelector('.flashcard');
    
    if (content.textContent === card.front) {
        content.textContent = card.back;
        flashcard.classList.add('flipped');
    } else {
        content.textContent = card.front;
        flashcard.classList.remove('flipped');
    }
}

function markKnown() {
    if (currentFlashcardIndex < currentFlashcardSet.length - 1) {
        currentFlashcardIndex++;
        displayFlashcard();
    } else {
        showToast("🎉 You've reviewed all flashcards!", "success");
    }
}

function markReview() {
    if (currentFlashcardIndex < currentFlashcardSet.length - 1) {
        currentFlashcardIndex++;
        displayFlashcard();
    } else {
        showToast("🎉 You've reviewed all flashcards!", "success");
    }
}

// ===== QUIZ =====
function loadQuiz() {
    const questionBank = courseContent[currentUserData.course]?.lessons[0]?.questionBank || [];
    currentQuizQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 3);
    currentQuizIndex = 0;
    quizScore = 0;
    displayQuiz();
}

function displayQuiz() {
    if (currentQuizQuestions.length === 0) return;
    
    const quiz = currentQuizQuestions[currentQuizIndex];
    let optionsHtml = '';
    
    quiz.options.forEach((option, index) => {
        optionsHtml += `
            <div class="quiz-option" onclick="selectQuizOption(${index})" id="opt_${index}">
                ${option}
            </div>
        `;
    });
    
    document.getElementById('quizContainer').innerHTML = `
        <div class="quiz-question">${quiz.question}</div>
        <div class="quiz-options">
            ${optionsHtml}
        </div>
    `;
    
    selectedQuizOption = null;
}

function selectQuizOption(index) {
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    document.getElementById(`opt_${index}`).classList.add('selected');
    selectedQuizOption = index;
}

function checkQuizAnswer() {
    if (selectedQuizOption === null) {
        showToast("Please select an answer", "error");
        return;
    }
    
    const quiz = currentQuizQuestions[currentQuizIndex];
    
    if (selectedQuizOption === quiz.correct) {
        document.getElementById(`opt_${selectedQuizOption}`).classList.add('correct');
        quizScore++;
        showToast("✅ Correct!", "success");
    } else {
        document.getElementById(`opt_${selectedQuizOption}`).classList.add('wrong');
        document.getElementById(`opt_${quiz.correct}`).classList.add('correct');
        showToast("❌ Incorrect. " + (quiz.explanation || ""), "error");
    }
}

function nextQuizQuestion() {
    if (currentQuizIndex < currentQuizQuestions.length - 1) {
        currentQuizIndex++;
        displayQuiz();
    } else {
        showToast(`Quiz complete! Score: ${quizScore}/${currentQuizQuestions.length}`, "success");
    }
}

// ===== PAYMENT =====
async function submitPayment() {
    try {
        const code = document.getElementById('mpesa_wall')?.value;
        
        if (!code || code.length < 5) {
            showToast("Please enter a valid M-PESA code", "error");
            return;
        }
        
        const { error } = await supabaseClient
            .from("payments")
            .insert([{
                email: currentUser,
                code: code,
                amount: 200,
                type: 'course',
                status: 'pending',
                created_at: new Date()
            }]);
            
        if (error) throw error;
        
        showToast("Payment submitted! Admin will verify shortly.", "success");
        document.getElementById('mpesa_wall').value = '';
        
    } catch (error) {
        console.error('Payment error:', error);
        showToast("Payment submission failed", "error");
    }
}

// ===== CERTIFICATE PURCHASE =====
async function purchaseCertificate() {
    try {
        const code = document.getElementById('cert_mpesa')?.value;
        
        if (!code || code.length < 5) {
            showToast("Please enter a valid M-PESA code", "error");
            return;
        }
        
        const { error } = await supabaseClient
            .from("payments")
            .insert([{
                email: currentUser,
                code: code,
                amount: 500,
                type: 'certificate',
                status: 'pending',
                created_at: new Date()
            }]);
            
        if (error) throw error;
        
        showToast("Certificate payment submitted!", "success");
        document.getElementById('cert_mpesa').value = '';
        
    } catch (error) {
        console.error('Certificate error:', error);
        showToast("Failed to process certificate payment", "error");
    }
}

// ===== COUNTDOWN TIMER =====
function startCountdown(endDate) {
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').textContent = 'Expired';
            if (currentUserData) {
                renderDashboard();
            }
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('countdown').textContent = `${days}d ${hours}h ${minutes}m`;
        document.getElementById('trialDays').textContent = days;
    }, 60000);
}

// ===== ADMIN PANEL =====
async function loadAdminPanel() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    await loadPendingPayments();
    await loadAllUsers();
}

async function loadPendingPayments() {
    const { data, error } = await supabaseClient
        .from("payments")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
        
    if (error) {
        console.error('Error loading payments:', error);
        return;
    }
    
    let html = '';
    data.forEach(payment => {
        html += `
            <div class="payment-request">
                <div>
                    <strong>${payment.email}</strong><br>
                    Code: ${payment.code} | Amount: KSH ${payment.amount}
                </div>
                <div>
                    <button class="btn-approve" onclick="approvePayment('${payment.id}', '${payment.email}', ${payment.amount})">Approve</button>
                    <button class="btn-reject" onclick="rejectPayment('${payment.id}')">Reject</button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('pendingPaymentsList').innerHTML = html || '<p>No pending payments</p>';
}

async function loadAllUsers() {
    const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
        
    if (error) {
        console.error('Error loading users:', error);
        return;
    }
    
    let html = '<table style="width:100%; border-collapse: collapse;">';
    html += '<tr><th>Name</th><th>Email</th><th>Course</th><th>Status</th><th>Progress</th></tr>';
    
    data.forEach(user => {
        html += `
            <tr style="border-bottom:1px solid #e0e0e0;">
                <td style="padding:10px;">${user.name}</td>
                <td style="padding:10px;">${user.email}</td>
                <td style="padding:10px;">${user.course}</td>
                <td style="padding:10px;">${user.payment_status}</td>
                <td style="padding:10px;">${user.progress || 0}%</td>
            </tr>
        `;
    });
    
    html += '</table>';
    document.getElementById('usersList').innerHTML = html;
}

async function approvePayment(paymentId, userEmail, amount) {
    try {
        await supabaseClient
            .from("payments")
            .update({ status: 'approved' })
            .eq("id", paymentId);
        
        if (amount === 200) {
            await supabaseClient
                .from("users")
                .update({ payment_status: 'paid' })
                .eq("email", userEmail);
        } else if (amount === 500) {
            await supabaseClient
                .from("users")
                .update({ payment_status: 'certified' })
                .eq("email", userEmail);
        }
        
        showToast(`Payment approved for ${userEmail}`, "success");
        loadPendingPayments();
        
    } catch (error) {
        console.error('Approval error:', error);
        showToast("Failed to approve payment", "error");
    }
}

async function rejectPayment(paymentId) {
    try {
        await supabaseClient
            .from("payments")
            .update({ status: 'rejected' })
            .eq("id", paymentId);
            
        showToast("Payment rejected", "success");
        loadPendingPayments();
        
    } catch (error) {
        console.error('Rejection error:', error);
        showToast("Failed to reject payment", "error");
    }
}

function logoutAdmin() {
    logout();
}

// ===== MAKE FUNCTIONS GLOBAL =====
window.register = register;
window.login = login;
window.logout = logout;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.submitPayment = submitPayment;
window.completeLesson = completeLesson;
window.flipCard = flipCard;
window.markKnown = markKnown;
window.markReview = markReview;
window.selectQuizOption = selectQuizOption;
window.checkQuizAnswer = checkQuizAnswer;
window.nextQuizQuestion = nextQuizQuestion;
window.purchaseCertificate = purchaseCertificate;
window.approvePayment = approvePayment;
window.rejectPayment = rejectPayment;
window.logoutAdmin = logoutAdmin;
