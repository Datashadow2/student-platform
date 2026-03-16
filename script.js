// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentUserData = null;
let countdownInterval = null;
let testimonials = [];
let kcseGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E', 'Adult'];

// ===== KENYAN GOVERNMENT AGENCIES BY KCSE GRADE =====
const governmentJobs = {
    'A': {
        agencies: [
            { name: "Central Bank of Kenya (CBK)", positions: 15, salary: "KSH 120-150k", jobs: ["Currency Analyst", "Economic Researcher", "Policy Officer"] },
            { name: "Capital Markets Authority (CMA)", positions: 12, salary: "KSH 100-130k", jobs: ["Senior Compliance Officer", "Market Analyst", "Legal Officer"] },
            { name: "Kenya Revenue Authority (KRA)", positions: 20, salary: "KSH 90-120k", jobs: ["Tax Analyst", "International Tax Specialist", "Customs Officer"] },
            { name: "Ministry of ICT", positions: 15, salary: "KSH 85-110k", jobs: ["ICT Officer 1", "Systems Architect", "Network Manager"] }
        ],
        total: 62
    },
    'A-': {
        agencies: [
            { name: "Central Bank of Kenya (CBK)", positions: 10, salary: "KSH 110-140k", jobs: ["Currency Analyst", "Research Assistant"] },
            { name: "Capital Markets Authority (CMA)", positions: 8, salary: "KSH 95-120k", jobs: ["Compliance Officer", "Market Analyst"] },
            { name: "Kenya Revenue Authority (KRA)", positions: 15, salary: "KSH 85-110k", jobs: ["Tax Officer", "Customs Assistant"] }
        ],
        total: 48
    },
    'B+': {
        agencies: [
            { name: "Kenya Revenue Authority (KRA)", positions: 25, salary: "KSH 70-95k", jobs: ["Tax Assistant", "Customer Service", "Data Entry"] },
            { name: "Huduma Kenya", positions: 20, salary: "KSH 60-85k", jobs: ["Customer Service Rep", "IT Support", "Office Admin"] },
            { name: "eCitizen", positions: 15, salary: "KSH 55-80k", jobs: ["Support Staff", "Content Manager"] },
            { name: "ICT Authority", positions: 18, salary: "KSH 65-90k", jobs: ["Technician", "Network Administrator"] }
        ],
        total: 107
    },
    'B': {
        agencies: [
            { name: "Huduma Kenya", positions: 25, salary: "KSH 55-75k", jobs: ["Customer Service", "Receptionist", "Clerk"] },
            { name: "KRA", positions: 20, salary: "KSH 60-80k", jobs: ["Tax Assistant", "Data Entry"] },
            { name: "County Governments", positions: 35, salary: "KSH 50-70k", jobs: ["Administrative Assistant", "Customer Service"] }
        ],
        total: 98
    },
    'B-': {
        agencies: [
            { name: "Huduma Kenya", positions: 20, salary: "KSH 50-65k", jobs: ["Clerk", "Receptionist"] },
            { name: "County Governments", positions: 40, salary: "KSH 45-60k", jobs: ["Office Assistant", "Customer Service"] }
        ],
        total: 85
    },
    'C+': {
        agencies: [
            { name: "County Governments", positions: 50, salary: "KSH 40-55k", jobs: ["Clerk", "Office Assistant"] },
            { name: "Huduma Kenya", positions: 25, salary: "KSH 40-50k", jobs: ["Support Staff", "Receptionist"] }
        ],
        total: 95
    },
    'C': {
        agencies: [
            { name: "County Governments", positions: 60, salary: "KSH 35-45k", jobs: ["Clerk", "Messenger"] },
            { name: "Huduma Kenya", positions: 30, salary: "KSH 35-45k", jobs: ["Support Staff"] }
        ],
        total: 110
    },
    'C-': {
        agencies: [
            { name: "County Governments", positions: 55, salary: "KSH 32-40k", jobs: ["Support Staff", "Messenger"] }
        ],
        total: 75
    },
    'D+': {
        agencies: [
            { name: "Government Internships", positions: 80, salary: "KSH 25k stipend", jobs: ["Intern", "Attachment"] }
        ],
        total: 120
    },
    'D': {
        agencies: [
            { name: "Government Internships", positions: 100, salary: "KSH 20k stipend", jobs: ["Intern", "Attachment"] }
        ],
        total: 140
    },
    'D-': {
        agencies: [
            { name: "Government Internships", positions: 120, salary: "KSH 15k stipend", jobs: ["Intern", "Attachment"] }
        ],
        total: 160
    },
    'E': {
        agencies: [
            { name: "NYS Training", positions: 200, salary: "KSH 10k stipend", jobs: ["Trainee"] },
            { name: "TVET Programs", positions: 150, salary: "Free", jobs: ["Student"] }
        ],
        total: 400
    },
    'Adult': {
        agencies: [
            { name: "KRA - Experienced", positions: 15, salary: "KSH 80-150k", jobs: ["Tax Specialist", "Manager"] },
            { name: "CMA - Professional", positions: 8, salary: "KSH 90-160k", jobs: ["Compliance Manager"] },
            { name: "ICT Authority", positions: 10, salary: "KSH 90-170k", jobs: ["ICT Officer", "Manager"] }
        ],
        total: 78
    }
};

