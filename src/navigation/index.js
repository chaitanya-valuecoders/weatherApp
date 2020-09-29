import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../modules/Home/Home';
import List from '../modules/List/List';

const AuthNav = createStackNavigator();

export default function AuthNavFun() {
  return (
    <AuthNav.Navigator headerMode="none">
      <AuthNav.Screen name="Home" component={Home} />
      <AuthNav.Screen name="List" component={List} />
    </AuthNav.Navigator>
  );
}
