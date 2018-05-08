var timer;
var blockSize=50;
var step = 10;
var dx=step;11
var dy=0;
var time=10;
var timerCond=-1;
var body = [];
var Food;
var trash = [];
var gradient = new Rainbow();
var reversGradient = new Rainbow();
var rainbowGradient = new Rainbow();
var shadesCount = 25;
var bodyZindex=-1;
var score = document.createElement("p");
var setingsBlock = document.createElement("div");
var setings = document.querySelector("#selectSetings");
var colorType;
var color1;
var color2;
var bodyPage = document.querySelector("body");
var gameStat;
var bodyCoords=[[]];
var trashCoords=[[]];
var trashColors=[];
var interval=0;

if (!localStorage.gameParam){
    document.querySelector("#continue").style.display="none";
}
//gameStat={bodyCoords,Food,trash,reversGradient,gradient,shadesCount,bodyZindex,colorType,color,dx,dy};

function continueGame(){
    gameStat=JSON.parse(localStorage.gameParam);
    console.log(gameStat);
    color1=gameStat.color1;
    color2=gameStat.color2;
    colorType=gameStat.colorType;
    dx=gameStat.dx;
    dy=gameStat.dy;
    bodyZindex=gameStat.bodyZindex;
    shadesCount=gameStat.shadesCount;
    trashColors=gameStat.trashColors;
    trashCoords=gameStat.trashCoords;
    for (var i=0;i<gameStat.trashColors.length;i++){
        setTrash(gameStat.trashCoords[i][0],gameStat.trashCoords[i][1]);
    }
    switch (colorType){
        case "Gradient":{
            //colorType = "Gradient";
            shadesCount=+bodyPage.querySelector("#inputInterval").value;
            gradient.setSpectrum(color1,color2);
            gradient.setNumberRange(0,shadesCount);
            reversGradient.setSpectrum(color2,color1);
            reversGradient.setNumberRange(0,shadesCount);
            break;
        }
        case "Rainbow":{
            //colorType = "Rainbow";
            shadesCount=+bodyPage.querySelector("#inputInterval").value;
            gradient.setSpectrum("red","orange","yellow","green","lightblue","blue","violet","red");
            gradient.setNumberRange(0,shadesCount);
            reversGradient.setSpectrum("red","orange","yellow","green","lightblue","blue","violet","red");
            reversGradient.setNumberRange(0,shadesCount);
            break;
        }
        case "Random":{
            //colorType = "Random";
            break;
        }
    }
    Food=gameStat.Food;
    console.log(Food);
    Food=makeFoodXY(Food[0][0],Food[0][1]);
    for (var i=0;i<gameStat.bodyCoords.length;i++){
        createBlock(gameStat.bodyCoords[i][0],gameStat.bodyCoords[i][1]);
    }
        submitSetings();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    //color+="0000";
    return color;
}

function setRandomColor(){
    console.log(body.length-1+" max");
    for(var i=0;i<body.length-1;i++){
        console.log(i+" new color");
        body[i].style.background=getRandomColor();
    }
    
}

function createBlock(){
    createBlock(100,50);    
}

function nextDecade(number){
    return Math.pow(10,(number+"").length);
}

function createBlock(x,y){
    var block = document.createElement("p");
    var dec = nextDecade(shadesCount);
    //colorType="Texture";
    switch (colorType){
        case "Random":{
            block.style.background=getRandomColor();
            break;
        }
        case "Gradient":{
            //console.log("number "+body.length+" type "+(body.length/shadesCount%2)+" color number "+(body.length%dec)-Math.floor(body.length%dec/shadesCount)*shadesCount);
            if (Math.floor(body.length/shadesCount)%2==0){           
                block.style.background="#"+gradient.colorAt((body.length%dec)-Math.floor(body.length%dec/shadesCount)*shadesCount);
            }else {
                block.style.background="#"+reversGradient.colorAt((body.length%dec)-Math.floor(body.length%dec/shadesCount)*shadesCount);
            }
            break;
        }
        case "Rainbow":{
            //console.log("number "+body.length+" type "+Math.floor(body.length/shadesCount%2)+" color number "+((body.length%dec)-Math.floor(body.length%dec/shadesCount)*shadesCount));
            if (Math.floor(body.length/shadesCount)%2==0){           
                block.style.background="#"+gradient.colorAt((body.length%dec)-Math.floor(body.length%dec/shadesCount)*shadesCount);
            }else {
                block.style.background="#"+reversGradient.colorAt((body.length%dec)-Math.floor(body.length%dec/shadesCount)*shadesCount);
            }
            break;
        }
        case "Solid":{
            block.style.background=color1;
            break;
        }
        case "Texture":{
            block.style.backgroundImage="url(depositphotos_44619091-stock-illustration-leather-animal-snake-textures.jpg)";
            break;
        }
    }
    block.style.width=blockSize+"px";
    block.style.height=blockSize+"px";
    block.style.position="absolute";
    block.style.top=y;
    block.style.borderRadius="25";
    block.style.left=x;
    
//    if (Math.floor(body.length)%3==0){
//        bodyZindex+=3;
//      
//    } else {
//        bodyZindex--;
//    }
    block.style.zIndex=bodyZindex;
    bodyZindex--
    document.querySelector("body").appendChild(block);
    body[body.length]=block;
}

