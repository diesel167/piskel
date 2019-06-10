let number = 0;  //ID of next canvas
let CurrentFrameId='';
let tooltype = 'draw'; //default tool
let lastActive='';

adding(); //draw initial canvas

function adding(old){
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', '512');
    canvas.setAttribute('height', '512');
    let image = new Image;
    let ctx = canvas.getContext("2d");
    //ctx.scale(4,4);
    let paint=false;
    
    //if edit frame - draw at first old frame state
    if(old){
        //apply the old canvas to the new one
        ctx.drawImage(old, 0, 0);
        CurrentFrameId=old.id.slice(6,);

    }
    
    //if new frame - create empty image to frame-list
    if(!old){
        CurrentFrameId=number;
        image.src=canvas.toDataURL("image/png");
        image.setAttribute('id', String('canvas' + CurrentFrameId));
        image.setAttribute("class", "canvas");

        image.onclick=function(){
            //delete active from previous
            if(lastActive){
                lastActive.classList.toggle('active');
            }
            image.classList.toggle('active');
            lastActive=image;
            //send it to editor
            adding(this);
        };
        
        if(lastActive){
            lastActive.classList.toggle('active');
        }
        image.classList.toggle('active');
        lastActive=image;

        number++;
        document.getElementById('root').appendChild(image);
    }

    //LISTENERS FOR CANVAS
    canvas.onmousedown=function(){
        paint=true;
    };
    
    canvas.onmousemove=function(e){
        let mousex = Math.ceil((parseInt(e.clientX-this.offsetLeft)-16)/16)*16;
        let mousey = Math.ceil((parseInt(e.clientY-this.offsetTop)-16)/16)*16;
        if(paint) {
            ctx.beginPath();
            if(tooltype==='draw') {
                ctx.globalCompositeOperation = 'source-over';
            } else {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 10;
            }
            //draw
            line(last_mousex,mousex,last_mousey, mousey, ctx);
        }
        last_mousex = mousex;
        last_mousey = mousey;
    };
    
    canvas.onmouseup=function(){
        paint=false;

        image.src=canvas.toDataURL("image/png");

        image.setAttribute('id', String('canvas' + CurrentFrameId));
        image.setAttribute("class", "canvas");
        //image.classList.toggle('active');
        
        image.onclick=function(){
            //delete active from previous
            if(lastActive){
                lastActive.classList.toggle('active');
            }
            image.classList.toggle('active');
            lastActive=image;
            //send it to editor
            adding(this);
        };
        lastActive=image;
        image.classList.toggle('active');
        document.getElementById(String('canvas' + CurrentFrameId)).parentNode.replaceChild(image,document.getElementById(String('canvas' + CurrentFrameId)));
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
    
    document.getElementById('editor').innerHTML='';
    document.getElementById('editor').appendChild(canvas);
}

let player = document.getElementById('player');

//алгоритм Брезенхема
function line(x1, x2, y1, y2, ctx){
    let deltaX = Math.abs(x2 - x1);
    let deltaY = Math.abs(y2 - y1);
    let signX=x1<x2?16:-16;
    let signY=y1<y2?16:-16;
    let error = deltaX-deltaY;
    
    ctx.fillRect(x2, y2,16, 16);
    console.log('x1'+x1);
    console.log('x2'+x2);
    while(x1!==x2||y1!==y2){
        ctx.fillRect(x1, y1,16, 16);
        let error2=error*2;
        if(error2>-deltaY){
            error-=deltaY;
            x1+=signX;
        }
        if(error2<deltaX){
            error+=deltaX;
            y1+=signY;
        }

    }
}



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
        image.setAttribute('width', '128');
        image.setAttribute('height', '128');
        console.log(image);
        arrayImg.push(image);
    });

    let length = arrayImg.length;
    let i=0;
    if(fps!=0){
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
