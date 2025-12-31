import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './src/database/db';
import HomeScreen from './src/screens/HomeScreen';
import CreateGoalScreen from './src/screens/CreateGoalScreen';
import GoalDetailScreen from './src/screens/GoalDetailScreen';
import StageDetailScreen from './src/screens/StageDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  console.log('App component rendered');
  React.useEffect(() => {
    console.log('Initializing database...');
    initDatabase().then(() => {
      console.log('Database initialized successfully');
    }).catch(error => {
      console.error('Database initialization failed:', error);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Objetivos' }} />
        <Stack.Screen name="CreateGoal" component={CreateGoalScreen} options={{ title: 'Crear Objetivo' }} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} options={{ title: 'Detalle del Objetivo' }} />
        <Stack.Screen name="StageDetail" component={StageDetailScreen} options={{ title: 'Detalle de la Etapa' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
