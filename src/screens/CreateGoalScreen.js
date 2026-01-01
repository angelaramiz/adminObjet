// screens/CreateGoalScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { saveGoal, updateGoal } from '../database/goalService';
import { parseGoalFromJSON } from '../utils/llmFormat';

const TEMPLATE = {
  title: "Título del Objetivo",
  description: "Descripción detallada del objetivo",
  stages: [
    {
      title: "Etapa 1: Preparación",
      description: "Descripción de la etapa",
      tasks: [
        {
          title: "Tarea 1",
          description: "Descripción de la tarea"
        },
        {
          title: "Tarea 2",
          description: "Descripción de la tarea"
        }
      ]
    },
    {
      title: "Etapa 2: Ejecución",
      description: "Descripción de la etapa",
      tasks: [
        {
          title: "Tarea 1",
          description: "Descripción de la tarea"
        }
      ]
    }
  ]
};

const CreateGoalScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showTemplate, setShowTemplate] = useState(false);

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

  const handleCopyTemplate = () => {
    const templateJson = JSON.stringify(TEMPLATE, null, 2);
    setJsonInput(templateJson);
    Alert.alert('Éxito', 'Plantilla copiada');
  };

  const headerText = isEditing ? `Editar: ${editingGoal?.title}` : 'Crear Nuevo Objetivo';

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
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
          
          <View style={styles.templateSection}>
            <TouchableOpacity 
              style={styles.templateToggle}
              onPress={() => setShowTemplate(!showTemplate)}
            >
              <Text style={styles.templateToggleText}>
                {showTemplate ? '▼' : '▶'} Ver Plantilla de Formato
              </Text>
            </TouchableOpacity>
            
            {showTemplate && (
              <View style={styles.templateContent}>
                <Text style={styles.templateTitle}>Estructura esperada:</Text>
                <Text style={styles.templateCode}>{JSON.stringify(TEMPLATE, null, 2)}</Text>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={handleCopyTemplate}
                >
                  <Text style={styles.copyButtonText}>📋 Copiar Plantilla</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TextInput
            style={[styles.input, { height: 200 }]}
            placeholder='Pega aquí el JSON...'
            value={jsonInput}
            onChangeText={setJsonInput}
            multiline
            placeholderTextColor="#aaa"
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 10, fontWeight: '600' },
  templateSection: {
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8'
  },
  templateToggle: {
    padding: 12,
    justifyContent: 'center'
  },
  templateToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#17a2b8'
  },
  templateContent: {
    padding: 12,
    paddingTop: 0,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8

  },
  templateTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  templateCode: {
    fontFamily: 'monospace',
    fontSize: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
    color: '#333',
    marginBottom: 10,
    maxHeight: 200
  },
  copyButton: {
    backgroundColor: '#17a2b8',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4
  },
  copyButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold'
  },
  saveButton: { backgroundColor: '#28a745', padding: 15, alignItems: 'center', borderRadius: 4, marginBottom: 10 },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { backgroundColor: '#6c757d', padding: 15, alignItems: 'center', borderRadius: 4 },
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default CreateGoalScreen;