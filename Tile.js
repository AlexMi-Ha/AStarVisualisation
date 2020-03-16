function Tile(x, y) {

	this.x = x;
	this.y = y;

	this.f = 0;	// f = g + h
	this.g = 0;	// cost to get from the start to this node
	this.h = 0; // expected cost to get from this node to the end
	this.neighbors = [];
	this.previous = undefined;
	this.wall = false;

	this.color = 'white';

	this.show = function() {
		switch(this.color) {
		case 'red':
			fill(255, 0, 0);
			break;
		case 'blue':
			fill(0, 0, 255);
			break;
		case 'green':
			fill(0, 255, 0);
			break;
		default:
			fill(255);
		}
		if(this.wall)
		fill(0);
		rect(this.x * 10, this.y * 10, 10, 10);
	}

	this.addNeighbors = function() {
		if(this.x < 50 - 1) 
		this.neighbors.push(tiles[this.x + 1][this.y]);
		if(this.x > 0) 
		this.neighbors.push(tiles[this.x - 1][this.y]);
		if(this.y < 50 - 1) 
		this.neighbors.push(tiles[this.x][this.y + 1]);
		if(this.y > 0) 
		this.neighbors.push(tiles[this.x][this.y - 1]);
	}

	// is the mouse currently hovering this node
	this.testHover = function() {
		return mouseX > this.x * 10 && mouseX < this.x * 10 + 10 && mouseY > this.y * 10  && mouseY < this.y * 10 + 10;
	}

}