describe('Grid module tests', function () {
  var gridProviderObj, gridService, tileModel, pieceColour;
  
  beforeEach(module("Grid"));
  
    
  beforeEach(function(){
    module(function(GridServiceProvider){
      gridProviderObj = GridServiceProvider;
    });
  }); 
  beforeEach(inject()); 
  beforeEach(inject(function(GridService, TileModel, PieceColour) {
      gridService = GridService;
      tileModel = TileModel;
      pieceColour = PieceColour;
    }));
    
  
  it('extractFlippableTiles case 1 - (target:black) white black -> 1 (1 white)', function(){
    var targetTile = new tileModel({x:3,y:3}, null, pieceColour.Black);
    var tiles = [
      new tileModel({x:3, y:4}, null, pieceColour.White),
      new tileModel({x:3, y:5}, null, pieceColour.Black)
    ];
    
    var tileArray = gridProviderObj.extractFlippableTiles(tiles, targetTile);
    
    expect(tileArray).toBeDefined();
    expect(tileArray.length).toBe(1);
  });
  
  it('extractFlippableTiles case 2 - (target:black) white black white -> 1 (1 white)', function(){
    var targetTile = new tileModel({x:3,y:3}, null, pieceColour.Black);
    var tiles = [
      new tileModel({x:3, y:4}, null, pieceColour.White),
      new tileModel({x:3, y:5}, null, pieceColour.Black),
      new tileModel({x:3, y:6}, null, pieceColour.White)
    ];
    
    var tileArray = gridProviderObj.extractFlippableTiles(tiles, targetTile);
    
    expect(tileArray).toBeDefined();
    expect(tileArray.length).toBe(1);
  });
  it('extractFlippableTiles case 3 - (target:black) white white black white -> 1 (2 whites)', function(){
    var targetTile = new tileModel({x:3,y:3}, null, pieceColour.Black);
    var tiles = [
      new tileModel({x:3, y:4}, null, pieceColour.White),
      new tileModel({x:3, y:5}, null, pieceColour.White),
      new tileModel({x:3, y:6}, null, pieceColour.Black),
      new tileModel({x:3, y:7}, null, pieceColour.White)
      
    ];
    
    var tileArray = gridProviderObj.extractFlippableTiles(tiles, targetTile);
    
    expect(tileArray).toBeDefined();
    expect(tileArray.length).toBe(2);
  });
  it('extractFlippableTiles case 4 - (target:white) white none black -> 0', function(){
    var targetTile = new tileModel({x:3,y:3}, null, pieceColour.White);
    var tiles = [
      new tileModel({x:3, y:4}, null, pieceColour.White),
      new tileModel({x:3, y:5}, null, pieceColour.None),
      new tileModel({x:3, y:6}, null, pieceColour.Black)
    ];
    
    var tileArray = gridProviderObj.extractFlippableTiles(tiles, targetTile);
    
    expect(tileArray).toBeDefined();
    expect(tileArray.length).toEqual(0);
  });
  
  it('extractFlippableTiles case 5 - (target:black) white white none -> 0', function(){
    var targetTile = new tileModel({x:3,y:3}, null, pieceColour.Black);
    var tiles = [
      new tileModel({x:3, y:4}, null, pieceColour.White),
      new tileModel({x:3, y:5}, null, pieceColour.White),
      new tileModel({x:3, y:6}, null, pieceColour.None)
    ];
    
    var tileArray = gridProviderObj.extractFlippableTiles(tiles, targetTile);
    
    expect(tileArray).toBeDefined();
    expect(tileArray.length).toEqual(0);
  });
  
    
  it('should call register with allow', function(){
    //console.log(gridProviderObj);
    expect(gridProviderObj).toBeDefined();
    expect(1==1).toBeTruthy();
  });
  
  it('completely filled up board has no valid moves', function() {
    for(var i = 0; i < gridProviderObj.tiles.length; i++) {
      var pos = gridProviderObj._positionToCoordinates(i);
      this.tiles[i] = new tileModel(pos, null, pieceColour.Black); // fill up the board with black tiles
    }
    var hasValidMoves = gridProviderObj.hasValidMoves(gridProviderObj.currentColour);
    expect(hasValidMoves).toEqual(false);
  });
  
  
});
