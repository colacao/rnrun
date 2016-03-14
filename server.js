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
var bodyParser     =         require("body-parser");  
app.use(bodyParser.urlencoded({ extended: false })); 

function initDB() {
  console.log('initDB');
  console.dir(db);
  //用户
  db.run("CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY autoincrement,name TEXT,nikename TEXT,pwd TEXT,created datetime default (datetime('now', 'localtime')))")
    //项目
  db.run("CREATE TABLE IF NOT EXISTS projects (id integer PRIMARY KEY autoincrement, uid integer,name TEXT,desc TEXT,created datetime default (datetime('now', 'localtime')) )");
  //文件
  db.run("CREATE TABLE IF NOT EXISTS files (id integer PRIMARY KEY autoincrement,mid TEXT, did TEXT,pid integer,name TEXT,path TEXT,created datetime default (datetime('now', 'localtime')) )");


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


var _getDirList = function(req, res) {
  //console.log(req.body);
  var dir = req.body['dir'];
  var r = '<ul class="jqueryFileTree" style="display: none;">';
    try {
        r = '<ul class="jqueryFileTree" style="display: none;">';
    var files = fs.readdirSync(dir);
    files.forEach(function(f){
      var ff = dir + f;
      var stats = fs.statSync(ff)
            if (stats.isDirectory()) { 
                r += '<li class="directory collapsed"><a href="#" rel="' + ff  + '/">' + f + '</a></li>';
            } else {
              var e = f.split('.')[1];
              r += '<li class="file ext_' + e + '"><a href="#" rel='+ ff + '>' + f + '</a></li>';
            }
    });
    r += '</ul>';
  } catch(e) {
    r += 'Could not load directory: ' + dir;
    r += '</ul>';
  }
  console.log(r);
  res.send(r)
}
app.post("/filetree/",function(req, res){
  //console.log(req.body.);
 _getDirList(req,res)

});
app.post("/getfile/",function(req, res){
 
var rf=require("fs");  
var data=rf.readFileSync(req.body.path,"utf-8");  
res.send(data)
console.log(data);  

})
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

function addFile(filename,arr) {
  var db = new sqlite3.Database('db/rnrun.sqlite3');
  db.run("insert into files(pid,name,path) values($pid,$name,$path)", {
    //$mid:(arr.join('/')+"/"+filename).replace("./public/upload/", ""),
    //$did:(arr.join('/')).replace("./public/upload/", ""),
    $pid: 1,
    $name: filename,
    $path: arr.join('/')
  }, function(err) {
    console.log(err);
    db.close();
    if(err){
        addFile(filename,arr);
    }
  });
}

app.post('/upload', upload.single('uploadImg'), function(req, res, next) {

  var tmp_path = req.file.path;
  var target_path = './public/upload/' + req.body["path"];
  var arr = target_path.split('/');
  var filename = arr.pop();
  mkdirsSync(arr.join('/'));

  //---------db-------------------------
  addFile(filename,arr);
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

var tempID={};
var tempNumber=1;
function getID(str){
  if(!tempID[str]){
       tempNumber++;
       tempID[str]=tempNumber;
  }
      return tempID[str]
}
app.get('/app/:id', function(req, res) {
  var db = new sqlite3.Database('db/rnrun.sqlite3');
  db.all('select * from files where pid=$pid', {
    $pid: 1
  }, function(err, rows) {
    db.close();
    res.json((function(data) {
      var ret = [];
      ret.push({
        id: 1,
        pId: 0,
        name: "fuck",
        open: true
      });
      var dir = {}
      for (var i = 0; i < data.length; i++) {
       
          console.log(data[i].path);

          var tempDir = data[i].path.replace("./public/upload/", "").split('/');
          console.log(tempDir);
          for(var k=0;k<tempDir.length;k++){
              console.log(tempDir[k]);
             if(!dir[tempDir]){
                dir[tempDir[k]]=tempDir[k];
                // ret.push({
                //     id:tempDir.length,
                //     pId:0,
                //     name:dir[tempDir[k]]
                // })
             }

          }
        console.log(dir);
          // ret.push({
          //     id:getID(data[i].mid),
          //     pId:getID(data[i].did),
          //     name:data[i].name
          // })
      }
     
     // console.log(ret);
      return ret;
    })(rows));
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