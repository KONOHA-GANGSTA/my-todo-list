let allTasks = new Map();
let maxId=0;
let taskList= document.querySelector(".taskList");
let taskInput = document.querySelector("#taskInput");
let taskButton = document.querySelector("#taskButton");
let isDedline = true;

let keys = Object.keys(localStorage);
for(let key of keys.sort()) {
    let storedTask = JSON.parse(localStorage.getItem(key));
    allTasks.set(storedTask.id,storedTask);
    if(maxId< storedTask.id) maxId=storedTask.id;
    addTask(storedTask);
}
globalMeterRefresh();



taskButton.addEventListener("click",()=>{
    if (!(taskInput.value.trim()=='')) addTask(createTask(taskInput.value,importanceValue.innerText,isDedline? getDateDeadline(document.querySelector(".createTask").querySelector(".deadlineControls")) : null));
    globalMeterRefresh();
    taskInput.value='';
    importanceLeftArrow.classList.add("done");
    importanceValue.innerText = "LOW";
    importanceRightArrow.classList.remove("done");
    if(isDedline) document.querySelector(".createTask").querySelector(".deadlineSign").childNodes[1].click();
})

function createTask(text,importance = "low",date = null,done = false){
    return{
        id: ++maxId,
        text: text,
        status: done,
        date: date,
        importance: importance
    }
}

