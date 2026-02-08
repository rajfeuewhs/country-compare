
const text={
en:{title:"Country Compare"},
hi:{title:"देश तुलना"}
};
function setLang(l){
document.querySelector("h1").innerText=text[l].title;
}
