/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  StyleSheet,
  Navigator,
  AsyncStorage,
  TouchableOpacity,
  View,
  Image,
  Text
} from 'react-native';


import TabIndex from './app/TabIndex';
import Detail from './app/Detail';
import Statistic from './app/Statistic';
import Icon from 'react-native-vector-icons/Ionicons';
import Qr from './app/Qr';
var ZIP = require('react-native-zip-archive');
var RNFS = require('react-native-fs');

var RNNetworkingManager = require('react-native-networking');

var STAR_KEY = "toutiao-star-";

var rnrun = React.createClass({
  
    getInitialState: function() {
        return {
            hideNavBar:true,
            starDatas: null,
        };
    },
    componentDidMount: function() {
        // 异步获取
        this._initGetData();
        Statistic.Run();
       
        this._readDir(RNFS.DocumentDirectoryPath+'/111');
    },
    _unZipFile:function(name){
        //console.log('_unZipFile',name);
        let sourcePath = RNFS.DocumentDirectoryPath+'/'+name
        let targetPath = RNFS.DocumentDirectoryPath+'/'+name.split('.')[0]

        ZIP.unzip(sourcePath, targetPath)
        .then(() => {
          console.log('unzip completed!')
          this._readDir(targetPath);
        })
        .catch((error) => {
          console.log(error)
        })
    },
    _run:function(code){
        new Function('alert("aa")')();
     },
    _readDir:function(path){
      RNFS.readFile(path+'/AwesomeProject/index.ios.js', 'utf8')
      .then((contents)=>{
          console.log(contents)
          this._run(contents);
      })
      .catch((err) => {
          console.log(err.message, err.code);
      });
    },
    handleResult:function(result){
     // console.log(result);
      //console.log(RNNetworkingManager);
      this.state.scanned = true


      var url ='http://cdn.mifengwo.me/AwesomeProject.zip';// result.data
      var path = RNFS.DocumentDirectoryPath + '/111.zip';

      RNFS.downloadFile(url,path)
      .then(()=>{
         console.log('Alerta','下载完成');
         this._unZipFile('111.zip');
      })
      .catch(()=>{
        console.log('Error','下载出错');
      });


      // RNNetworkingManager.requestFile(url, {
      //     'method':'GET'
      // }, function(results) {

      //    RNFS.writeFile(path, results, 'utf8')
      // .then((success) => {
      //   console.log('写成功了');
      // })
      // .catch((err) => {
      //   console.log(err.message);
      // });
      // });


   


    // alert(
    //   result.data,
    //   JSON.stringify(result),
    //   [
    //     {text: 'Foo', onPress: () => console.log('Foo Pressed!')},
    //     {text: 'Bar', onPress: () => console.log('Bar Pressed!')},
    //   ]
    // );
//      this.props.navigator.push({title: 'Scan Result', component: ScannerResult, passProps: {data: result.data, returnHandler: this.reset.bind(this)}});
   
    },
    reset() {
      this.state.scanned = false
    },
    _renderScene: function(route,nav) {
        switch (route.sence) {
            case 'detail':
                return <Detail route={route} pnav={nav} id={route.id} />
                break;
            case 'tab':
                return <TabIndex route={route} pnav={nav} starDatas={this.state.starDatas}/>
                break;
            case 'qr':
                return  <View style={styles.qr}>
                             
                          <Qr route={route} pnav={nav} id={route.id} resultHandler={this.handleResult}>
                           <Image
        source={require('image!mengban_04')}
      />
                          </Qr>
                              </View>
                break;
            default:
        }
    },
    // 初始化执行
    async _initGetData() {
        // 获取收藏数据
        var tmps = await AsyncStorage.getItem(STAR_KEY);
        this.setState({
            starDatas: tmps != null? JSON.parse(tmps): null,
        });
    },

    _refFunc: function(navigator) {
        var callback = (event) => {
             var route = event.data.route;
             if(route.sence == 'detail') {
                // 这里写逻辑来加载收藏的路由
                this.setState({
                    hideNavBar:false,
                });
            } else {
                this.setState({
                    hideNavBar:false,
                });
            }
        };
          this._listeners = [
            // navigator.navigationContext.addListener('didfocus', callback),
            navigator.navigationContext.addListener('willfocus', callback),
          ];
    },
    componentWillUnmount: function() {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    },

    render: function() {
        return (
            <Navigator
              ref={this._refFunc}
              style={{flex:1}} // 整体的背景颜色
              initialRoute={{sence:'tab'}}
              renderScene={this._renderScene}
              sceneStyle={{backgroundColor:'#fff'}} // 场景的北京颜色
              navigationBar={
                  this._navBar()
              }
            />);
    },
    //
    _navBar: function() {
       
            return <Navigator.NavigationBar
                      routeMapper={{
                          LeftButton: this.LeftButton,
                          RightButton: this.RightButton,
                          Title: this.Title
                      }}
                      style={styles.navBar}
                    />;
       
    },
    // Nav使用
    LeftButton: function(route, navigator, index, navState) {

        return index?(
          <TouchableOpacity
            onPress={() => navigator.pop()}
            style={styles.navBarLeftButton}>
            <Icon
                name='ios-arrow-left'
                size={30}
                color='#666'
                style={styles.icon}
            />
          </TouchableOpacity>
        ):null;
    },
    RightButton: function(route, navigator, index, navState) {
         return !index?(
              <TouchableOpacity
               onPress={()=>this._changeDetailStar(route,navigator,this.state.starDatas)}
                style={styles.navBarRightButton}>
                <Icon
                    name='qr-scanner'
                    size={30}
                    color='#333'
                    style={styles.icon}
                />
              </TouchableOpacity>
          ):null;

      // if(route.isStar) {
      //     return (
      //         <TouchableOpacity
      //          onPress={()=>this._changeDetailStar(route,navigator,this.state.starDatas)}
      //           style={styles.navBarRightButton}>
      //           <Icon
      //               name='ios-star'
      //               size={30}
      //               color='#333'
      //               style={styles.icon}
      //           />
      //         </TouchableOpacity>
      //     );
      // } else {
      //     return (
      //         <TouchableOpacity
      //          onPress={()=>this._changeDetailStar(route,navigator,this.state.starDatas)}
      //           style={styles.navBarRightButton}>
      //           <Icon
      //               name='ios-star-outline'
      //               size={30}
      //               color='#333'
      //               style={styles.icon}
      //           />
      //         </TouchableOpacity>
      //     );
      // }
  },
  _changeDetailStar: function(route,navigator) {

    navigator.push({
        title: 'qr',
        sence:"qr"
    })
      // var tmpRoute = route;
      // var dataArr = this.state.starDatas;
      //   if(dataArr != null) {
      //        if(route.isStar) {
      //           if(dataArr.length > 0) {
      //               for(var i=0; i< dataArr.length; i++) {
      //                   if(dataArr[i].id == route.id) {
      //                      dataArr.splice(i,1);
      //                      tmpRoute.isStar = !tmpRoute.isStar;
      //                      navigator.replace(tmpRoute);
      //                      break;
      //                   }
      //               }
      //           }
      //       } else {
      //           dataArr.unshift({id: route.id, title: route.title});
      //           tmpRoute.isStar = !tmpRoute.isStar;
      //           navigator.replace(tmpRoute);
      //       }
      //   } else {
      //       dataArr = [];
      //       if(!route.isStar) {
      //         dataArr.unshift({id: route.id, title: route.title});
      //         tmpRoute.isStar = !tmpRoute.isStar;
      //         navigator.replace(tmpRoute);
      //       }
      //   }
      //   this.setState({
      //       starDatas: dataArr,
      //   });
      //   AsyncStorage.setItem(STAR_KEY, JSON.stringify(dataArr)).done();
  },
  Title: function(route, navigator, index, navState) {
    return (<Text style={styles.title}>RNRun</Text>)
  },
});

var styles = StyleSheet.create({
  navBar: {
      backgroundColor:'red',
      borderColor:'#dddddd',
  },
  navBarTitleText: {
    fontWeight: '500',
  },
  navBarLeftButton: {
    paddingLeft: 5,
  },
  navBarRightButton: {
      marginRight:5,
  },
  title:{
        fontWeight: '500',
        color:"#ffffff",
        paddingTop: 5,
        fontSize: 25
  },
  qr:{
  },
  icon: {
            color:"#ffffff",

      width:30,
      height:30,
      marginTop:6,
      textAlign:'center'
  }
});

AppRegistry.registerComponent('app', () => rnrun);
