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
let knownCards = [];
let reviewCards = [];
let currentQuizIndex = 0;
let quizScore = 0;
let selectedQuizOption = null;

// ===== COURSE CONTENT =====
const courseContent = {
    forex: {
        title: "Forex Trading Mastery",
        icon: "chart-line",
        lessons: [
            { 
                title: "Introduction to Forex", 
                description: "Learn Forex basics, market hours, and currency pairs",
                content: "Forex (Foreign Exchange) is the global market for trading currencies. Daily volume: $6.6 trillion. Market hours: 24/5 from Sunday 5pm to Friday 5pm EST. Major pairs: EUR/USD, GBP/USD, USD/JPY, USD/CHF."
            },
            { 
                title: "Technical Analysis", 
                description: "Master charts, indicators, and price action",
                content: "Technical analysis involves studying price charts to predict future movements. Key concepts: Support and Resistance, Trend Lines, Chart Patterns (Head and Shoulders, Double Tops), Indicators (RSI, MACD, Moving Averages)."
            },
            { 
                title: "Risk Management", 
                description: "Position sizing, stop losses, and risk-reward",
                content: "Never risk more than 1-2% of your account per trade. Use stop losses to protect capital. Aim for risk-reward ratios of at least 1:2. Position size = (Account Size × Risk %) / Stop Loss in pips."
            },
            { 
                title: "Trading Psychology", 
                description: "Master emotions and develop winning habits",
                content: "The market is a battle of emotions. Fear causes selling at bottoms, greed causes buying at tops. Develop a trading plan and stick to it. Keep a trading journal. Embrace losses as learning opportunities."
            }
        ],
        flashcards: [
            { front: "What is Forex?", back: "Foreign Exchange - trading currencies globally" },
            { front: "What is a Pip?", back: "Percentage in Point - smallest price movement (0.0001)" },
            { front: "Major currency pairs?", back: "EUR/USD, GBP/USD, USD/JPY, USD/CHF" },
            { front: "Market hours?", back: "24/5 from Sunday 5pm to Friday 5pm EST" },
            { front: "Bullish market?", back: "Prices are rising/expected to rise" },
            { front: "Bearish market?", back: "Prices are falling/expected to fall" }
        ],
        quizzes: [
            {
                question: "What does a Pip represent?",
                options: ["Price movement", "Currency pair", "Trading platform", "Broker fee"],
                correct: 0
            },
            {
                question: "Which is a major currency pair?",
                options: ["EUR/USD", "USD/TRY", "EUR/TRY", "GBP/ZAR"],
                correct: 0
            },
            {
                question: "Forex market is open 24/7",
                options: ["True", "False"],
                correct: 1
            }
        ]
    },
    webdev: {
        title: "Web Development Bootcamp",
        icon: "laptop-code",
        lessons: [
            { 
                title: "HTML Fundamentals", 
                description: "Structure web pages with semantic HTML",
                content: "HTML (HyperText Markup Language) is the foundation of all websites. Key elements: <html>, <head>, <body>, <h1>-<h6> for headings, <p> for paragraphs, <a> for links, <img> for images, <div> and <span> for containers."
            },
            { 
                title: "CSS Styling", 
                description: "Create beautiful layouts with modern CSS",
                content: "CSS (Cascading Style Sheets) makes websites look good. Selectors target HTML elements. Properties control colors, fonts, spacing. Flexbox and Grid create layouts. Responsive design with media queries."
            },
            { 
                title: "JavaScript Essentials", 
                description: "Add interactivity to your websites",
                content: "JavaScript brings websites to life. Variables store data. Functions perform tasks. DOM manipulation changes page content. Events handle user interactions. APIs fetch external data."
            },
            { 
                title: "Responsive Design", 
                description: "Build websites that work on all devices",
                content: "Responsive design ensures websites look great on phones, tablets, and desktops. Use viewport meta tag, fluid grids, flexible images, and media queries. Mobile-first approach designs for small screens first."
            }
        ],
        flashcards: [
            { front: "What is HTML?", back: "HyperText Markup Language - structure of web pages" },
            { front: "What is CSS?", back: "Cascading Style Sheets - makes websites beautiful" },
            { front: "What is JavaScript?", back: "Programming language for interactive websites" },
            { front: "What is a tag?", back: "<div>, <p>, <h1> - elements that define content" }
        ],
        quizzes: [
            {
                question: "What does HTML stand for?",
                options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
                correct: 0
            },
            {
                question: "Which tag is used for the largest heading?",
                options: ["<h1>", "<heading>", "<h6>", "<head>"],
                correct: 0
            }
        ]
    },
    ai: {
        title: "AI & Automation",
        icon: "robot",
        lessons: [
            { 
                title: "AI Fundamentals", 
                description: "Understand artificial intelligence basics",
                content: "AI (Artificial Intelligence) enables machines to mimic human intelligence. Machine Learning is a subset of AI where systems learn from data. Deep Learning uses neural networks. Natural Language Processing (NLP) handles text and speech."
            },
            { 
                title: "Automation Tools", 
                description: "Explore popular AI automation platforms",
                content: "Popular AI tools: ChatGPT for conversation, Midjourney for images, Zapier for workflow automation, TensorFlow for ML models, PyTorch for research, AutoGPT for autonomous tasks."
            },
            { 
                title: "Machine Learning", 
                description: "Learn how machines learn from data",
                content: "Machine Learning types: Supervised (labeled data), Unsupervised (patterns in data), Reinforcement (reward-based). Algorithms: Linear Regression, Decision Trees, Neural Networks, K-Means Clustering."
            },
            { 
                title: "AI Applications", 
                description: "Real-world AI applications in business",
                content: "AI in business: Customer service chatbots, Predictive analytics, Fraud detection, Personalized recommendations, Process automation, Sentiment analysis, Image recognition."
            }
        ],
        flashcards: [
            { front: "What is AI?", back: "Artificial Intelligence - machines mimicking human intelligence" },
            { front: "What is Machine Learning?", back: "Algorithms that learn from data" },
            { front: "What is Automation?", back: "Using technology to automate tasks" }
        ],
        quizzes: [
            {
                question: "What does AI stand for?",
                options: ["Artificial Intelligence", "Automated Interface", "Advanced Integration", "Algorithmic Input"],
                correct: 0
            }
        ]
    },
    business: {
        title: "Online Business Mastery",
        icon: "briefcase",
        lessons: [
            { 
                title: "Business Models", 
                description: "Choose the right online business model",
                content: "Online business models: E-commerce (selling products), Dropshipping (no inventory), Affiliate marketing (commission on sales), Digital products (courses, ebooks), SaaS (software subscription), Membership sites (recurring revenue)."
            },
            { 
                title: "Digital Marketing", 
                description: "Market your business effectively online",
                content: "Digital marketing channels: SEO (organic search), PPC (paid ads), Social media marketing, Email marketing, Content marketing, Influencer marketing. Track metrics: CTR, Conversion rate, ROI, Customer acquisition cost."
            },
            { 
                title: "Sales Funnels", 
                description: "Build high-converting sales funnels",
                content: "Sales funnel stages: Awareness (TOFU) → Interest → Consideration → Intent → Evaluation → Purchase (BOFU). Lead magnets attract prospects. Email sequences nurture leads. Upsells and cross-sells increase order value."
            },
            { 
                title: "Scaling Strategies", 
                description: "Scale your business to 6 figures",
                content: "Scaling strategies: Automate processes, Outsource tasks, Expand product lines, Enter new markets, Increase prices, Build partnerships, Create systems and SOPs, Focus on high-value activities."
            }
        ],
        flashcards: [
            { front: "What is a business model?", back: "How a company creates and delivers value" },
            { front: "What is digital marketing?", back: "Marketing through digital channels" },
            { front: "What is a sales funnel?", back: "Customer journey from awareness to purchase" }
        ],
        quizzes: [
            {
                question: "What is a business model?",
                options: ["How company makes money", "Company logo", "Office location", "Employee count"],
                correct: 0
            }
        ]
    }
};

