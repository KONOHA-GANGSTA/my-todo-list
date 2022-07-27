document.querySelector(".filter").childNodes.forEach((element)=>{
    if(element.nodeName=="SPAN"){
        element.onclick = () =>{
            element.classList.contains("filterSelected")? element.classList.remove("filterSelected") : element.classList.add("filterSelected");
            switch(element.innerText){
                case "UNDONE":{
                    for(let value of allTasks.values()){
                        if(value.status) document.getElementById(value.id).style.display=
                        element.classList.contains("filterSelected")? "none":"" ;
                    }
                    break;
                }

                case "DEADLINES":{
                    if(document.querySelector(".filter").querySelectorAll("SPAN")[1].classList.contains("filterSelected")){
                    let sortedTasks = [];
                    let displayedIds = [];
                    for(let elem of Array.from(allTasks.values()).sort((a,b)=>a.date - b.date)){
                       if(elem.date) sortedTasks.push(elem);
                    }

                    document.querySelector(".taskList").childNodes.forEach(element => {
                        if(element.nodeName!='#text')
                            if (element.style.display=="") displayedIds.push(+element.id)
                    })

                    sortedTasks.reverse().forEach(element => {
                        if(displayedIds.includes(element.id)){
                            let swap = document.getElementById(element.id);
                            document.getElementById(element.id).remove();
                            document.querySelector(".taskList").prepend(swap);
                        }
                    });
                } else resetTaskList();
                }
                
                default: {
                    filterTasksByImportance();
                    break;
                }
            }
        }
    }
})

function filterTasksByImportance(){
    let filter= {
        "LOW": true,
        "MEDIUM": true,
        "HIGH": true
    }
    document.querySelector(".filter").childNodes.forEach(element =>{
        if(Object.keys(filter).includes(element.innerText))
                filter[element.innerText] = (element.classList.contains("filterSelected"))? true:false;

    })

    document.querySelector(".taskList").childNodes.forEach(element=>{
        if(element.nodeName!='#text')
        element.style.display="none";
    })

    for(let value of allTasks.values()){
        if(filter[value.importance])
            document.getElementById(value.id).style.display="";
        else
        document.getElementById(value.id).style.display="none";
    }
    
    if(!filter["LOW"] & !filter["MEDIUM"] & !filter["HIGH"]){
        document.querySelector(".taskList").childNodes.forEach(element=>{
            if(element.nodeName!='#text') element.style.display="";
        })
        
    }
    if(document.querySelector(".filter").querySelectorAll("SPAN")[0].classList.contains("filterSelected")){
    document.querySelector(".filter").querySelectorAll("SPAN")[0].click();
    document.querySelector(".filter").querySelectorAll("SPAN")[0].click();
    }
}

function resetTaskList(){
    document.querySelector(".taskList").innerHTML="";
    Array.from(allTasks.values()).forEach(elem=>addTask(elem));
}