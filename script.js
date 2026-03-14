// -----------------------------
// SUPABASE CONNECTION

var SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";

var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

if (!window.supabaseClient) {
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

var supabase = window.supabaseClient;


// -----------------------------
// ELEMENTS

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

const dashboard = document.getElementById("dashboard");
const auth = document.getElementById("auth");

const username = document.getElementById("username");
const trialInfo = document.getElementById("trialInfo");
const lessonsDiv = document.getElementById("lessons");

let currentUser;


// -----------------------------
// REGISTER

registerBtn.onclick = async () => {

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(!name || !email || !password){
alert("Fill all fields");
return;
}


// CHECK IF EMAIL EXISTS

const { data:existingUser } = await supabase
.from("users")
.select("email")
.eq("email",email)
.single();

if(existingUser){
alert("Email already registered. Please login.");
return;
}


// INSERT USER

const { data, error } = await supabase
.from("users")
.insert([{
name:name,
email:email,
password:password,
signup_date:new Date(),
payment_status:"trial"
}])
.select()
.single();

if(error){
console.log(error);
alert("Registration failed");
return;
}

alert("Account created successfully");

currentUser = data;

showDashboard();

};


// -----------------------------
// LOGIN

loginBtn.onclick = async () => {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const { data, error } = await supabase
.from("users")
.select("*")
.eq("email",email)
.eq("password",password)
.single();

if(error){
alert("Invalid login");
return;
}

currentUser = data;

showDashboard();

};


// -----------------------------
// DASHBOARD

function showDashboard(){

auth.style.display="none";
dashboard.style.display="block";

username.textContent=currentUser.name;

const signupDate = new Date(currentUser.signup_date);
const now = new Date();

const trialDays = 2;

const daysPassed = (now - signupDate)/(1000*60*60*24);

const progress = Math.min((daysPassed/trialDays)*100,100);


// PROGRESS BAR

trialInfo.innerHTML = `
Trial progress
<div style="background:#ddd;height:20px;border-radius:10px;">
<div style="width:${progress}%;background:#4CAF50;height:100%;border-radius:10px;"></div>
</div>
<p>${(trialDays-daysPassed).toFixed(2)} days remaining</p>
`;

lessonsDiv.innerHTML="";

if(daysPassed < 2){

showLessons(false);

}else{

if(currentUser.payment_status==="paid"){

trialInfo.innerHTML += "<p>Payment verified</p>";

showLessons(true);

}else{

showPaymentScreen();

}

}

}


// -----------------------------
// PAYMENT SCREEN

function showPaymentScreen(){

lessonsDiv.innerHTML = `

<h3>Trial Expired</h3>

<p>Unlock full courses for <b>200 KSh</b></p>

<p>Send M-Pesa to:</p>

<h2 style="color:green;">0798880808</h2>

<p>Enter your M-Pesa code</p>

<input id="mpesaCode" placeholder="M-Pesa Code">

<button onclick="submitPayment()">Submit Payment</button>

<p id="paymentMsg"></p>

`;

}


// -----------------------------
// PAYMENT SUBMISSION

async function submitPayment(){

const code = document.getElementById("mpesaCode").value;

const { error } = await supabase
.from("users")
.update({
payment_status:"pending",
mpesa_code:code
})
.eq("id",currentUser.id);

if(error){
alert("Payment error");
return;
}

document.getElementById("paymentMsg").innerHTML =
"Payment submitted. Waiting for admin approval.";

}


// -----------------------------
// COURSES

function showLessons(paid){

const lessons=[

{title:"Forex Basics",type:"text"},
{title:"Trading Psychology",type:"text"},
{title:"Risk Management",type:"text"},

{title:"Chart Analysis",type:"video",video:"dQw4w9WgXcQ"},
{title:"Advanced Forex Strategy",type:"video",video:"UB1O30fR-EE"},

{title:"Web Development Intro",type:"text"},
{title:"HTML Basics",type:"text"},
{title:"CSS Basics",type:"video",video:"yfoY53QXEnI"},

{title:"JavaScript Fundamentals",type:"video",video:"PkZNo7MFNFg"}

];

lessons.forEach(l=>{

if(l.type==="video" && !paid) return;

const div=document.createElement("div");

if(l.type==="video"){

div.innerHTML=`
<h3>${l.title}</h3>
<iframe width="100%" height="200"
src="https://www.youtube.com/embed/${l.video}"
frameborder="0" allowfullscreen></iframe>
`;

}else{

div.innerHTML=`<h3>${l.title}</h3><p>Lesson notes available.</p>`;

}

lessonsDiv.appendChild(div);

});

}
