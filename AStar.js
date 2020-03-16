function AStar() {
    
    this.pathfind = function(start, end) {
        this.setup(start, end);
    }

    this.openSet = [];
    this.closedSet = [];
    this.isSearchingPath = false;
    this.path = [];

    this.setup = function(start, end) {
        this.isSearchingPath = true;
        this.start = start;
        this.end = end;
        this.openSet.push(start);

        for(let i = 0; i < 50; ++i) {
            for(let j = 0; j < 50; ++j) {
                tiles[i][j].addNeighbors(tiles);
            }
        }
        this.start.wall = false;
        this.end.wall = false;
    }

    this.searchPath = function() {
        for(let n = 0; n < 10; ++n) {
        if(this.openSet.length > 0) {
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
                neighbor = neighbors[i];
                if(!this.closedSet.includes(neighbor) && !neighbor.wall) {
                    let tempG = current.g + 1;
                    if(this.openSet.includes(neighbor)) {
                        if(tempG < neighbor.g) {
                            neighbor.g = tempG;
                        }
                    }else {
                        neighbor.g = tempG;
                        this.openSet.push(neighbor);
                    }

                    neighbor.h = this.heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }

            if(current == end) {
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

        for(let i = 0; i < 50; ++i) {
            for(let j = 0; j < 50; ++j) {
                if(tiles[i][j] != undefined)
                    tiles[i][j].color = 'white';
            }
        }

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

    this.heuristic = function(start, end) {
        let d = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
        return Math.sqrt(d);
    }
}
