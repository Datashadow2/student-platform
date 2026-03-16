// ===== SUPABASE CONFIG =====
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== GLOBAL VARIABLES =====
let currentUser = null;

// ===== KENYAN TESTIMONIALS - ONE IMAGE PER PERSON =====
const testimonials = [
    {
        name: "James Otieno",
        grade: "B+",
        job: "Tax Assistant",
        org: "KRA - Kenya Revenue Authority",
        story: "Nilipay KSH 150, nikajifunza kuhusu kazi za serikali, na baada ya miezi 3 nikaajiriwa KRA! Asante SkillForge!",
        image: "https://images.pexels.com/photos/5792980/pexels-photo-5792980.jpeg",
        stars: 5
    },
    {
        name: "Mary Wanjiku",
        grade: "C",
        job: "Customer Service",
        org: "Huduma Kenya - Nyeri",
        story: "Sikujua ni kazi gani ningepata na C plain yangu. Kozi hii ilionyesha nafasi 185 za serikali! Sasa niko Huduma Nyeri.",
        image: "https://images.pexels.com/photos/1390128/pexels-photo-1390128.jpeg",
        stars: 5
    },
    {
        name: "Peter Kamau",
        grade: "Adult",
        job: "ICT Officer",
        org: "ICT Authority",
        story: "Mimi mwanafunzi mzima nilidhani kazi za serikali ni ngumu. Sasa niko ICT Authority! Usikate tamaa.",
        image: "https://images.pexels.com/photos/35165475/pexels-photo-35165475.jpeg",
        stars: 5
    },
    {
        name: "Faith Akinyi",
        grade: "A-",
        job: "Compliance Officer",
        org: "CMA - Capital Markets Authority",
        story: "Niliomba nafasi 8, nikaitwa interview 3, sasa niko CMA! KSH 150 ilikuwa investment bora kabisa.",
        image: "https://images.pexels.com/photos/1255010/pexels-photo-1255010.jpeg",
        stars: 5
    },
    {
        name: "John Mwangi",
        grade: "C",
        job: "Clerk",
        org: "County Government of Kiambu",
        story: "County zinaajiri watu wengi wa C plain. Sasa niko permanent na pension! Nashukuru.",
        image: "https://images.pexels.com/photos/29079409/pexels-photo-29079409.jpeg",
        stars: 5
    },
    {
        name: "Lucy Wambui",
        grade: "B",
        job: "IT Support",
        org: "Huduma Kenya",
        story: "Nililipa KSH 150, KSH 200, na KSH 500 kwa cheti. Yote ilifaa! Sasa niko na kazi nzuri.",
        image: "https://images.pexels.com/photos/35081993/pexels-photo-35081993.jpeg",
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
                        <li><i class="fas fa-keyboard"></i> 2:00 PM - Weka data</li>
                        <li><i class="fas fa-file-pdf"></i> 4:00 PM - Tengeneza ripoti</li>
                    </ul>
                    
                    <h4>Ujuzi Utakaopata:</h4>
                    <ul>
                        <li>✅ Kutumia iTax system</li>
                        <li>✅ Kuelewa VAT, PAYE, Corporation tax</li>
                        <li>✅ Kusaidi wateja kujaza returns</li>
                        <li>✅ Huduma kwa wateja</li>
                    </ul>
                    
                    <h4>Mahitaji:</h4>
                    <ul>
                        <li>KCSE C+ na kuendelea</li>
                        <li>Certificate ya KSH 500 (optional)</li>
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
                        <li><i class="fas fa-file"></i> 2:00 PM - Angalia nyaraka</li>
                        <li><i class="fas fa-phone"></i> 3:00 PM - Jibu maswali</li>
                    </ul>
                    
                    <h4>Ujuzi Utakaopata:</h4>
                    <ul>
                        <li>✅ Huduma kwa wateja</li>
                        <li>✅ Kutumia Huduma system</li>
                        <li>✅ Kuhudumia ID, paspoti, cheti</li>
                    </ul>
                </div>
            `
        }
    ],
    'CMA': [
        {
            title: "Compliance Officer - CMA",
            description: "Jifunze kazi za Capital Markets Authority",
            content: `
                <div class="job-details">
                    <h4>Kazi za Kila Siku:</h4>
                    <ul class="daily-tasks">
                        <li><i class="fas fa-clock"></i> 9:00 AM - Angalia compliance</li>
                        <li><i class="fas fa-file"></i> 10:00 AM - Review reports</li>
                        <li><i class="fas fa-check"></i> 11:00 AM - Inspect companies</li>
                        <li><i class="fas fa-gavel"></i> 2:00 PM - Enforce regulations</li>
                    </ul>
                    
                    <h4>Mahitaji:</h4>
                    <ul>
                        <li>KCSE B+ na kuendelea</li>
                        <li>Degree in Finance/Law</li>
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
    
    // Show first 6 testimonials
    const featured = testimonials.slice(0, 6);
    
    container.innerHTML = featured.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" 
                 alt="${t.name}" 
                 class="testimonial-image"
                 style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;"
                 onerror="this.onerror=null; this.src='https://images.pexels.com/photos/5792980/pexels-photo-5792980.jpeg';">
            <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
            <p class="testimonial-text">"${t.story}"</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-job">${t.job} - ${t.org}</div>
            <span class="testimonial-grade">KCSE: ${t.grade}</span>
        </div>
    `).join('');
}

// ===== LOAD GRADE-SPECIFIC TESTIMONIALS =====
function loadGradeTestimonials(grade) {
    const container = document.getElementById('gradeTestimonials');
    if (!container) return;
    
    const filtered = testimonials.filter(t => t.grade === grade).slice(0, 3);
    
    if (filtered.length === 0) {
        container.innerHTML = '<p>Hakuna testimonial za grade yako bado. Kuwa wa kwanza!</p>';
        return;
    }
    
    container.innerHTML = filtered.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" 
                 alt="${t.name}" 
                 class="testimonial-image"
                 style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
            <p class="testimonial-text">"${t.story}"</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-job">${t.job} - ${t.org}</div>
        </div>
    `).join('');
}

