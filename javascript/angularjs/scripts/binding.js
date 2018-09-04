angular.module('myApp', [])
  .controller('MyController', ['$scope', '$filter', function($scope, $filter){
    $scope.favs = ['山田りえ', '高橋もえ', '新井由香', '新島ちか', '桃井あかね'];
    $scope.url ="http://google.com";

    $scope.greeting = 'こんにちは、権兵衛';
    $scope.onclick = function(){
      $scope.greeting = 'こんにちは、' + $scope.myName;
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
        title: 'サーブレット＆JSPポケットリファレンス',
        price: 2330,
        publish: '英傑社',
        published: new Date(2016, 3, 7)
      },
      {
        isbn: '2678428445',
        title: 'JavaScript完全攻略',
        price: 1330,
        publish: '技術評論社',
        published: new Date(2012, 10, 18)
      },
      {
        isbn: '8967644',
        title: '我が闘争',
        price: 930,
        publish: '日経BC',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '8979842',
        title: '10日で攻略Ruby&Rails',
        price: 4130,
        publish: '日経BC',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '314897845',
        title: '燃えよ剣',
        price: 730,
        publish: 'ビックローブ',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '71443414513',
        title: 'PHP入門から応用',
        price: 2630,
        publish: '技術評論社',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '4467193513',
        title: 'ほんとは難しい日本語',
        price: 1030,
        publish: 'ABA出版',
        published: new Date(1945, 10, 18)
      },
      {
        isbn: '16893513',
        title: '立ち上がれ少年',
        price: 1930,
        publish: 'ABA出版',
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
      { name: '鈴木一郎', role: '課長', old: 55 },
      { name: '田中勇気', role: '部長', old: 58 },
      { name: '轟 健', role: '担当', old: 25 },
      { name: '森田幸一', role: '主任', old: 35 },
      { name: '田口大輔', role: '課長', old: 45 },
    ];

    $scope.mySort = function(member) {
      var roles = { '部長': 0, '課長': 1, '主任': 2, '担当': 3,};
      return roles[member.role];
    };

    $scope.sort = function(exp, reverse) {
      $scope.members = $filter('orderBy')($scope.members, exp, reverse);
    }

    $scope.len = 3;　//ページ当たりの最大表示件数
    $scope.start = 0;　//表示開始位置

    $scope.pager = function(page){
      // 表示開始位置
      $scope.start = $scope.len * page;
    };

  
  }]);