function coords(n){
    if (n<body.length){
    var coordsr= [[]];
    coordsr[0] = body[n].style.left.slice(0,-2);
    coordsr[1] = body[n].style.top.slice(0,-2);
    return coordsr;
    }
}

function setHeadCoords(x,y){
    setCoords(x,y,0);
}

function setCoords(x,y,n){
    body[n].style.left=x+"px";
    body[n].style.top=y+"px";        
}

function moveHead(dx,dy){
    var xHead = +coords(0)[0];
    var yHead = +coords(0)[1];
    setHeadCoords(+coords(0)[0]+dx,
                  +coords(0)[1]+dy);
    moveBody(xHead,yHead);
}

function moveBody(xHead,yHead){
    for(var i=body.length-1;i>1;i--){
            //setCoords(coords(i-1)[0],coords(i-1)[1] ,i);
        if (coords(i-1)[1]==coords(i)[1]){
            setCoords((+coords(i-1)[0]-interval),coords(i-1)[1] ,i);
        }else if(coords(i-1)[0]==coords(i)[0]){
            setCoords(coords(i-1)[0],(+(coords)(i-1)[1]-interval) ,i);
        }
    }
    setCoords(xHead,yHead,1);
}

function increasSize(n){
    for (var i=0;i<n;i++){
        createBlock(coords(body.length-1)[0],coords(body.length-1)[1]);
    }
}

function decreasSize(n){
    for (var i=body.length-n;i<body.length;i++){
        document.querySelector("body").removeChild(body[i]);
    }
    body=body.slice(0,((body.length)-n));
}

function compareArr(arr1,arr2){
    //for (var i=0;i<arr1.length;i++){
        if ((Math.abs(arr1[0]-arr2[0])<blockSize)||// && arr1[1]!=arr2[1] )||
            (Math.abs(arr1[1]-arr2[1])<blockSize )){//&& arr1[1]!=arr2[1] )){
            console.log(" "+arr1+" "+arr2+" "+Math.abs(arr1[1]-arr2[1])+" "+Math.abs(arr1[0]-arr2[0]));
           // console.log(0+" ");
            return true;
        }
    //}
    return false;
};

function colisionCheck(arr1){
    for (var i=10;i<body.length-1;i++){
        if ((Math.abs(arr1[0]-coords(i)[0])<blockSize)&&
            (Math.abs(arr1[1]-coords(i)[1])<blockSize)){
            return i; 
        }        
    }
    return NaN;
}

function colisionCheckBody(arr1){
    for (var i=0;i<body.length-1;i++){
        if ((Math.abs(arr1[0]-coords(i)[0])<=blockSize)&&
            (Math.abs(arr1[1]-coords(i)[1])<=blockSize)){
            //console.log(arr1+" "+i+" "+coords(i));
            return i; 
        }        
    }
    return NaN;
}

function colisionCheckTrash(arr1){
    for (var i=0;i<trash.length;i++){
        //console.log(arr1," "+trash[i].style.left.slice(0,-2)+" "+trash[i].style.top.slice(0,-2));
        if ((Math.abs(arr1[0]-trash[i].style.left.slice(0,-2))<=blockSize)&&
            (Math.abs(arr1[1]-trash[i].style.top.slice(0,-2))<=blockSize)){
            
            //console.log(arr1," trash "+trash[i].style.left.slice(0,-2)+" "+trash[i].style.top.slice(0,-2));
            return i; 
        }
    }
    return NaN;
}

function colisionCheck2(arr1,arr2){
        if ((Math.abs(arr1[0]-arr2[0])<blockSize)&&
            (Math.abs(arr1[1]-arr2[1])<blockSize)){
            return true; 
        }        
    return false;
}

