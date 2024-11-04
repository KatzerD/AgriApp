import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Plus, AlertTriangle, X, Filter, List } from 'lucide-react-native';

const initialInventory = [
  { id: '1', name: 'Soja', quantity: 120, date: '2024-01-10', threshold: 50 },
  { id: '2', name: 'Maíz', quantity: 30, date: '2024-02-15', threshold: 50 },
  { id: '3', name: 'Trigo', quantity: 75, date: '2024-03-20', threshold: 50 },
];

const GrainForm = ({ visible, onClose, onSubmit, editingGrain }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [threshold, setThreshold] = useState('');

  useEffect(() => {
    if (editingGrain) {
      setName(editingGrain.name || '');
      setQuantity(editingGrain.quantity ? editingGrain.quantity.toString() : '');
      setThreshold(editingGrain.threshold ? editingGrain.threshold.toString() : '');
    } else {
      setName('');
      setQuantity('');
      setThreshold('');
    }
  }, [editingGrain]);

  const handleSubmit = () => {
    if (name && quantity && threshold) {
      onSubmit({
        id: editingGrain ? editingGrain.id : Date.now().toString(),
        name,
        quantity: parseInt(quantity),
        date: editingGrain ? editingGrain.date : new Date().toISOString().split('T')[0],
        threshold: parseInt(threshold),
      });
      onClose();
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#4a9f4d" size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{editingGrain ? 'Editar Grano' : 'Agregar Nuevo Grano'}</Text>
          <Text style={styles.label}>Nombre del grano:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Trigo"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Cantidad (kg):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 100"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Umbral de alerta (kg):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 50"
            value={threshold}
            onChangeText={setThreshold}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const GrainList = ({ inventory, onEdit, onDelete }) => {
  const getProgressColor = (quantity, threshold) => {
    if (quantity <= threshold) return '#ff6b6b';
    if (quantity <= threshold * 2) return '#feca57';
    return '#4a9f4d';
  };

  const confirmDelete = (id, name) => {
    Alert.alert(
      'Confirmación de Eliminación',
      `¿Estás seguro de que quieres eliminar el grano ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(id, name) },
      ]
    );
  };

  return (
    <ScrollView style={styles.listContainer}>
      {inventory.map((grain) => (
        <View key={grain.id} style={styles.grainItem}>
          <Text style={styles.grainName}>{grain.name}</Text>
          <Text style={styles.grainQuantity}>{grain.quantity} kg</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.min((grain.quantity / (grain.threshold * 3)) * 100, 100)}%`,
                  backgroundColor: getProgressColor(grain.quantity, grain.threshold),
                },
              ]}
            />
          </View>
          <Text style={styles.grainDate}>Último registro: {grain.date}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => onEdit(grain)}>
              <Text style={styles.editButton}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(grain.id, grain.name)}>
              <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const AlertSystem = ({ inventory }) => {
  const lowStockGrains = inventory.filter((grain) => grain.quantity <= grain.threshold);

  if (lowStockGrains.length === 0) return null;

  return (
    <View style={styles.alertContainer}>
      <AlertTriangle color="#ff6b6b" size={24} />
      <Text style={styles.alertText}>
        ¡Alerta! Stock bajo para: {lowStockGrains.map((grain) => grain.name).join(', ')}
      </Text>
    </View>
  );
};

export default function InventoryScreen() {
  const [inventory, setInventory] = useState(initialInventory);
  const [modalVisible, setModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [editingGrain, setEditingGrain] = useState(null);
  const [history, setHistory] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [showLowStock, setShowLowStock] = useState(false);

  const addOrUpdateGrain = (newGrain) => {
    if (editingGrain) {
      // Identificar cambios entre los datos viejos y los nuevos
      const changes = [];
      if (editingGrain.name !== newGrain.name) {
        changes.push(`Nombre cambiado de "${editingGrain.name}" a "${newGrain.name}"`);
      }
      if (editingGrain.quantity !== newGrain.quantity) {
        changes.push(`Cantidad cambiada de ${editingGrain.quantity} kg a ${newGrain.quantity} kg`);
      }
      if (editingGrain.threshold !== newGrain.threshold) {
        changes.push(`Umbral cambiado de ${editingGrain.threshold} kg a ${newGrain.threshold} kg`);
      }

      setHistory((prevHistory) => [
        ...prevHistory,
        { action: 'Editado', grain: newGrain.name, changes, date: new Date().toLocaleString() },
      ]);

      // Actualizar el inventario con los nuevos datos
      setInventory((prevInventory) =>
        prevInventory.map((item) => (item.id === newGrain.id ? newGrain : item))
      );
    } else {
      setInventory((prevInventory) => [...prevInventory, newGrain]);
      setHistory((prevHistory) => [
        ...prevHistory,
        { action: 'Agregado', grain: newGrain.name, changes: [], date: new Date().toLocaleString() },
      ]);
    }

    setEditingGrain(null);
  };

  const deleteGrain = (id, name) => {
    setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
    setHistory((prevHistory) => [
      ...prevHistory,
      { action: 'Eliminado', grain: name, changes: [], date: new Date().toLocaleString() },
    ]);
  };

  const startEditGrain = (grain) => {
    setEditingGrain(grain);
    setModalVisible(true);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setInventory((prevInventory) =>
      [...prevInventory].sort((a, b) => (sortOrder === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity))
    );
  };

  const toggleLowStockFilter = () => {
    setShowLowStock(!showLowStock);
  };

  const filteredInventory = showLowStock ? inventory.filter((grain) => grain.quantity <= grain.threshold) : inventory;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario de Granos</Text>
      <AlertSystem inventory={inventory} />

      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={toggleSortOrder}>
          <List color="#4a9f4d" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleLowStockFilter}>
          <Filter color="#4a9f4d" size={24} />
        </TouchableOpacity>
      </View>

      <GrainList inventory={filteredInventory} onEdit={startEditGrain} onDelete={deleteGrain} />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Plus color="#fff" size={24} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.historyButton} onPress={() => setHistoryModalVisible(true)}>
        <Text style={styles.historyButtonText}>H</Text>
      </TouchableOpacity>

      <GrainForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addOrUpdateGrain}
        editingGrain={editingGrain}
      />

      {/* Modal para Historial de Cambios */}
      <Modal visible={historyModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setHistoryModalVisible(false)}>
              <X color="#4a9f4d" size={24} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Historial de Cambios</Text>
            <ScrollView>
              {history.map((entry, index) => (
                <View key={index} style={styles.historyEntry}>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                  <Text>{`${entry.action} - ${entry.grain}`}</Text>
                  {entry.changes.map((change, i) => (
                    <Text key={i} style={styles.changeDetail}>• {change}</Text>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}









  //Style, no se toca ojo..
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#4a9f4d',
      textAlign: 'center',
    },
    listContainer: {
      flex: 1,
    },
    grainItem: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
    },
    grainName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    grainQuantity: {
      fontSize: 16,
      color: '#666',
      marginTop: 5,
    },
    progressBarContainer: {
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
      marginTop: 10,
    },
    progressBar: {
      height: '100%',
      borderRadius: 5,
    },
    grainDate: {
      fontSize: 14,
      color: '#999',
      marginTop: 5,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    editButton: {
      color: '#4a9f4d',
      fontWeight: 'bold',
    },
    deleteButton: {
      color: '#ff6b6b',
      fontWeight: 'bold',
    },
    addButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: '#4a9f4d',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '80%',
    },
    closeButton: {
      alignSelf: 'flex-end',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#4a9f4d',
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    submitButton: {
      backgroundColor: '#4a9f4d',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    alertContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff3cd',
      borderColor: '#ffeeba',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
    },
    alertText: {
      marginLeft: 10,
      color: '#856404',
      flex: 1,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 10,
    },
    addButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: '#4a9f4d',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    historyButton: {
      position: 'absolute',
      right: 90,
      bottom: 20,
      backgroundColor: '#4a9f4d',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    historyButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    historyEntry: {
      marginBottom: 10,
    },
    historyDate: {
      fontWeight: 'bold',
    },
    changeDetail: {
      marginLeft: 10,
      color: '#555',
    },
  });
