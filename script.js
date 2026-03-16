// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let pendingUsers = [];

// ===== KENYAN TESTIMONIALS WITH REAL KENYAN FACES =====
const testimonials = [
    {
        name: "James Otieno",
        grade: "B+",
        job: "Tax Assistant",
        org: "KRA - Kenya Revenue Authority",
        story: "Nilipay KSH 150, nikajifunza kuhusu kazi za serikali, na baada ya miezi 3 nikaajiriwa KRA! Asante SkillForge!",
        image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "Mary Wanjiku",
        grade: "C",
        job: "Customer Service",
        org: "Huduma Kenya - Nyeri",
        story: "Sikujua ni kazi gani ningepata na C plain yangu. Kozi hii ilionyesha nafasi 185 za serikali! Sasa niko Huduma Nyeri.",
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "Peter Kamau",
        grade: "Adult",
        job: "ICT Officer",
        org: "ICT Authority",
        story: "Mimi mwanafunzi mzima nilidhani kazi za serikali ni ngumu. Sasa niko ICT Authority! Usikate tamaa.",
        image: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "Faith Akinyi",
        grade: "A-",
        job: "Compliance Officer",
        org: "CMA - Capital Markets Authority",
        story: "Niliomba nafasi 8, nikaitwa interview 3, sasa niko CMA! KSH 150 ilikuwa investment bora kabisa.",
        image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "John Mwangi",
        grade: "C",
        job: "Clerk",
        org: "County Government of Kiambu",
        story: "County zinaajiri watu wengi wa C plain. Sasa niko permanent na pension! Nashukuru.",
        image: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "Lucy Wambui",
        grade: "B",
        job: "IT Support",
        org: "Huduma Kenya",
        story: "Nililipa KSH 150, KSH 200, na KSH 500 kwa cheti. Yote ilifaa! Sasa niko na kazi nzuri.",
        image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "Brian Odhiambo",
        grade: "B-",
        job: "Customs Officer",
        org: "KRA - Customs Department",
        story: "Nimeajiriwa KRA Customs Mombasa! Kazi nzuri na malipo mazuri. Mungu ni mwema.",
        image: "https://images.pexels.com/photos/2770600/pexels-photo-2770600.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "Sarah Chepkemoi",
        grade: "C+",
        job: "Receptionist",
        org: "Huduma Kenya - Eldoret",
        story: "Nilikuwa natafuta kazi kwa muda mrefu. Kozi hii ilinionyesha njia ya kuingia Huduma. Asanteni!",
        image: "https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 4
    },
    {
        name: "David Mwangi",
        grade: "D+",
        job: "Intern",
        org: "ICT Authority",
        story: "Nilianza kama intern, sasa nimepata nafasi ya kuapply permanent. SkillForge imenisaidia sana.",
        image: "https://images.pexels.com/photos/2623917/pexels-photo-2623917.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 4
    },
    {
        name: "Esther Akoth",
        grade: "B+",
        job: "Tax Officer",
        org: "KRA - Headquarters",
        story: "Nilimaliza kozi, nikapata cheti cha KSH 500, na sasa niko KRA! Cheti kilinisaidia interview.",
        image: "https://images.pexels.com/photos/1855582/pexels-photo-1855582.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    },
    {
        name: "Joseph Kipchoge",
        grade: "C",
        job: "Driver",
        org: "County Government of Uasin Gishu",
        story: "Sijui kwanini nilidhani C haifai. County zina nafasi nyingi! Niko na kazi sasa.",
        image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 4
    },
    {
        name: "Grace Njeri",
        grade: "Adult",
        job: "Administrative Assistant",
        org: "Ministry of Education",
        story: "Nilianza kama adult learner, sasa niko Ministry of Education. Usiogope kujaribu!",
        image: "https://images.pexels.com/photos/1820917/pexels-photo-1820917.jpeg?auto=compress&cs=tinysrgb&w=400",
        stars: 5
    }
];

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
            description: "Jifunze kazi za Tax Assistant KRA",
            content: `
                <div class="job-details">
                    <h4>Kazi za Kila Siku:</h4>
                    <ul class="daily-tasks">
                        <li><i class="fas fa-clock"></i> 8:30 AM - Fungua kaunta</li>
                        <li><i class="fas fa-file"></i> 9:00 AM - Saidia walipa kodi</li>
                        <li><i class="fas fa-check"></i> 10:00 AM - Angalia nyaraka</li>
                        <li><i class="fas fa-phone"></i> 11:00 AM - Jibu maswali</li>
                        <li><i class="fas fa-id-card"></i> 12:00 PM - Chapisha KRA PIN</li>
                    </ul>
                    
                    <h4>Ujuzi Utakaopata:</h4>
                    <ul>
                        <li>✅ Kutumia iTax system</li>
                        <li>✅ Kuelewa VAT na PAYE</li>
                        <li>✅ Huduma kwa wateja</li>
                    </ul>
                </div>
            `
        }
    ],
    'Huduma': [
        {
            title: "Customer Service - Huduma Kenya",
            description: "Jifunze kuhudumia wananchi",
            content: `
                <div class="job-details">
                    <h4>Kazi za Kila Siku:</h4>
                    <ul class="daily-tasks">
                        <li><i class="fas fa-clock"></i> 8:00 AM - Fungua kaunta</li>
                        <li><i class="fas fa-smile"></i> 9:00 AM - Saidia wananchi</li>
                        <li><i class="fas fa-id-card"></i> 10:00 AM - Chapisha ID</li>
                        <li><i class="fas fa-passport"></i> 11:00 AM - Huduma ya paspoti</li>
                    </ul>
                </div>
            `
        }
    ]
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedTestimonials();
    checkSession();
});

