
document.querySelector(".create").addEventListener("transitionend",(event)=>{
    if(!document.querySelector(".calendar").style.display){
    document.querySelector(".create").style.display="none";
    document.querySelector(".calendar").classList.remove("hiddenCalendar");
    }
    if (event.propertyName == "opacity" & document.querySelector(".calendar").classList.contains("hiddenCalendar")) swapNodes(9,10);
})

document.querySelector(".strip").querySelectorAll("DIV")[1].addEventListener("click", ()=>{
    document.querySelector(".create").classList.add("hiddenCreator");
    document.querySelector(".calendar").style.display="";
    resetFilter();
})

document.querySelector(".strip").querySelectorAll("DIV")[0].addEventListener("click", ()=>{
    document.querySelector(".calendar").classList.add("hiddenCalendar");
    document.querySelector(".create").style.display="";
    resetFilter();
})

document.querySelector(".calendar").addEventListener("transitionend",(event)=>{
    if(!document.querySelector(".create").style.display){
    document.querySelector(".calendar").style.display="none";
    document.querySelector(".create").classList.remove("hiddenCreator");
    }
    if (event.propertyName == "opacity" & document.querySelector(".create").classList.contains("hiddenCreator")) swapNodes(9,10);
})

document.body.childNodes[10].remove();

function swapNodes(one,two){
    document.body.childNodes[one].before(document.body.childNodes[two]);
}

/// Display today
function makeDayOfWeek(num){
    switch (num){
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
    }
}

function makeCalendarDate(num) {
    if(num==11 | num==12 | num ==13) return num+"’th";
    switch(num.toString().slice(-1)){
        case "1": return num + "’st";
        case "2": return num + "’nd";
        case "3": return num + "’rd";
        default: return num + "’th";
    }
}



function howManyTasksForToday(date = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())){
    let counter = 0;
    for (let item of allTasks.values()){
        if(date.getFullYear() == new Date(item.date).getFullYear() & date.getMonth() == new Date(item.date).getMonth() & date.getDate() == new Date(item.date).getDate()) counter++;
    }
    return counter;
}

function refreshTodayStatus(){
    document.querySelector(".today").querySelectorAll("SPAN")[1].innerText = makeDayOfWeek(new Date().getDay());
    document.querySelector(".today").querySelectorAll("SPAN")[2].innerText = makeCalendarDate(new Date().getDate());
    document.querySelector(".today").querySelectorAll("SPAN")[3].innerText = makeMonth(new Date().getMonth());
    document.querySelectorAll(".today")[1].innerText= howManyTasksForToday()? howManyTasksForToday()+" task" +((howManyTasksForToday()==1)? "":"s")+ " to complete for today" : "No tasks for today";

}

refreshTodayStatus();

/// Calendar block

function makeCalendar(month = new Date().getMonth(),year = new Date().getFullYear()){
    let page = document.createElement("TABLE");
    page.border=1;
    let day = new Date(year,month,2-new Date(year,month,1).getDay()).getDate();
    if(new Date(year,month,1).getDay() == 0) day = new Date(year,month,-5).getDate();
    let tableHeader = document.createElement("TR");
    let days = ["Mon.","Tue.","Wed.","Thu.","Fri.","Sat.","Sun."];
    for(let i=0; i<7;i++){
        let colName = document.createElement("TH");
        colName.innerText = days.shift();
        tableHeader.appendChild(colName);
    }
    page.appendChild(tableHeader);
    while (true){
        let week = document.createElement("TR");
        while (week.childNodes.length<7){
            let dayBlock = document.createElement("TD");
            dayBlock.innerText = new Date(year,month-1,day++).getDate();
            dayBlock.onclick = ()=>{
                try{document.querySelector("TABLE").querySelector(".activeCell").classList.remove("activeCell");}
                catch{console.log("no selection")}
                if(dayBlock.classList.contains("done")) return;
                dayBlock.classList.add("activeCell");
                document.querySelector(".tasksForToday").innerHTML="";
                for(let value of allTasks.values()){
                    if(new Date(value.date).getFullYear()== +document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText &
                    new Date(value.date).getMonth() == makeNumFromMonth(document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText) &
                    new Date(value.date).getDate() == +dayBlock.innerText)
                    addDayTask(value);
                    filterTodaysTask();
                }
            }
            week.appendChild(dayBlock);
        }
    page.appendChild(week);
    if((new Date(year,month,1).getDay()!=1) & (new Date(year,month-1,day)>=new Date(year,month+1,1))) break;
    if((new Date(year,month,1).getDay() == 1) & (new Date(year,month,day)>=new Date(year,month+1,1))) break;
    }
return page;
}

function underlineDay(day){
    day.classList.add("importantDay");
}

