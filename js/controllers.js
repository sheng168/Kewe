angular.module('starter.controllers', [])


// A simple controller that fetches a list of data from a service
.controller('CalcCtrl', function($scope, $window) {
    // "Pets" is a service returning mock data (services.js)
    $scope.bill = {
        amount : 10,
        percent : 15,
        split : 2,
        round: false,

        tip: function() {
            return this.amount * this.percent / 100
        },
        total: function() {
            return this.tip() + this.amount;
        },
        each: function() {
            var e = this.total() / this.split;
            if (this.round)
                e = Math.ceil(e);
            return e;
        },
        roundPercent: function() {
          if (this.round) {
            return (this.each() * this.split / this.amount - 1) * 100 ;

          } else {
            return this.percent;
          }
        }
    };
  
    $scope.range = function(a,b) {
        var r = []
        for (var i=a;i<=b;i++) {
            r.push(i);
        }

        return r;
    };
})

// A simple controller that fetches a list of data from a service
.controller('PetIndexCtrl', function($scope, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pets = PetService.all();
})


// A simple controller that shows a tapped item's data
.controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
  // "Pets" is a service returning mock data (services.js)
  $scope.pet = PetService.get($stateParams.petId);
});