// ===== LOAD FEATURED TESTIMONIALS =====
function loadFeaturedTestimonials() {
    const container = document.getElementById('featuredTestimonials');
    if (!container) return;
    
    const featured = testimonials.slice(0, 6);
    
    container.innerHTML = featured.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" alt="${t.name}" class="testimonial-image" onerror="this.src='https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'">
            <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
            <p class="testimonial-text">"${t.story}"</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-job">${t.job} - ${t.org}</div>
            <span class="testimonial-grade">KCSE: ${t.grade}</span>
        </div>
    `).join('');
}

// ===== PAGE NAVIGATION =====
function showHeroSection() {
    document.getElementById('heroSection').style.display = 'block';
    document.getElementById('registrationPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

function showRegistrationPage() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('registrationPage').style.display = 'block';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

function showLoginPage() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('registrationPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('registrationPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    loadPendingRegistrations();
}

function showDashboard() {
    document.getElementById('heroSection').style.display = 'none';
    document.getElementById('registrationPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// ===== UPDATE ACCOUNT DISPLAY =====
function updateAccountDisplay(email) {
    const display = document.getElementById('accountDisplay');
    if (display) display.textContent = email || 'Your Email';
}

// ===== TOAST =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== SUBMIT REGISTRATION =====
async function submitRegistration() {
    try {
        const name = document.getElementById('reg_name').value;
        const email = document.getElementById('reg_email').value;
        const password = document.getElementById('reg_pass').value;
        const kcse = document.getElementById('reg_kcse').value;
        const course = document.getElementById('reg_course').value;
        const mpesaMessage = document.getElementById('reg_mpesa').value;

        // Validation
        if (!name || !email || !password || !kcse || !course || !mpesaMessage) {
            showToast('Tafadhali jaza sehemu zote', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password lazima iwe na herufi 6 au zaidi', 'error');
            return;
        }

        // Extract M-PESA code from message
        const mpesaCode = mpesaMessage.match(/[A-Z0-9]{6,10}/g)?.[0] || 'MANUAL-' + Date.now();

        // Save to Supabase
        const { error } = await supabaseClient
            .from('users')
            .insert([{
                name,
                email,
                password,
                kcse,
                course,
                mpesa_message: mpesaMessage,
                mpesa_code: mpesaCode,
                amount_paid: 150,
                status: 'pending',
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        showToast('Umefanikiwa! Subiri admin akubali.', 'success');
        
        // Clear form
        document.getElementById('registrationForm').reset();
        
        // Go to login page
        showLoginPage();
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast(error.message, 'error');
    }
}

// ===== LOGIN =====
async function login() {
    try {
        const email = document.getElementById('log_email').value;
        const password = document.getElementById('log_pass').value;

        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password);

        if (error) throw error;

        if (!data || data.length === 0) {
            showToast('Email au password si sahihi', 'error');
            return;
        }

        const user = data[0];
        
        // Check if admin
        if (email === 'admin@skillforge.com') {
            currentUser = user;
            showAdminPanel();
            return;
        }

        // Check if approved
        if (user.status !== 'approved') {
            showToast('Akaunti yako haijaidhinishwa. Subiri admin.', 'info');
            return;
        }

        currentUser = user;
        localStorage.setItem('student', email);
        renderDashboard();
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem('student');
    currentUser = null;
    showHeroSection();
    showToast('Umetoka vizuri', 'success');
}

// ===== LOAD PENDING REGISTRATIONS (ADMIN) =====
async function loadPendingRegistrations() {
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('status', 'pending');

        if (error) throw error;

        const container = document.getElementById('pendingRegistrations');
        
        if (!container) return;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p>Hakuna watu wanaosubiri</p>';
            return;
        }

        container.innerHTML = data.map(user => `
            <div class="pending-payment">
                <div class="payment-details">
                    <strong>${user.name}</strong> (${user.email})<br>
                    KCSE: ${user.kcse} | Course: ${user.course}<br>
                    M-PESA: ${user.mpesa_code}<br>
                    <small>${new Date(user.created_at).toLocaleString()}</small>
                </div>
                <div class="payment-actions">
                    <button class="btn-approve" onclick="approveUser('${user.email}')">✓ Idhinisha</button>
                    <button class="btn-reject" onclick="rejectUser('${user.email}')">✗ Kataa</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading pending:', error);
    }
}

