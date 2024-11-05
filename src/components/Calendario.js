import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, History } from 'lucide-react-native';

const CalendarioCRUD = () => {
  const [eventos, setEventos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({ nombre: '', descripcion: '', fecha: '', historial: [] });
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [editandoEventoId, setEditandoEventoId] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [historialModalVisible, setHistorialModalVisible] = useState(false);

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const eventosGuardados = await AsyncStorage.getItem('eventos');
      if (eventosGuardados) {
        setEventos(JSON.parse(eventosGuardados));
      }
      const historialGuardado = await AsyncStorage.getItem('historial');
      if (historialGuardado) {
        setHistorial(JSON.parse(historialGuardado));
      }
    } catch (error) {
      console.log('Error al cargar eventos:', error);
    }
  };

  const guardarEventos = async (eventosActualizados, historialActualizado) => {
    try {
      await AsyncStorage.setItem('eventos', JSON.stringify(eventosActualizados));
      await AsyncStorage.setItem('historial', JSON.stringify(historialActualizado));
    } catch (error) {
      console.log('Error al guardar eventos:', error);
    }
  };

  const manejarGuardarEvento = () => {
    if (!nuevoEvento.nombre || !nuevoEvento.descripcion || !nuevoEvento.fecha) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const timestamp = new Date().toISOString();
    let cambios = [];
    const nuevoHistorial = editandoEventoId
      ? [...nuevoEvento.historial]
      : [{ accion: 'Creado', fecha: timestamp }];

    if (editandoEventoId) {
      const eventoOriginal = eventos.find((evento) => evento.id === editandoEventoId);

      if (eventoOriginal.nombre !== nuevoEvento.nombre) {
        cambios.push(`Nombre cambiado de "${eventoOriginal.nombre}" a "${nuevoEvento.nombre}"`);
      }
      if (eventoOriginal.descripcion !== nuevoEvento.descripcion) {
        cambios.push(`Descripción cambiada de "${eventoOriginal.descripcion}" a "${nuevoEvento.descripcion}"`);
      }
      if (eventoOriginal.fecha !== nuevoEvento.fecha) {
        cambios.push(`Fecha cambiada de "${eventoOriginal.fecha}" a "${nuevoEvento.fecha}"`);
      }
      nuevoHistorial.push({ accion: 'Editado', cambios, fecha: timestamp });
    }

    const eventoActualizado = { ...nuevoEvento, historial: nuevoHistorial };
    let eventosActualizados;
    let historialActualizado = [...historial];

    if (editandoEventoId) {
      eventosActualizados = eventos.map((evento) =>
        evento.id === editandoEventoId ? eventoActualizado : evento
      );
      historialActualizado.push({
        accion: 'Editado',
        evento: nuevoEvento.nombre,
        cambios,
        fecha: timestamp,
      });
    } else {
      eventosActualizados = [...eventos, { ...eventoActualizado, id: Date.now() }];
      historialActualizado.push({
        accion: 'Agregado',
        evento: nuevoEvento.nombre,
        cambios: [],
        fecha: timestamp,
      });
    }

    setEventos(eventosActualizados);
    setHistorial(historialActualizado);
    guardarEventos(eventosActualizados, historialActualizado);
    setNuevoEvento({ nombre: '', descripcion: '', fecha: '', historial: [] });
    setModalVisible(false);
    setEditandoEventoId(null);
  };

  const onChangeFecha = (event, selectedDate) => {
    const currentDate = selectedDate || fechaSeleccionada;
    setMostrarDatePicker(false);
    setFechaSeleccionada(currentDate);
    setNuevoEvento({ ...nuevoEvento, fecha: currentDate.toISOString().split('T')[0] });
  };

  const eliminarEvento = (id, nombre) => {
    const eventosActualizados = eventos.filter(evento => evento.id !== id);
    const timestamp = new Date().toISOString();
    const historialActualizado = [
      ...historial,
      { accion: 'Eliminado', evento: nombre, cambios: [], fecha: timestamp }
    ];
    guardarEventos(eventosActualizados, historialActualizado);
    setEventos(eventosActualizados);
    setHistorial(historialActualizado);
  };

  const abrirModalParaEdicion = (evento) => {
    setNuevoEvento(evento);
    setEditandoEventoId(evento.id);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de Eventos</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.evento}>
            <Text style={styles.eventoTexto}>Nombre: {item.nombre}</Text>
            <Text style={styles.eventoTexto}>Descripción: {item.descripcion}</Text>
            <Text style={styles.eventoTexto}>Fecha: {item.fecha}</Text>
            <View style={styles.botonContainer}>
              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => abrirModalParaEdicion(item)}
              >
                <Text style={styles.botonTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => eliminarEvento(item.id, item.nombre)}
              >
                <Text style={styles.botonTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.botonHistorial}
        onPress={() => setHistorialModalVisible(true)}
      >
        <History color="#fff" size={24} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => {
          setNuevoEvento({ nombre: '', descripcion: '', fecha: '', historial: [] });
          setEditandoEventoId(null);
          setModalVisible(true);
        }}
      >
        <Plus color="#fff" size={24} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>{editandoEventoId ? 'Editar Evento' : 'Agregar Evento'}</Text>
            </View>
            <Text style={styles.label}>Nombre del Evento</Text>
            <TextInput
              placeholder="Ingresa el nombre del evento"
              style={styles.input}
              value={nuevoEvento.nombre}
              onChangeText={(text) => setNuevoEvento({ ...nuevoEvento, nombre: text })}
            />
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              placeholder="Ingresa la descripción del evento"
              style={styles.input}
              value={nuevoEvento.descripcion}
              onChangeText={(text) => setNuevoEvento({ ...nuevoEvento, descripcion: text })}
              multiline
            />
            <TouchableOpacity onPress={() => setMostrarDatePicker(true)}>
              <Text style={styles.fechaTexto}>
                {nuevoEvento.fecha ? `Fecha: ${nuevoEvento.fecha}` : 'Seleccionar Fecha'}
              </Text>
            </TouchableOpacity>

            {mostrarDatePicker && (
              <DateTimePicker
                value={fechaSeleccionada}
                mode="date"
                display="default"
                onChange={onChangeFecha}
              />
            )}

            <TouchableOpacity style={styles.botonGuardar} onPress={manejarGuardarEvento}>
              <Text style={styles.textoBotonGuardar}>{editandoEventoId ? 'Guardar Cambios' : 'Guardar Evento'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonCancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={historialModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Historial de Modificaciones</Text>
            <ScrollView style={styles.historialScroll}>
              {historial.map((item, index) => (
                <View key={index} style={styles.historialEntry}>
                  <Text style={styles.historialTexto}>{item.accion} - {item.evento}</Text>
                  <Text style={styles.historialFecha}>{new Date(item.fecha).toLocaleString()}</Text>
                  {item.cambios && item.cambios.map((cambio, idx) => (
                    <Text key={idx} style={styles.cambioDetalle}>• {cambio}</Text>
                  ))}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.botonCerrarHistorial} onPress={() => setHistorialModalVisible(false)}>
              <Text style={styles.textoBotonCerrar}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};












const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a9f4d',
    textAlign: 'center',
  },
  evento: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventoTexto: {
    fontSize: 16,
  },
  botonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonEditar: {
    backgroundColor: '#4a9f4d',
    padding: 10,
    borderRadius: 5,
  },
  botonEliminar: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 5,
  },
  botonesInferiores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  botonAgregar: {
    backgroundColor: '#4a9f4d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  botonHistorial: {
    backgroundColor: '#4a9f4d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#4a9f4d',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  fechaTexto: {
    color: '#4a9f4d',
    textAlign: 'center',
    marginBottom: 10,
  },
  botonGuardar: {
    backgroundColor: '#4a9f4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBotonGuardar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonCancelar: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotonCancelar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historialEntry: {
    marginBottom: 10,
  },
  historialTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historialFecha: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  cambioDetalle: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  botonCerrarHistorial: {
    backgroundColor: '#4a9f4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotonCerrar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a9f4d',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  fechaTexto: {
    color: '#4a9f4d',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  botonGuardar: {
    backgroundColor: '#4a9f4d',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotonGuardar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonCancelar: {
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotonCancelar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  botonCerrarHistorial: {
    backgroundColor: '#4a9f4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotonCerrar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  historialScroll: {
    maxHeight: '80%',
    marginBottom: 10,
  },
  botonHistorial: {
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
  botonAgregar: {
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
  botonCerrarHistorial: {
    backgroundColor: '#4a9f4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default CalendarioCRUD;
