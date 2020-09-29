import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavFun from './src/navigation';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <NavigationContainer>
          <AuthNavFun />
      </NavigationContainer>
    );
  }
}

export default App;
