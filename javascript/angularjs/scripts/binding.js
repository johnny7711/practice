angular.module('myApp', [])
  .controller('MyController', ['$scope', '$filter', function($scope, $filter){
    $scope.favs = ['�R�c�肦', '��������', '�V��R��', '�V������', '���䂠����'];
    $scope.url ="http://google.com";

    $scope.greeting = '����ɂ��́A�����q';
    $scope.onclick = function(){
      $scope.greeting = '����ɂ��́A' + $scope.myName;
    };

    $scope.path ='img/droid.gif';

    $scope.onmouseenter = function(){
      $scope.path = 'img/plenty.gif';
    };

    $scope.onmouseleave = function(){
      $scope.path = 'img/droid.gif';
    };

    $scope.show = true;

    $scope.onclick2 = function(){
      angular.element(document.getElementById('panel'))
        .css({
          backgroundColor: '#000',
          color: '#fff'
        });
    };

    $scope.author = {
      name: 'YAMADA Yoshihiro',
      gender: 'male',
      birth: new Date(1994, 8, 6)
    };

    $scope.data = { book: {} };

    $scope.onchange = function () {
      for (var i = 0; i < $scope.books.length; i++){
        var isbn = $scope.books[i].isbn;
        $scope.data.book[isbn] = $scope.all;
      }
    };

    $scope.books =  [
      {
        isbn: '617889689',
        title: '�T�[�u���b�g��JSP�|�P�b�g���t�@�����X',
        price: 2330,
        publish: '�p����',
        published: new Date(2016, 3, 7)
      },
      {
        isbn: '2678428445',
        title: 'JavaScript���S�U��',
        price: 1330,
        publish: '�Z�p�]�_��',
        published: new Date(2012, 10, 18)
      },
      {
        isbn: '8967644',
        title: '�䂪����',
        price: 930,
        publish: '���oBC',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '8979842',
        title: '10���ōU��Ruby&Rails',
        price: 4130,
        publish: '���oBC',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '314897845',
        title: '�R���挕',
        price: 730,
        publish: '�r�b�N���[�u',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '71443414513',
        title: 'PHP���傩�牞�p',
        price: 2630,
        publish: '�Z�p�]�_��',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '4467193513',
        title: '�ق�Ƃ͓�����{��',
        price: 1030,
        publish: 'ABA�o��',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '16893513',
        title: '�����オ�ꏭ�N',
        price: 1930,
        publish: 'ABA�o��',
        published: new Date(1945, 10, 18)
      },
    ];

    $scope.onsubmit = function(){
      console.log('mail addr' + $scope.user.mail);
      console.log('passwd' + $scope.user.passwd);
      console.log('name' + $scope.user.name);
      console.log('memo' + $scope.user.memo);

    }

    var max = 140;
    $scope.count = max;
    $scope.myStyle = {color: '#00f'};

    $scope.onchange = function(){
      $scope.count = max - $scope.tweet.length;
      if ($scope.count > 10) {
        $scope.myStyle = {color: '#00f'};
      } else if ($scope.count > 0){
        $scope.myStyle = {color: '#f0f'};
      } else {
        $scope.myStyle = {color: '#f00', fontWeight: 'bold'};
      }
    }

    $scope.members = [
      { name: '��؈�Y', role: '�ے�', old: 55 },
      { name: '�c���E�C', role: '����', old: 58 },
      { name: '�� ��', role: '�S��', old: 25 },
      { name: '�X�c�K��', role: '��C', old: 35 },
      { name: '�c�����', role: '�ے�', old: 45 },
    ];

    $scope.mySort = function(member) {
      var roles = { '����': 0, '�ے�': 1, '��C': 2, '�S��': 3,};
      return roles[member.role];
    };

    $scope.sort = function(exp, reverse) {
      $scope.members = $filter('orderBy')($scope.members, exp, reverse);
    }

    $scope.len = 3;�@//�y�[�W������̍ő�\������
    $scope.start = 0;�@//�\���J�n�ʒu

    $scope.pager = function(page){
      // �\���J�n�ʒu
      $scope.start = $scope.len * page;
    };

  
  }]);