function addTask(task){
    let newTask = document.createElement('div');
    let doneButton = document.createElement('button');
    let editButton = document.createElement('button');
    let deleteButton = document.createElement("button");
    let taskField = document.createElement('div');
    let controlField = document.createElement('div');
    let importance = document.createElement("div");
    let deadlineMark = document.createElement("div");

    if (task.date){
        deadlineMark.classList.add("importanceMark");
        deadlineMark.innerHTML = "<hr> DEADLINE: " + new Date(task.date).getDate()+" "+makeMonth(new Date(task.date).getMonth())+" "+new Date(task.date).getFullYear();
    }

    importance.innerHTML = "IMPORTANCE: " + task.importance + "<hr>";
    importance.classList.add("importanceMark");
    controlField.classList.add("controlField");
    doneButton.innerText="DONE";
    editButton.innerText="EDIT";
    deleteButton.innerText="DELETE";
    doneButton.classList.add("doneButton", "antiHoverButtons");
    editButton.classList.add("doneButton", "antiHoverButtons");
    deleteButton.classList.add("doneButton", "antiHoverButtons");


    doneButton.addEventListener("click",()=>{
        newTask.classList.add("done");
        doneButton.setAttribute('disabled',"disabled");
        editButton.setAttribute('disabled',"disabled");
        doneButton.classList.remove("antiHoverButtons");
        editButton.classList.remove("antiHoverButtons");
        allTasks.set(task.id,Object.assign(allTasks.get(task.id),{status: true}));
        localStorage.setItem(task.id.toString(),JSON.stringify(allTasks.get(task.id)));
        taskList.append(newTask);
        globalMeterRefresh();
    });


    editButton.addEventListener("click",()=>{
        let oldTask = document.getElementById(task.id.toString());
        let oldTaskField = oldTask.querySelector("div");
        let importanceMark = oldTaskField.querySelector(".importanceMark");
        let deadlineMark =  task.date;
        if(deadlineMark) oldTaskField.querySelectorAll(".importanceMark")[1].remove();
        oldTaskField.removeChild(importanceMark);
        let controls = oldTask.querySelector(".controlField");
        let saveButton = document.createElement("button");
        let oldText = oldTaskField.innerText;
        let editInput = document.createElement("input");
        let generalControls = document.createElement("div");

        let importanceEdit = document.createElement("div");
        oldTask.style.flexDirection="column";
        importanceEdit.classList.add("importanceEdit");
        importanceEdit.appendChild(document.createElement("span"));
        importanceEdit.appendChild(document.createElement("div"));
        importanceEdit.appendChild(document.createElement("span"));
        importanceEdit.appendChild(document.createElement("div"));
        importanceEdit.childNodes[0].innerText= "Importance: ";
        importanceEdit.childNodes[2].innerText= importanceMark.innerText.slice(12,importanceMark.innerText.length);
        importanceEdit.childNodes[1].classList.add("arrowLeft");
        importanceEdit.childNodes[3].classList.add("arrowRight");
        console.log(importanceEdit.childNodes[2].innerText.trim()=="LOW");
        switch(importanceEdit.childNodes[2].innerText){
            case "MEDIUM":{
                importanceEdit.childNodes[1].classList.add("arrowLeftHover");
                importanceEdit.childNodes[3].classList.add("arrowRightHover");
                break;
            }
            case "LOW":{
                importanceEdit.childNodes[1].classList.add("done");
                importanceEdit.childNodes[3].classList.add("arrowRightHover");
                break;
            }
            case "HIGH":{
                importanceEdit.childNodes[1].classList.add("arrowLeftHover");
                importanceEdit.childNodes[3].classList.add("done");
                break;
            }
        }
        importanceEdit.childNodes[1].addEventListener("click",()=>{
            switch(importanceEdit.childNodes[2].innerText.trim()){
                case "MEDIUM":{
                    importanceEdit.childNodes[1].classList.add("done");
                    importanceEdit.childNodes[1].classList.remove("arrowLeftHover");
                    importanceEdit.childNodes[2].innerText ="LOW";
                    break;
                }
                case "HIGH":{
                    importanceEdit.childNodes[3].classList.remove("done");
                    importanceEdit.childNodes[3].classList.add("arrowRightHover");
                    importanceEdit.childNodes[2].innerText="MEDIUM";
                    break;
                }
                default: {
                    if(!(importanceEdit.childNodes[2].innerText.trim() == "LOW")) {importanceEdit.childNodes[1].classList.remove("done");
                    importanceEdit.childNodes[1].classList.add("arrowLeftHover");
                    }
                    break;}
            }
        });
        importanceEdit.childNodes[3].addEventListener("click",()=>{
            switch(importanceEdit.childNodes[2].innerText.trim()){
                case "MEDIUM":{
                    importanceEdit.childNodes[3].classList.add("done");
                    importanceEdit.childNodes[3].classList.remove("arrowRightHover");
                    importanceEdit.childNodes[2].innerText ="HIGH";
                    break;
                }
                case "LOW":{
                    importanceEdit.childNodes[1].classList.remove("done");
                    importanceEdit.childNodes[1].classList.add("arrowLeftHover");
                    importanceEdit.childNodes[2].innerText="MEDIUM";
                    break;
                }
                default: {
                    if(!(importanceEdit.childNodes[2].innerText.trim() == "HIGH")) {importanceEdit.childNodes[3].classList.remove("done");
                    importanceEdit.childNodes[3].classList.add("arrowRightHover");
                    importanceEdit.childNodes[2].innerText="LOW";
                    }
                    break;}
            }
        });


        saveButton.classList.add("antiHoverButtons");
        saveButton.innerText="SAVE";
        saveButton.style.width="19%";
        editInput.style.width="77%";
        controls.style.display="none";
        generalControls.style.display="flex";
        generalControls.style.justifyContent="center";
        generalControls.style.width="100%";
        saveButton.addEventListener("click",()=>{
            let newTaskField = document.createElement("div");
            newTaskField.innerText = editInput.value;
            newTaskField.classList.add("taskField");
            editInput.remove();
            oldTask.prepend(newTaskField);
            controls.style.display="flex";
            saveButton.remove();
            generalControls.remove();
            importanceEdit.remove();
            oldTask.style.flexDirection="row";
            allTasks.set(task.id,Object.assign(allTasks.get(task.id),{text: newTaskField.innerText,importance:importanceEdit.childNodes[2].innerText.trim()}));
            importanceMark.innerHTML="IMPORTANCE: " + importanceEdit.childNodes[2].innerText.trim() + "<hr>";
            newTaskField.prepend(importanceMark);
            if (deadlineMark){
                let newDeadline = document.createElement("div");
                newDeadline.classList.add("importanceMark");
                newDeadline.innerHTML = "<hr> DEADLINE: " + new Date(deadlineMark).getDate()+" "+makeMonth(new Date(deadlineMark).getMonth())+" "+new Date(deadlineMark).getFullYear();
                newTaskField.appendChild(newDeadline);
            }
            localStorage.setItem(task.id.toString(),JSON.stringify(allTasks.get(task.id)));
        });
        generalControls.appendChild(editInput);
        generalControls.appendChild(saveButton);
        editInput.classList.add("editInput");
        editInput.style.fontSize="1.1em";
        editInput.value = oldText;
        oldTask.appendChild(generalControls);
        oldTask.appendChild(importanceEdit);
        oldTaskField.remove();
    });


    deleteButton.addEventListener("click",()=>{
        localStorage.removeItem(task.id.toString());
        allTasks.delete(task.id);
        newTask.remove();
        globalMeterRefresh();
        if(!allTasks.size) document.querySelector(".globalMeter span").innerHTML = "NO TASKS"
    })

    newTask.classList.add("task");
    newTask.id = task.id;
    taskField.innerHTML = task.text;
    taskField.prepend(importance);
    if(task.date) taskField.appendChild(deadlineMark);
    taskField.classList.add("taskField");
    newTask.appendChild(taskField);
    controlField.appendChild(doneButton);
    controlField.appendChild(editButton);
    controlField.appendChild(deleteButton);
    newTask.appendChild(controlField);
    taskList.prepend(newTask);
    newTask.style.animation = "addTask 1s";
    if(task.status) newTask.querySelector("button").click();
    allTasks.set(task.id,task);
    localStorage.setItem(maxId.toString(),JSON.stringify(task));
    globalMeterRefresh();
}

