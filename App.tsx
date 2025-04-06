import React from 'react';

import MainPage from './src/pages/MainPage';
import {NavigationContainer} from '@react-navigation/native';

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <MainPage />
    </NavigationContainer>
  );
}

export default App;
