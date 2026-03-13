// --- Supabase setup ---
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "sb_publishable_t856nqE72fz3X3RFJstmDQ_K5nkoftv";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const dashboard = document.getElementById("dashboard");
const auth = document.getElementById("auth");
const usernameSpan = document.getElementById("username");
const trialInfo = document.getElementById("trialInfo");
const progressFill = document.getElementById("progressFill");
const badgesContainer = document.getElementById("badgesContainer");
const lessonsDiv = document.getElementById("lessons");

let currentUser;

// --- Register with Auto-login ---
registerBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(!name || !email || !password){ 
    alert("Fill all fields"); 
    return; 
  }

  // Insert new user into Supabase
  const { data, error } = await supabase
    .from("users")
    .insert([{ 
      name, 
      email, 
      password, 
      signup_date: new Date(), 
      paid_200k: false, 
      paid_500k_certificate:false,
      progress:0, 
      streak:0, 
      badges: []
    }])
    .select() // Return the inserted row
    .single();

  if(error) {
    alert("Error: "+error.message);
  } else {
    alert("Registered successfully! Logging you in...");
    currentUser = data; // Set current user to the newly created user
    showDashboard(); // Automatically show dashboard
  }
});

// --- Login ---
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(!email || !password){ alert("Fill all fields"); return; }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if(error) alert("Login failed: "+error.message);
  else {
    currentUser = data;
    showDashboard();
  }
});

// --- Show Dashboard ---
function showDashboard(){
  auth.style.display = "none";
  dashboard.style.display = "block";
  usernameSpan.textContent = currentUser.name;

  // --- Trial calculation ---
  const signupDate = new Date(currentUser.signup_date);
  const now = new Date();
  const diff = (now - signupDate)/(1000*60*60*24); // in days

  lessonsDiv.innerHTML = ""; // clear lessons

  if(diff < 2 || currentUser.paid_200k){
    trialInfo.textContent = `Trial active. Day ${Math.floor(diff)+1}`;

    // Trial reminders
    if(diff > 1.5 && !currentUser.paid_200k){
      alert("Reminder: Your trial ends soon. Pay 200 KSh to continue access!");
    }

    showLessons(currentUser.paid_200k);
  } else {
    trialInfo.textContent = "Trial expired. Please pay 200 KSh to continue learning.";

    // Show placeholder payment button
    const payDiv = document.createElement("div");
    payDiv.innerHTML = `<button id="pay200Btn">Pay 200 KSh to Unlock Lessons</button>`;
    lessonsDiv.appendChild(payDiv);

    document.getElementById("pay200Btn").addEventListener("click", async () => {
      alert("Payment placeholder: Marking account as paid 200 KSh...");
      // Update Supabase
      const { error } = await supabase
        .from("users")
        .update({ paid_200k: true })
        .eq("id", currentUser.id);
      if(error) alert("Error: "+error.message);
      else {
        currentUser.paid_200k = true;
        showDashboard();
      }
    });
  }

  // --- Progress & badges ---
  progressFill.style.width = currentUser.progress+"%";
  badgesContainer.innerHTML = "";
  currentUser.badges.forEach(b => {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = b;
    badgesContainer.appendChild(badge);
  });

  // --- Certificate button ---
  if(currentUser.progress >= 100 && !currentUser.paid_500k_certificate){
    const certDiv = document.createElement("div");
    certDiv.innerHTML = `<button id="pay500Btn">Pay 500 KSh for Certificate</button>`;
    dashboard.appendChild(certDiv);

    document.getElementById("pay500Btn").addEventListener("click", async () => {
      alert("Payment placeholder: Certificate unlocked!");
      const { error } = await supabase
        .from("users")
        .update({ paid_500k_certificate: true })
        .eq("id", currentUser.id);
      if(error) alert("Error: "+error.message);
      else {
        currentUser.paid_500k_certificate = true;
        alert("Congratulations! You can now download your certificate.");
      }
    });
  }
}

// --- Show Lessons ---
function showLessons(paid){
  const lessons = [
    { title:"Forex Basics", type:"notes" },
    { title:"Trading Strategies", type:"notes" },
    { title:"Chart Reading", type:"video" },
    { title:"Risk Management", type:"video" },
    { title:"Web Development Basics", type:"notes" },
    { title:"HTML & CSS", type:"video" },
    { title:"JavaScript Fundamentals", type:"video" },
    { title:"Graphic Design Intro", type:"notes" },
    { title:"Online Freelancing Tips", type:"video" }
  ];

  lessons.forEach(lesson => {
    if(lesson.type==="video" && !paid) return; // hide videos until payment
    const lessonDiv = document.createElement("div");
    lessonDiv.className = "lesson";
    lessonDiv.innerHTML = `<h3>${lesson.title}</h3>
      ${lesson.type==="video"? "<iframe width='100%' height='200' src='https://www.youtube.com/embed/https://youtu.be/nmjdaBaZe8Y frameborder='0' allowfullscreen></iframe>" : "<p>Notes content here...</p>"}`;
    lessonsDiv.appendChild(lessonDiv);
  });
}
