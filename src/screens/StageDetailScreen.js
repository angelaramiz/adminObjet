// screens/StageDetailScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const StageDetailScreen = ({ route }) => {
  const { stage } = route.params;
  const [tasks, setTasks] = useState(stage.tasks);

  const handleUploadEvidence = async (task) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      task.evidence = result.assets[0].uri;
      // Update in DB (simplified, assume update function)
      setTasks([...tasks]);
      Alert.alert('Éxito', 'Evidencia subida');
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={() => handleUploadEvidence(item)}>
        <Text style={styles.uploadButtonText}>Subir Evidencia</Text>
      </TouchableOpacity>
      {item.evidence && <Text>Evidencia subida</Text>}
    </View>
  );

  const stageProgress = stage.getProgress();
  const stageProgressValue = Math.min(Math.max(stageProgress / 100, 0), 1);
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{stage.title}</Text>
      <Text style={styles.description}>{stage.description}</Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${stageProgressValue * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{Math.round(stageProgress)}% completado</Text>
      <Text style={styles.subHeader}>Tareas:</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
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
  progressText: { marginBottom: 20, fontSize: 12, color: '#999' },
  subHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  taskItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  taskTitle: { fontSize: 18, fontWeight: 'bold' },
  taskDescription: { fontSize: 14, color: '#666', marginBottom: 10 },
  uploadButton: { backgroundColor: '#007bff', padding: 10, alignItems: 'center', borderRadius: 5 },
  uploadButtonText: { color: 'white' },
});

export default StageDetailScreen;