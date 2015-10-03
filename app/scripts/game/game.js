"use strict";
angular.module('Game', ['Grid', 'ngCookies'])
.service('GameManager', function($q, $cookieStore, GridService, PieceColour) {
	this.blackScore = 2;
    this.whiteScore = 2;
	
	// create a new game
	this.reinit = function() {
		this.grid = GridService.grid;
		this.tiles = GridService.tiles;
		this.currentColour = GridService.currentColour;
		
		this.gameOver = false;
		this.winner = '';
		this.blackScore = this.whiteScore = 2; // reset the scores
	};
	this.reinit();
	
	this.newGame = function() {
		GridService.buildEmptyGameBoard();
		GridService.buildStartingPosition();
		this.reinit();
	};
  
	// update the scores
	// simply loop through all tiles and count the instances of black/white
	this.updateScores = function() {
		var black = 0;
		var white = 0;
		
		for(var i = 0; i < this.tiles.length; i++) {
			var t = this.tiles[i];
			
			if (t.colour == PieceColour.Black)
				black++;
			else if (t.colour == PieceColour.White)
				white++;
		}
		
		this.blackScore = black;
		this.whiteScore = white;
	};
	
	
	
	
	// are there any moves available
	this.hasValidMoves = function() {
		return GridService.hasValidMoves(); 
	};
	
	// Returns true if the tile in cell at position { tile.x, tile.y } is already occupied.
	this.isTileOccupied = function(tile) {
		return GridService.isGridCellOccupied(tile);	
	};
	
	// Event handler fired when a tile is clicked on
	// Argument: tile is the tile being clicked on. It carries the position and colour.
	this.onTileClicked = function(tile) {
		var isOccupied = this.isTileOccupied(tile);
		console.log('game.onTileClicked ' + tile.colour + ' x:' + tile.x + ' y:'+tile.y +' isOccupied:' +isOccupied);
		
		if (!isOccupied) {
			var numTilesFlipped = GridService.placeTile(tile);
			if (numTilesFlipped > 0) {
				tile.colour = this.currentColour;
				this.updateScores();
				// alternate turn
				this.currentColour = GridService.swapCurrentColour();
				
				// check to see if the colour at the current turn can make any moves or not. 
				if (!this.hasValidMoves(this.currentColour)) {
					// declare game over
					this.declareWinner();
				}
			}
		}
	};
	
	
	this.declareWinner = function() {
		this.gameOver = true;
		this.winner = "A draw";
		if (this.blackScore > this.whiteScore)
			this.winner = "Black player";
		else if (this.whiteScore > this.blackScore)
			this.winner = "White player";
	};
	
	this.showWinner = function() {
		return this.winner != '';
	};
})
;