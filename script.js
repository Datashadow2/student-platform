// Supabase connection
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "sb_publishable_t856nqE72fz3X3RFJstmDQ_K5nkoftv";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM elements
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const dashboard = document.getElementById("dashboard");
const auth = document.getElementById("auth");
const username = document.getElementById("username");
const trialInfo = document.getElementById("trialInfo");
const lessonsDiv = document.getElementById("lessons");

let currentUser;

// --- REGISTER ---
registerBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(!name || !email || !password){
    alert("Fill all fields");
    return;
  }

  const { data, error } = await supabase.from("users").insert([{
    name:name,
    email:email,
    password:password,
    signup_date:new Date(),
    payment_status:"trial",
    progress:0
  }]).select().single();

  if(error){
    console.error("Register error:", error);
    alert("Registration failed");
    return;
  }

  currentUser = data;
  showDashboard();
});

// --- LOGIN ---
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if(error){
    console.error("Login error:", error);
    alert("Login failed");
    return;
  }

  currentUser = data;
  showDashboard();
});

// --- DASHBOARD ---
function showDashboard(){
  auth.style.display = "none";
  dashboard.style.display = "block";
  username.textContent = currentUser.name;

  const signup = new Date(currentUser.signup_date);
  const now = new Date();
  const days = (now - signup) / (1000*60*60*24);

  lessonsDiv.innerHTML="";

  if(days < 2){
    trialInfo.textContent = "Free Trial Active";
    showLessons(false);
  } else {
    if(currentUser.payment_status==="paid"){
      trialInfo.textContent = "Payment Verified";
      showLessons(true);
    } else if(currentUser.payment_status==="pending"){
      trialInfo.textContent = "Payment Pending Verification";
      lessonsDiv.innerHTML="<p>We are verifying your payment.</p>";
    } else {
      trialInfo.textContent = "Trial Expired";
      lessonsDiv.innerHTML=`
        <h3>Pay 200 KSh</h3>
        <p>Send via M-Pesa to:</p>
        <h2>0798880808</h2>
        <p>Enter M-Pesa Transaction Code</p>
        <input id="mpesaCode">
        <button id="submitPayment">Submit</button>
      `;
      document.getElementById("submitPayment").addEventListener("click", submitPayment);
    }
  }

  // DEBUG: log current user
  console.log("Current User:", currentUser);
}

// --- PAYMENT SUBMIT ---
async function submitPayment(){
  const code = document.getElementById("mpesaCode").value;
  if(!code){ alert("Enter transaction code"); return; }

  const { error } = await supabase.from("users").update({
    payment_status:"pending",
    mpesa_code:code
  }).eq("id", currentUser.id);

  if(error){
    console.error("Payment submit error:", error);
    alert("Payment submission failed");
    return;
  }

  alert("Payment submitted for verification");
  currentUser.payment_status="pending";
  showDashboard();
}

// --- LESSONS ---
function showLessons(paid){
  const lessons = [
    {title:"Forex Basics",type:"notes"},
    {title:"Trading Psychology",type:"notes"},
    {title:"Chart Analysis",type:"video",video:"dQw4w9WgXcQ"},
    {title:"Web Development Intro",type:"notes"},
    {title:"HTML & CSS",type:"video",video:"UB1O30fR-EE"},
    {title:"JavaScript Basics",type:"video",video:"W6NZfCO5SIk"}
  ];

  lessons.forEach(l=>{
    if(l.type==="video" && !paid) return;
    const div = document.createElement("div");
    if(l.type==="video"){
      div.innerHTML = `
        <h3>${l.title}</h3>
        <iframe width="100%" height="200" src="https://www.youtube.com/embed/${l.video}" frameborder="0" allowfullscreen></iframe>
      `;
    } else {
      div.innerHTML = `<h3>${l.title}</h3><p>Course notes available during trial.</p>`;
    }
    lessonsDiv.appendChild(div);
  });
}

// --- TEST SUPABASE CONNECTION ---
async function testSupabase(){
  const { data, error } = await supabase.from('users').select('*');
  console.log("Users table:", data);
  if(error) console.error("Supabase error:", error);
}
testSupabase();
