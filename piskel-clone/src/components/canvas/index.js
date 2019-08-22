let number = 0;  //ID of next canvas
let CurrentFrameId='';
let tooltype = 'draw'; //default tool
let toolButtonPushed='';
use_tool('draw',document.getElementById('draw'));
let lastActiveFrame='';
let ifRuns=false;
let color="rgb(255,0,0,255)";
let size = 1; //for tool size
let sizeCanvas = 32; //default


let imageData;
let currentCtx;
let currentCanvas;
let sizeButton=document.getElementById('size32');
sizeButton.classList.toggle('active');


//show size
document.getElementById('size').innerHTML=`[${sizeCanvas}x${sizeCanvas}]`;

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
    currentCtx=ctx;
    currentCanvas=canvas;
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
            if(lastActiveFrame){
                lastActiveFrame.classList.toggle('active');
            }
            image.classList.toggle('active');
            lastActiveFrame=image;
            //send it to editor
            adding(this);
            if(tooltype==='line'){
                document.getElementById('editorWithHelpCanvas').lastChild.remove();
                document.getElementById('editorWithHelpCanvas').appendChild(helpCanvas);
            }
        };
        if(lastActiveFrame){
            lastActiveFrame.classList.toggle('active');
        }
        image.classList.toggle('active');
        lastActiveFrame=image;
        number++;
        
        let buttonDelete = document.createElement('button');
        buttonDelete.setAttribute("class", "actFrame");
        buttonDelete.innerText='delete';
        buttonDelete.onclick=function(e){
            if(this.parentNode.parentNode.childNodes.length>1){
                document.getElementById('root').childNodes[0].click();
                console.log( document.getElementById('root').childNodes[0]);

                this.parentNode.remove();
                if(ifRuns){
                    run();
                }
            }
        };
    
        let buttonClone = document.createElement('button');
        buttonClone.setAttribute("class", "actFrame");
        buttonClone.innerText='clone';
        buttonClone.onclick = function(){
            adding(this.parentNode.childNodes[0],'cloning');
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
        //set draw (if eraser was last)
        ctx.globalCompositeOperation = 'source-over';
        startX=Math.ceil((parseInt(e.clientX-this.getBoundingClientRect().left)-16*size/(sizeCanvas/32))/(16*size/(sizeCanvas/32)))*16*size/(sizeCanvas/32);
        startY=Math.ceil((parseInt(e.clientY-this.getBoundingClientRect().top)-16*size/(sizeCanvas/32))/(16*size/(sizeCanvas/32)))*16*size/(sizeCanvas/32);
    };
    helpCanvas.onmousemove=function(e){
        if(paint){
            let mousex = Math.ceil((parseInt(e.clientX-this.getBoundingClientRect().left)-16*size/(sizeCanvas/32))/(16*size/(sizeCanvas/32)))*16*size/(sizeCanvas/32);
            let mousey = Math.ceil((parseInt(e.clientY-this.getBoundingClientRect().top)-16*size/(sizeCanvas/32))/(16*size/(sizeCanvas/32)))*16*size/(sizeCanvas/32);
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
            helpImage.onload=function(){
                ctx.drawImage(helpImage, 0, 0);
                image.src=canvas.toDataURL("image/png");
                console.log(document.getElementById(String('canvas' + CurrentFrameId)));
                image.setAttribute('id', String('canvas' + CurrentFrameId));
                image.setAttribute("class", "canvas");
                document.getElementById(String('canvas' + CurrentFrameId)).parentNode.replaceChild(image,document.getElementById(String('canvas' + CurrentFrameId)));
                lastActiveFrame=image;
                image.classList.toggle('active');
            };
        }
        if (ifRuns) {
            run();
        }
        helpCtx.clearRect(0, 0, 512, 512);
    };
    
    //LISTENERS FOR CANVAS
    canvas.onmousedown=function(e){
        paint=true;
        let mousex = Math.ceil((parseInt(e.clientX-canvas.getBoundingClientRect().left)-16*size/(sizeCanvas/32))/(16*size/(sizeCanvas/32)))*16*size/(sizeCanvas/32);
        let mousey = Math.ceil((parseInt(e.clientY-canvas.getBoundingClientRect().top)-16*size/(sizeCanvas/32))/(16*size/(sizeCanvas/32)))*16*size/(sizeCanvas/32);
        
        if(paint) {
            ctx.beginPath();
            if(tooltype==='draw') {
                ctx.globalCompositeOperation = 'source-over';
                ctx.fillRect(mousex, mousey,16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));
            }
            else if(tooltype==='erase') {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillRect(mousex, mousey,16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));
            }
            else if(tooltype==='invert') {
                imageData = ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) );
                console.log(Boolean(imageData.data.some(pixel=>pixel!==0)));
                let data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    data[i]     = 255 - data[i];     // red
                    data[i + 1] = 255 - data[i + 1]; // green
                    data[i + 2] = 255 - data[i + 2]; // blue
                }
                ctx.putImageData(imageData, mousex, mousey);
            }
            else if (tooltype==='bucket'){
                let x = mousex;
                let y = mousey;

                let initialColor = "rgb("
                    +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[0]+","
                    +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[1]+","
                    +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[2]+","
                    +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[3]+")";
                

                let pixelStack=[[x,y]];  //stack for vertical lines for coloring
                
                while(pixelStack.length){
                    let newxy = pixelStack.pop();
                    let reachLeft = false;
                    let reachRight = false;
                    x = newxy[0];
                    y = newxy[1];
                    
                    let currentPixelColor = "rgb("
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[0]+","
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[1]+","
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[2]+","
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[3]+")";
                    while(y>=0 && currentPixelColor===initialColor ){
                        currentPixelColor = "rgb("
                            +ctx.getImageData(x, y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[0]+","
                            +ctx.getImageData(x, y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[1]+","
                            +ctx.getImageData(x, y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[2]+","
                            +ctx.getImageData(x, y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[3]+")";
                        y-=16/(sizeCanvas/32);
                    }

                    //reset
                    y+=16/(sizeCanvas/32);
                    currentPixelColor = "rgb("
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[0]+","
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[1]+","
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[2]+","
                        +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[3]+")";

                    
                    while (y+16/(sizeCanvas/32) <= 512 && currentPixelColor===initialColor) {
                        y+=16/(sizeCanvas/32);
                        console.log(y);
                        let rgb = color.substring(4, color.length-1)
                            .replace(/ /g, '')
                            .split(',');
                        
                        let img = ctx.getImageData(x, y - 16/(sizeCanvas/32) , 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));
                        let data = img.data;
                        for (let i = 0; i < data.length; i += 4) {
                            data[i]     = rgb[0];     // red
                            data[i + 1] = rgb[1]; // green
                            data[i + 2] = rgb[2]; // blue
                            data[i + 3] = rgb[3]; //ligthning
                        }
                        ctx.putImageData(img, x, y - 16/(sizeCanvas/32));
                        
                        //move left
                        if (x > 0) {
                            if ("rgb("
                                +ctx.getImageData(x-16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[0]+","
                                +ctx.getImageData(x-16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[1]+","
                                +ctx.getImageData(x-16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[2]+","
                                +ctx.getImageData(x-16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[3]+")" === initialColor) {
                                if (!reachLeft) {
                                    pixelStack.push([x - 16/(sizeCanvas/32), y - 16/(sizeCanvas/32)]);
                                    reachLeft = true;
                                }
                            }
                            else if (reachLeft) {
                                reachLeft = false;
                            }
                        }
                        //move right
                        if(x < 512){
                            if("rgb("
                                +ctx.getImageData(x+16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[0]+","
                                +ctx.getImageData(x+16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[1]+","
                                +ctx.getImageData(x+16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[2]+","
                                +ctx.getImageData(x+16/(sizeCanvas/32), y-16/(sizeCanvas/32), 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[3]+")"===initialColor){
                                if(!reachRight){
                                    pixelStack.push([x+16/(sizeCanvas/32),y-16/(sizeCanvas/32)]);
                                    reachRight = true;
                                }
                            }
                            else if(reachRight){
                                reachRight = false;
                            }
                        }
                        currentPixelColor = "rgb("
                            +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[0]+","
                            +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[1]+","
                            +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[2]+","
                            +ctx.getImageData(x, y, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) ).data[3]+")";
                    }
               }
            }
            else if(tooltype==='darken'){
                imageData = ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) );
                console.log(Boolean(imageData.data.some(pixel=>pixel!==0)));
                let data = imageData.data;
    
                for (let i = 0; i < data.length; i += 4) {
                    data[i] -= 25;
                    data[i+1] -= 25;
                    data[i+2] -= 25;
                }
                ctx.putImageData(imageData, mousex, mousey);
            }
            else if(tooltype==='lighten'){
                imageData = ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32) );
                console.log(Boolean(imageData.data.some(pixel=>pixel!==0)));
                let data = imageData.data;
    
                for (let i = 0; i < data.length; i += 4) {
                    data[i] += 25;
                    data[i+1] += 25;
                    data[i+2] += 25;
                }
                ctx.putImageData(imageData, mousex, mousey);
            }
            
            last_mousex = mousex;
            last_mousey = mousey;
        }
    };
    
    canvas.onmousemove=function(e){
        let mousex = Math.ceil((parseInt(e.clientX-canvas.getBoundingClientRect().left)-16/(sizeCanvas/32))/(16/(sizeCanvas/32)))*16/(sizeCanvas/32);
        let mousey = Math.ceil((parseInt(e.clientY-canvas.getBoundingClientRect().top)-16/(sizeCanvas/32))/(16/(sizeCanvas/32)))*16/(sizeCanvas/32);
        mousex<0?mousex=0:1;
        mousey<0?mousey=0:1;
        
        document.getElementById('coordinates').innerHTML=`[${mousex/(16/(sizeCanvas/32))};${mousey/(16/(sizeCanvas/32))}]`;
        
        if(paint) {
            ctx.beginPath();
            console.log(tooltype);
            if(tooltype==='draw') {
                ctx.globalCompositeOperation = 'source-over';
                line(last_mousex,mousex,last_mousey, mousey, ctx);
            }
            else if(tooltype==='erase') {
                ctx.globalCompositeOperation = 'destination-out';
                line(last_mousex,mousex,last_mousey, mousey, ctx);
            }
            else if(tooltype==='invert') {
                if(ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32)).data.slice(0,4).some(pixel=>pixel!==0)){
                    let temp = ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));
                    let data = temp.data;
                    console.log(mousex);
                    for (let i = 0; i < data.length; i += 4) {
                        data[i]     = 255 - data[i];     // red
                        data[i + 1] = 255 - data[i + 1]; // green
                        data[i + 2] = 255 - data[i + 2]; // blue
                    }
                    if(mousex!==last_mousex || mousey!==last_mousey){
                        ctx.putImageData(temp, mousex, mousey);
                    }
                }
            }
            else if(tooltype==='darken'){
                if(ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32)).data.slice(0,4).some(pixel=>pixel!==0)){
                    let temp = ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));
                    let data = temp.data;
                    
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] -= 25;
                        data[i+1] -= 25;
                        data[i+2] -= 25;
                    }
                    if(mousex!==last_mousex || mousey!==last_mousey){
                        ctx.putImageData(temp, mousex, mousey);
                    }
                }
            }
            else if(tooltype==='lighten'){
                
                if(ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32)).data.slice(0,4).some(pixel=>pixel!==0)){
                    let temp = ctx.getImageData(mousex, mousey, 16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));
                    let data = temp.data;
        
                    for (let i = 0; i < data.length; i += 4) {
                        data[i] += 25;
                        data[i+1] += 25;
                        data[i+2] += 25;
            
                    }
                    if(mousex!==last_mousex || mousey!==last_mousey){
                        ctx.putImageData(temp, mousex, mousey);
                    }
                }
            }
        }
        last_mousex = mousex;
        last_mousey = mousey;
    };
    canvas.onmouseup=function(e){
        paint=false;
        image.src=canvas.toDataURL("image/png");
        image.setAttribute('id', String('canvas' + CurrentFrameId));
        image.setAttribute("class", "canvas");
        image.onclick=function(){
            //delete active from previous
            if(lastActiveFrame){
                lastActiveFrame.classList.toggle('active');
            }
            image.classList.toggle('active');
            lastActiveFrame=image;
            //send it to editor
            adding(this);
            if(tooltype==='line'){
                document.getElementById('editorWithHelpCanvas').lastChild.remove();
                document.getElementById('editorWithHelpCanvas').appendChild(helpCanvas);
            }
        };
        lastActiveFrame=image;
        image.classList.toggle('active');
        if(ifRuns){
            run();
        }
        document.getElementById(String('canvas' + CurrentFrameId)).parentNode.replaceChild(image,document.getElementById(String('canvas' + CurrentFrameId)));
    };
    canvas.onmouseleave=()=>{
        paint=false;
        document.getElementById('coordinates').innerHTML='';
        
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
    let signX=x1<x2?(16/(sizeCanvas/32)):-(16/(sizeCanvas/32));
    let signY=y1<y2?(16/(sizeCanvas/32)):-(16/(sizeCanvas/32));
    let error = deltaX-deltaY;

    ctx.fillRect(x2, y2,16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));

    while(x1!==x2||y1!==y2){
        ctx.fillRect(x1, y1,16*size/(sizeCanvas/32), 16*size/(sizeCanvas/32));
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
            image.setAttribute('width', '256');
            image.setAttribute('height', '256');
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

//CHOOSE TOOL

function use_tool (tool,element) {
    
    if(toolButtonPushed){
        toolButtonPushed.classList.toggle('active');
    }

    element.classList.toggle('active');
    toolButtonPushed=element;
    
    if(tooltype==='line'){
    
    }
    if(tooltype==='circle'){
        document.getElementById('editorWithHelpCanvas').lastChild.remove();
    }
    
    tooltype = tool; //update
    if(tooltype==='line'){
        document.getElementById('editorWithHelpCanvas').appendChild(helpCanvas);
    }
    if(tooltype==='circle'){
        document.getElementById('editorWithHelpCanvas').appendChild(helpCanvas);
    }
    
}
function choose_color (setColor) {
    color = setColor; //update
}
function change_size (setSize) {
    size = setSize; //update

}
function change_sizeCanvas (setSize, element) {
    let tempImage = new Image();
    tempImage.src=currentCanvas.toDataURL("image/png");
    tempImage.onload=function(){
        currentCtx.clearRect(0, 0, 512, 512);
        currentCtx.imageSmoothingEnabled = false;
        currentCtx.drawImage(tempImage, 0, 0, 512/(setSize/sizeCanvas), 512/(setSize/sizeCanvas));
        sizeCanvas = setSize; //update
        
        //update frame preview
        let frameForUpdate = document.getElementById(String('canvas' + CurrentFrameId));
        frameForUpdate.src=currentCanvas.toDataURL("image/png");
        if(ifRuns){
            run();
        }
        document.getElementById('size').innerHTML=`[${sizeCanvas}x${sizeCanvas}]`;
    };
    
    sizeButton.classList.toggle('active');
    sizeButton=element;
    element.classList.toggle('active');
}

/*___________________________________________________________*/


let editor=document.getElementById('editor');


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







