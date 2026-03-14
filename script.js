var SUPABASE_URL = "https://xzptxrarzdgawilymmhu.supabase.co";

var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cHR4cmFyemRnYXdpbHltbWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODc0NjYsImV4cCI6MjA4ODk2MzQ2Nn0.5n833vgZmdN3Rr4s_jja8R6qLy4DN34DPbRw6DzuDbg";

if(!window.supabaseClient){
window.supabaseClient = window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
}

var supabase = window.supabaseClient;

const registerBtn=document.getElementById("registerBtn");
const loginBtn=document.getElementById("loginBtn");

let currentUser;


// REGISTER

registerBtn.onclick=async()=>{

const name=document.getElementById("name").value;
const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

const {data:existing}=await supabase
.from("users")
.select("email")
.eq("email",email)
.single();

if(existing){
alert("Email already exists");
return;
}

const {data,error}=await supabase
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
alert("Registration failed");
return;
}

currentUser=data;

showDashboard();

};


// LOGIN

loginBtn.onclick=async()=>{

const email=document.getElementById("loginEmail").value;
const password=document.getElementById("loginPassword").value;

const {data,error}=await supabase
.from("users")
.select("*")
.eq("email",email)
.eq("password",password)
.single();

if(error){
alert("Invalid login");
return;
}

currentUser=data;

showDashboard();

};


// LOGOUT

function logout(){

location.reload();

}


// DASHBOARD

function showDashboard(){

document.getElementById("auth").style.display="none";
document.getElementById("dashboard").style.display="block";

document.getElementById("username").innerText=currentUser.name;

updateTrial();

showCourses();

}


// TRIAL

function updateTrial(){

const signup=new Date(currentUser.signup_date);
const now=new Date();

const trialDays=2;

const days=(now-signup)/(1000*60*60*24);

const percent=Math.min((days/trialDays)*100,100);

document.getElementById("trialBar").style.width=percent+"%";

document.getElementById("trialText").innerText=(trialDays-days).toFixed(2)+" days remaining";

if(days>trialDays && currentUser.payment_status!="paid"){
showPayment();
}

}


// PAYMENT

function showPayment(){

const box=document.getElementById("paymentBox");

box.style.display="block";

box.innerHTML=`

<h3>Trial Expired</h3>

<p>Pay 200 KSh via M-Pesa</p>

<h2>0798880808</h2>

<input id="mpesaCode" placeholder="M-Pesa Code">

<button onclick="submitPayment()">Submit</button>

<p id="payMsg"></p>

`;

}


async function submitPayment(){

const code=document.getElementById("mpesaCode").value;

await supabase
.from("users")
.update({
payment_status:"pending",
mpesa_code:code
})
.eq("id",currentUser.id);

document.getElementById("payMsg").innerText="Waiting for admin approval";

}


// COURSES

function showCourses(){

const courses=[

{cat:"Forex",title:"Forex Basics",type:"text"},
{cat:"Forex",title:"Trading Psychology",type:"text"},
{cat:"Forex",title:"Chart Analysis",type:"video",video:"dQw4w9WgXcQ"},

{cat:"Coding",title:"HTML Basics",type:"text"},
{cat:"Coding",title:"CSS Basics",type:"video",video:"yfoY53QXEnI"},

{cat:"Coding",title:"JavaScript Intro",type:"video",video:"PkZNo7MFNFg"}

];

const div=document.getElementById("courses");

div.innerHTML="";

courses.forEach(c=>{

if(c.type=="video" && currentUser.payment_status!="paid") return;

let block=document.createElement("div");

if(c.type=="video"){

block.innerHTML=`

<h4>${c.cat} - ${c.title}</h4>

<iframe width="100%" height="200"
src="https://www.youtube.com/embed/${c.video}">
</iframe>

`;

}else{

block.innerHTML=`<h4>${c.cat} - ${c.title}</h4><p>Lesson notes</p>`;

}

div.appendChild(block);

});

}


// ADMIN DASHBOARD

async function loadUsers(){

document.getElementById("adminPanel").style.display="block";

const {data}=await supabase
.from("users")
.select("*");

let html="";

data.forEach(u=>{

html+=`

<div>

${u.name} | ${u.email} | ${u.payment_status}

<button onclick="approve('${u.id}')">Approve</button>

</div>

`;

});

document.getElementById("userList").innerHTML=html;

}


async function approve(id){

await supabase
.from("users")
.update({payment_status:"paid"})
.eq("id",id);

alert("User approved");

}
