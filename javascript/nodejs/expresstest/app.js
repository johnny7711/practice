
// 外部モジュールの読み込み
var http = require('http');
var express = require('express');
var cors = require('cors');
// Views dirの絶対パスの作成するためのパスライブラリ
var path = require('path');
var mongoose = require('mongoose');

//POST形式のリクエストを取得するミドルウェア
// => 取得されたものは req.bodyオブジェクトに格納
var bodyParser = require('body-parser');
//multipart/form-data形式のリクエスト処理するミドルウェア
var fileUpLoad = require('express-fileupload');

//スキーマのインポート
var User = require('./schema/User');
var Message = require('./schema/Message');
var Book = require('./schema/Book');

var app = express();

//passportでローカル認証をするためのモジュール
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');

var twitterConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
};


// MongoDBへの接続
mongoose.connect('mongodb://localhost:27017/chatapp', function(err){
  if(err){
    console.error(err);
  } else {
    console.log("successfully connected to MongoDB");
  }
});

// ミドルウェアの利用宣言
app.use(bodyParser());
app.use(cors());
//ファイルアクセスのためのpath
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/avatar', express.static(path.join(__dirname, 'avatar')));
app.use('/public', express.static(path.join(__dirname, 'public')));

//セッションのハッシュ化に使う文字列
app.use(session({secret: 'HogeFuga'}));

app.use(passport.initialize());
app.use(passport.session());


//設定
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/', function(req, res, next){
  //mongoDBのクエリ method( {Obj}, function(エラーObj, 配列Obj))
  Message.find({}, function(err, msgs){
    if(err) throw err;
    return res.render('index', {
      msgs: msgs,
      user: req.session && req.session.user ? req.session.user : null});
  });
});

/*
app.get('/signin', function(req, res, next) {
  return res.render('signin');
});

//multipart/form-dataを受け付ける場合は fileUpLoad()を追加
app.post('/signin', fileUpLoad(), function(req, res, next){
  var avatar = req.files.avatar
  avatar.mv('./avatar/' + avatar.name, function(err){
    if(err) throw err
    //スキーマにデータの格納
    var newUser = new User ({
      username: req.body.username,
      password: req.body.password,
      avatar_path: '/avatar/' + avatar.name
    })
    //スキーマに保存
    //スキーマに適合したデータを保存　=>　null
    //スキーマに適合しないデータを保存　=>　コールバック関数
    newUser.save((err)=>{
      if(err) throw error
      return res.redirect('/')
    })
  })
})


app.get('/login', function(req, res, next){
  return res.render('login')
});


//セッション初期化後の処理
//passport.authenticate('local')がセッションを検証する　
// =>　セッションがない場合は new LocalStrategyへ再送信する
app.post('/login', passport.authenticate('local'), function(req, res, next) {
  User.findOne({ _id: req.session.passport.user }, function(err, user) {
    if(err||!req.session){
      failureFlash: true
      return res.redirect('/login');
    } else {
      req.session.user = {
        username: user.username,
        avatar_path: user.avatar_path
      }
      return res.redirect('/');
    }
  });
});

//passport.authenticate('local')でセッションが設定されていない場合の処理
//認証に成功した場合は、ユーザーの情報を使ってセッションIDが生成される
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username}, function(err, user){
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username'});
      }
      if(user.password !== password) {
        return done(null, false, {message: 'Incorrect password'});
      }
      return done(null, user);
    });
  }
));]
*/

//passport.useでセッションが認証されたユーザーのデータからどのデータをセッションに格納するのか決定
//=> 指定したデータはreq.sessionに格納される（req.session.paasport.userで利用可能）
passport.serializeUser(function(user, done){
  done(null, user._id);
});
//シリアライズで決めたデータで、DBに問い合わせ、中身を検証する
passport.deserializeUser(function(id, done){
  User.findOne({ _id: id}, function(err, user){
    done(err, user);
  });
});


passport.use(new TwitterStrategy(twitterConfig,
function(token, tokenSecret, profile, done){
  User.findOne({twitter_profile_id: profile.id}, function(err, user){
    if(err){
      return done(err);
    } else if (!user){
      var _user = {
        username: profile.displayName,
        twitter_profile_id: profile.id,
        avatar_path: profile.photos[0].value
      };
      var newUser = new User(_user);
      newUser.save((err)=>{
        if(err) throw err
        return done(null, newUser);
      });
    }else{
      return done(null, user);
    }
  });
}));

app.get('/oauth/twitter', passport.authenticate('twitter'));

app.get('/oauth/twitter/callback', passport.authenticate('twitter'),
function(req, res, next){
  User.findOne({_id: req.session.passport.user}, function(err, user){
    if(err||!req.session) return res.redirect('/oauth/twitter')
    req.session.user = {
      username: user.username,
      avatar_path: user.avatar_path
    }
    return res.redirect('/')
  })
});

app.get('/update', function(req, res, next){
  return res.render('update');
});

app.post('/update', fileUpLoad(), function(req, res, next) {
  // req.files : POSTで送られてきた画像データ（req.filesに保存される）
  // req.files.image : req.filesから取り出した画像データ
  if(req.files && req.files.image){
    var img = req.files.image
    // オンメモリ上のdataをファイルとして/imageに保存
    img.mv('./image/' + img.name, function(err){
      if(err) throw err;
      // mongoDBに追加
      var newMessage = new Message({
        username: req.session.user.username,
        avatar_path: req.session.user.avatar_path,
        message: req.body.message,
        image_path: '/image/' + img.name
      });
      // mongoDBで保存
      newMessage.save((err)=>{
        if(err) throw err;
        return res.redirect('/');
      });
    });
  } else {
    var newMessage = new Message({
      username: req.session.user.username,
      avatar_path: req.session.user.avatar_path,
      message: req.body.message,
    });
    newMessage.save((err)=>{
      if(err) throw err;
      return res.redirect('/');
    });
  }
});

app.get('/angular', function(req, res, next){
res.render('angular');
});

app.post('/angularreq', function(req, res, next){
  console.log(req.body.name);
  var input  = req.body.name;
  var fname = "masaaki";
  var age =  24;
  var result = {
    input: input,
    fname: fname,
    age:age
  }
  console.log(result);
  res.write(JSON.stringify({
    result: result
  }));
  res.end();
});

app.get('/resource', function(req, res, next){
    res.render('resource');
});


app.get('/edit', function(req, res, next){
  res.render('resource');
});

app.get('/del', function(req, res, next){
  res.render('resource');
});

app.get('/regi', function(req, res, next){
  res.render('resource');
});

app.get('/modi', function(req, res, next){
  res.render('resource');
});


app.post('/regiReq', function(req, res, next){
  var newBook = new Book({
    isbn: req.body.isbn,
    title: req.body.title,
    price: req.body.price,
    publish: req.body.publish,
  });
  newBook.save((err)=>{
    if(err) throw err;
  });
  console.log(newBook);
var books = [];
Book.find({}, function(err, books){
  books = books.concat(books);
 });

console.log(books);
  res.write(JSON.stringify({
    books: books
  }));
  res.end();
});

var server = http.createServer(app);
server.listen('3000');