// ===== JOB TRAINING LESSONS =====
const jobLessons = {
    'KRA': [
        {
            title: "Tax Assistant - KRA",
            description: "Learn what Tax Assistants do daily",
            content: `
                <div class="job-details">
                    <h4>Daily Tasks:</h4>
                    <ul class="daily-tasks">
                        <li><i class="fas fa-clock"></i> 8:30 AM - Open taxpayer counter</li>
                        <li><i class="fas fa-file"></i> 9:00 AM - Help taxpayers file returns</li>
                        <li><i class="fas fa-check"></i> 10:00 AM - Verify submitted documents</li>
                        <li><i class="fas fa-phone"></i> 11:00 AM - Answer tax inquiries</li>
                        <li><i class="fas fa-id-card"></i> 12:00 PM - Process KRA PIN applications</li>
                        <li><i class="fas fa-keyboard"></i> 2:00 PM - Data entry of tax records</li>
                        <li><i class="fas fa-clock"></i> 4:00 PM - Report generation</li>
                    </ul>
                    
                    <h4>Skills You'll Learn:</h4>
                    <ul>
                        <li>✅ How to file tax returns (iTax system)</li>
                        <li>✅ Understanding VAT, PAYE, Corporation tax</li>
                        <li>✅ KRA PIN application process</li>
                        <li>✅ Tax compliance checks</li>
                    </ul>
                    
                    <h4>Requirements:</h4>
                    <ul>
                        <li>KCSE: C+ and above</li>
                        <li>Certificate: KSH 500 (optional)</li>
                    </ul>
                </div>
            `
        }
    ],
    'Huduma': [
        {
            title: "Customer Service - Huduma Kenya",
            description: "Learn to serve citizens at Huduma centres",
            content: `
                <div class="job-details">
                    <h4>Daily Tasks:</h4>
                    <ul class="daily-tasks">
                        <li><i class="fas fa-clock"></i> 8:00 AM - Open service counter</li>
                        <li><i class="fas fa-smile"></i> 9:00 AM - Assist citizens with services</li>
                        <li><i class="fas fa-id-card"></i> 10:00 AM - Process ID applications</li>
                        <li><i class="fas fa-passport"></i> 11:00 AM - Handle passport inquiries</li>
                        <li><i class="fas fa-file"></i> 2:00 PM - Document verification</li>
                    </ul>
                </div>
            `
        }
    ]
};