function globalMeterRefresh(){
    let meter = document.querySelector(".globalMeter");
    let meterText = meter.querySelector("span");
    if(!allTasks.size) {
        allTasks.clear();
        meterText = "NO TASKS";
        return;}
    let counter = 0;
    for (let task of allTasks.values()) if(task.status) counter++;
    meterText.innerHTML = counter.toString()+"/"+allTasks.size.toString()+
    "<br> TASKS DONE<span style='font-size:40px;'><br>POGRESS:"+Math.round(counter/allTasks.size*100)+"%</span>";
}

let importanceLeftArrow = document.querySelector(".arrowLeft");
let importanceRightArrow = document.querySelector(".arrowRight");
let importanceValue = document.querySelector(".importanceSet").childNodes[3];

importanceLeftArrow.addEventListener("click",()=>{
    switch(importanceValue.innerText){
        case "MEDIUM":{
            importanceLeftArrow.classList.add("done");
            importanceLeftArrow.classList.remove("arrowLeftHover");
            importanceValue.innerText ="LOW";
            break;
        }
        case "HIGH":{
            importanceRightArrow.classList.remove("done");
            importanceRightArrow.classList.add("arrowRightHover");
            importanceValue.innerText="MEDIUM";
            break;
        }
        default: {
            if(!(importanceValue.innerText == "LOW")) {importanceLeftArrow.classList.remove("done");
                importanceLeftArrow.classList.add("arrowLeftHover");
            }
            break;}
    }
});

importanceRightArrow.addEventListener("click",()=>{
    switch(importanceValue.innerText){
        case "MEDIUM":{
            importanceRightArrow.classList.add("done");
            importanceRightArrow.classList.remove("arrowRightHover");
            importanceValue.innerText ="HIGH";
            break;
        }
        case "LOW":{
            importanceLeftArrow.classList.remove("done");
            importanceLeftArrow.classList.add("arrowLeftHover");
            importanceValue.innerText="MEDIUM";
            break;
        }
        default: {
            if(!(importanceValue.innerText == "HIGH")) {importanceRightArrow.classList.remove("done");
            importanceRightArrow.classList.add("arrowRightHover");
            }
            break;}
    }
})

window.addEventListener("keydown",(e)=>{
    switch(e.key){
        case "ArrowRight":{
            importanceRightArrow.click();
            break;
        }
        case "ArrowLeft":{
            importanceLeftArrow.click();
            break;
        }
        case "Enter" :{
            taskButton.click();
            break;
        }
    }
})

///////DEADLINES

