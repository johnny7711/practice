angular.module('myApp', [])
  .controller('MyController', ['$scope', '$filter',  function($scope, $filter){
    $scope.len = 3;�@//�y�[�W������̍ő�\������
    $scope.start = 0;�@//�\���J�n�ʒu

    $scope.pager = function(page){
      // �\���J�n�ʒu
      $scope.start = $scope.len * page;
    };
  }]);
