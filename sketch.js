
var tiles = []; // 2d array of all tiles in the grid

var start, end; // start and end node
var finding;	// A* algorithm

//UI elements
var resetButton, findButton;
var btnText;
var sliderText;
var btn_startNode, btn_endNode, btn_setWall, btn_delWall;
var randSlider;

// Node paint mode 0=startNode  1=endNode  2=setWall  3=delWall
var nodeMode = 2;

function setup() {
	createCanvas(500,500);
	ellipseMode(CORNER)
	//fill the tiles array
	for(let x = 0; x < 50; ++x) {
		tiles[x] = [];
		for(let y = 0; y < 50; ++y) {
			tiles[x][y] = new Tile(x, y);
		}
	}
	finding = new AStar();
	
	end = tiles[43][26];
	start = tiles[12][3];

	createUI();
}


function draw() {
	// draw all tiles
	for(let x = 0; x < 50; ++x) {
		for(let y = 0; y < 50; ++y) {
			tiles[x][y].show();
		}
	}
	if(start != undefined) {
		fill(0,0,255);
		ellipse(start.x * 10, start.y * 10, 10, 10);
	}
	if(end != undefined) {
		fill(0,0,255);
		ellipse(end.x * 10, end.y * 10, 10, 10);
	}
	
	//continue searching if the search has started
	if(finding.isSearchingPath)	//Here for the animation
		finding.searchPath();
}

// Start the pathfinding
function findPath() {
	reset(false);
	finding.pathfind(start, end);
}

// Listen for mouse dragging
function mouseDragged() {
	if(nodeMode == 2) { 
		//Set walls at the dragging position
		for(let i = floor((mouseX/10)-2); i < floor((mouseX/10)+2); i++) {
			for(let j =  floor((mouseY/10)-2); j < floor((mouseY/10)+2); j++) {
				if(i < 0 || i >= 50 || j < 0 || j >= 50)
					continue;
				if(tiles[i][j].testHover()) { //if hovering while dragging
					tiles[i][j].wall = true;	//set the wall
				}
			}
		}
	}else if(nodeMode == 3) {
		// delete walls at the dragging position
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

//Listen for mouse presses
function mousePressed() {
	//get the cursor position and adjust it to fit the tiles array
	i = floor(mouseX / 10);
	j = floor(mouseY / 10);
	if(nodeMode == 0) {
		// Change the start node position
		if(i < 0 || i >= 50 || j < 0 || j >= 50)
			return;
		start = tiles[i][j];
	}else if(nodeMode == 1) {
		// Change the end node position
		if(i < 0 || i >= 50 || j < 0 || j >= 50)
			return;
		end = tiles[i][j];
	}
}

// Callback function for the randSlider; Updates the propability for a Tile being a Wall
function updateRandomWalls() {
	for(let x = 0; x < 50; ++x) {
		for(let y = 0; y < 50; ++y) {
			tiles[x][y].wall = random() < randSlider.value() / 100 ? true : false;
		}
	}
}

// Reset the algorithm
function reset(deleteWalls = true) {
	finding = new AStar();
	
	if(deleteWalls) {
		startIndex = [start.x, start.y];
		endIndex = [end.x, end.y];
		for(let x = 0; x < 50; ++x) {
			for(let y = 0; y < 50; ++y) {
				tiles[x][y] = new Tile(x, y);
			}
		}
		start = tiles[startIndex[0]][startIndex[1]];
		end = tiles[endIndex[0]][endIndex[1]];
		updateRandomWalls();
	}else {
		for(let x = 0; x < 50; ++x) {
			for(let y = 0; y < 50; ++y) {
				tiles[x][y].neighbors = [];
				tiles[x][y].f = 0;
				tiles[x][y].g = 0;
				tiles[x][y].h = 0;
				tiles[x][y].color = 'white';
			}
		}
	}
}


//Create all UI Elements
function createUI() {
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
	
	btnText = createElement('p','Brush mode:')
	sliderText = createElement('p', 'Random Walls:')
	btnText.position(155 + 10, 490);
	sliderText.position(300, 490);
	btn_startNode.position(140 + 10, 508 + 20);
	btn_endNode.position(143 + 10, 530 + 20);
	btn_setWall.position(141 + 10, 552 + 20);
	btn_delWall.position(135 + 10, 574 + 20);
	
	resetButton.position(0,528);
	findButton.position(55,528);

	randSlider = createSlider(0,40,0,1);
	randSlider.position(283, 518)
	randSlider.input(updateRandomWalls);
}