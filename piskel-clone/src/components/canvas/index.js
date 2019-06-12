let number = 0;  //ID of next canvas
let CurrentFrameId='';
let tooltype = 'draw'; //default tool
let lastActive='';
let ifRuns=false;
let color='red';


let helpCanvas = document.createElement('canvas'); // canvas for drawing
let helpCtx = helpCanvas.getContext("2d");
helpCanvas.setAttribute('width', '512');
helpCanvas.setAttribute('height', '512');
helpCanvas.setAttribute('id', 'helpCanvas');
let helpImage = new Image;




//for drawing
let startX;
let startY;
let last_mousex, last_mousey;
adding(); //draw initial canvas

function adding(old,cloning){
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
    
    //if new frame - create empty image to frame-list or clonning frame
    if(!old || cloning){
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
        
        
        let buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('width', '20');
        buttonDelete.setAttribute('height', '10');
        buttonDelete.setAttribute("class", "actFrame");
        buttonDelete.innerText='delete';
        buttonDelete.onclick=function(e){
            if(this.parentNode.parentNode.childNodes.length>1){
                document.getElementById('canvas0').click();
                this.parentNode.remove();
                if(ifRuns){
                    run();
                }
            }
        };
    
        let buttonClone = document.createElement('button');
        buttonClone.setAttribute('width', '20');
        buttonClone.setAttribute('height', '10');
        buttonClone.setAttribute("class", "actFrame");
        buttonClone.innerText='clone';
        buttonClone.onclick = function(){
            adding(this.parentNode.childNodes[0],'cloning');
            console.log(this.parentNode.childNodes[0]);
        };
        
        let temp = document.createElement('div');
        temp.appendChild(image);
        temp.appendChild(buttonDelete);
        temp.appendChild(buttonClone);
        
        document.getElementById('root').appendChild(temp);
    }
    
    //LISTENERS FOR TEMPORARY CANVAS FOR OTHER TOOLS
    helpCanvas.onmousedown=function(e){
        paint=true;
        startX=Math.ceil((parseInt(e.clientX-this.offsetLeft)-16)/16)*16;
        startY=Math.ceil((parseInt(e.clientY-this.offsetTop)-16)/16)*16;
    };
    helpCanvas.onmousemove=function(e){
        if(paint){
            console.log('hel');
            let mousex = Math.ceil((parseInt(e.clientX-this.offsetLeft)-16)/16)*16;
            let mousey = Math.ceil((parseInt(e.clientY-this.offsetTop)-16)/16)*16;
            if(tooltype==='line'){
                helpCtx.clearRect(0, 0, 512, 512);
                helpCtx.beginPath();
                helpCtx.globalCompositeOperation = 'source-over';
                line(startX,mousex,startY,mousey,helpCtx);
            }
        }
    };
    helpCanvas.onmouseup=function(e) {
        paint=false;
        if (tooltype === 'line') {
            
            helpImage.src = helpCanvas.toDataURL("image/png");
            let d = function(){
                ctx.drawImage(helpImage, 0, 0);
            };
            
            helpImage.onload=d;
            
 
        }
        if (ifRuns) {
            run();
        }
        this.remove();
    };
    //LISTENERS FOR CANVAS
    canvas.onmousedown=function(e){
        paint=true;
        if(tooltype==='line'){
            startX=Math.ceil((parseInt(e.clientX-this.offsetLeft)-16)/16)*16;
            startY=Math.ceil((parseInt(e.clientY-this.offsetTop)-16)/16)*16;
            document.getElementById('editor').appendChild(helpCanvas);
        }
        let mousex = Math.ceil((parseInt(e.clientX-this.offsetLeft)-16)/16)*16;
        let mousey = Math.ceil((parseInt(e.clientY-this.offsetTop)-16)/16)*16;
        if(paint) {
            ctx.beginPath();
            if(tooltype==='draw') {
                ctx.globalCompositeOperation = 'source-over';
                line(last_mousex,mousex,last_mousey, mousey, ctx);
            }
        
            else if(tooltype==='erase') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 10;
                line(last_mousex,mousex,last_mousey, mousey, ctx);
            }
        
            else if(tooltype==='line'){
                helpCtx.globalCompositeOperation = 'source-over';
                //ctx.moveTo(startX,startY);
                line(startX,mousex,startY,mousey,helpCtx);
            }
        
        }
        last_mousex = mousex;
        last_mousey = mousey;
        e.stopPropagation();
    };
    
    canvas.onmousemove=function(e){
        let mousex = Math.ceil((parseInt(e.clientX-this.offsetLeft)-16)/16)*16;
        let mousey = Math.ceil((parseInt(e.clientY-this.offsetTop)-16)/16)*16;
        if(paint) {
            ctx.beginPath();
            if(tooltype==='draw') {
                ctx.globalCompositeOperation = 'source-over';
                line(last_mousex,mousex,last_mousey, mousey, ctx);
            }
            else if(tooltype==='erase') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = 10;
                line(last_mousex,mousex,last_mousey, mousey, ctx);
            }
            
            /*else if(tooltype==='line'){
                //helpCtx.clearRect(0, 0, 512, 512);
                helpCtx.beginPath();
                //helpCtx.globalCompositeOperation = 'destination-out';
               // line(startX,mousex,startY,mousey,helpCtx);
                helpCtx.globalCompositeOperation = 'source-over';
                line(startX,mousex,startY,mousey,helpCtx);
                
            }*/
            
        }
        last_mousex = mousex;
        last_mousey = mousey;
    };
    
    canvas.onmouseup=function(e){
        paint=false;
        console.log('can');
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
        if(tooltype==='line'){
            helpImage.src=helpCanvas.toDataURL("image/png");
            ctx.drawImage(helpImage, 0, 0);
        }
        
        
        if(ifRuns){
            run();
        }
        document.getElementById(String('canvas' + CurrentFrameId)).parentNode.replaceChild(image,document.getElementById(String('canvas' + CurrentFrameId)));
    };
                
    canvas.onmouseleave=()=>{
                    paint=false;
                };
    
    
    document.getElementById('editor').innerHTML='';
    document.getElementById('editor').appendChild(canvas);
}

let player = document.getElementById('player');

//алгоритм Брезенхема
function line(x1, x2, y1, y2, ctx){
    ctx.fillStyle = color;
    let deltaX = Math.abs(x2 - x1);
    let deltaY = Math.abs(y2 - y1);
    let signX=x1<x2?16:-16;
    let signY=y1<y2?16:-16;
    let error = deltaX-deltaY;
    ctx.fillRect(x2, y2,16, 16);
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
let fps = 15;
document.getElementById('fpsAmount').innerHTML=fps;
sizeFps=()=>{
    fps=document.getElementById("fps").value;
    document.getElementById('fpsAmount').innerHTML=fps;
    run();
};

function run(){
    stop();
    ifRuns=true;
    let arrayImg = [];
    document.getElementById('root').childNodes.forEach((item)=>{
            let image = new Image;
            image.src=item.childNodes[0].src;
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
    ifRun=false;
    clearInterval(timer);
    player.innerHTML='';
}
/*___________________________________________________________*/




/*___________________________________________________________*/
//CHOOSE TOOL

function use_tool (tool) {
    tooltype = tool; //update
    if(tooltype==='line'){
        document.getElementById('editor').appendChild(helpCanvas);
    }
}
function choose_color (setColor) {
    color = setColor; //update
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
        lastActive.parentNode.childNodes[2].dispatchEvent(doEvent);
    }
    if (event.key === 'd') {
        lastActive.parentNode.childNodes[1].dispatchEvent(doEvent);
    }
});

/*_________________________________________________*/






