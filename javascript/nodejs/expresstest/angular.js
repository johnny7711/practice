angular.module('myApp', [])
  .controller('MyController', ['$scope', '$filter',  function($scope, $filter){
    $scope.len = 3;　//ページ当たりの最大表示件数
    $scope.start = 0;　//表示開始位置

    $scope.pager = function(page){
      // 表示開始位置
      $scope.start = $scope.len * page;
    };
  }]);
