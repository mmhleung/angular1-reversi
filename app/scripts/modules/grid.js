"use strict";
angular.module('Grid',[])
.value('PieceColour', { 
  Black: 'Black',
  White: 'White',
  None: 'None'
})
.factory('TileModel', function() {
  var Tile = function(pos, val, colour) {
    this.x = pos.x;
    this.y = pos.y;
    this.value = val || 0;
    this.colour = colour;
    
    this.clone = function() {
      return new Tile({ x:this.x, y:this.y } ,this.value, this.colour);  
    };
  };
  return Tile;
})
.provider('GridService', function(){
  this.size = 8; // 8x8. Size of the board
	
  this.setSize = function(sz) {
    this.size = sz ? sz : 0;
  };
  var vectors = {
    'left': { x: -1, y: 0 },
    'right': { x: 1, y: 0 },
    'up': { x: 0, y: -1 },
    'down': { x: 0, y: 1 },
    'left-up': { x:-1, y: -1},
    'left-down': { x:-1, y: 1},
    'right-up': { x:1, y: -1},
    'right-down': { x:1, y: 1}
  };

  var service = this;
  this.$get = function(TileModel, PieceColour) {
    // $get start
    this.grid = []; // static
	  this.tiles = []; // array to store all reversi pieces
    this.currentColour = PieceColour.Black; // Black starts first
    
    this.getSize = function() {
      return service.size;
    };
    
  
    /*
     * Run a callback for every cell
     * either on the grid or tiles
     */
    this.forEach = function(callbackFunction) {
      var totalSize = service.size * service.size;
      for (var i = 0; i < totalSize; i++) {
        var pos = this._positionToCoordinates(i);
        callbackFunction(pos.x, pos.y, this.tiles[i]);
      }
    };
    
    // Build game board
    this.buildEmptyGameBoard = function() {
      var self = this;
      // Initialize our grid
      for (var x = 0; x < service.size * service.size; x++) {
        this.grid[x] = null;
      }

      this.forEach(function(x,y) {
        self.resetCellAt({x:x,y:y}, new TileModel({x:x, y:y}, null, PieceColour.None) );
      });
    };
    
    this.buildStartingPosition = function() {
      var self = this;
      self.setCellAt({x:3,y:3}, new TileModel({x:3,y:3}, 3, PieceColour.Black));
      self.setCellAt({x:3,y:4}, new TileModel({x:3,y:4}, 4, PieceColour.White));
      self.setCellAt({x:4,y:3}, new TileModel({x:4,y:3}, 5, PieceColour.White));
      self.setCellAt({x:4,y:4}, new TileModel({x:4,y:4}, 6, PieceColour.Black));
    };
    
    // Set the tile at pos to 'tile', regardless of whether it's occupied or not.
    // The differs from setCellAt in that it doesn't check if the cell is already occupied. 
    this.resetCellAt = function(pos, tile) {
      if (this.withinGrid(pos)) {
        var xPos = this._coordinatesToPosition(pos);
        this.tiles[xPos] = tile;
      }
    };
    
    /*
     * Set a cell at position
     */
    this.setCellAt = function(pos, tile) {
      if (this.withinGrid(pos)) {
        if (!this.isGridCellOccupied(tile)) {
          var xPos = this._coordinatesToPosition(pos);
          this.tiles[xPos] = tile;
        }
      }
    };
    
    this.withinGrid = function(pos) {
      return ((pos.x >= 0 && pos.x <= this.size)
        && (pos.y >= 0 && pos.y <= this.size))
        ;
    };
    
    /*
     * Return true if the cell at tile is occupied; false otherwise. 
     */
    this.isGridCellOccupied = function(tile) {
      var pos = this._coordinatesToPosition({x:tile.x, y: tile.y});
      var tileAtPos = this.tiles[pos];
      if (tileAtPos && tileAtPos.colour != PieceColour.None) {
        return true;
      }
      return false;
    };
    
    
    // Swaps the current colour and returns the current colour after swapping
    this.swapCurrentColour = function() {
      this.currentColour = this.flipColour(this.currentColour);
      
      return this.currentColour;
    };
    
    this.flipColour = function(currentColour) {
      var c = currentColour;
      if (c == PieceColour.Black)
        c = PieceColour.White;
      else if (c == PieceColour.White)
        c = PieceColour.Black;
        
      return c;
    };
    
    
    // can the current play make any more valid moves
    this.hasValidMoves = function(currentColour) {
		
      for(var i = 0; i < this.tiles.length; i++) {
        var t = this.tiles[i];
        
        if (t.colour == PieceColour.None) {
          var tileClone = t.clone();
          tileClone.colour = currentColour;
          // with the current tile (at pos of t) and colour or currentColour, find all flippable tiles.
          // if there can be any flippable files, then there is a valid move, so return true.
          var allPossibleFlippableTiles = this.getFlippableTiles(tileClone);
          if (allPossibleFlippableTiles && allPossibleFlippableTiles.length > 0) {
            return true;
          }
        }
      }
      return false;
      
    };
    
    // Check if the Reversi piece at its new location is a valid move.
    this.placeTile = function(targetTile) {
      var allFlippableTilesArray = this.getFlippableTiles(targetTile);
      
      var hasFlippableTiles = (allFlippableTilesArray && allFlippableTilesArray.length > 0);
      
      if (hasFlippableTiles) {
        console.log('calling this.flipTiles');
        this.flipTiles(allFlippableTilesArray);
      }
      
      console.log('hasFlippableTiles ' + (hasFlippableTiles?"yes":"no"));
      return hasFlippableTiles;
    };
    
    // Get the tiles that are to have its colours changed
    // 'targetTile' is the tile in which the current player has just put down the latest reversi piece.
    // Returns an array of tiles that needs to have its colours inverted.
    this.getFlippableTiles = function(targetTile) {
      var self = this;
      var vectorDirections = ['up', 'down', 'left', 'right', 'left-up', 'left-down', 'right-up', 'right-down' ];
      var allFlippableTilesArray = [];
      
      var targetTileClone = targetTile.clone();
      targetTileClone.colour = this.currentColour;
      
      for(var i = 0; i < vectorDirections.length; i++) {
        var tiles = self.getAllTilesInDirection(targetTileClone, vectorDirections[i]);
        if (tiles && tiles.length > 0) {
          var flippableTiles = self.extractFlippableTiles(tiles, targetTileClone);
          if (flippableTiles) {
            for(var t = 0; t < flippableTiles.length; t++) {
              allFlippableTilesArray.push(flippableTiles[t]);
            }
          }
        }
      }
      return allFlippableTilesArray;
    };
    
    // 'tiles' represent tiles in one direction. 
    // currentTile is the one that has just been placed on board and is not part of the array.
    this.extractFlippableTiles = function(tiles, currentTile) {
      var result = [];
      var hasMetSameColour = false;
      
      // if the last tile in this array is the same colour, then we can flip
      if (tiles && currentTile && tiles.length > 1) {
        for(var i = 0; i < tiles.length; i++) {
          var t = tiles[i];
          
          //console.log(t.colour);
          
          if (t.colour == currentTile.colour) { 
            // same colour, stop traversing in direction.
            hasMetSameColour = true;
            break;
          }
          else if (t.colour == PieceColour.None)
            break;
          else if (t.colour != currentTile.colour) {
            result.push(t);
            console.log('flip: x: ' + t.x + ' y:' + t.y + ' ' + t.colour + ' ' + currentTile.colour);
          }
        }
      }
      
      if (hasMetSameColour)
        return result;
        
      return [];
    };
    
    this.flipTiles = function(tilesArray) {
      var self = this;
      if (tilesArray) {
        tilesArray.forEach(function(tile, index, array) {
            var pos = self._coordinatesToPosition(tile);
            
            self.tiles[pos].colour = self.flipColour(self.tiles[pos].colour);
          
        });
      }
    };
    
    /*
     Return all non-empty tiles in a given direction. targetTile not included in array.
     */
    this.getAllTilesInDirection = function(targetTile, vectorDirection) {
      var vector = vectors[vectorDirection];
      
      var tilesInDirection = [];
      for(var x = targetTile.x + vector.x, y = targetTile.y + vector.y;
          x >= 0 && x < service.size &&  y >= 0 && y < service.size;
          x += vector.x, y += vector.y
          ) {
          var pos = this._coordinatesToPosition({x:x, y:y});
          var tileAtPos = this.tiles[pos];
          if (tileAtPos.colour == PieceColour.None)
            break;
          else 
          if (tileAtPos.colour != PieceColour.None /*&& tileAtPos.colour != targetTile.colour*/) {
            tilesInDirection.push(this.tiles[pos]);
          
            console.log('Tile pos: ' + this.tiles[pos].x + ' ' + this.tiles[pos].y +' dir: ' + vectorDirection);
          }
        }
      
      
      return tilesInDirection;
    };
    
    /*
     * Helper to convert x to x,y
     */
    this._positionToCoordinates = function(i) {
      var x = i % service.size,
          y = (i - x) / service.size;
      return {
        x: x,
        y: y
      };
    };
    
    /*
     * Helper to convert coordinates to position
     */
    this._coordinatesToPosition = function(pos) {
      return (pos.y * service.size) + pos.x;
    };
    
    return this;
    // $get end
  };
});