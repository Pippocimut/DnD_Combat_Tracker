
var cursor = {
    x: 0,
    y: 0
};
var dragobj = null,
    h1, i1, oLeft, oTop;


if(!cellSize){
    var cellSize = 50;
}    
const canvas = document.getElementById('canvas')
const numColumns = 15;
const numRows = 10;
var canvasWitdh = numColumns*cellSize;
var canvasHeigth = numRows*cellSize;

const container = document.getElementById("canvas");

function makeRows(rows, cols) {

  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  container.style.setProperty('--grid-size', cellSize+"px");

  for (c = 0; c < (rows * cols); c++) {
    let cell = document.createElement("div");
    cell.style.width = cellSize;
    cell.style.height = cellSize;
    container.appendChild(cell).className = "grid-item";
  };
};

makeRows(numRows, numColumns);

function rel(ob) {
    if (ob) {
        return document.getElementById(ob)
    } else {
        return null
    }
}

function gTxt(ob, txt) {
    rel(ob).innerHTML = txt;
}

function makeObjectToDrag(obj) {
    if (obj) {
        
        console.log("creating Obj")
        dragobj = rel(obj.id);
        document.onmousedown = startMove;
        document.onmouseup = drop;
        document.onmousemove = moving;
    }
}

function startMove(e) {
    if (dragobj) {
        console.log("startmove")
        getCursorPos(e);
        i1 = cursor.x - dragobj.offsetLeft;
        h1 = cursor.y - dragobj.offsetTop;
    }
}

function drop() {
    console.log("dropping")
    if (dragobj) {
        console.log("found dropable")
        const tokenId = dragobj.id
        
        const canvasStyle = getComputedStyle(canvas)
        let tokenheight = dragobj.offsetHeight;
        let tokenwidth  = dragobj.offsetWidth;

        console.log("tokenheight: "+tokenheight)
        console.log("tokenwidth: "+tokenwidth)

        const offsetX = cellSize-tokenwidth
        const offsetY = cellSize-tokenheight


        let picturePositionX =  +dragobj.style.left.replace("px","")
        let picturePositionY =  +dragobj.style.top.replace("px","")

        let canvasPositionX  =  +canvasStyle.left.replace("px","")
        let canvasPositionY  =  +canvasStyle.top.replace("px","")

        let relativeX = picturePositionX-canvasPositionX
        let relativeY = picturePositionY-canvasPositionY

        let removeX = relativeX%cellSize>cellSize/2? -(cellSize-relativeX%cellSize) : relativeX%cellSize 
        let removeY = relativeY%cellSize>cellSize/2? -(cellSize-relativeY%cellSize) : relativeY%cellSize

        console.log("removeX: "+removeX)
        console.log("removeY: "+removeY)

        let gridAlignedx = relativeX-removeX + canvasPositionX;
        let gridAlignedy = relativeY-removeY + canvasPositionY; 

        let x = Math.max(gridAlignedx,canvasPositionX);
        let y = Math.max(gridAlignedy,canvasPositionY);
        console.log("Y: "+y)
        x = Math.min(x, canvasPositionX+canvasWitdh-dragobj.offsetWidth )
        y = Math.min(y, canvasPositionY+canvasHeigth-dragobj.offsetHeight )

        console.log("Long thing: "+(canvasPositionY+canvasHeigth-dragobj.offsetHeight))
        console.log("Y: "+y)
        
        console.log(x)
        console.log(y)
        fetch('/admin/token/'+tokenId,{
            method:'DELETE',
            headers: {
                //'csrf-token': csrf,
                'x': x,
                'y': y
            }
        }).then(result => {
            console.log(result);
            console.log("drop")
            
        }).catch(err => {
            console.log(err);
        });
        dragobj.style.top = y+"px";
        dragobj.style.left = x+"px";
        dragobj = null;
    }
}

function getCursorPos(e) {
    e = e || window.event;
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    } else {
        var de = document.documentElement;
        var db = document.body;
        cursor.x = e.clientX +
            (de.scrollLeft || db.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY +
            (de.scrollTop || db.scrollTop) - (de.clientTop || 0);
    }
    return cursor;
}

function moving(e) {
    getCursorPos(e);
    if (dragobj) {
        console.log("moving")
        oLeft = cursor.x - i1;
        oTop = cursor.y - h1;
        dragobj.style.left = oLeft + 'px';
        dragobj.style.top = oTop + 'px';
    }
}