
let allCountries=[];

fetch("https://restcountries.com/v3.1/all")
.then(r=>r.json())
.then(d=>allCountries=d.map(c=>c.name.common));

function suggest(input,id){
let box=document.getElementById(id);
box.innerHTML="";
let v=input.value.toLowerCase();
if(!v)return;
allCountries.filter(c=>c.toLowerCase().startsWith(v)).slice(0,5).forEach(c=>{
let div=document.createElement("div");
div.innerText=c;
div.onclick=()=>{input.value=c;box.innerHTML="";};
box.appendChild(div);
});
}

c1.oninput=()=>suggest(c1,"suggestions1");
c2.oninput=()=>suggest(c2,"suggestions2");

function dark(){document.documentElement.classList.toggle("dark");}

function aiInsight(A,B){
return (A.population>B.population?
`${A.name.common} has larger population. `:
`${B.name.common} has larger population. `)
+(A.area>B.area?
`${A.name.common} is geographically larger.`:
`${B.name.common} is geographically larger.`);
}

function compare(){
Promise.all([
fetch(`https://restcountries.com/v3.1/name/${c1.value}`).then(r=>r.json()),
fetch(`https://restcountries.com/v3.1/name/${c2.value}`).then(r=>r.json()),
fetch("data/static.json").then(r=>r.json())
]).then(([Adata,Bdata,staticData])=>{
let A=Adata[0],B=Bdata[0];
let SA=staticData[A.name.common]||{},SB=staticData[B.name.common]||{};

result.innerHTML=`
<div class="card compare-box">
<div class="country">
<h3>${A.name.common}</h3>
<img src="${A.flags.png}">
<div>👥 ${A.population.toLocaleString()}</div>
<div>📐 ${A.area.toLocaleString()} km²</div>
<div>💱 ${Object.keys(A.currencies||{})[0]}</div>
<div>🏙️ ${A.capital?.[0]||"N/A"}</div>
<div>🌍 ${A.region}</div>
<div>🪖 ${SA.military||"N/A"}</div>
</div>
<div class="divider"></div>
<div class="country">
<h3>${B.name.common}</h3>
<img src="${B.flags.png}">
<div>👥 ${B.population.toLocaleString()}</div>
<div>📐 ${B.area.toLocaleString()} km²</div>
<div>💱 ${Object.keys(B.currencies||{})[0]}</div>
<div>🏙️ ${B.capital?.[0]||"N/A"}</div>
<div>🌍 ${B.region}</div>
<div>🪖 ${SB.military||"N/A"}</div>
</div>
</div>
<div class="card"><h3>🧠 AI Insight</h3>${aiInsight(A,B)}</div>
`;

new Chart(document.getElementById("chart"),{
type:"bar",
data:{labels:["Population","Area"],datasets:[
{label:A.name.common,data:[A.population,A.area],backgroundColor:"#4a6cf7"},
{label:B.name.common,data:[B.population,B.area],backgroundColor:"#ff6b6b"}
]}
});
});
}

function vote(v){
let a=+localStorage.getItem("A")||0;
let b=+localStorage.getItem("B")||0;
if(v==="A")a++; else b++;
localStorage.setItem("A",a);localStorage.setItem("B",b);
voteResult.innerText=`Votes → Country 1: ${a} | Country 2: ${b}`;
}
