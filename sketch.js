
var tiles = [];


var start, end;
var finding;

var resetButton, findButton;
var btn_startNode, btn_endNode, btn_setWall, btn_delWall;

var nodeMode = 2;

function setup() {
  createCanvas(500,500);
  ellipseMode(CORNER)
  for(let x = 0; x < 50; ++x) {
    tiles[x] = [];
    for(let y = 0; y < 50; ++y) {
      tiles[x][y] = new Tile(x, y);
    }
  }
  finding = new AStar();
  end = tiles[43][26];
  start = tiles[12][3];

  resetButton = createButton("Reset!");
  findButton = createButton("Find Path!");
  resetButton.mouseClicked(reset);
  findButton.mouseClicked(findPath);

  btn_startNode = createButton("StartNode Brush");
  btn_endNode = createButton("EndNode Brush");
  btn_startNode.mouseClicked((e)=>{
    btn_startNode.style('background-color', color(0, 255, 0));
    btn_endNode.style('background-color', color(255, 255, 255));
    btn_setWall.style('background-color', color(255, 255, 255));
    btn_delWall.style('background-color', color(255, 255, 255));
    nodeMode = 0;
  });
  btn_endNode.mouseClicked((e)=>{
    btn_startNode.style('background-color', color(255, 255, 255));
    btn_endNode.style('background-color', color(0, 255, 0));
    btn_setWall.style('background-color', color(255, 255, 255));
    btn_delWall.style('background-color', color(255, 255, 255));
    nodeMode = 1;
  });

  btn_setWall = createButton("WallNode Brush");
  btn_delWall = createButton("SpaceNode Brush");
  btn_setWall.mouseClicked((e)=>{
    btn_startNode.style('background-color', color(255, 255, 255));
    btn_endNode.style('background-color', color(255, 255, 255));
    btn_setWall.style('background-color', color(0, 255, 0));
    btn_delWall.style('background-color', color(255, 255, 255));
    nodeMode = 2;
  });
  btn_delWall.mouseClicked((e)=>{
    btn_startNode.style('background-color', color(255, 255, 255));
    btn_endNode.style('background-color', color(255, 255, 255));
    btn_setWall.style('background-color', color(255, 255, 255));
    btn_delWall.style('background-color', color(0, 255, 0));
    nodeMode = 3;
  });

  btn_setWall.style('background-color', color(0, 255, 0));
}


function draw() {
  for(let x = 0; x < 50; ++x) {
    for(let y = 0; y < 50; ++y) {
      tiles[x][y].show();
    }
  }
  if(finding.isSearchingPath)
    finding.searchPath();

  if(start != undefined) {
    fill(0,0,255);
    ellipse(start.x * 10, start.y * 10, 10, 10);
  }
  if(end != undefined) {
    fill(0,0,255);
    ellipse(end.x * 10, end.y * 10, 10, 10);
  }
}

function mouseDragged() {
  if(nodeMode == 2) {
    for(let i = floor((mouseX/10)-2); i < floor((mouseX/10)+2); i++) {
      for(let j =  floor((mouseY/10)-2); j < floor((mouseY/10)+2); j++) {
       
        if(i < 0 || i >= 50 || j < 0 || j >= 50)
          continue;
        if(tiles[i][j].testHover()) {
          tiles[i][j].wall = true;
        }
     }
  }
}else if(nodeMode == 3) {
  for(let i = floor((mouseX/10)-2); i < floor((mouseX/10)+2); i++) {
    for(let j =  floor((mouseY/10)-2); j < floor((mouseY/10)+2); j++) {
      if(i < 0 || i >= 50 || j < 0 || j >= 50)
        continue;
      if(tiles[i][j].testHover()) {
        tiles[i][j].wall = false;
      }
    }
}
}
}

function mousePressed() {
  if(nodeMode == 0) {
    i = floor(mouseX / 10);
    j = floor(mouseY / 10);
    //for(let i = floor((mouseX/10)-2); i < floor((mouseX/10)+2); i++) {
     // for(let j =  floor((mouseY/10)-2); j < floor((mouseY/10)+2); j++) {
        if(i < 0 || i >= 50 || j < 0 || j >= 50)
          return;
        if(tiles[i][j].testHover()) {
          start = tiles[i][j];
        }
   //   }
 // }
}else if(nodeMode == 1) {
  i = floor(mouseX / 10);
  j = floor(mouseY / 10);
  //for(let i = floor((mouseX/10)-2); i < floor((mouseX/10)+2); i++) {
  //  for(let j =  floor((mouseY/10)-2); j < floor((mouseY/10)+2); j++) {
      if(i < 0 || i >= 50 || j < 0 || j >= 50)
        return;
      if(tiles[i][j].testHover()) {
        end = tiles[i][j];
      }
    //}
//}
}
}


function findPath() {
  finding.pathfind(start, end)
}

function reset() {
  finding = new AStar();
  startIndex = [start.x, start.y];
  endIndex = [end.x, end.y];
  for(let x = 0; x < 50; ++x) {
    for(let y = 0; y < 50; ++y) {
      tiles[x][y] = new Tile(x, y);
    }
  }
  start = tiles[startIndex[0]][startIndex[1]];
  end = tiles[endIndex[0]][endIndex[1]];
}