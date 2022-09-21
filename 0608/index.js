today = new Date();
//today.setDate(1);
DayOfTheWeek = today.getDay();
MonthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
if(today.getFullYear() % 4 == 0 && today.getFullYear() % 100 != 0 || today.getFullYear() %400==0) {
    MonthDays[1] = 29;
}

let date = 1;
let id = DayOfTheWeek;
let ym = document.querySelector("h1");
ym.innerText = `${today.getFullYear()}년 ${today.getMonth()+1}월`
for(let i = 0;i<MonthDays[today.getMonth()];i++){
    tag = document.querySelector('#d'+String(id-1));
    tag.innerText = date;
    date++; 
    id++;
}