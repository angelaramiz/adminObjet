// screens/CreateGoalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveGoal, updateGoal } from '../database/goalService';
import { parseGoalFromJSON } from '../utils/llmFormat';

const CreateGoalScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    if (route?.params?.goal) {
      const goal = route.params.goal;
      setEditingGoal(goal);
      setIsEditing(true);
      setTitle(goal.title);
      setDescription(goal.description);
    }
  }, [route?.params?.goal]);

  const handleSave = async () => {
    try {
      let goal;
      
      if (isEditing && editingGoal) {
        // Update existing goal
        editingGoal.title = title;
        editingGoal.description = description;
        console.log('Updating goal:', editingGoal.id);
        await updateGoal(editingGoal);
        Alert.alert('Éxito', 'Objetivo actualizado correctamente');
      } else {
        // Create new goal
        if (jsonInput.trim()) {
          goal = parseGoalFromJSON(jsonInput);
        } else {
          Alert.alert('Error', 'Por favor, ingresa el JSON generado por LLM o edita un objetivo existente');
          return;
        }
        console.log('Saving new goal:', goal);
        await saveGoal(goal);
        Alert.alert('Éxito', 'Objetivo guardado correctamente');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('Error', error.message || 'Error al guardar el objetivo');
    }
  };

  const headerText = isEditing ? `Editar: ${editingGoal?.title}` : 'Crear Nuevo Objetivo';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{headerText}</Text>
      
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
      
      {!isEditing && (
        <>
          <Text style={styles.label}>Pega el JSON generado por LLM:</Text>
          <TextInput
            style={[styles.input, { height: 200 }]}
            placeholder='{"title": "...", "description": "...", "stages": [...]}'
            value={jsonInput}
            onChangeText={setJsonInput}
            multiline
          />
        </>
      )}
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{isEditing ? 'Actualizar' : 'Guardar'}</Text>
      </TouchableOpacity>
      
      {isEditing && (
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 10, fontWeight: '600' },
  saveButton: { backgroundColor: '#28a745', padding: 15, alignItems: 'center', borderRadius: 4, marginBottom: 10 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#6c757d', padding: 15, alignItems: 'center', borderRadius: 4 },
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default CreateGoalScreen;