import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { Component} from 'react';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';

import HomePage from './src/Pages/Main/HomePage';
import CartPage from './src/Pages/Main/CartPage';
import AccountPage from './src/Pages/Main/AccountPage';


var fcmUnsubscribe = null;
const navigationRef = React.createRef();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack(){
  return(
    <Stack.Navigator 
      initialRouteName='Home'
    >
      
      <Stack.Screen
        name='Home'
        component={HomePage}
        options={{
          title:'Keşfet',
          headerShown:false
        }}
      />

    </Stack.Navigator>
  );
}

function CartStack(){
  return(
    <Stack.Navigator 
      initialRouteName='Cart'
    >

      <Stack.Screen
        name='Cart'
        component={CartPage}
        options={{
          title:'Sepetim',
          headerShown:false
        }}
      />
      
    </Stack.Navigator>
  );
}

function AccountStack(){
  return(
    <Stack.Navigator 
      initialRouteName='Account'
    >

      <Stack.Screen
        name='Account'
        component={AccountPage}
        options={{
          title:'Hesabım',
          headerShown:false
        }}
      />
      
    </Stack.Navigator>
  );
}


export default class App extends Component{

  componentDidMount(){
    messaging()
    .requestPermission()
    .then(authStatus => {
      console.log('APNs Status:', authStatus);

      if(authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL){
        messaging()
        .getToken()
        .then(token =>{
          console.log('messaging.getToken: ', token)
        });

        messaging().onTokenRefresh(token => {
          console.log('messaging.OnTokenRefresh: ', token)
        });

        messaging()
        .subscribeToTopic('bildirim');

        // fcmUnsubscribe = messaging().onMessage(async remoteMessage => {
        //   console.log('A new message arrived',remoteMessage);

        //   Alert.alert(
        //     remoteMessage.notification.title,
        //     remoteMessage.notification.body);

        // });

        messaging()
        .onNotificationOpenedApp(remoteMessage => {
          if(remoteMessage){
            if(remoteMessage.from == "/topics/bildirim"){
                navigationRef.current?.navigate("HomeStack");
            }
          }
        });

        messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if(remoteMessage){
            if(remoteMessage.from == "/topics/bildirim"){
                navigationRef.current?.navigate("HomeStack");
            }
          }
        });
      }

    })
    .catch(err => {
      console.log('messaging.requestPermission Error: ', err)
    });

  }

  render(){
    return (
      <NavigationContainer ref = {navigationRef}>
      <Tab.Navigator
        initialRouteName='Feed'
        screenOptions={{
          tabBarActiveTintColor:'#3496f0',
          tabBarInactiveTintColor:'#666',
          tabBarLabelStyle:{fontWeight:'600',fontSize:12},
          headerShown:false,
          unmountOnBlur:true,
          tabBarHideOnKeyboard:true
        }}>
          <Tab.Screen
            name='HomeStack'
            component={HomeStack}
            options={{
              tabBarLabel:'Keşfet',
              tabBarIcon:({color,size}) => (
                <MaterialCommunityIcon
                  name='home-outline'
                  color={color}
                  size={size}
                />
              )
            }}
          />
          <Tab.Screen
            name='CartStack'
            component={CartStack}
            options={{
              tabBarLabel:'Sepetim',
              tabBarIcon:({color,size}) => (
                <MaterialCommunityIcon
                  name='cart-outline'
                  color={color}
                  size={size}
                />
              )
            }}
          />
          <Tab.Screen
            name='AccountStack'
            component={AccountStack}
            options={{
              tabBarLabel:'Hesabım',
              tabBarIcon:({color,size}) => (
                <MaterialCommunityIcon
                  name='account-circle-outline'
                  color={color}
                  size={size}
                />
              )
            }}
          />
      </Tab.Navigator>
    </NavigationContainer>
    );
  }
}