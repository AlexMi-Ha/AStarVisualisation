function AStar() {
	
	this.pathfind = function(start, end) {
		this.setup(start, end);
	}

	this.openSet = [];	// Nodes to visit
	this.closedSet = [];  // Nodes visited
	this.isSearchingPath = false;  // currently Searching ?
	this.path = [];  // final path

	this.setup = function(start, end) {
		this.isSearchingPath = true;
		this.start = start;
		this.end = end;
		this.openSet.push(start);

		// Calculate the neighbors of each node
		for(let i = 0; i < 50; ++i) {
			for(let j = 0; j < 50; ++j) {
				tiles[i][j].addNeighbors(tiles);
			}
		}
		
		// Remove walls at start and end
		this.start.wall = false;
		this.end.wall = false;
	}

	this.searchPath = function() {
		for(let n = 0; n < 5; ++n) { //Animation speed: 5 cycles per tick
			if(this.openSet.length > 0) {
				
				// Get the node with the best f-cost (cost_to_get_there or g-cost) + (expected_cost_to_get_to_the_end or h-cost))
				let bestNodeF = 0;
				for(let i = 0; i < this.openSet.length; ++i) {
					if(this.openSet[i].f < this.openSet[bestNodeF].f)
						bestNodeF = i;
				}
				
				let current = this.openSet[bestNodeF];
				
				this.openSet.splice(bestNodeF, 1);
				this.closedSet.push(current);

				let neighbors = current.neighbors;
				for(let i = 0; i < neighbors.length; ++i) {
					let neighbor = neighbors[i];
					
					if(!this.closedSet.includes(neighbor) && !neighbor.wall) { // Isn't this neighbor in the closedset and is it not a wall?
						let tempG = current.g + 1;
						if(this.openSet.includes(neighbor)) { // Is there already a different path to this neighbor node
							if(tempG < neighbor.g) { // is the current path cheaper?
								neighbor.g = tempG;
							}
						}else { 
							neighbor.g = tempG;
							this.openSet.push(neighbor);
						}

						//update neighbor properties
						neighbor.h = this.heuristic(neighbor, end);
						neighbor.f = neighbor.g + neighbor.h;
						neighbor.previous = current;
					}
				}

				if(current == end) { // at the end
					this.path = [];
					let temp = current;
					this.path.push(temp);
					while(temp.previous != undefined) {
						this.path.push(temp.previous);
						temp = temp.previous;
					}
					this.isSearchingPath = false;
				}
			}else {
				//path not found
				this.isSearchingPath = false;
				console.log("No Solution");
			}


			// update the node colors
			for(let i = 0; i < this.closedSet.length; ++i) {
				this.closedSet[i].color = 'red'
			}
			for(let i = 0; i < this.openSet.length; ++i) {
				this.openSet[i].color = 'green'
			}
			for(let i = 0; i < this.path.length; ++i) {
				this.path[i].color = 'blue'
			}

		}
	}

	// Approximate the cost to get from node a to node b
	this.heuristic = function(a, b) {
		let d = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
		return d;
	}
}
