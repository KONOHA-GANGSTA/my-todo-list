function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top
    };
  }

  function eyeCordsCheck(x0,y0,r,x,y){
    if(Math.pow(r,2)<Math.pow(x-x0,2)+Math.pow(y-y0,2))
    return false
    else
    return true;
}

function eyeCords(x0,y0,r,x,y){
    let a =Math.atan((y0-y)/(x0-x));
    if(x<= x0)
    return{
        left: x0-Math.cos(a)*r,
        top: y0-Math.sin(a)*r
    }
    else{
    return{
        left: x0+Math.cos(a)*r,
        top: y0+Math.sin(a)*r
        }
    }
}

let leftEye = document.createElement("div");
leftEye.style.width="30px";
leftEye.style.height="30px";
leftEye.style.borderRadius="50%";
leftEye.style.backgroundColor="black";
let leftO = document.getElementById("leftO");
leftEye.style.position="absolute";
leftEye.style.left=getOffset(leftO).left+45+"px";
leftEye.style.top=getOffset(leftO).top+45+"px";
leftO.appendChild(leftEye);
let rightEye = document.createElement("div");
rightEye.style.width="30px";
rightEye.style.height="30px";
rightEye.style.borderRadius="50%";
rightEye.style.backgroundColor="black";
let rightO = document.getElementById("rightO");
rightEye.style.position="absolute";
rightEye.style.left=getOffset(rightO).left+45+"px";
rightEye.style.top=getOffset(rightO).top+45+"px";
rightO.appendChild(rightEye);

window.addEventListener("mousemove",(eve)=>{
    if(eyeCordsCheck(getOffset(leftO).left+60,getOffset(leftO).top+60,45,eve.clientX,eve.clientY)){
        leftEye.style.left=eve.clientX - 15 + "px";
        leftEye.style.top=eve.clientY - 15 + "px";
    } else {
        leftEye.style.left=eyeCords(getOffset(leftO).left+60,getOffset(leftO).top+60,45,eve.clientX,eve.clientY).left -15 +"px";
        leftEye.style.top=eyeCords(getOffset(leftO).left+60,getOffset(leftO).top+60,45,eve.clientX,eve.clientY).top -15 +"px";
    }

    if(eyeCordsCheck(getOffset(rightO).left+60,getOffset(rightO).top+60,45,eve.clientX,eve.clientY)){
        rightEye.style.left=eve.clientX - 15 + "px";
        rightEye.style.top=eve.clientY - 15 + "px";
    } else {
        rightEye.style.left=eyeCords(getOffset(rightO).left+60,getOffset(rightO).top+60,45,eve.clientX,eve.clientY).left -15 +"px";
        rightEye.style.top=eyeCords(getOffset(rightO).left+60,getOffset(rightO).top+60,45,eve.clientX,eve.clientY).top -15 +"px";
    }
})