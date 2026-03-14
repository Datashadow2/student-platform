
const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg"; // replace with your anon key
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;


window.onload = checkSession;

function checkSession(){
  const saved = localStorage.getItem("student");
  if(saved){ 
    currentUser = saved; 
    loadUser(); 
  }
}

// ---------------------------
// Register new user
// ---------------------------
async function register(){
  const name = document.getElementById("reg_name").value;
  const email = document.getElementById("reg_email").value;
  const pass = document.getElementById("reg_pass").value;
  const course = document.getElementById("reg_course").value;

  if(!name || !email || !pass || !course){ alert("Fill all fields"); return; }

  let {data:exist} = await supabase.from("users").select("*").eq("email",email).single();
  if(exist){ alert("Email already exists"); return; }

  await supabase.from("users").insert([{name,email,password:pass,course,progress:0}]);

  localStorage.setItem("student", email);
  currentUser = email;
  loadUser();
}

// ---------------------------
// Login existing user
// ---------------------------
async function login(){
  const email = document.getElementById("log_email").value;
  const pass = document.getElementById("log_pass").value;

  let {data} = await supabase.from("users").select("*").eq("email",email).eq("password",pass);
  if(data.length==0){ alert("Invalid login"); return; }

  localStorage.setItem("student", email);
  currentUser = email;
  loadUser();
}

// ---------------------------
// Logout
// ---------------------------
function logout(){
  localStorage.removeItem("student");
  location.reload();
}

// ---------------------------
// Load user dashboard
// ---------------------------
async function loadUser(){
  document.getElementById("auth").style.display = "none";
  let {data} = await supabase.from("users").select("*").eq("email",currentUser);
  let user = data[0];
  openDashboard(user);
}

function openDashboard(user){
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("welcome").innerText = `Welcome ${user.name}`;
  document.getElementById("courseTitle").innerText = `Course: ${user.course}`;
  loadNotes(user.course);
  loadProgress(user);
}

// ---------------------------
// Load course-specific notes
// ---------------------------
function loadNotes(course){
  const notes = {
    forex: ["Lesson 1: What is Forex","Lesson 2: Currency pairs","Lesson 3: Charts & Analysis"],
    webdev: ["Lesson 1: HTML Basics","Lesson 2: CSS Styling","Lesson 3: JavaScript Intro"],
    ai: ["Lesson 1: What is AI","Lesson 2: Automation Tools","Lesson 3: AI Applications"],
    business: ["Lesson 1: Online income models","Lesson 2: Marketing Basics","Lesson 3: Scaling Strategies"]
  };

  let container = document.getElementById("lessonsContainer");
  container.innerHTML = "";
  notes[course].forEach((n,i)=>{
    let div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h4>${n}</h4><p id="lesson${i}">Incomplete</p>`;
    container.appendChild(div);
  });
}

// ---------------------------
// Complete a lesson
// ---------------------------
async function completeLesson(){
  let {data} = await supabase.from("users").select("*").eq("email",currentUser);
  let user = data[0];
  let progress = user.progress || 0;
  progress += 33;
  if(progress>100) progress=100;
  await supabase.from("users").update({progress}).eq("email",currentUser);
  loadUser();
}

function loadProgress(user){
  let progress = user.progress || 0;
  document.getElementById("progressBar").style.width = progress + "%";
}

// ---------------------------
// Payment submission
// ---------------------------
async function submitPayment(){
  let code = document.getElementById("mpesa").value;
  if(!code){ alert("Enter code"); return; }

  await supabase.from("payments").insert([{email:currentUser, code, status:"pending"}]);
  document.getElementById("paymentStatus").innerText = "Payment Submitted. Await admin approval.";
}
