// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAllGoals, deleteGoal, duplicateGoal } from '../database/goalService';

const HomeScreen = ({ navigation }) => {
  console.log('HomeScreen rendered');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    console.log('HomeScreen useEffect triggered');
    loadGoals();
  }, []);

  const loadGoals = async () => {
    console.log('Loading goals...');
    try {
      const loadedGoals = await getAllGoals();
      console.log('Goals loaded:', loadedGoals.length);
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const handleDelete = (goalId, goalTitle) => {
    Alert.alert(
      'Eliminar Objetivo',
      `¿Está seguro de que desea eliminar "${goalTitle}"?`,
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteGoal(goalId);
              loadGoals();
              Alert.alert('Éxito', 'Objetivo eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el objetivo');
              console.error('Error deleting goal:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDuplicate = async (goal) => {
    try {
      await duplicateGoal(goal);
      loadGoals();
      Alert.alert('Éxito', 'Objetivo duplicado');
    } catch (error) {
      Alert.alert('Error', 'No se pudo duplicar el objetivo');
      console.error('Error duplicating goal:', error);
    }
  };

  const renderGoal = ({ item }) => {
    console.log('renderGoal called with item:', item?.id, item?.title);
    
    if (!item) {
      console.warn('Item is null or undefined');
      return null;
    }
    
    if (!item.title) {
      console.warn('Item has no title:', item);
      return null;
    }
    
    try {
      const progress = typeof item.getProgress === 'function' ? item.getProgress() : 0;
      const progressValue = Math.min(Math.max(progress / 100, 0), 1);
      
      console.log('Rendering goal with progress:', progressValue, 'for', item.title);
      
      return (
        <View style={styles.goalContainer}>
          <TouchableOpacity 
            style={styles.goalItem} 
            onPress={() => {
              console.log('Navigation to GoalDetail');
              navigation.navigate('GoalDetail', { goal: item });
            }}
          >
            <Text style={styles.goalTitle}>{item.title}</Text>
            <Text style={styles.goalDescription}>{item.description || 'Sin descripción'}</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progressValue * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% completado</Text>
          </TouchableOpacity>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('CreateGoal', { goal: item })}
            >
              <Text style={styles.buttonText}>✎ Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.duplicateButton} 
              onPress={() => handleDuplicate(item)}
            >
              <Text style={styles.buttonText}>⊕ Duplicar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleDelete(item.id, item.title)}
            >
              <Text style={styles.buttonText}>✕ Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } catch (error) {
      console.error('Error in renderGoal:', error, item);
      return (
        <View style={styles.goalItem}>
          <Text style={styles.goalTitle}>{item?.title || 'Sin título'}</Text>
          <Text style={{ color: 'red' }}>Error: {error.message}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Objetivos</Text>
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={(item, index) => {
          const key = item && item.id ? item.id.toString() : `goal-${index}`;
          console.log('Key extractor returning:', key, 'for item:', item?.id);
          return key;
        }}
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
  goalContainer: { marginBottom: 15, borderRadius: 8, overflow: 'hidden', backgroundColor: '#f9f9f9' },
  goalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  goalTitle: { fontSize: 18, fontWeight: 'bold' },
  goalDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  progressBarContainer: { 
    height: 10, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 5, 
    overflow: 'hidden',
    marginVertical: 8
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#4caf50' 
  },
  progressText: { fontSize: 12, color: '#999' },
  actionButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  editButton: { 
    flex: 1,
    backgroundColor: '#17a2b8', 
    padding: 10, 
    alignItems: 'center', 
    marginHorizontal: 3,
    borderRadius: 4
  },
  duplicateButton: { 
    flex: 1,
    backgroundColor: '#6c757d', 
    padding: 10, 
    alignItems: 'center', 
    marginHorizontal: 3,
    borderRadius: 4
  },
  deleteButton: { 
    flex: 1,
    backgroundColor: '#dc3545', 
    padding: 10, 
    alignItems: 'center', 
    marginHorizontal: 3,
    borderRadius: 4
  },
  buttonText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  addButton: { backgroundColor: '#28a745', padding: 15, alignItems: 'center', marginTop: 20, borderRadius: 4 },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;