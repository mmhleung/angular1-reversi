'use strict';

/**
 * @ngdoc overview
 * @name reversiApp
 * @description
 * # reversiApp
 *
 * Main module of the application.
 */
angular
  .module('reversiApp', [ 'Grid', 'Game', 'ngCookies' ])
  .config(function(GridServiceProvider) {
    GridServiceProvider.setSize(8);
  })
  .controller('GameController', function(GameManager) {
    this.game = GameManager;
    
    this.newGame = function() {
      //KeyboardService.init();
      this.game.newGame();
      this.startGame();
    };
  
    this.startGame = function() {
      var self = this;
      /*KeyboardService.on(function(key) {
        self.game.move(key);
      });*/
    };
  
    this.newGame();
  
  })
  ;
