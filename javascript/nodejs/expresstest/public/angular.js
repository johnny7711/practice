angular.module('myApp', [ ])
  .controller('myController', [ '$scope', '$http', function($scope, $http){
    $scope.msg = "hello";
/*
    var Book = $resorce(
      '/resource/:isbn',
      { isbn: '@isbn' },
      { modi: {method: 'PUT' } }
    );*/


    $scope.onclick = function() {
      $http({
        method: 'POST',
        url: '/angularreq',
        data: {name: $scope.name }
      })
      .success(function(data, status, headers, config){
        console.log("GET /co2listreq success");
        $scope.result = data.result;
        // $scope.fname = data.fname;
        // $scope.age = data.age;
      })
      .error(function(data, status, headers, config){
        console.log('data not found');
      });
    };

    $scope.onregi = function() {
      $http({
        method: 'POST',
        url: '/regiReq',
        data: {
          isbn: $scope.isbn,
          title: $scope.title,
          price: $scope.price,
          publish: $scope.publish,
        }
      })
      .success(function(datas, status, headers, config){
        console.log("GET /regiReq success");
        $scope.books = datas.books;

      })
      .error(function(data, status, headers, config){
        console.log('data not found');
      });
    };


}]);