function makeFood(){
    var Food = [];
    var a =1;
    do{
        Food[0] = Math.floor(Math.random()*(document.body.clientWidth-blockSize));
        Food[1] = Math.floor(Math.random()*(document.body.clientHeight-blockSize));
        var food = document.createElement("p");
        food.style.height=blockSize;
        food.style.width=blockSize;
        food.style.background="radial-gradient(ellipse at center, rgba(255,0,0,1) 0%, rgba(0,0,0,1) 100%)";
        //food.style.background="red";
        food.style.position="absolute";
        food.style.left=""+Food[0]+"px";
        food.style.zIndex=-10000000;
        food.style.top=""+Food[1]+"px";
        //console.log(a+" Food on "+Food);
        a++;
    }while (colisionCheckBody(Food)+1 || colisionCheckTrash(Food)+1);
    document.querySelector("body").appendChild(food);
    return [Food,food];   
}

function makeFoodXY(x,y){
    var Food = [];
    var a =1;
    do{
        Food[0] = x;
        Food[1] = y;
        var food = document.createElement("p");
        food.style.height=blockSize;
        food.style.width=blockSize;
        food.style.background="radial-gradient(ellipse at center, rgba(255,0,0,1) 0%, rgba(0,0,0,1) 100%)";
        //food.style.background="red";
        food.style.position="absolute";
        food.style.left=""+Food[0]+"px";
        food.style.zIndex=-10000000;
        food.style.top=""+Food[1]+"px";
        //console.log(a+" Food on "+Food);
        a++;
    }while (colisionCheckBody(Food)+1 || colisionCheckTrash(Food)+1);
    document.querySelector("body").appendChild(food);
    return [Food,food];   
}

function enterColor1(){
 document.querySelector("#color1").style.background="#"+document.querySelector("#inputColor1").value;
}

function enterColor2(){
 document.querySelector("#color2").style.background="#"+document.querySelector("#inputColor2").value;
}

function cutOfTail(n){
    //for(var i=n;i<body.length;i++){
    if (n){
        for (var i=0;i<(body.slice(n)).length;i++){
            trash[trash.length]=(body.slice(n))[i];
//        if (trash[0]){
//            trash.concat(body.slice(n));
//            console.log("---->"+trash);
//            
//        } else{
//            trash=(body.slice(n));
//            console.log("--NaN-->"+trash);
//        }
            trash.forEach(function(a){
                a.style.zIndex=a.style.zIndex-1000;
            });
        }
        body=body.slice(0,n);
    //}
}
}

function trashEat(n){
    if (n>=0 && body.length>-1){
        document.querySelector("body").removeChild(trash[n]);
        decreasSize(1);
        //console.log(n);
        trash.splice(n, 1);
    }
    
}

function setTrash(x,y,n){
    var trashBlock = document.createElement("p"); 
    trashBlock.style.width=blockSize+"px";
    trashBlock.style.height=blockSize+"px";
    trashBlock.style.position="absolute";
    trashBlock.style.top=y;
    trashBlock.style.left=x;
    trashBlock.style.borderRadius="25";
    trashBlock.style.background=trashColors[trash.length];
    trashBlock.style.zIndex=-10000;
    bodyPage.appendChild(trashBlock);
    trash[trash.length]=trashBlock;
}

function makeTrashColors(){
    var trashColors=[];
    for (var i=0;i<trash.length;i++){
        trashColors[i]= trash[i].style.background;  
    }
    return trashColors;
}

function makeBodyCoords(){
    var bodycoords=[[]];
    for (var i=0;i<body.length;i++){
        bodycoords[i]= [coords(i)[0],coords(i)[1]];  
    }
    return bodycoords;
}

function makeTrashCoords(){
    var bodycoords=[[]];
    for (var i=0;i<trash.length;i++){
        bodycoords[i]= [trash[i].style.left.slice(0,-2),trash[i].style.top.slice(0,-2)];  
    }
    return bodycoords;
}

