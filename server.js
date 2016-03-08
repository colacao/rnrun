var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

var db = new sqlite3.Database('db/rnrun.sqlite3');


var multer = require('multer');
var upload = multer({
  dest: '/tmp'
})



app.set('port', process.env.PORT || 8808);
app.set('views', __dirname + '/view');
app.set('view engine', 'html');
app.set("view options", {
  "open": "{{",
  "close": "}}"
});
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));


function initDB() {
  console.log('initDB');
  console.dir(db);
  //用户
  db.run("CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY autoincrement,name TEXT,nikename TEXT,pwd TEXT,created datetime default (datetime('now', 'localtime')))")
    //项目
  db.run("CREATE TABLE IF NOT EXISTS projects (id integer PRIMARY KEY autoincrement, uid integer,name TEXT,desc TEXT,created datetime default (datetime('now', 'localtime')) )");
  //文件
  db.run("CREATE TABLE IF NOT EXISTS files (id integer PRIMARY KEY autoincrement, pid integer,name TEXT,path TEXT,created datetime default (datetime('now', 'localtime')) )");


  //  db.run("insert into users(name,nikename,pwd) values($name,$nickname,$pwd)", {
  //    $name: "caoyueqq@163.com",
  //    $nickname: "colacao",
  //    $pwd: md5("000000")
  //  });
  // db.run("insert into users(name,nikename,pwd) values($name,$nickname,$pwd)", {
  //    $name: "caoyueqq@126.com",
  //    $nickname: "colacao",
  //    $pwd: md5("000000")
  //  });

  // db.all("select * from users",function(err,rows){
  //  console.log(rows);
  // });



  db.close();
}


initDB();


app.get('/', function(req, res) {
  var data = [{
    id: 1,
    name: "test",
    desc: "这是一个测试",
    auth: "caoyueqq@163.com",
    platform: [
      "ios",
      "android"
    ],
    count: {
      run: 120,
      up: 120,
      down: 80,
    },
    images: [{
      name: "1.jpg",
      desc: "首页"
    }, {
      name: "2.jpg",
      desc: "列表页"
    }]
  }, {
    id: 2,
    name: "tes2",
    desc: "这是一个测试2",
    auth: "caoyueqq@163.com",
    platform: [
      "ios",
      "android"
    ],
    count: {
      run: 120,
      up: 120,
      down: 80,
    },
    images: [{
      name: "3.jpg",
      desc: "首页"
    }, {
      name: "4.jpg",
      desc: "列表页"
    }]
  }]
  res.render('index', {
    data: data
  });
});
app.get('/add', function(req, res) {
  res.render('add', {});
});

function mkdirsSync(dirpath, mode) {
  console.log(dirpath);
  if (!fs.existsSync(dirpath)) {
    var pathtmp;
    dirpath.split(path.sep).forEach(function(dirname) {
      if (pathtmp) {
        pathtmp = path.join(pathtmp, dirname);
      } else {
        pathtmp = dirname;
      }
      if (!fs.existsSync(pathtmp)) {
        if (!fs.mkdirSync(pathtmp, mode)) {
          return false;
        }
      }
    });
  }
  return true;
}

app.post('/upload', upload.single('uploadImg'), function(req, res, next) {

  var tmp_path = req.file.path;
  var target_path = './public/upload/' + req.body["path"];
  var arr = target_path.split('/');
  var filename = arr.pop();
  mkdirsSync(arr.join('/'));

  //---------db-------------------------
  var db = new sqlite3.Database('db/rnrun.sqlite3');
  db.run("insert into files(pid,name,path) values($pid,$name,$path)", {
    $pid: 1,
    $name: filename,
    $path: arr.join('/')
  },function(err){
    db.close();
  });
  // 
  //---------db-------------------------

  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  res.json({
    id: req.body["post_id"],
    path: req.body["path"],
    file: req.file
  });
});


app.get('/app/:id', function(req, res) {
   var db = new sqlite3.Database('db/rnrun.sqlite3');
  db.all('select * from files where pid=$pid', {
    $pid: 1
  }, function(err, rows) {
    db.close();
    res.json((function(data) {
  var ret = [];
  ret.push({
    id:1,
    pId:0,
    name:"fuck",
    open:true
  });
  for (var i = 0; i < data.length; i++) {
    var obj = {
      id: (function(p,n){
          return (p.replace("./public/upload/","").split('/').length)+1
      })(data[i].path, data[i].name),
      pId: (function(p,n){
          return (p.replace("./public/upload/","").split('/').length)
      })(data[i].path, data[i].name),
      name: data[i].name
    }
    ret.push(obj);
  }
  //console.log(ret);
  return ret;
})(rows)
);
 });
});
app.get('/apps/:id', function(req, res) {
     res.render('add', {
      id: req.params.beginid
    });
});
app.get('/api/index/:beginid', function(req, res) {
  console.log(req.params.beginid);
  var data = {
    status: 1,
    msg: "",
    data: {
      lists: {
        lists: [{
          id: "1",
          resource: {
            title: "这是一个测试",
            digg_count: "78",
            bury_count: "129",
            source: "caoyueqq@163.com",
            hot_order: "1455980768",
            id: "265827",
            category_id: "6",
            source_public_time: "02-20 15:39",
            images: [{
              article_id: "265827",
              url: "http://192.168.240.37:8808/images/1.jpg"
            }, {
              article_id: "265828",
              url: "http://192.168.240.37:8808/images/2.jpg"
            }, {
              article_id: "265828",
              url: "http://192.168.240.37:8808/images/3.jpg"
            }]
          }
        }, {
          id: "2",
          resource: {
            title: "这是一个测试11",
            digg_count: "78",
            bury_count: "129",
            source: "caoyueqq@163.com",
            hot_order: "1455980768",
            id: "265827",
            category_id: "6",
            source_public_time: "02-20 15:39",
            images: [{
              article_id: "265827",
              url: "http://192.168.240.37:8808/images/3.jpg"
            }, {
              article_id: "265828",
              url: "http://192.168.240.37:8808/images/1.jpg"
            }, {
              article_id: "265828",
              url: "http://192.168.240.37:8808/images/2.jpg"
            }]
          }
        }],
        max: "41168"
      }
    }
  }
  res.json(data);
});

function getIPAdress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

console.log('http://' + getIPAdress() + ":" + app.get('port') + "/");
app.listen(app.get('port'));