function markPassedDays(){
    let newMonthStarted = false;
    for(let i = 1; i<document.querySelector("TABLE").childNodes.length; i++){
        for(let j =0; j<7;j++){
            document.querySelector("TABLE").childNodes[i].childNodes[j].classList.remove("importantDay");
            if(document.querySelector("TABLE").childNodes[i].childNodes[j].innerText=="1")
                newMonthStarted = !newMonthStarted;
            if(!newMonthStarted) 
                document.querySelector("TABLE").childNodes[i].childNodes[j].classList.add("done");
            else if(new Date(+document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText,makeNumFromMonth(document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText),+document.querySelector("TABLE").childNodes[i].childNodes[j].innerText) < new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()))
                document.querySelector("TABLE").childNodes[i].childNodes[j].classList.add("done");
            else if (+document.querySelector("TABLE").childNodes[i].childNodes[j].innerText == new Date().getDate() & makeNumFromMonth(document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText)==new Date().getMonth()& +document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText == new Date().getFullYear() & newMonthStarted)
            document.querySelector("TABLE").childNodes[i].childNodes[j].style.border="5px solid black";
                for(let value of allTasks.values()){
                    if(new Date(value.date).getFullYear()== +document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText &
                    new Date(value.date).getMonth() == makeNumFromMonth(document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText) &
                    new Date(value.date).getDate() == +document.querySelector("TABLE").childNodes[i].childNodes[j].innerText &
                    getFilterParams().includes(value.importance)){
                    document.querySelector("TABLE").childNodes[i].childNodes[j].classList.add("importantDay");
                    if(value.status & getFilterParams().includes("UNDONE"))
                    document.querySelector("TABLE").childNodes[i].childNodes[j].classList.remove("importantDay");
                }

                if(new Date(value.date).getFullYear()== +document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText &
                    new Date(value.date).getMonth() == makeNumFromMonth(document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText) &
                    new Date(value.date).getDate() == +document.querySelector("TABLE").childNodes[i].childNodes[j].innerText &
                    getFilterParams().includes("UNDONE")){
                        document.querySelector("TABLE").childNodes[i].childNodes[j].classList.add("importantDay");
                    }

                }
        }
    }
}

document.querySelector(".calendarPage").appendChild(makeCalendar());
markPassedDays();

// calendar controls

function getFullNameOfMonth(shortForm){
    switch(shortForm){
        case "Jan.": return "January";
        case "Feb.": return "February";
        case "Mar.": return "March";
        case "Apr.": return "April";
        case "May" : return "May";
        case "Jun.": return "June";
        case "Jul.": return "July";
        case "Aug.": return "August";
        case "Sep.": return "September";
        case "Oct.": return "October";
        case "Nov.": return "November";
        case "Dec.": return "December";
    }
}

function changeCalendar(direction){
    let date = new Date(+document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText,makeNumFromMonth(document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText));
    date = new Date(date.getFullYear(),direction? date.getMonth()+1: date.getMonth()-1);
    document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText = date.getFullYear();
    document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText = getFullNameOfMonth(makeMonth(date.getMonth()));

    document.querySelector("TABLE").replaceWith(makeCalendar(date.getMonth(),date.getFullYear()));
    markPassedDays();
}

document.querySelector(".calendarControls").querySelectorAll("DIV")[1].addEventListener("click",()=>{
    changeCalendar(true);
    document.querySelector(".calendarControls").querySelectorAll("DIV")[0].classList.remove("done")
    document.querySelector(".calendarControls").querySelectorAll("DIV")[0].classList.add("arrowLeftHover")


})

document.querySelector(".calendarControls").querySelectorAll("DIV")[0].addEventListener("click",()=>{
    if(!document.querySelector(".calendarControls").querySelectorAll("DIV")[0].classList.contains("done"))
        changeCalendar(false);
    if(+document.querySelector(".calendarControls").querySelectorAll("SPAN")[1].innerText == new Date().getFullYear() & makeNumFromMonth(document.querySelector(".calendarControls").querySelectorAll("SPAN")[0].innerText) == new Date().getMonth()){
        document.querySelector(".calendarControls").querySelectorAll("DIV")[0].classList.add("done");
        document.querySelector(".calendarControls").querySelectorAll("DIV")[0].classList.remove("arrowLeftHover");
    }
})

//tasks

function addDayTask(task){
    let newTask = document.createElement('div');
    let taskField = document.createElement('div');
    let importance = document.createElement("div");
    taskField.style.width="100%";
    taskField.style.borderRight="";
    importance.innerHTML = "IMPORTANCE: " + task.importance + "<hr>";
    importance.classList.add("importanceMark");

    newTask.classList.add("task");
    taskField.innerHTML = task.text;
    taskField.prepend(importance);
    taskField.classList.add("taskField");
    newTask.appendChild(taskField);
    newTask.style.animation = "addTask 1s";
    if(task.status) newTask.classList.add("done");
    document.querySelector(".tasksForToday").appendChild(newTask);
}



