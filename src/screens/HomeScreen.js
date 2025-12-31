// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-progress';
import { getAllGoals } from '../database/goalService';

const HomeScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const loadedGoals = await getAllGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error(error);
    }
  };

  const renderGoal = ({ item }) => (
    <TouchableOpacity style={styles.goalItem} onPress={() => navigation.navigate('GoalDetail', { goal: item })}>
      <Text style={styles.goalTitle}>{item.title}</Text>
      <Text style={styles.goalDescription}>{item.description}</Text>
      <ProgressBar progress={item.getProgress() / 100} width={null} />
      <Text>{Math.round(item.getProgress())}% completado</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Objetivos</Text>
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateGoal')}>
        <Text style={styles.addButtonText}>+ Nuevo Objetivo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  goalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  goalTitle: { fontSize: 18, fontWeight: 'bold' },
  goalDescription: { fontSize: 14, color: '#666' },
  addButton: { backgroundColor: '#007bff', padding: 15, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: 'white', fontSize: 16 },
});

export default HomeScreen;