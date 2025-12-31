// screens/CreateGoalScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveGoal } from '../database/goalService';
import { parseGoalFromJSON } from '../utils/llmFormat';

const CreateGoalScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jsonInput, setJsonInput] = useState('');

  const handleSave = async () => {
    try {
      let goal;
      if (jsonInput.trim()) {
        goal = parseGoalFromJSON(jsonInput);
      } else {
        // Create basic goal, but for now, require JSON or add manual creation
        Alert.alert('Error', 'Por favor, ingresa el JSON generado por LLM');
        return;
      }
      await saveGoal(goal);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crear Nuevo Objetivo</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Pega el JSON generado por LLM:</Text>
      <TextInput
        style={[styles.input, { height: 200 }]}
        placeholder='{"title": "...", "description": "...", "stages": [...]}'
        value={jsonInput}
        onChangeText={setJsonInput}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  label: { fontSize: 16, marginBottom: 10 },
  saveButton: { backgroundColor: '#28a745', padding: 15, alignItems: 'center' },
  saveButtonText: { color: 'white', fontSize: 16 },
});

export default CreateGoalScreen;