// screens/GoalDetailScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const GoalDetailScreen = ({ route, navigation }) => {
  const { goal } = route.params;

  const renderStage = ({ item }) => {
    const progress = item.getProgress();
    const progressValue = Math.min(Math.max(progress / 100, 0), 1);
    return (
      <TouchableOpacity style={styles.stageItem} onPress={() => navigation.navigate('StageDetail', { stage: item })}>
        <Text style={styles.stageTitle}>{item.title}</Text>
        <Text style={styles.stageDescription}>{item.description}</Text>
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
    );
  };

  const goalProgress = goal.getProgress();
  const goalProgressValue = Math.min(Math.max(goalProgress / 100, 0), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{goal.title}</Text>
      <Text style={styles.description}>{goal.description}</Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${goalProgressValue * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressTextCenter}>{Math.round(goalProgress)}% completado</Text>
      <Text style={styles.subHeader}>Etapas:</Text>
      <FlatList
        data={goal.stages}
        renderItem={renderStage}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  progressBarContainer: { 
    height: 10, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 5, 
    overflow: 'hidden',
    marginBottom: 10
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#4caf50' 
  },
  progressTextCenter: { textAlign: 'center', marginBottom: 20 },
  progressText: { fontSize: 12, color: '#999', marginTop: 8 },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  stageItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  stageTitle: { fontSize: 18, fontWeight: 'bold' },
  stageDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
});

export default GoalDetailScreen;