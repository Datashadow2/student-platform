const SUPABASE_URL="https://xzptxrarzdgawilymmhu.supabase.co";
const SUPABASE_KEY="PASTE_ANON_KEY";

const supabase=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);

let currentUser=null;

window.onload=checkSession;

function checkSession(){
const saved=localStorage.getItem("student");
if(saved){currentUser=saved;loadUser();}
}

async function register(){
let email=document.getElementById("reg_email").value;
let pass=document.getElementById("reg_pass").value;

let {data:exist}=await supabase.from("users").select("*").eq("email",email).single();
if(exist){alert("Email exists");return;}

await supabase.from("users").insert([{email,password:pass,progress:0}]);
localStorage.setItem("student",email);
currentUser=email;
loadUser();
}

async function login(){
let email=document.getElementById("log_email").value;
let pass=document.getElementById("log_pass").value;

let {data}=await supabase.from("users").select("*").eq("email",email).eq("password",pass);
if(data.length==0){alert("Invalid login");return;}
localStorage.setItem("student",email);
currentUser=email;
loadUser();
}

function logout(){localStorage.removeItem("student");location.reload();}

async function loadUser(){
document.getElementById("auth").style.display="none";
let {data}=await supabase.from("users").select("*").eq("email",currentUser);
let user=data[0];
if(!user.course){document.getElementById("courseSelect").style.display="grid";}else{openDashboard(user);}
}

async function chooseCourse(course){
await supabase.from("users").update({course:course}).eq("email",currentUser);
loadUser();
}

function openDashboard(user){
document.getElementById("dashboard").style.display="block";
document.getElementById("courseSelect").style.display="none";
document.getElementById("welcome").innerText="Welcome "+user.email;
document.getElementById("courseTitle").innerText="Course: "+user.course;
loadNotes(user.course);
loadProgress(user);
}

function loadNotes(course){
let notes={
forex:["Lesson 1: What is Forex","Lesson 2: Currency pairs","Lesson 3: Charts & Analysis"],
webdev:["Lesson 1: HTML Basics","Lesson 2: CSS Styling","Lesson 3: JavaScript Intro"],
ai:["Lesson 1: What is AI","Lesson 2: Automation Tools","Lesson 3: AI Applications"],
business:["Lesson 1: Online income models","Lesson 2: Marketing Basics","Lesson 3: Scaling Strategies"]
};
let container=document.getElementById("lessonsContainer");
container.innerHTML="";
notes[course].forEach((n,i)=>{
let div=document.createElement("div");
div.className="card";
div.innerHTML=`<h4>${n}</h4><p id="lesson${i}">Incomplete</p>`;
container.appendChild(div);
});
}

async function completeLesson(){
let {data}=await supabase.from("users").select("*").eq("email",currentUser);
let user=data[0];
let progress=user.progress||0;
progress+=33; 
if(progress>100)progress=100;
await supabase.from("users").update({progress:progress}).eq("email",currentUser);
loadUser();
}

function loadProgress(user){
let progress=user.progress||0;
document.getElementById("progressBar").style.width=progress+"%";
}

async function submitPayment(){
let code=document.getElementById("mpesa").value;
await supabase.from("payments").insert([{email:currentUser,code:code,status:"pending"}]);
document.getElementById("paymentStatus").innerText="Payment Submitted. Await admin approval.";
}

// Admin functions
async function loadUsers(){
document.getElementById("adminPanel").style.display="block";
const {data}=await supabase.from("users").select("*");
let html="";
data.forEach(u=>{html+=`<div>${u.email} | ${u.course || 'None'} | ${u.progress}% <button onclick="approve('${u.id}')">Approve Payment</button></div>`;});
document.getElementById("userList").innerHTML=html;
}
async function approve(id){
await supabase.from("users").update({progress:100}).eq("id",id);
alert("User approved & course unlocked");
}