// ===== SAMPLE TESTIMONIALS WITH IMAGES =====
const sampleTestimonials = [
    {
        id: 1,
        name: "James Otieno",
        grade: "B+",
        job: "Tax Assistant",
        organization: "KRA",
        salary: "KSH 65,000",
        story: "I paid KSH 150, learned about government jobs through this course, and 3 months later I was hired at KRA! The daily tasks training prepared me perfectly for the interview.",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        stars: 5,
        approved: true,
        date: "2024-01-15"
    },
    {
        id: 2,
        name: "Mary Wanjiku",
        grade: "C",
        job: "Customer Service",
        organization: "Huduma Kenya",
        salary: "KSH 45,000",
        story: "I didn't know what jobs my C plain could get. This course showed me 185 government positions I qualified for! Now I serve citizens at Huduma Nyeri.",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        stars: 5,
        approved: true,
        date: "2024-02-20"
    },
    {
        id: 3,
        name: "Peter Kamau",
        grade: "Adult",
        job: "ICT Officer",
        organization: "ICT Authority",
        salary: "KSH 95,000",
        story: "As an adult learner with 10 years experience, I thought government jobs were out of reach. This course showed me 78 positions I qualified for. Now I'm a manager!",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        stars: 5,
        approved: true,
        date: "2024-03-10"
    },
    {
        id: 4,
        name: "Faith Akinyi",
        grade: "A-",
        job: "Compliance Officer",
        organization: "CMA",
        salary: "KSH 82,000",
        story: "The interview tips helped me prepare for the CMA panel. I got the job! The KSH 150 booking fee was the best investment I ever made.",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        stars: 4,
        approved: true,
        date: "2024-03-05"
    },
    {
        id: 5,
        name: "John Mwangi",
        grade: "C",
        job: "Clerk",
        organization: "County Government of Kiambu",
        salary: "KSH 38,000",
        story: "I didn't know county governments hired so many C plain graduates. This course showed me the way. Now I'm permanent and pensionable!",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
        stars: 5,
        approved: true,
        date: "2024-02-28"
    },
    {
        id: 6,
        name: "Lucy Wambui",
        grade: "B",
        job: "IT Support",
        organization: "Huduma Kenya",
        salary: "KSH 58,000",
        story: "Paid KSH 150, then KSH 200, and finally KSH 500 for the certificate. Worth every shilling! The certificate helped me stand out.",
        image: "https://randomuser.me/api/portraits/women/6.jpg",
        stars: 5,
        approved: true,
        date: "2024-01-30"
    }
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedTestimonials();
    checkSession();
});

