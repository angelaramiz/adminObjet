import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initDatabase } from './src/database/db';
import HomeScreen from './src/screens/HomeScreen';
import CreateGoalScreen from './src/screens/CreateGoalScreen';
import GoalDetailScreen from './src/screens/GoalDetailScreen';
import StageDetailScreen from './src/screens/StageDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  const [dbReady, setDbReady] = React.useState(false);
  const [dbError, setDbError] = React.useState(null);
  
  console.log('App component rendered');
  React.useEffect(() => {
    console.log('Initializing database...');
    initDatabase()
      .then(() => {
        console.log('Database initialized successfully');
        setDbReady(true);
      })
      .catch(error => {
        console.error('Database initialization failed:', error);
        setDbError(error);
      });
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 16 }}>Error en la base de datos:</Text>
        <Text style={{ color: 'red', marginTop: 10 }}>{dbError.message}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando aplicación...</Text>
      </View>
    );
  }

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
