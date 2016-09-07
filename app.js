var app = angular.module('artificiaCat', ['ngRoute', 'firebase', 'ui.bootstrap']);

'use strict';

app.config(['$routeProvider', function($routeProvider, $urlRouterProvider){

	$routeProvider

	  .when('/products/:category', {

    	templateUrl: 'templates/products.html',
      controller: 'productsCtrl',
      private : false
    })
    .when('/create/product',{

      templateUrl : 'templates/create.html',
      controller : 'createProductCtrl',
      private : false
    })
}]);

app.run(function ($rootScope,$location,$route, $window) {

 	$rootScope.$on('$routeChangeStart', function(event, next, current) {


  });

});

app.controller('productsCtrl', function($scope,$rootScope,$routeParams,$firebase){

  $scope.category = $routeParams.category;

  $rootScope.active =  $scope.category;

  var productsArr = []

  var fireBase = new Firebase("https://artifacia.firebaseio.com/products");

  $scope.getProducts = function(){

    $scope.showLoader = true;

    fireBase.on("value", function(snapshot) {

      var products = snapshot.val();

      var keys = Object.keys(products);

      for(var i=0;i<keys.length;i++){

        if($scope.category == "All"){

          productsArr.push(products[keys[i]])
        }else{

          if(products[keys[i]].category == $scope.category){

            productsArr.push(products[keys[i]])
          }
        }
      }
      $scope.showLoader = false;

      $scope.products = productsArr;

    }, function (errorObject) {

      console.log("The read failed: " + errorObject.code);
    });
  }  

})

app.controller('categoriesCtrl', function($scope,$rootScope,$location){

  $scope.active = $rootScope.active 
  
  $scope.categories = [
    {
      "title" : "All",
      "id" : 1,
      "icon" : 'heart' 
    },
     {
      "title" : "Dresses",
      "id" : 2,
      "icon" : "hand-up"
    },
     {
      "title" : "Skirts",
      "id" : 3,
      "icon" : "tower"
    },
     {
      "title" : "Bags",
      "id" : 4,
      "icon" : "glass"
    },
  ]

  $scope.navClass = function (page) {
        
    var currentRoute = $location.path().substring(1) || 'All';
    return page === currentRoute ? 'active' : '';
  };   

})
app.controller('createProductCtrl', function($scope,$rootScope, $firebase, $window){

  $scope.showError = false;

  $scope.categories = [
    {
      "title" : "All",
      "id" : 1
    },
     {
      "title" : "Dresses",
      "id" : 2
    },
     {
      "title" : "Skirts",
      "id" : 3
    },
     {
      "title" : "Bags",
      "id" : 4
    },
  ]

  var fireBase = new Firebase("https://artifacia.firebaseio.com/");
  
  $scope.create = function(){

    $scope.showError = false;

    if(!$scope.createForm.$valid){

      $scope.showError = true;
      $scope.errorMsg = "Please fill in all details"
      return;
    }

    var obj = {

      name : $scope.name,
      id : $scope.id,
      imageurl : $scope.imageurl,
      price : $scope.price,
      category : $scope.category,
      description : $scope.description,
      date : Firebase.ServerValue.TIMESTAMP
    }

    var child = $scope.category;
    var tickets = $firebase(fireBase.child("products")).$asArray();

    tickets.$add(obj).then(function(data){

      $scope.showError = false;
      $window.location.reload();
    }, function(err){

      $scope.showError = true;
      $scope.errorMsg = "Something went wrong. Please try again later"
    })
  }
})
