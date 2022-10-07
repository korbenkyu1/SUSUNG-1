const DaysOfWeek = [ 'mon', 'tue', 'wed', 'thu', 'fri']
const today = new Date();
const dayTarget = new Date(today.getTime())

// 방향키에 따라 dayTarget을 바꾸고 updateMenuPlanner 호출
function handleSwipeWeek(event) {
    if(event.key === "ArrowLeft") {
        dayTarget.setDate(dayTarget.getDate()-7);
        updateMenuPlanner(dayTarget);
    }
    else if (event.key === "ArrowRight") {
        dayTarget.setDate(dayTarget.getDate()+7);
        updateMenuPlanner(dayTarget);
    } 
}
window.addEventListener("keydown", handleSwipeWeek);
// menu: 음식 하나 (ex: 보리밥)
// menuList: menu의 리스트
// menuTable: menuLIst의 리스트
// menuPlanner: 이 페이지

// <h2 id = 'title'>00000000~00000000</h2> 부분 수정
function updateTitle(newTitle){
    title = document.querySelector('#title');
    title.innerText =  newTitle;
}

/*
    <div class="date">
        <div>요일</div>
        <div>(00-00)</div>
    에서 <div>(00-00)</div> 수정
*/ 
function updateDate(newDates) {
    DaysOfWeek.forEach((day, index) => {
        const date = document.body.querySelector(`#${day} .date div:last-child`); // get a div that carries date
        date.innerText = newDates[index];
    });
}

/*
 <div id="tue">
                <div class="date">
                    <div>요일</div>
                    <div>(00-00)</div>
                </div>
                <div class="menu">메뉴</div>
            </div>
    에서 <div class="menu">메뉴</div> 수정
*/ 
function updateMenuTable(dayOfWeek, newMenus) {
    menu = document.body.querySelector(`#${dayOfWeek} .menu`);
    menu.innerText = '';
    for(i in newMenus) {
        const span = document.createElement("span");
        const li = document.createElement("li");
        span.innerText = newMenus[i].split('(')[0];
        li.appendChild(span);
        menu.appendChild(li);
    }
}

// (반환 ex: [yyyy, mm, dd])
function dateToArray(date){
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const date_today = String(date.getDate()).padStart(2, '0');
    return [year, month, date_today];
}
// 입력된 날이 해당하는 주 혹은 그 다음주 월요일 반환
function getModayOfWeek(date) {
    switch(date.getDay()){
        case 0: // 일요일
            date.setDate(date.getDate()+1);
            break;
        case 6: // 토요일
            date.setDate(date.getDate() + 2);
            break;
        default:
            date.setDate(date.getDate() - date.getDay() + 1);
    }
    return date;
}

// 입력된 날에 따라 그 주 식단으로 업데이트
function updateMenuPlanner(date){
    const startDate = new Date(getModayOfWeek(date).getTime());
    const dateArray = []; //html의 표에 넣을 숫자. 
    
    // 식단 업데이트
    const testList = []
    for(let i = 0; i < 5; i++){
       
        const tempDate = new Date(startDate.getTime()+i*86400000);
        const mlsv = dateToArray(tempDate).join(''); //끝 날짜
        const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=a591678623e24d458213f8a1a59b57aa&Type=json&pIndex=1&pSize=5&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530091&MLSV_FROM_YMD=${mlsv}`;
        //링크 주소(너무 길어서 
        fetch(url) //fetch 이용하면 html 추출 가능
        .then((result) => {
            return result.json();
        })//html 텍스트가 json 형식이라 변환 가능함.(링크 참조) --> .json()함수로 변환.
        .then((data) => {
            let menuTable = []
            console.log(mlsv);            
            if (data.mealServiceDietInfo !== undefined){
                console.log(data.mealServiceDietInfo[1].row[0].DDISH_NM.split('<br/>'));
                menuTable = data.mealServiceDietInfo[1].row[0].DDISH_NM.split('<br/>');
            } else {
                console.log('undefined');
                menuTable.push('undefined')
            }
            testList.push(menuTable);
            updateMenuTable(DaysOfWeek[i], menuTable);
        });
        dateArray.push(`(${tempDate.getMonth()+1}.${tempDate.getDate()})`);
        if(i === 4)
            updateTitle(`${dateToArray(startDate).join('-')} ~ ${dateToArray(tempDate).join('-')}`);
            
    }
    console.log(testList)
    updateDate(dateArray); 
    // title 업데이트
            
}
// 최초 호출
updateMenuPlanner(dayTarget);

// 모바일용 주 변환
let touchstartX = 0;
let touchendX = 0;
function checkDirection(){
    if(touchendX < touchstartX-100)
        handleSwipeWeek({key: 'ArrowRight'});
    if(touchendX > touchstartX+100)
        handleSwipeWeek({key:'ArrowLeft'});
}
document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
});
document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    checkDirection();
});