// ===== APPROVE USER (ADMIN) =====
async function approveUser(email) {
    try {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 2);

        const { error } = await supabaseClient
            .from('users')
            .update({ 
                status: 'approved',
                trial_start: new Date().toISOString(),
                trial_end: trialEnd.toISOString(),
                progress: 0,
                completed_lessons: []
            })
            .eq('email', email);

        if (error) throw error;

        showToast(`✅ ${email} ameidhinishwa!`, 'success');
        loadPendingRegistrations();
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== REJECT USER (ADMIN) =====
async function rejectUser(email) {
    try {
        const { error } = await supabaseClient
            .from('users')
            .delete()
            .eq('email', email);

        if (error) throw error;

        showToast(`❌ ${email} amekataliwa`, 'success');
        loadPendingRegistrations();
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== RENDER DASHBOARD =====
function renderDashboard() {
    showDashboard();
    
    const user = currentUser;
    
    document.getElementById('userAvatar').textContent = user.name.charAt(0);
    document.getElementById('welcomeName').textContent = `Karibu, ${user.name}!`;
    document.getElementById('userGrade').textContent = `KCSE: ${user.kcse}`;
    
    // Check trial status
    const now = new Date();
    const trialEnd = new Date(user.trial_end);
    
    if (now <= trialEnd) {
        document.getElementById('trialTimer').style.display = 'block';
        startCountdown(trialEnd);
        document.getElementById('paymentStatus').textContent = 'Trial Inaendelea';
        document.getElementById('paymentStatus').className = 'payment-status';
    } else {
        document.getElementById('trialTimer').style.display = 'none';
        document.getElementById('paymentStatus').textContent = 'Trial Imeisha - Lipa KSH 200';
        document.getElementById('paymentStatus').className = 'payment-status';
    }
    
    // Load dashboard content
    loadDashboardContent(user);
}

// ===== LOAD DASHBOARD CONTENT =====
function loadDashboardContent(user) {
    const container = document.getElementById('dashboardContent');
    
    const jobs = governmentJobs[user.kcse] || governmentJobs['B+'];
    
    container.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 20px;">
            <h3>📊 Job Market - KCSE ${user.kcse}</h3>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0;">
                <div style="background: #f8f9fa; padding: 1.5rem; text-align: center; border-radius: 10px;">
                    <div style="font-size: 2rem; color: #667eea; font-weight: 700;">${jobs.total}</div>
                    <div>Government Jobs</div>
                </div>
                <div style="background: #f8f9fa; padding: 1.5rem; text-align: center; border-radius: 10px;">
                    <div style="font-size: 2rem; color: #667eea; font-weight: 700;">${Math.floor(jobs.total * 2)}</div>
                    <div>Private Sector</div>
                </div>
                <div style="background: #f8f9fa; padding: 1.5rem; text-align: center; border-radius: 10px;">
                    <div style="font-size: 2rem; color: #667eea; font-weight: 700;">${Math.floor(jobs.total * 0.5)}</div>
                    <div>Internships</div>
                </div>
            </div>
            
            <h4 style="margin: 2rem 0 1rem;">🏛️ Government Agencies</h4>
            ${jobs.agencies.map(agency => `
                <div style="background: #f8f9fa; padding: 1rem; margin: 0.5rem 0; border-radius: 10px;">
                    <strong>${agency.name}</strong> - ${agency.positions} positions
                    <div style="font-size: 0.9rem; color: #666;">${agency.salary}</div>
                </div>
            `).join('')}
            
            <h4 style="margin: 2rem 0 1rem;">📚 Mafunzo ya Kazi</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div class="lesson-card">
                    <h5>KRA - Tax Assistant</h5>
                    <p>Jifunze kazi za KRA</p>
                    <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;" onclick="alert('Lesson coming soon!')">Fungua</button>
                </div>
                <div class="lesson-card">
                    <h5>Huduma Kenya</h5>
                    <p>Jifunze kuhudumia wananchi</p>
                    <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;" onclick="alert('Lesson coming soon!')">Fungua</button>
                </div>
            </div>
        </div>
    `;
}

// ===== COUNTDOWN TIMER =====
function startCountdown(endDate) {
    const interval = setInterval(() => {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            clearInterval(interval);
            document.getElementById('countdown').textContent = 'Imeisha';
            renderDashboard();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        document.getElementById('countdown').textContent = `${days}d ${hours}h`;
    }, 60000);
}

// ===== CHECK SESSION =====
async function checkSession() {
    const savedEmail = localStorage.getItem('student');
    
    if (savedEmail) {
        const { data } = await supabaseClient
            .from('users')
            .select('*')
            .eq('email', savedEmail);
            
        if (data && data.length > 0) {
            currentUser = data[0];
            
            if (savedEmail === 'admin@skillforge.com') {
                showAdminPanel();
            } else if (currentUser.status === 'approved') {
                renderDashboard();
            } else {
                showHeroSection();
            }
            return;
        }
    }
    
    showHeroSection();
}

// ===== MAKE FUNCTIONS GLOBAL =====
window.showRegistrationPage = showRegistrationPage;
window.showLoginPage = showLoginPage;
window.showHeroSection = showHeroSection;
window.submitRegistration = submitRegistration;
window.login = login;
window.logout = logout;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.updateAccountDisplay = updateAccountDisplay;
window.showAdminPanel = showAdminPanel;
