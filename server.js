var express = require('express');
var path = require('path');
var app = express();
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
    platform:[
      "ios",
      "android"
    ],
    count:{
        run:120,
        up:120,
        down:80,
    },
    images: [{
      name: "1.jpg",
      desc: "首页"
    }, {
      name: "2.jpg",
      desc: "列表页"
    }]
  },{
    id: 2,
    name: "tes2",
    desc: "这是一个测试2",
    auth: "caoyueqq@163.com",
      platform:[
      "ios",
      "android"
    ],
    count:{
        run:120,
        up:120,
        down:80,
    },
    images: [{
      name: "3.jpg",
      desc: "首页"
    }, {
      name: "4.jpg",
      desc: "列表页"
    }]
  }]
  res.render('index', {data:data});
});
app.get('/add', function(req, res) {
  res.render('add', {});
});
app.get('/apps/:id', function(req, res) {
  res.render('add', {});
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