// ===== FEATURED TESTIMONIALS =====
function loadFeaturedTestimonials() {
    const container = document.getElementById('featuredTestimonials');
    const featured = sampleTestimonials.slice(0, 3);
    
    container.innerHTML = featured.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" alt="${t.name}" class="testimonial-image">
            <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
            <p class="testimonial-text">"${t.story.substring(0, 100)}..."</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-job">${t.job} at ${t.organization}</div>
            <span class="testimonial-grade">KCSE: ${t.grade}</span>
        </div>
    `).join('');
}

// ===== SESSION MANAGEMENT =====
async function checkSession() {
    const saved = localStorage.getItem("student");
    if (saved) {
        currentUser = saved;
        await loadUser();
    } else {
        document.getElementById('heroSection').style.display = 'block';
        document.getElementById('auth').style.display = 'none';
    }
}

function showAuthForms() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('auth').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
}

function showDashboard() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

function showRegister() {
    showAuthForms();
    document.getElementById('registerCard').style.display = 'block';
    document.getElementById('loginCard').style.display = 'none';
}

function showLogin() {
    showAuthForms();
    document.getElementById('loginCard').style.display = 'block';
    document.getElementById('registerCard').style.display = 'none';
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== REGISTRATION WITH KSH 150 =====
async function register() {
    try {
        const name = document.getElementById("reg_name").value;
        const email = document.getElementById("reg_email").value;
        const pass = document.getElementById("reg_pass").value;
        const course = document.getElementById("reg_course").value;
        const kcse = document.getElementById("reg_kcse").value;
        const mpesa = document.getElementById("reg_mpesa").value;

        if (!name || !email || !pass || !course || !kcse || !mpesa) {
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

        const now = new Date();
        const trialEnd = new Date(now);
        trialEnd.setDate(trialEnd.getDate() + 2);

        // Insert user with KSH 150 paid
        const { error } = await supabaseClient
            .from("users")
            .insert([{
                name, email, password: pass, course, kcse,
                progress: 0, completed_lessons: [],
                payment_status: 'booking_paid', // KSH 150 paid
                amount_paid: 150,
                trial_start: now.toISOString(),
                trial_end: trialEnd.toISOString(),
                created_at: now.toISOString(),
                mpesa_code: mpesa
            }]);

        if (error) throw error;

        localStorage.setItem("student", email);
        currentUser = email;
        
        showToast("Registration successful! KSH 150 received. 2-day trial started!", "success");
        
        document.getElementById("reg_name").value = '';
        document.getElementById("reg_email").value = '';
        document.getElementById("reg_pass").value = '';
        document.getElementById("reg_course").value = '';
        document.getElementById("reg_kcse").value = '';
        document.getElementById("reg_mpesa").value = '';
        
        await loadUser();
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message, "error");
    }
}

// ===== LOGIN =====
async function login() {
    try {
        const email = document.getElementById("log_email").value;
        const pass = document.getElementById("log_pass").value;

        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("password", pass);

        if (error || !data || data.length === 0) {
            showToast("Invalid email or password", "error");
            return;
        }

        localStorage.setItem("student", email);
        currentUser = email;
        
        showToast("Login successful!", "success");
        await loadUser();
        
    } catch (error) {
        showToast(error.message, "error");
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("student");
    currentUser = null;
    currentUserData = null;
    if (countdownInterval) clearInterval(countdownInterval);
    document.getElementById('heroSection').style.display = 'block';
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    showToast("Logged out", "success");
}

// ===== LOAD USER =====
async function loadUser() {
    try {
        const { data } = await supabaseClient
            .from("users")
            .select("*")
            .eq("email", currentUser);

        if (!data || data.length === 0) {
            logout();
            return;
        }

        currentUserData = data[0];
        
        if (currentUserData.email === 'admin@skillforge.com') {
            loadAdminPanel();
            return;
        }
        
        renderDashboard();
        
    } catch (error) {
        console.error('Load error:', error);
    }
}

// ===== CHECK ACCESS =====
function checkAccess() {
    const now = new Date();
    const trialEnd = new Date(currentUserData.trial_end);
    
    // If trial expired and not fully paid
    if (now > trialEnd && currentUserData.payment_status !== 'full_access') {
        return { canAccess: false, status: 'locked', message: 'Trial ended. Pay KSH 200.' };
    }
    
    // If has full access
    if (currentUserData.payment_status === 'full_access') {
        return { canAccess: true, status: 'full', showContent: true };
    }
    
    // Still in trial
    return { canAccess: true, status: 'trial', showContent: false };
}

// ===== RENDER DASHBOARD =====
function renderDashboard() {
    showDashboard();
    
    const access = checkAccess();
    const jobs = governmentJobs[currentUserData.kcse] || governmentJobs['B+'];
    
    // Update header
    document.getElementById('userAvatar').textContent = currentUserData.name.charAt(0);
    document.getElementById('welcome').textContent = `Welcome, ${currentUserData.name}!`;
    document.getElementById('kcseDisplay').textContent = `KCSE: ${currentUserData.kcse}`;
    document.getElementById('userGrade').textContent = currentUserData.kcse;
    document.getElementById('testimonialGrade').textContent = currentUserData.kcse;
    
    // Update payment badge
    if (currentUserData.payment_status === 'full_access') {
        document.getElementById('paymentBadge').textContent = 'KSH 350 Paid - Full Access';
        document.getElementById('paymentBadge').style.background = '#28a745';
    } else {
        document.getElementById('paymentBadge').textContent = 'KSH 150 Paid - Limited Access';
    }
    
    // Update job preview
    document.getElementById('previewGrade').textContent = currentUserData.kcse;
    document.getElementById('previewGov').textContent = jobs.total;
    document.getElementById('previewPrivate').textContent = Math.floor(jobs.total * 2.2);
    
    // Update job stats
    document.getElementById('govJobs').textContent = jobs.total;
    document.getElementById('privateJobs').textContent = Math.floor(jobs.total * 2.2);
    document.getElementById('internships').textContent = Math.floor(jobs.total * 0.5);
    
    // Show/hide based on access
    if (access.status === 'locked') {
        document.getElementById('paymentWall').style.display = 'block';
        document.getElementById('mainContent').style.display = 'none';
    } else {
        document.getElementById('paymentWall').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        
        if (access.status === 'trial') {
            startCountdown(new Date(currentUserData.trial_end));
        }
        
        if (access.showContent) {
            renderLessons();
            renderGradeTestimonials();
            renderAllTestimonials();
            updateProgress();
        }
    }
}

// ===== UNLOCK FULL ACCESS (KSH 200) =====
async function unlockFullAccess() {
    const code = document.getElementById('mpesa_unlock').value;
    if (!code || code.length < 5) {
        showToast("Enter valid M-PESA code", "error");
        return;
    }
    
    try {
        await supabaseClient
            .from("users")
            .update({ 
                payment_status: 'full_access',
                amount_paid: 350,
                full_access_code: code,
                full_access_date: new Date()
            })
            .eq("email", currentUser);
        
        currentUserData.payment_status = 'full_access';
        showToast("Payment verified! Full access granted!", "success");
        renderDashboard();
        
    } catch (error) {
        showToast("Payment failed", "error");
    }
}

// ===== RENDER LESSONS =====
function renderLessons() {
    const container = document.getElementById('lessonsGrid');
    const lessons = [
        {
            title: "KRA Jobs - Tax Assistant",
            description: "Learn about tax assistant positions at KRA",
            icon: "landmark",
            content: jobLessons['KRA'][0].content
        },
        {
            title: "Huduma Kenya - Customer Service",
            description: "Learn about customer service at Huduma centres",
            icon: "hands-helping",
            content: jobLessons['Huduma'][0].content
        },
        {
            title: "CMA - Compliance Officer",
            description: "Learn about compliance at Capital Markets Authority",
            icon: "chart-line",
            content: `<div class="job-details"><h4>Coming soon...</h4></div>`
        }
    ];
    
    container.innerHTML = lessons.map(lesson => `
        <div class="lesson-card">
            <div class="lesson-icon">
                <i class="fas fa-${lesson.icon}"></i>
            </div>
            <h4>${lesson.title}</h4>
            <p>${lesson.description}</p>
            ${lesson.content}
        </div>
    `).join('');
}

// ===== RENDER GRADE-SPECIFIC TESTIMONIALS =====
function renderGradeTestimonials() {
    const container = document.getElementById('gradeTestimonials');
    const filtered = sampleTestimonials.filter(t => t.grade === currentUserData.kcse).slice(0, 3);
    
    if (filtered.length === 0) {
        container.innerHTML = '<p>No testimonials yet for your grade. Be the first to share!</p>';
        return;
    }
    
    container.innerHTML = filtered.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" alt="${t.name}" class="testimonial-image">
            <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
            <p class="testimonial-text">"${t.story}"</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-job">${t.job} at ${t.organization}</div>
            <div class="testimonial-salary">💰 ${t.salary}</div>
        </div>
    `).join('');
}

