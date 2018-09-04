
// �O�����W���[���̓ǂݍ���
var http = require('http');
var express = require('express');
var cors = require('cors');
// Views dir�̐�΃p�X�̍쐬���邽�߂̃p�X���C�u����
var path = require('path');
var mongoose = require('mongoose');

//POST�`���̃��N�G�X�g���擾����~�h���E�F�A
// => �擾���ꂽ���̂� req.body�I�u�W�F�N�g�Ɋi�[
var bodyParser = require('body-parser');
//multipart/form-data�`���̃��N�G�X�g��������~�h���E�F�A
var fileUpLoad = require('express-fileupload');

//�X�L�[�}�̃C���|�[�g
var User = require('./schema/User');
var Message = require('./schema/Message');
var Book = require('./schema/Book');

var app = express();

//passport�Ń��[�J���F�؂����邽�߂̃��W���[��
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');

var twitterConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
};


// MongoDB�ւ̐ڑ�
mongoose.connect('mongodb://localhost:27017/chatapp', function(err){
  if(err){
    console.error(err);
  } else {
    console.log("successfully connected to MongoDB");
  }
});

// �~�h���E�F�A�̗��p�錾
app.use(bodyParser());
app.use(cors());
//�t�@�C���A�N�Z�X�̂��߂�path
app.use('/image', express.static(path.join(__dirname, 'image')));
app.use('/avatar', express.static(path.join(__dirname, 'avatar')));
app.use('/public', express.static(path.join(__dirname, 'public')));

//�Z�b�V�����̃n�b�V�����Ɏg��������
app.use(session({secret: 'HogeFuga'}));

app.use(passport.initialize());
app.use(passport.session());


//�ݒ�
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/', function(req, res, next){
  //mongoDB�̃N�G�� method( {Obj}, function(�G���[Obj, �z��Obj))
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

//multipart/form-data���󂯕t����ꍇ�� fileUpLoad()��ǉ�
app.post('/signin', fileUpLoad(), function(req, res, next){
  var avatar = req.files.avatar
  avatar.mv('./avatar/' + avatar.name, function(err){
    if(err) throw err
    //�X�L�[�}�Ƀf�[�^�̊i�[
    var newUser = new User ({
      username: req.body.username,
      password: req.body.password,
      avatar_path: '/avatar/' + avatar.name
    })
    //�X�L�[�}�ɕۑ�
    //�X�L�[�}�ɓK�������f�[�^��ۑ��@=>�@null
    //�X�L�[�}�ɓK�����Ȃ��f�[�^��ۑ��@=>�@�R�[���o�b�N�֐�
    newUser.save((err)=>{
      if(err) throw error
      return res.redirect('/')
    })
  })
})


app.get('/login', function(req, res, next){
  return res.render('login')
});


//�Z�b�V������������̏���
//passport.authenticate('local')���Z�b�V���������؂���@
// =>�@�Z�b�V�������Ȃ��ꍇ�� new LocalStrategy�֍đ��M����
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

//passport.authenticate('local')�ŃZ�b�V�������ݒ肳��Ă��Ȃ��ꍇ�̏���
//�F�؂ɐ��������ꍇ�́A���[�U�[�̏����g���ăZ�b�V����ID�����������
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

//passport.use�ŃZ�b�V�������F�؂��ꂽ���[�U�[�̃f�[�^����ǂ̃f�[�^���Z�b�V�����Ɋi�[����̂�����
//=> �w�肵���f�[�^��req.session�Ɋi�[�����ireq.session.paasport.user�ŗ��p�\�j
passport.serializeUser(function(user, done){
  done(null, user._id);
});
//�V���A���C�Y�Ō��߂��f�[�^�ŁADB�ɖ₢���킹�A���g�����؂���
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
  // req.files : POST�ő����Ă����摜�f�[�^�ireq.files�ɕۑ������j
  // req.files.image : req.files������o�����摜�f�[�^
  if(req.files && req.files.image){
    var img = req.files.image
    // �I�����������data���t�@�C���Ƃ���/image�ɕۑ�
    img.mv('./image/' + img.name, function(err){
      if(err) throw err;
      // mongoDB�ɒǉ�
      var newMessage = new Message({
        username: req.session.user.username,
        avatar_path: req.session.user.avatar_path,
        message: req.body.message,
        image_path: '/image/' + img.name
      });
      // mongoDB�ŕۑ�
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