function setDeadlineArrows(){
    isDedline = !isDedline;
    let deadlineSwitch = document.querySelector(".deadlineSign");
    deadlineSwitch.childNodes.forEach((element)=>{
        if(element.nodeName=="DIV"){
            let newArrow = document.createElement("DIV");
            newArrow.classList.add(isDedline? "arrowDown" : "arrowUp");
            element.before(newArrow);
            element.remove();
        }
    })

    deadlineSwitch.childNodes.forEach((element)=>{
        element.onmouseover = ()=>{
            deadlineSwitch.childNodes[1].classList.remove(isDedline? "arrowDown":"arrowUp");
            deadlineSwitch.childNodes[3].classList.remove(isDedline? "arrowDown":"arrowUp");
            deadlineSwitch.childNodes[1].classList.add(isDedline? "arrowDownHover":"arrowUpHover");
            deadlineSwitch.childNodes[3].classList.add(isDedline? "arrowDownHover":"arrowUpHover");
        }

        element.onmouseout = ()=>{
            deadlineSwitch.childNodes[1].classList.remove(isDedline? "arrowDownHover":"arrowUpHover");
            deadlineSwitch.childNodes[3].classList.remove(isDedline? "arrowDownHover":"arrowUpHover");
            deadlineSwitch.childNodes[1].classList.add(isDedline? "arrowDown":"arrowUp");
            deadlineSwitch.childNodes[3].classList.add(isDedline? "arrowDown":"arrowUp");
        }

        element.addEventListener("click",()=>{
            deadlineSwitch.childNodes[1].style.animation = "rotateArrows 1s";
            deadlineSwitch.childNodes[3].style.animation = "rotateArrows 1s";
            if(!isDedline & (document.querySelector(".createTask").childNodes.length < 8)){
            document.querySelector(".createTask").appendChild(makeDeadlineControls());
            }
            else
            if(document.querySelector(".createTask").childNodes.length ==8) document.querySelector(".createTask").querySelector(".deadlineControls").remove();
        });

        deadlineSwitch.childNodes[1].addEventListener("animationend",()=>{
            setDeadlineArrows();
            document.querySelector(".createTask").querySelector(".deadlineControls").classList.remove("popAnimation");
        })
    })
}
setDeadlineArrows();

function makeDeadlineControls(){
    let defaultDeadline = new Date();
    let deadlineControls = document.createElement("DIV");
    deadlineControls.classList.add("deadlineControls");
    deadlineControls.classList.add("popAnimation");
    let dayInput = document.createElement("input"); 
    dayInput.maxLength=2;
    dayInput.value = defaultDeadline.getDate();
    dayInput.oninput = ()=>{
        if(isNaN(+dayInput.value) | +dayInput.value > 31) dayInput.value = new Date().getDate();
    }
    dayInput.onblur = ()=>{
        if(!+dayInput.value) dayInput.value = new Date().getDate();
        if ((+dayInput.value > dateLimits(makeNumFromMonth(dayInput.parentNode.parentNode.querySelectorAll("SPAN")[0].innerText),+dayInput.parentNode.parentNode.querySelectorAll("SPAN")[1].innerText).max)|
        (+dayInput.value < dateLimits(makeNumFromMonth(dayInput.parentNode.parentNode.querySelectorAll("SPAN")[0].innerText),+dayInput.parentNode.parentNode.querySelectorAll("SPAN")[1].innerText).min))
        dayInput.value = dateLimits(makeNumFromMonth(dayInput.parentNode.parentNode.querySelectorAll("SPAN")[0].innerText),+dayInput.parentNode.parentNode.querySelectorAll("SPAN")[1].innerText).min
    }
    let monthInput = document.createElement("span"); monthInput.innerText = makeMonth(defaultDeadline.getMonth());
    let yearInput = document.createElement("span"); yearInput.innerText = defaultDeadline.getFullYear();
    let dayDiv = document.createElement("DIV"); dayDiv.appendChild(dayInput)
    let monthDiv = document.createElement("DIV"); monthDiv.appendChild(monthInput)
    let yearDiv = document.createElement("DIV"); yearDiv.appendChild(yearInput)
    deadlineControls.appendChild(makeSwitchArrows(dayDiv));
    deadlineControls.appendChild(makeSwitchArrows(monthDiv));
    deadlineControls.appendChild(makeSwitchArrows(yearDiv));
    return makeChangeDeadline(deadlineControls);
}

function makeMonth(num){
    switch(num){
        case 0: return "Jan.";
        case 1: return "Feb.";
        case 2: return "Mar.";
        case 3: return "Apr.";
        case 4: return "May";
        case 5: return "Jun.";
        case 6: return "Jul.";
        case 7: return "Aug.";
        case 8: return "Sep.";
        case 9: return "Oct.";
        case 10: return "Nov.";
        case 11: return "Dec.";
    }
}

