const SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

const dashboard = document.getElementById("dashboard");
const auth = document.getElementById("auth");

const username = document.getElementById("username");
const trialInfo = document.getElementById("trialInfo");
const lessonsDiv = document.getElementById("lessons");

let currentUser;


// REGISTER
registerBtn.addEventListener("click", async () => {

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

if(!name || !email || !password){
alert("Fill all fields");
return;
}

const { data, error } = await supabase
.from("users")
.insert([
{
name:name,
email:email,
password:password,
signup_date:new Date(),
payment_status:"trial"
}
])
.select()
.single();

if(error){
console.log(error);
alert("Registration failed");
return;
}

currentUser = data;

showDashboard();

});



// LOGIN
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
alert("Login failed");
return;
}

currentUser = data;

showDashboard();

});



// DASHBOARD
function showDashboard(){

auth.style.display="none";
dashboard.style.display="block";

username.textContent=currentUser.name;

const signupDate = new Date(currentUser.signup_date);
const now = new Date();

const days = (now - signupDate) / (1000*60*60*24);

lessonsDiv.innerHTML="";

if(days < 2){

trialInfo.textContent="Free trial active";

showLessons(false);

}else{

if(currentUser.payment_status === "paid"){

trialInfo.textContent="Payment verified";

showLessons(true);

}else{

trialInfo.textContent="Trial expired";

lessonsDiv.innerHTML=`
<h3>Pay 200 KSh</h3>
<p>Send money to:</p>
<h2>0798880808</h2>

<p>Enter M-Pesa Code</p>

<input id="mpesaCode">

<button onclick="submitPayment()">Submit</button>
`;

}

}

}



// PAYMENT
async function submitPayment(){

const code = document.getElementById("mpesaCode").value;

const { error } = await supabase
.from("users")
.update({
payment_status:"pending",
mpesa_code:code
})
.eq("id", currentUser.id);

if(error){

alert("Error submitting payment");

return;

}

alert("Payment sent for verification");

}



// LESSONS
function showLessons(paid){

const lessons = [

{
title:"Forex Basics",
type:"text"
},

{
title:"Trading Psychology",
type:"text"
},

{
title:"Chart Analysis",
type:"video",
video:"dQw4w9WgXcQ"
},

{
title:"Web Development Intro",
type:"text"
},

{
title:"HTML & CSS",
type:"video",
video:"UB1O30fR-EE"
}

];

lessons.forEach(l => {

if(l.type === "video" && !paid) return;

const div = document.createElement("div");

if(l.type === "video"){

div.innerHTML = `
<h3>${l.title}</h3>
<iframe width="100%" height="200"
src="https://www.youtube.com/embed/${l.video}"
frameborder="0" allowfullscreen></iframe>
`;

}else{

div.innerHTML = `<h3>${l.title}</h3><p>Course notes available during trial.</p>`;

}

lessonsDiv.appendChild(div);

});

}
