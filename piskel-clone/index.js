let number = 0;  //ID of next canvas
let CurrentFrameId='';
adding();
let tooltype = 'draw';


//нужно добавить перемнную - текущий id активного слайда
function adding(old){
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', '256');
    canvas.setAttribute('height', '256');

    let ctx = canvas.getContext("2d");
    let paint=false;
    let last_mousex = 0;
    let last_mousey = 0;
    
    //if edit frame - draw at first old frame state
    if(old){
        //apply the old canvas to the new one
        ctx.drawImage(old, 0, 0);
        CurrentFrameId=old.id.slice(6,);
        console.log(old.id);
    }
    //if new frame - create empty image to frame-list
    if(!old){
        CurrentFrameId=number;
        let InitialImage=document.createElement('img');
        InitialImage.src=canvas.toDataURL("image/png");
        InitialImage.setAttribute('id', String('canvas' + CurrentFrameId));
        InitialImage.setAttribute("class", "canvas");
        number++;
        document.getElementById('root').appendChild(InitialImage);
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
    
    canvas.onmouseup=function(){
        paint=false;
        let image = new Image;
        image.src=canvas.toDataURL("image/png");

        image.setAttribute('id', String('canvas' + CurrentFrameId));
        image.setAttribute("class", "canvas");

        image.onclick=function(){
            adding(this);
        };
        
        console.log(document.getElementById(String('canvas' + CurrentFrameId)));
        document.getElementById(String('canvas' + CurrentFrameId)).parentNode.replaceChild(image,document.getElementById(String('canvas' + CurrentFrameId)));
    };
    
    canvas.onmouseleave=()=>{
        paint=false;
        let image = new Image;
        image.src=canvas.toDataURL("image/png");
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
    
    
    //отправить картинку ввместо temp а темп inner в editor
    //и после каждого отпускания мыши создавать toDataURL("image/png") и отправлсять в document.getElementById('root').appendChild(КАРТИНКА)
    document.getElementById('editor').innerHTML='';
    document.getElementById('editor').appendChild(canvas);
}

let player = document.getElementById('player');



/*___________________________________________________________*/

//RUN---STOP ANIMATION

let timer;
let fps = 5;
sizeFps=()=>{
    fps=document.getElementById("fps").value;
    run();
};

function run(){
    stop();
    let arrayImg = [];
    document.getElementById('root').childNodes.forEach((item)=>{
        let image = new Image;
        image.src=item.src;
        arrayImg.push(image);
    });

    let length = arrayImg.length;
    let i=0;
    if(fps!=0){
        console.log("не ноль")
        timer = setInterval(function (){
            player.innerHTML='';
            player.appendChild(arrayImg[i%length]);
            i++;
        },1000 / fps);
    }
    else{
        clearInterval(timer);
    }

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




/*_________________________________________________*/

//KEYBOARD
document.addEventListener('keydown', function (event) {
    let doEvent = new Event('click');
    if (event.key === 's') {
        document.getElementById('stop').dispatchEvent(doEvent);
    }
    if (event.key === 'p') {
        document.getElementById('run').dispatchEvent(doEvent);
    }
    if (event.key === '+') {
        document.getElementById('add').dispatchEvent(doEvent);
    }
    if (event.key === 'c') {
        document.getElementById('clone').dispatchEvent(doEvent);
    }
});

/*_________________________________________________*/