function makeNumFromMonth(num){
    switch(num){
        case "Jan." : return 0;
        case "Feb." : return 1;
        case "Mar." : return 2;
        case "Apr." : return 3;
        case "May" : return 4;
        case "Jun." : return 5;
        case "Jul." : return 6;
        case "Aug." : return 7;
        case "Sep." : return 8;
        case "Oct." : return 9;
        case "Nov." : return 10;
        case "Dec." : return 11;
    }
}

function makeSwitchArrows(el){
    let up = document.createElement("DIV");
    let down = document.createElement("DIV");
    up.classList.add("arrowUp");
    down.classList.add("arrowDown");
    down.classList.add("done");
    el.prepend(up);
    el.appendChild(down);
    return el;
}

function getDateDeadline(dedline){
   return new Date(+dedline.querySelectorAll("SPAN")[1].innerText,makeNumFromMonth(dedline.querySelectorAll("SPAN")[0].innerText),+dedline.querySelector("input").value)
}

function makeChangeDeadline(dedline){
    let upArrows = dedline.querySelectorAll(".arrowUp");
    let downArrows = dedline.querySelectorAll(".arrowDown");

    upArrows.forEach((element)=>{
        element.onmouseover = ()=>{
            if(!element.classList.contains("done")){
                element.classList.remove("arrowUp");
                element.classList.add("arrowUpHover")
            }
        }

        element.onmouseout = ()=>{
            if((!element.classList.contains("done")) & element.classList.contains("arrowUpHover")){
                element.classList.remove("arrowUpHover");
                element.classList.add("arrowUp");
            }
        }
    })

    downArrows.forEach((element)=>{
        element.onmouseover = ()=>{
            if(!element.classList.contains("done")){
                element.classList.remove("arrowDown");
                element.classList.add("arrowDownHover")
            }
        }

        element.onmouseout = ()=>{
            if((!element.classList.contains("done")) & element.classList.contains("arrowDownHover")){
                element.classList.remove("arrowDownHover");
                element.classList.add("arrowDown");
            }
        }
    })

    

    function monthLimits(year){
        if(year== new Date().getFullYear())
        return {max:11,
                min: new Date().getMonth()        
        }
        else return {max:11,
                    min: 0
                 }
    }

    function disableArrows(dedline){
        let dateOnScren = getDateDeadline(dedline);
        if(dateOnScren.getDate()<dateLimits(dateOnScren.getMonth(),dateOnScren.getFullYear()).max)
            upArrows[0].classList.remove("done");
        else upArrows[0].classList.add("done");
        if(dateOnScren.getDate()>dateLimits(dateOnScren.getMonth(),dateOnScren.getFullYear()).min)
            downArrows[0].classList.remove("done");
        else downArrows[0].classList.add("done");

        if(dateOnScren.getMonth()< monthLimits(dateOnScren.getFullYear()).max)
            upArrows[1].classList.remove("done");
        else upArrows[1].classList.add("done");
        if(dateOnScren.getMonth()> monthLimits(dateOnScren.getFullYear()).min)
            downArrows[1].classList.remove("done");
        else downArrows[1].classList.add("done");
    }

    function setDefaultDeadline(dedline){
        dedline.querySelector("INPUT").value = new Date().getDate();
        dedline.querySelectorAll("SPAN")[0].innerText = makeMonth(new Date().getMonth())
    }

    function setMaxDate(dedline){
        dedline.querySelector("INPUT").value = dateLimits(makeNumFromMonth(dedline.querySelectorAll("SPAN")[0].innerText),+dedline.querySelectorAll("SPAN")[1].innerText).max
    }

    upArrows[0].addEventListener("click",()=>{
        if(+upArrows[0].parentNode.querySelector("input").value < dateLimits(getDateDeadline(dedline).getMonth(),getDateDeadline(dedline).getFullYear()).max){
            upArrows[0].parentNode.querySelector("input").value = +upArrows[0].parentNode.querySelector("input").value + 1;
            downArrows[0].classList.remove("done")
            if(+upArrows[0].parentNode.querySelector("input").value == dateLimits(getDateDeadline(dedline).getMonth(),getDateDeadline(dedline).getFullYear()).max)
            upArrows[0].classList.add("done");
        }
        disableArrows(dedline)
    })
    downArrows[0].addEventListener("click",()=>{
        if(+downArrows[0].parentNode.querySelector("input").value> dateLimits(getDateDeadline(dedline).getMonth(),getDateDeadline(dedline).getFullYear()).min){
            downArrows[0].parentNode.querySelector("input").value = +downArrows[0].parentNode.querySelector("input").value - 1;
            upArrows[0].classList.remove("done");
            if(+downArrows[0].parentNode.querySelector("input").value == dateLimits(getDateDeadline(dedline).getMonth(),getDateDeadline(dedline).getFullYear()).min)
            downArrows[0].classList.add("done");
        }
        disableArrows(dedline)
    })

    upArrows[1].addEventListener("click",()=>{
        if(!(upArrows[1].parentNode.querySelector("SPAN").innerText=="Dec.")){
        upArrows[1].parentNode.querySelector("SPAN").innerText = makeMonth(makeNumFromMonth(upArrows[1].parentNode.querySelector("SPAN").innerText)+1);
        downArrows[1].classList.remove("done");
        }
        if(upArrows[1].parentNode.querySelector("SPAN").innerText=="Dec.")
        upArrows[1].classList.add("done");
        if(+dedline.querySelector("INPUT").value>dateLimits(makeNumFromMonth(dedline.querySelectorAll("SPAN")[0].innerText),+dedline.querySelectorAll("SPAN")[1].innerText).max)
        setMaxDate(dedline)
        disableArrows(dedline)
    })

    downArrows[1].addEventListener("click",()=>{
        let currentDate = new Date();
        let onScreenDate = getDateDeadline(dedline);
        if(!(upArrows[1].parentNode.querySelector("SPAN").innerText=="Jan.") & !(currentDate.getMonth()== onScreenDate.getMonth() & currentDate.getFullYear()== onScreenDate.getFullYear()) ){
        upArrows[1].parentNode.querySelector("SPAN").innerText = makeMonth(makeNumFromMonth(upArrows[1].parentNode.querySelector("SPAN").innerText)-1);
        upArrows[1].classList.remove("done");
        }
        if((upArrows[1].parentNode.querySelector("SPAN").innerText=="Jan.")|(currentDate.getMonth()== (onScreenDate.getMonth()-1) & currentDate.getFullYear()== onScreenDate.getFullYear()))
        downArrows[1].classList.add("done");
        if(+dedline.querySelector("INPUT").value>dateLimits(makeNumFromMonth(dedline.querySelectorAll("SPAN")[0].innerText),+dedline.querySelectorAll("SPAN")[1].innerText).max)
        setMaxDate(dedline)
        disableArrows(dedline)
    })

    upArrows[2].addEventListener("click",()=>{
        upArrows[2].parentNode.querySelector("SPAN").innerText = (+upArrows[2].parentNode.querySelector("SPAN").innerText)+1;
        downArrows[2].classList.remove("done");
        if(+dedline.querySelector("INPUT").value>dateLimits(makeNumFromMonth(dedline.querySelectorAll("SPAN")[0].innerText),+dedline.querySelectorAll("SPAN")[1].innerText).max)
        setMaxDate(dedline)
        disableArrows(dedline)
    })

    downArrows[2].addEventListener("click",()=>{
        let currentYear = new Date().getFullYear();
        if(+upArrows[2].parentNode.querySelector("SPAN").innerText!=currentYear)
        downArrows[2].parentNode.querySelector("SPAN").innerText = (+upArrows[2].parentNode.querySelector("SPAN").innerText)-1;
        if(+upArrows[2].parentNode.querySelector("SPAN").innerText==currentYear)
        downArrows[2].classList.add("done");
        if (currentYear == getDateDeadline(dedline).getFullYear()) setDefaultDeadline(dedline);
        if(+dedline.querySelector("INPUT").value>dateLimits(makeNumFromMonth(dedline.querySelectorAll("SPAN")[0].innerText),+dedline.querySelectorAll("SPAN")[1].innerText).max)
        setMaxDate(dedline)
        disableArrows(dedline)
    })

    

    return dedline;
}

function daysInMonth (month, year) {
    return new Date(year, month+1, 0).getDate();
}

function dateLimits(month,year){
    if( (year== new Date().getFullYear()) & (month == new Date().getMonth()) )
    return {max:daysInMonth(month,year),
            min: new Date().getDate()        
    }
    else return {max:daysInMonth(month,year),
                min: 1
             }
}