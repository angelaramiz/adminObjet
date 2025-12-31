// screens/GoalDetailScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-progress';

const GoalDetailScreen = ({ route, navigation }) => {
  const { goal } = route.params;

  const renderStage = ({ item }) => (
    <TouchableOpacity style={styles.stageItem} onPress={() => navigation.navigate('StageDetail', { stage: item })}>
      <Text style={styles.stageTitle}>{item.title}</Text>
      <Text style={styles.stageDescription}>{item.description}</Text>
      <ProgressBar progress={item.getProgress() / 100} width={null} />
      <Text>{Math.round(item.getProgress())}% completado</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{goal.title}</Text>
      <Text style={styles.description}>{goal.description}</Text>
      <ProgressBar progress={goal.getProgress() / 100} width={null} style={styles.progressBar} />
      <Text style={styles.progressText}>{Math.round(goal.getProgress())}% completado</Text>
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
  progressBar: { marginBottom: 10 },
  progressText: { textAlign: 'center', marginBottom: 20 },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  stageItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  stageTitle: { fontSize: 18, fontWeight: 'bold' },
  stageDescription: { fontSize: 14, color: '#666' },
});

export default GoalDetailScreen;