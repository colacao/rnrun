'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View, // 类似于DIV
  Text,
  ActivityIndicatorIOS,
  WebView,
  AlertIOS,
  TouchableOpacity,
  PixelRatio,
  Dimensions
} = React;

var Detail = React.createClass({
  getInitialState: function() {
    console.log("DetailDetailDetailDetailDetailDetail");
    return {uri: "about:blank"};
  },
    componentDidMount: function() {
      console.log("http://192.168.240.37:8808/apps/1");
      console.log(this.props.id);
      setTimeout(function(){
      this.setState({
          uri:"http://192.168.240.37:8808/apps/1"
        });
    }.bind(this),200)

        // if(this.props.from == 'news') {
        //     var navigator = this.props.navigator;
        //     var callback = (event) => {
        //          var route = event.data.route;
        //           if(route.page=='lists') {
        //
        //              // console.log(this.props.route_stact.indexOf(route),navigator.getCurrentRoutes(),event.type);
        //           }
        //     };
        //       // Observe focus change events from the owner.
        //       this._listeners = [
        //         // navigator.navigationContext.addListener('didfocus', callback),
        //         // navigator.navigationContext.addListener('willfocus', callback),
        //       ];
        // }

    },
    componentWillUnmount: function() {
     // this.props.pnav.title="呵呵"
        // if(this.props.from == 'news') {
        //     this._listeners && this._listeners.forEach(listener => listener.remove());
        // }
    },
  render: function() {
    return (
        <View style={{flex:1}}>
            <View style={styles.content}>
              <WebView
              source={{uri:this.state.uri}}
              decelerationRate="fast"
              automaticallyAdjustContentInset={false}              
              scalesPageToFit={true}
              contentInset={{top:20,left:0,bottom:20,right:0}}
              startInLoadingState={true}
              />
            </View>
        </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },
  content: {
    marginTop:60,
    backgroundColor:'#fff',
    width: Dimensions.get('window').width,
    flex:1,
    borderColor:'#e6e6e6',
    borderWidth: 1/PixelRatio.get(),
  },
});

module.exports = Detail;
