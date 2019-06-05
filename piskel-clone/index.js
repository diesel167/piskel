let number = 0;  //ID of next canvas
adding();
let tooltype = 'draw';

function adding(old){
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', '128');
    canvas.setAttribute('height', '128');
    canvas.setAttribute('id', String('canvas' + number));
    number++;
    
    let ctx = canvas.getContext("2d");
    let paint=false;
    let last_mousex = 0;
    let last_mousey = 0;
    
    
    if(old){
        //apply the old canvas to the new one
        ctx.drawImage(old, 0, 0);
    }
    
    
    canvas.onmousedown=function(e){
        paint=true;
    };
    
    canvas.onmousemove=function(e){
        let mousex = parseInt(e.clientX-this.offsetLeft);
        let mousey = parseInt(e.clientY-this.offsetTop);
        if(paint) {
            ctx.beginPath();
            if(tooltype==='draw') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 5;
            } else {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 10;
            }
            ctx.moveTo(last_mousex,last_mousey);
            ctx.lineTo(mousex,mousey);
            ctx.lineJoin = ctx.lineCap = 'round';
            ctx.stroke();
        }
        last_mousex = mousex;
        last_mousey = mousey;
    };
    
    canvas.onmouseup=()=>{
        paint=false;
    };
    
    canvas.onmouseleave=()=>{
        paint=false;
    };
    
    
    let buttonDelete = document.createElement('button');
    buttonDelete.setAttribute('width', '20');
    buttonDelete.setAttribute('height', '10');
    buttonDelete.innerText='delete';
    buttonDelete.onclick=function(){
        this.parentNode.remove();
    };
    
    
    let buttonClone = document.createElement('button');
    buttonClone.setAttribute('width', '20');
    buttonClone.setAttribute('height', '10');
    buttonClone.innerText='clone';
    buttonClone.onclick = function(){
        adding(this.parentNode.children[0]);
    };
    
    
    let temp = document.createElement('div');
    temp.appendChild(canvas);
    temp.appendChild(buttonDelete);
    temp.appendChild(buttonClone);
    
    document.getElementById('root').appendChild(temp);
}

let player = document.getElementById('player');



/*___________________________________________________________*/

//RUN---STOP ANIMATION

let timer;
function run(){
    stop();
    let arrayImg = [];
    document.getElementById('root').childNodes.forEach((item)=>{
        
        let image = new Image;
        
        image.src=item.firstChild.toDataURL("image/png");
        arrayImg.push(image);
    });
    
    console.log(arrayImg);
    let fps = 8;
    let length = arrayImg.length;
    let i=0;
    
    
    timer = setInterval(function (){
        player.innerHTML='';
        player.appendChild(arrayImg[i%length]);
        i++;
    },1000 / fps);

    
}

function stop(){
    clearInterval(timer);
    player.innerHTML='';
}
/*___________________________________________________________*/




/*___________________________________________________________*/
//CHOOSE TOOL

function use_tool (tool) {
    tooltype = tool; //update
}
/*___________________________________________________________*/


let editor=document.getElementById('editor');
