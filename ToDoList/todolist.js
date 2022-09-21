var todoDic = {}; 

class Text {
  constructor(word, isCheck) {
    this.word = word; 
    this.isCheck = isCheck; 
  }
}

class TodoObj {
  constructor(Date) { 
    this.Date = Date;
    this.todos = [];
  } 
  informationLoad()  { // 정보 저장 
    var information = [];
    for (var i=0; i<this.todos.length; i++) {
      information.push({
        number: i,
        word: this.todos[i].word,
        isCheck: this.todos[i].isCheck
      });
    }
    Save(this.Date, information); 
  }
  ToggleCheck(number) { // 체크랑 비체크 왔다갔다를 편리하게 만들어주는 함수
    this.todos[number].isCheck = !this.todos[number].isCheck;
    this.informationLoad();
  }
  Delete(number) { // todos의 number 인덱스 제거 해주는 함수
    this.todos.splice(number, 1);
    this.informationLoad();
  }
  Add(text) { // todos 배열에 텍스트를 추가해주는 함수 
    this.todos.push(text);
    this.informationLoad();
  }
  Edit(text, n, isCheck) { //todos[n]을 수정해주는 함수 
    this.todos[n] = new Text(text, isCheck);
    console.log(this.todos[n]);
    this.informationLoad();
  }
}
function Load(Date) { // 특정 날 기록 불러오기 로컬스토리지 활용(json) 기록 반환해준다
  return window.localStorage.getItem(Date);
}
function Save(Date, information) { // 특정 날 기록 저장 로컬스토리지 활용(json)
  window.localStorage.setItem(Date, JSON.stringify(information));
}

function AddNewTodoObj(Date) { // 새로운 todo 오브젝트 생성
  obj = new TodoObj(Date);
  todoDic[Date] = obj;
}
function AddBtn() { // 추가버튼 이벤트 함수
  var text = document.getElementById("todoText").value;
  document.getElementById("todoText").value = "";
  if(text != "") {
  var date = document.getElementById("date").innerHTML;
  todoDic[date].Add(new Text(text));
  Reloadli();
}
}
function DeleteBtn(e) { // 삭제 버튼 이벤트 함수
  var id = e.id;
  var date = document.getElementById("date").innerHTML;
  todoDic[date].Delete(id);
  Reloadli();
}
function editBtn(e, n) {  // 편집 버튼 이벤트 함수
  if(e.innerHTML == "편집") {
    e.innerHTML = "완료";
      document.getElementById("text" + n).readOnly = false;
  }else {
    e.innerHTML = "편집";
    document.getElementById("text" + n).readOnly = true;
    var date = document.getElementById("date").innerHTML;
    console.log(document.getElementById("text" + n).value);
    todoDic[date].Edit(document.getElementById("text" + n).value, n, todoDic[date].todos[n].isCheck);
    Reloadli();
  }
}
function Reloadli() { // li를 새로고침 해주는 함수
    var date = document.querySelector('input[type="date"]').value;
   var todo = document.getElementById("todolists");
    todo.innerHTML = "";
    console.log(todoDic[date].todos.length);
    for (var i=0; i<todoDic[date].todos.length; i++) {
      if(todoDic[date].todos[i].isCheck == true) {
          todo.innerHTML+='<li class="list-group-item"><textarea style="text-decoration: line-through;" class="card-text" name="checked" onclick="todoclick(this)" rows="10" id=' + "text" + i + ' readonly>'+ todoDic[date].todos[i].word  + '</textarea><br/><button style="width:80px" onclick="editBtn(this, ' + i +')">편집</button><button style="width:80px" onclick="DeleteBtn(this)" id="' + i +'">삭제</button></li>';
      }else {
        console.log(todoDic[date].todos[i].word);
          todo.innerHTML+='<li class="list-group-item"><textarea class="card-text" onclick="todoclick(this)" rows="10" id=' + "text" + i + ' readonly>'+ todoDic[date].todos[i].word  + '</textarea><br/><button style="width:80px" onclick="editBtn(this, ' + i +')">편집</button><button style="width:80px" onclick="DeleteBtn(this)" id="' + i +'">삭제</button></li>';
      }
    }
}
function dateSelect() { // 날짜가 선택됐을때 함수
  var date = document.querySelector('input[type="date"]').value;
      var todo = document.getElementById("todolists");
  document.getElementById("date").innerHTML = date;
  if(Load(date)==null) { // 해당 날의 데이터가 없을 경우
    AddNewTodoObj(date);
    Reloadli();
  }
  else { // 해당 날의 데이터가 있는 경우 전부다 불러오기
    AddNewTodoObj(date);
    var information =  JSON.parse(Load(date));  
    for (var i=0; i<information.length; i++) {
      todoDic[date].Add(new Text(information[i]["word"], information[i]["isCheck"]));
    }
    Reloadli();
  }

}
  function todoclick(e) { // 투두를 클릭했을떄 이벤트 함수
    var date = document.querySelector('input[type="date"]').value;;
    console.log(e.id.substr(4));
    if(e.name == "checked") {
      console.log("ddd");
      if(e.readOnly) {
      e.name = "unchecked";
      e.style.textDecoration = "none";
      todoDic[date].ToggleCheck(e.id.substr(4));
    }
    }else if(e.readOnly){
      e.name = "checked";
      e.style.textDecoration = "line-through";
      todoDic[date].ToggleCheck(e.id.substr(4));
    }
    }
function SetDate() { // 처음 사이트 들어왔을떄 오늘로 세팅해주는 함수
  document.querySelector('input[type="date"]').value = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0];
  dateSelect();
}
