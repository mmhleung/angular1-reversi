describe('Game', function () {

  // load the controller's module
  beforeEach(module('Game'));
  
  var gameManager; // instance of the GameManager
  var _gridService;
  var realGridService;
  var PieceColourEnum;
  var TileModelObj;
  
  /*
  beforeEach(module(function($provide) {
    _gridService = {
      hasValidMoves: angular.noop
    };

    // Switch out the real GridService for our
    // fake version
    $provide.value('GridService', _gridService);
  }));
  */
  
  beforeEach(inject(
    function(GameManager, GridService, TileModel, PieceColour) {
      gameManager = GameManager;
      TileModelObj = TileModel;
      PieceColourEnum = PieceColour;
      realGridService = GridService;
      
    }));

    it('should have a GameManager', function() {
      expect(gameManager).toBeDefined();
    });
  
    it('showWinner returns true if winner is not empty string', function() {
      gameManager.winner = 'Black';
      expect(gameManager.showWinner()).toBeTruthy();
      
      gameManager.winner = 'White';
      expect(gameManager.showWinner()).toBeTruthy();
    });
    
    it('showWinner returns false if winner is empty string', function() {
      gameManager.winner = '';
      expect(gameManager.showWinner()).toBeFalsy();
    });
    
  
    it('first move after starting a new game must have a valid move', function() {
      gameManager.newGame();
      expect(gameManager.hasValidMoves()).toEqual(true);
    });
    
    it('player scores are equal to 2, immediately after creating a new game', function() {
      gameManager.newGame();
      expect(gameManager.blackScore).toEqual(2);
      expect(gameManager.whiteScore).toEqual(2);
      expect(gameManager.winner).toEqual('');
      expect(gameManager.showWinner()).toEqual(false);
    });
  
  it('hasValidMoves has been called if onTileClicked and if cell is not already occupied', function() {
    console.log('hasValidMoves has been called if onTileClicked and if cell is not already occupied');
    // arrange
    spyOn(gameManager, 'isTileOccupied').and.returnValue(false);
    spyOn(gameManager, 'updateScores');
    spyOn(gameManager, 'hasValidMoves').and.returnValue(true);
    spyOn(gameManager, 'declareWinner');
    
    // act
    gameManager.newGame();
    gameManager.onTileClicked(new TileModelObj({x:4, y:2}, null, PieceColourEnum.Black));
    
    //assert
    expect(gameManager.updateScores).toHaveBeenCalled();
    expect(gameManager.hasValidMoves).toHaveBeenCalled();
    expect(gameManager.declareWinner).not.toHaveBeenCalled();
  });
});


describe('Game mocks', function () {
  var _gameManager, _gridService;
  
  // load the controller's module
  beforeEach(module('Game'));
  
  beforeEach(module(function($provide) {
    _gameManager = {
      hasValidMoves: true
    };
    _gridService = {
      isGridCellOccupied: false,
      buildEmptyGameBoard: buildEmptyGameBoard,
      placeTile: 1
    };
    // Switch out the real GridService for our
    // fake version
    //$provide.value('GameManager', _gameManager);
    $provide.value('GridService', _gridService);
  }));
  
  var gameManager;
  beforeEach(inject(
    function(GameManager, GridService, TileModel, PieceColour) {
      gameManager = GameManager;
      
      console.log(gameManager);
    }));
    
});