// ===== LOAD ALL TESTIMONIALS WITH FILTER =====
function loadAllTestimonials(filter = 'all') {
    const container = document.getElementById('allTestimonials');
    if (!container) return;
    
    let filtered = testimonials;
    if (filter !== 'all') {
        filtered = testimonials.filter(t => t.grade === filter);
    }
    
    container.innerHTML = filtered.map(t => `
        <div class="testimonial-card">
            <img src="${t.image}" 
                 alt="${t.name}" 
                 class="testimonial-image"
                 style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
            <div class="testimonial-stars">${'⭐'.repeat(t.stars)}</div>
            <p class="testimonial-text">"${t.story}"</p>
            <div class="testimonial-name">${t.name}</div>
            <div class="testimonial-job">${t.job} - ${t.org}</div>
            <span class="testimonial-grade">KCSE: ${t.grade}</span>
        </div>
    `).join('');
}

// ===== FILTER TESTIMONIALS =====
function filterTestimonials(grade) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    loadAllTestimonials(grade);
}

// ===== SUBMIT TESTIMONIAL =====
async function submitTestimonial() {
    const name = document.getElementById('story_name')?.value || currentUser?.name;
    const job = document.getElementById('story_job')?.value;
    const org = document.getElementById('story_org')?.value;
    const story = document.getElementById('story_text')?.value;
    
    if (!job || !org || !story) {
        showToast('Tafadhali jaza sehemu zote', 'error');
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from('testimonials')
            .insert([{
                name: name,
                email: currentUser?.email,
                grade: currentUser?.kcse,
                job: job,
                organization: org,
                story: story,
                image: "https://images.pexels.com/photos/5792980/pexels-photo-5792980.jpeg",
                stars: 5,
                approved: false,
                created_at: new Date()
            }]);
            
        if (error) throw error;
        
        showToast('Testimonial imetumwa! Inasubiri kuidhinishwa.', 'success');
        
        document.getElementById('story_job').value = '';
        document.getElementById('story_org').value = '';
        document.getElementById('story_text').value = '';
        
    } catch (error) {
        console.error('Testimonial error:', error);
        showToast('Error submitting testimonial', 'error');
    }
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
    loadPendingTestimonials();
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

        if (!name || !email || !password || !kcse || !course || !mpesaMessage) {
            showToast('Tafadhali jaza sehemu zote', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password lazima iwe na herufi 6 au zaidi', 'error');
            return;
        }

        const mpesaCode = mpesaMessage.match(/[A-Z0-9]{6,10}/g)?.[0] || 'MANUAL-' + Date.now();
        const now = new Date();
        const trialEnd = new Date(now);
        trialEnd.setDate(trialEnd.getDate() + 2);

        const { error } = await supabaseClient
            .from('users')
            .insert([{
                name: name,
                email: email,
                password: password,
                kcse: kcse,
                course: course,
                mpesa_message: mpesaMessage,
                mpesa_code: mpesaCode,
                amount_paid: 150,
                status: 'pending',
                trial_start: now.toISOString(),
                trial_end: trialEnd.toISOString(),
                progress: 0,
                completed_lessons: [],
                payment_status: 'booking_paid',
                created_at: now.toISOString()
            }]);

        if (error) throw error;

        showToast('Umefanikiwa! Subiri admin akubali.', 'success');
        document.getElementById('registrationForm').reset();
        showLoginPage();
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed: ' + error.message, 'error');
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
        
        if (email === 'admin@skillforge.com') {
            currentUser = user;
            showAdminPanel();
            return;
        }

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

// ===== LOAD PENDING TESTIMONIALS (ADMIN) =====
async function loadPendingTestimonials() {
    try {
        const { data, error } = await supabaseClient
            .from('testimonials')
            .select('*')
            .eq('approved', false);

        if (error) throw error;

        const container = document.getElementById('pendingTestimonialsList');
        
        if (!container) return;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p>Hakuna testimonials zinazosubiri</p>';
            return;
        }

        container.innerHTML = data.map(t => `
            <div class="pending-payment">
                <div class="payment-details">
                    <strong>${t.name}</strong> (${t.email})<br>
                    KCSE: ${t.grade} | ${t.job} at ${t.organization}<br>
                    "${t.story.substring(0, 100)}..."<br>
                    <small>${new Date(t.created_at).toLocaleString()}</small>
                </div>
                <div class="payment-actions">
                    <button class="btn-approve" onclick="approveTestimonial('${t.id}')">✓ Idhinisha</button>
                    <button class="btn-reject" onclick="rejectTestimonial('${t.id}')">✗ Kataa</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// ===== APPROVE USER (ADMIN) =====
async function approveUser(email) {
    try {
        const { error } = await supabaseClient
            .from('users')
            .update({ status: 'approved' })
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

// ===== APPROVE TESTIMONIAL (ADMIN) =====
async function approveTestimonial(id) {
    try {
        const { error } = await supabaseClient
            .from('testimonials')
            .update({ approved: true })
            .eq('id', id);

        if (error) throw error;

        showToast(`✅ Testimonial imeidhinishwa!`, 'success');
        loadPendingTestimonials();
        loadAllTestimonials();
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== REJECT TESTIMONIAL (ADMIN) =====
async function rejectTestimonial(id) {
    try {
        const { error } = await supabaseClient
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showToast(`❌ Testimonial imekataliwa`, 'success');
        loadPendingTestimonials();
        
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// ===== RENDER DASHBOARD =====
function renderDashboard() {
    showDashboard();
    
    const user = currentUser;
    
    document.getElementById('userAvatar').textContent = user.name ? user.name.charAt(0) : 'U';
    document.getElementById('welcomeName').textContent = `Karibu, ${user.name || 'User'}!`;
    document.getElementById('userGrade').textContent = `KCSE: ${user.kcse || 'N/A'}`;
    
    if (user.trial_end) {
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
    } else {
        document.getElementById('trialTimer').style.display = 'none';
        document.getElementById('paymentStatus').textContent = 'Active';
    }
    
    loadDashboardContent(user);
}

// ===== LOAD DASHBOARD CONTENT =====
function loadDashboardContent(user) {
    const container = document.getElementById('dashboardContent');
    if (!container) return;
    
    const jobs = governmentJobs[user.kcse] || governmentJobs['B+'];
    
    if (user.kcse) {
        loadGradeTestimonials(user.kcse);
    }
    
    container.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 20px;">
            <h3>📊 Job Market - KCSE ${user.kcse || 'N/A'}</h3>
            
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
                    <div style="font-size: 0.9rem;">${agency.jobs.join(' • ')}</div>
                </div>
            `).join('')}
            
            <h4 style="margin: 2rem 0 1rem;">📚 Mafunzo ya Kazi</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px;">
                    <h5>KRA - Tax Assistant</h5>
                    <p>Jifunze kazi za KRA</p>
                    <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;" onclick="alert('Lesson coming soon!')">Fungua</button>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px;">
                    <h5>Huduma Kenya</h5>
                    <p>Jifunze kuhudumia wananchi</p>
                    <button style="background: #667eea; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;" onclick="alert('Lesson coming soon!')">Fungua</button>
                </div>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px;">
                    <h5>CMA - Compliance</h5>
                    <p>Jifunze kazi za CMA</p>
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

// ===== PURCHASE CERTIFICATE =====
async function purchaseCertificate() {
    const code = document.getElementById('cert_mpesa')?.value;
    if (!code || code.length < 5) {
        showToast('Weka M-PESA code', 'error');
        return;
    }
    
    showToast('Malipo yamepokelewa! Utapata certificate soon.', 'success');
    document.getElementById('cert_mpesa').value = '';
}

// ===== UNLOCK FULL ACCESS (KSH 200) =====
async function unlockFullAccess() {
    const code = document.getElementById('mpesa_unlock')?.value;
    if (!code || code.length < 5) {
        showToast('Weka M-PESA code', 'error');
        return;
    }
    
    try {
        await supabaseClient
            .from('users')
            .update({ 
                payment_status: 'full_access',
                amount_paid: 350,
                full_access_code: code,
                full_access_date: new Date()
            })
            .eq('email', currentUser.email);
        
        currentUser.payment_status = 'full_access';
        showToast('Umefanikiwa! Full access imefunguliwa!', 'success');
        renderDashboard();
        
    } catch (error) {
        showToast('Payment failed', 'error');
    }
}

// ===== CHECK SESSION =====
async function checkSession() {
    const savedEmail = localStorage.getItem('student');
    
    if (savedEmail) {
        try {
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
        } catch (e) {
            console.log('Session check error:', e);
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
window.purchaseCertificate = purchaseCertificate;
window.unlockFullAccess = unlockFullAccess;
window.filterTestimonials = filterTestimonials;
window.submitTestimonial = submitTestimonial;
window.approveTestimonial = approveTestimonial;
window.rejectTestimonial = rejectTestimonial;