function submitSetings(){
    if (!gameStat){
    color1 ="#"+ bodyPage.querySelector("#inputColor1").value;
    color2 ="#"+ bodyPage.querySelector("#inputColor2").value;
    switch (document.querySelector('input[name = "answer"]:checked').value){
        case "Solid":{
            colorType = "Solid";
            break;
        }
//        case "Gradient":{
//            colorType = "Gradient";
//            shadesCount=+bodyPage.querySelector("#inputInterval").value;
//            gradient.setSpectrum("#"+bodyPage.querySelector("#inputColor1").value,"#"+bodyPage.querySelector("#inputColor2").value);
//            gradient.setNumberRange(0,shadesCount);
//            reversGradient.setSpectrum(bodyPage.querySelector("#inputColor2").value,bodyPage.querySelector("#inputColor1").value);
//            reversGradient.setNumberRange(0,shadesCount);
//            break;
//        }
//        case "Rainbow":{
//            colorType = "Rainbow";
//            shadesCount=+bodyPage.querySelector("#inputInterval").value;
//            gradient.setSpectrum("red","orange","yellow","green","lightblue","blue","violet","red");
//            gradient.setNumberRange(0,shadesCount);
//            reversGradient.setSpectrum("red","orange","yellow","green","lightblue","blue","violet","red");
//            reversGradient.setNumberRange(0,shadesCount);
            
        case "Gradient":{
            colorType = "Gradient";
            shadesCount=+bodyPage.querySelector("#inputInterval").value;
            gradient.setSpectrum(color1,color2);
            gradient.setNumberRange(0,shadesCount);
            reversGradient.setSpectrum(color2,color1);
            reversGradient.setNumberRange(0,shadesCount);
            break;
        }
        case "Rainbow":{
            colorType = "Rainbow";
            shadesCount=+bodyPage.querySelector("#inputInterval").value;
            gradient.setSpectrum("red","orange","yellow","green","lightblue","blue","violet","red");
            gradient.setNumberRange(0,shadesCount);
            reversGradient.setSpectrum("red","orange","yellow","green","lightblue","blue","violet","red");
            reversGradient.setNumberRange(0,shadesCount);
            
            break;
        }
        case "Random":{
            colorType = "Random";
            break;
        }
    }
    
    
        createBlock(50,50);
        for (var i=4;i>=0;i--){
            createBlock(i*step,50);
        }
        Food = makeFood();
    }
    bodyPage.querySelector("#setingDiv").style.display="none";
    document.querySelector("#score").appendChild(score);

    score.style.position="absolut";
    score.style.zIndex=1000;
    score.style.textAlign="center";

    $(document).keydown(function(key){
        //console.log(key.key);
        //console.log(key.key=="+");
        switch (key.key){
            case "ArrowDown" : 
                if (dy==0 ){
                    dy=step;
                    dx=0;
                }
                //alert();
                break;
            case "ArrowUp" : 
                if (dy==0 ){
                    dy=-1*step;
                    dx=0;
                }
                //alert();
                break;
            case "ArrowRight" : 
                if (dx==0 ){
                    dx=step;
                    dy=0;
                }
                //alert();
                break;
            case "ArrowLeft" : 
                if (dx==0 ){
                    dx=-1*step;
                    dy=0;
                }
                //alert();
                break;
            case "+":
                increasSize(5);
                break;
            case "*":
                makeFood();
                break;
            case "-":
                step-=1;
                break;    
            case "c":
                setRandomColor();
                break;    
            case " " :
                if (timerCond==-1){
                    timer = setInterval(function(){                    
                        if (+coords(0)[0]>(document.body.clientWidth) && dx>0){
                            setHeadCoords(0);
                        } else if (+coords(0)[0]<(-1*blockSize)&& dx<0){
                            setHeadCoords(document.body.clientWidth,coords(0)[1]);
                        } else if (+coords(0)[1]>(document.body.clientHeight) && dy>0){
                            setHeadCoords(coords(0)[0],-20);
                        } else if (+coords(0)[1]<(-1*blockSize) && dy<0){
                            setHeadCoords(coords(0)[0],document.body.clientHeight);
                        }
                        moveHead(dx,dy);
                        cutOfTail(colisionCheck(coords(0))+9);//
                        trashEat(colisionCheckTrash(coords(0))); 
                        if (body.length==1){
                            clearInterval(timer);            
                            bodyPage.querySelector("#gameOver").style.visibility="visible";
                            console.log(timer+"stop");
                            timerCond=10;
                           localStorage.removeItem("gameParam");

                        }else{
                            trashCoords=makeTrashCoords();
                            trashColors=makeTrashColors();
                            bodyCoords=makeBodyCoords();
                            gameStat={bodyCoords,Food,trashCoords,trashColors,reversGradient,gradient,shadesCount,bodyZindex,colorType,color1,color2,dx,dy};
                            localStorage.setItem("gameParam", JSON.stringify(gameStat));
                        }
                        if (colisionCheck2(Food[0],coords(0))){
                            document.querySelector("body").removeChild(Food[1]);
                            increasSize(5);
                            Food = makeFood();
                        };
                        if (+score.innerHTML.slice(7)<body.length){
                            score.innerHTML="Score: "+body.length;
                        }
                    },time)

                    console.log(timer+"go");
                    timerCond=timerCond*(-1);
                } else{
                    clearInterval(timer);
                    console.log(timer+"stop");
                    timerCond=timerCond*(-1);
                }
                break;
        }
    })
    }