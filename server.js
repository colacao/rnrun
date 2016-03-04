var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var fs = require('fs');

var multer  = require('multer');
var upload = multer({ dest: '/tmp' })



app.set('port', process.env.PORT || 8808);
app.set('views', __dirname + '/view');
app.set('view engine', 'html');
app.set("view options", {
  "open": "{{",
  "close": "}}"
});
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));


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
            }
            else {
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

app.post('/upload',upload.single('uploadImg'),function(req,res,next){
    
  var tmp_path = req.file.path;
  var target_path = './public/upload/' + req.body["path"];
  var arr = target_path.split('/');
  arr.pop();
mkdirsSync(arr.join('/'));
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
    res.json({
      id:req.body["post_id"],
      path:req.body["path"],
      file:req.file
    });
 // src.on('end', function() { res.render('complete'); });
  //src.on('error', function(err) { res.render('error'); });

});
app.get('/apps/:id', function(req, res) {
  res.render('add', {});
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
              url: "http://172.31.0.153:8808/images/1.jpg"
            }, {
              article_id: "265828",
              url: "http://172.31.0.153:8808/images/2.jpg"
            }, {
              article_id: "265828",
              url: "http://172.31.0.153:8808/images/3.jpg"
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
              url: "http://172.31.0.153:8808/images/3.jpg"
            }, {
              article_id: "265828",
              url: "http://172.31.0.153:8808/images/1.jpg"
            }, {
              article_id: "265828",
              url: "http://172.31.0.153:8808/images/2.jpg"
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