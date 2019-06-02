let number = 0;
adding();

function adding(){
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', '128');
    canvas.setAttribute('height', '128');
    canvas.setAttribute('id', String('canvas' + number));
    number++;
    let context = canvas.getContext("2d");
    let clickX = [];
    let clickY = [];
    let clickDrag = [];
    let paint=false;

    function addClick(x, y, dragging){
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function redraw(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.strokeStyle = "#df4b26";
        context.lineJoin = "round";
        context.lineWidth = 5;
        for(let i=0; i < clickX.length; i++) {
            context.beginPath();
            if(clickDrag[i] && i){
                context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }

    canvas.onmousedown=function(e){
        let mouseX = e.pageX - this.offsetLeft;
        let mouseY = e.pageY - this.offsetTop;
        paint=true;
        addClick(mouseX, mouseY, false);
        redraw();
    };
    canvas.onmousemove=function(e){
        if(paint){
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);

            redraw();
        }
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

    let temp = document.createElement('div');
    temp.appendChild(canvas);
    temp.appendChild(buttonDelete);

    document.getElementById('root').appendChild(temp);
}

let player = document.getElementById('player');
player.appendChild(document.createElement('div'));

function run(){
    let arrayImg = [];
    document.getElementById('root').childNodes.forEach((item)=>{arrayImg.push(item.firstChild)});

    let fps = 5;
    let length = arrayImg.length;
    let i=0;

    let timer = setInterval(function (){
        player.children[0].innerHTML='';
        console.log(player);
        player.children[0].appendChild(arrayImg[i%length]);
        i++;
    },1000 / fps);

}