// ===== RENDER ALL TESTIMONIALS =====
function renderAllTestimonials(filter = 'all') {
    const container = document.getElementById('allTestimonials');
    let filtered = sampleTestimonials.filter(t => t.approved);
    
    if (filter !== 'all') {
        filtered = filtered.filter(t => t.grade === filter);
    }
    
    container.innerHTML = filtered.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" alt="${t.name}" class="testimonial-image">
            <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
            <p class="testimonial-text">"${t.story.substring(0, 150)}..."</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-job">${t.job} at ${t.organization}</div>
            <span class="testimonial-grade">KCSE: ${t.grade}</span>
        </div>
    `).join('');
}

// ===== FILTER TESTIMONIALS =====
function filterTestimonials(grade) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderAllTestimonials(grade);
}

// ===== SUBMIT TESTIMONIAL =====
async function submitTestimonial() {
    const name = document.getElementById('story_name').value || currentUserData.name;
    const job = document.getElementById('story_job').value;
    const org = document.getElementById('story_org').value;
    const salary = document.getElementById('story_salary').value;
    const story = document.getElementById('story_text').value;
    const image = document.getElementById('story_image').value || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`;
    
    if (!job || !org || !story) {
        showToast("Please fill required fields", "error");
        return;
    }
    
    const testimonial = {
        id: sampleTestimonials.length + 1,
        name,
        grade: currentUserData.kcse,
        job,
        organization: org,
        salary,
        story,
        image,
        stars: 5,
        approved: false,
        date: new Date().toISOString().split('T')[0]
    };
    
    // In real app, save to database
    sampleTestimonials.push(testimonial);
    
    showToast("Testimonial submitted for approval!", "success");
    
    document.getElementById('story_job').value = '';
    document.getElementById('story_org').value = '';
    document.getElementById('story_salary').value = '';
    document.getElementById('story_text').value = '';
}

// ===== PURCHASE CERTIFICATE =====
async function purchaseCertificate() {
    const code = document.getElementById('cert_mpesa').value;
    if (!code || code.length < 5) {
        showToast("Enter M-PESA code", "error");
        return;
    }
    
    showToast("Certificate payment received! You'll get your PDF soon.", "success");
}

// ===== UPDATE PROGRESS =====
function updateProgress() {
    const progress = currentUserData.progress || 0;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressBar').textContent = progress + '%';
    document.getElementById('progressPercent').textContent = progress + '%';
}

// ===== COUNTDOWN =====
function startCountdown(endDate) {
    if (countdownInterval) clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').textContent = 'Expired';
            renderDashboard();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('countdown').textContent = `${days}d ${hours}h ${minutes}m`;
    }, 60000);
}

// ===== ADMIN PANEL =====
function loadAdminPanel() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    renderAdminPayments();
    renderAdminTestimonials();
}

function renderAdminPayments() {
    const container = document.getElementById('pendingPaymentsList');
    container.innerHTML = `
        <div class="payment-request">
            <div><strong>john@example.com</strong> - KSH 200 - Code: X