// ===== YOUTUBE TEACHERS (Hidden until payment) =====
const youtubeTeachers = {
    forex: [
        { name: "Rayner Teo", channel: "@RaynerTeo", url: "https://youtube.com/@RaynerTeo", specialty: "Price Action", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "ForexSignals", channel: "@ForexSignals", url: "https://youtube.com/@ForexSignals", specialty: "Daily Analysis", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "Trading Rush", channel: "@TradingRush", url: "https://youtube.com/@TradingRush", specialty: "Beginners", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" }
    ],
    webdev: [
        { name: "Kevin Powell", channel: "@KevinPowell", url: "https://youtube.com/@KevinPowell", specialty: "CSS Master", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "Traversy Media", channel: "@TraversyMedia", url: "https://youtube.com/@TraversyMedia", specialty: "Full Stack", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "Web Dev Simplified", channel: "@WebDevSimplified", url: "https://youtube.com/@WebDevSimplified", specialty: "JavaScript", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" }
    ],
    ai: [
        { name: "Sentdex", channel: "@sentdex", url: "https://youtube.com/@sentdex", specialty: "Python AI", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "Two Minute Papers", channel: "@TwoMinutePapers", url: "https://youtube.com/@TwoMinutePapers", specialty: "AI Research", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "Nicholas Renotte", channel: "@nicholasrenotte", url: "https://youtube.com/@nicholasrenotte", specialty: "AI Projects", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" }
    ],
    business: [
        { name: "Alex Hormozi", channel: "@AlexHormozi", url: "https://youtube.com/@AlexHormozi", specialty: "Scaling", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "Grant Cardone", channel: "@GrantCardone", url: "https://youtube.com/@GrantCardone", specialty: "Sales", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" },
        { name: "GaryVee", channel: "@GaryVee", url: "https://youtube.com/@GaryVee", specialty: "Marketing", image: "https://img.youtube.com/vi/UC8p1vwZvnIo/0.jpg" }
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
        showToast(error.message, "error");
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
        showToast(error.message, "error");
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
    
    // Check if trial expired
    if (now > trialEnd && user.payment_status !== 'paid' && user.payment_status !== 'certified') {
        return {
            canAccess: false,
            status: 'locked',
            message: 'Trial ended. Pay KSH 200 to unlock.'
        };
    }
    
    // Check if paid
    if (user.payment_status === 'paid' || user.payment_status === 'certified') {
        return {
            canAccess: true,
            status: 'paid',
            message: 'Lifetime access',
            showYouTube: true
        };
    }
    
    // Still in trial
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
    
    // Update header
    document.getElementById('userAvatar').textContent = currentUserData.name.charAt(0).toUpperCase();
    document.getElementById('welcome').textContent = `Welcome, ${currentUserData.name}!`;
    
    const courseInfo = courseContent[currentUserData.course] || courseContent.webdev;
    document.getElementById('courseTitle').innerHTML = `<i class="fas fa-${courseInfo.icon}"></i> ${courseInfo.title}`;
    
    // Show/hide trial timer
    if (access.status === 'trial') {
        document.getElementById('trialTimer').style.display = 'flex';
        document.getElementById('trialHeaderBadge').style.display = 'block';
        startCountdown(new Date(currentUserData.trial_end));
    } else {
        document.getElementById('trialTimer').style.display = 'none';
        document.getElementById('trialHeaderBadge').style.display = 'none';
    }
    
    // Show/hide payment wall
    if (access.status === 'locked') {
        document.getElementById('paymentWall').style.display = 'block';
        document.getElementById('dashboardContent').style.display = 'none';
        renderLockedProgress();
    } else {
        document.getElementById('paymentWall').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        
        // Show/hide YouTube section (only after payment)
        if (access.showYouTube) {
            document.getElementById('youtubeSection').style.display = 'block';
            renderYouTubeTeachers();
        } else {
            document.getElementById('youtubeSection').style.display = 'none';
        }
        
        // Render regular content
        renderLessons();
        updateProgress();
        loadFlashcards();
        loadQuiz();
        
        // Show certificate section if course completed
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
                <img src="${teacher.image}" alt="${teacher.name}">
                <h4>${teacher.name}</h4>
                <p>${teacher.specialty}</p>
                <a href="${teacher.url}" target="_blank" class="btn-youtube">
                    <i class="fab fa-youtube"></i> Visit Channel
                </a>
            </div>
        `;
    });
    
    document.getElementById('teacherGrid').innerHTML = html;
}

// ===== RENDER LESSONS =====
function renderLessons() {
    const lessons = courseContent[currentUserData.course]?.lessons || [];
    const completed = currentUserData.completed_lessons || [];
    
    let html = '';
    lessons.forEach((lesson, index) => {
        const isCompleted = completed.includes(index);
        const isLocked = index > 0 && !completed.includes(index - 1) && !completed.includes(index);
        
        html += `
            <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}">
                <div class="lesson-icon">
                    <i class="fas fa-${courseContent[currentUserData.course]?.icon}"></i>
                </div>
                <h4>${lesson.title}</h4>
                <p>${lesson.description}</p>
                <div class="lesson-content">
                    <p>${lesson.content}</p>
                </div>
                <div class="lesson-status">
                    <span class="status-badge ${isCompleted ? 'status-completed' : isLocked ? 'status-locked' : 'status-pending'}">
                        ${isCompleted ? '✓ Completed' : isLocked ? '🔒 Locked' : '▶ In Progress'}
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
        
        // Find next incomplete lesson
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
        
        showToast(`✅ Lesson ${nextLesson + 1} completed!`, "success");
        
    } catch (error) {
        console.error('Error:', error);
        showToast("Failed to complete lesson", "error");
    }
}

// ===== FLASHCARDS =====
function loadFlashcards() {
    const cards = courseContent[currentUserData.course]?.flashcards || [];
    currentFlashcardSet = cards;
    currentFlashcardIndex = 0;
    knownCards = [];
    reviewCards = [];
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
    document.getElementById('flashcardProgress').textContent = 
        `Progress: ${knownCards.length}/${currentFlashcardSet.length} mastered`;
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
    if (!knownCards.includes(currentFlashcardIndex)) {
        knownCards.push(currentFlashcardIndex);
    }
    nextFlashcard();
}

function markReview() {
    if (!reviewCards.includes(currentFlashcardIndex)) {
        reviewCards.push(currentFlashcardIndex);
    }
    nextFlashcard();
}

function nextFlashcard() {
    if (currentFlashcardIndex < currentFlashcardSet.length - 1) {
        currentFlashcardIndex++;
        displayFlashcard();
    } else {
        showToast("🎉 You've reviewed all flashcards!", "success");
    }
}

// ===== QUIZ =====
function loadQuiz() {
    const quizzes = courseContent[currentUserData.course]?.quizzes || [];
    currentQuizIndex = 0;
    quizScore = 0;
    displayQuiz();
}

function displayQuiz() {
    const quizzes = courseContent[currentUserData.course]?.quizzes || [];
    if (quizzes.length === 0) return;
    
    const quiz = quizzes[currentQuizIndex];
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
    
    document.getElementById('quizScore').textContent = `Score: ${quizScore}/${quizzes.length}`;
    selectedQuizOption = null;
}

function selectQuizOption(index) {
    // Remove previous selection
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection
    document.getElementById(`opt_${index}`).classList.add('selected');
    selectedQuizOption = index;
}

function checkQuizAnswer() {
    if (selectedQuizOption === null) {
        showToast("Please select an answer", "error");
        return;
    }
    
    const quizzes = courseContent[currentUserData.course]?.quizzes || [];
    const quiz = quizzes[currentQuizIndex];
    
    const selectedEl = document.getElementById(`opt_${selectedQuizOption}`);
    const correctEl = document.getElementById(`opt_${quiz.correct}`);
    
    if (selectedQuizOption === quiz.correct) {
        selectedEl.classList.add('correct');
        quizScore++;
        showToast("✅ Correct!", "success");
    } else {
        selectedEl.classList.add('wrong');
        correctEl.classList.add('correct');
        showToast("❌ Incorrect. Try again!", "error");
    }
    
    document.getElementById('quizScore').textContent = `Score: ${quizScore}/${quizzes.length}`;
}

function nextQuizQuestion() {
    const quizzes = courseContent[currentUserData.course]?.quizzes || [];
    
    if (currentQuizIndex < quizzes.length - 1) {
        currentQuizIndex++;
        displayQuiz();
    } else {
        const passScore = Math.ceil(quizzes.length * 0.7); // 70% to pass
        if (quizScore >= passScore) {
            showToast("🎉 Quiz passed! You can complete the lesson!", "success");
            document.getElementById('completeLessonBtn').disabled = false;
        } else {
            showToast(`You need ${passScore}/${quizzes.length} to pass. Try again!`, "error");
        }
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
        
        // Insert payment record
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
        
        showToast("Certificate payment submitted! You'll receive your PDF soon.", "success");
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
            // Auto-lock the account
            if (currentUserData) {
                renderDashboard(); // This will show the payment wall
            }
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('countdown').textContent = `${days}d ${hours}h ${minutes}m`;
        document.getElementById('trialDays').textContent = days;
    }, 60000); // Update every minute
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
                    Code: ${payment.code} | Amount: KSH ${payment.amount} | Type: ${payment.type}
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
        // Update payment status
        const { error: paymentError } = await supabaseClient
            .from("payments")
            .update({ status: 'approved' })
            .eq("id", paymentId);
            
        if (paymentError) throw paymentError;
        
        // Update user status based on payment type
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
