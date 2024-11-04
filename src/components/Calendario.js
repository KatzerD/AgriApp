import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Seed, Droplet, Flask, Wheat, X, Corn, Soybean } from 'lucide-react-native';

// Datos de ejemplo para eventos
const eventosIniciales = [
  { id: 1, fecha: '2023-05-15', cultivo: 'Soja', tipo: 'Siembra', observaciones: 'Parcela A' },
  { id: 2, fecha: '2023-05-20', cultivo: 'Maíz', tipo: 'Riego', observaciones: 'Parcela B' },
  { id: 3, fecha: '2023-06-01', cultivo: 'Trigo', tipo: 'Fertilización', observaciones: 'Parcela C' },
  { id: 4, fecha: '2023-09-10', cultivo: 'Soja', tipo: 'Cosecha', observaciones: 'Parcela A' },
];

const tiposDeEvento = [
  { etiqueta: 'Siembra', valor: 'Siembra', icono: Seed },
  { etiqueta: 'Riego', valor: 'Riego', icono: Droplet },
  { etiqueta: 'Fertilización', valor: 'Fertilización', icono: Flask },
  { etiqueta: 'Cosecha', valor: 'Cosecha', icono: Wheat },
];

const iconosDeCultivo = {
  'Soja': Soybean,
  'Maíz': Corn,
  'Trigo': Wheat,
};

const FormularioEvento = ({ visible, onClose, onSubmit, fechaSeleccionada }) => {
  const [cultivo, setCultivo] = useState('');
  const [tipo, setTipo] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const manejarEnvio = () => {
    if (cultivo && tipo) {
      onSubmit({
        id: Date.now(),
        fecha: fechaSeleccionada,
        cultivo,
        tipo,
        observaciones,
      });
      setCultivo('');
      setTipo('');
      setObservaciones('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={estilos.modalContenedor}>
        <View style={estilos.modalContenido}>
          <TouchableOpacity style={estilos.botonCerrar} onPress={onClose}>
            <X color="#4a9f4d" size={24} />
          </TouchableOpacity>
          <Text style={estilos.tituloModal}>Agregar Evento</Text>
          <TextInput
            style={estilos.input}
            placeholder="Nombre del cultivo"
            value={cultivo}
            onChangeText={setCultivo}
          />
          <View style={estilos.contenedorTipo}>
            {tiposDeEvento.map((tipoEvento) => (
              <TouchableOpacity
                key={tipoEvento.valor}
                style={[
                  estilos.botonTipo,
                  tipo === tipoEvento.valor && estilos.botonTipoSeleccionado,
                ]}
                onPress={() => setTipo(tipoEvento.valor)}
              >
                <tipoEvento.icono
                  color={tipo === tipoEvento.valor ? '#fff' : '#4a9f4d'}
                  size={24}
                />
                <Text
                  style={[
                    estilos.textoBotonTipo,
                    tipo === tipoEvento.valor && estilos.textoBotonTipoSeleccionado,
                  ]}
                >
                  {tipoEvento.etiqueta}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={estilos.input}
            placeholder="Observaciones"
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
          />
          <TouchableOpacity style={estilos.botonEnviar} onPress={manejarEnvio}>
            <Text style={estilos.textoBotonEnviar}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ListaEventos = ({ eventos }) => {
  const obtenerIconoEvento = (tipo, cultivo) => {
    if (iconosDeCultivo[cultivo]) {
      return iconosDeCultivo[cultivo];
    }
    const tipoEvento = tiposDeEvento.find((te) => te.valor === tipo);
    return tipoEvento ? tipoEvento.icono : null;
  };

  return (
    <ScrollView style={estilos.contenedorListaEventos}>
      <Text style={estilos.tituloListaEventos}>Próximos Eventos</Text>
      {eventos.map((evento) => {
        const IconoEvento = obtenerIconoEvento(evento.tipo, evento.cultivo);
        return (
          <View key={evento.id} style={estilos.itemEvento}>
            {IconoEvento && <IconoEvento color="#4a9f4d" size={24} style={estilos.iconoEvento} />}
            <View style={estilos.detallesEvento}>
              <Text style={estilos.fechaEvento}>{evento.fecha}</Text>
              <Text style={estilos.cultivoEvento}>{evento.cultivo}</Text>
              <Text style={estilos.tipoEvento}>{evento.tipo}</Text>
              {evento.observaciones && <Text style={estilos.observacionesEvento}>{evento.observaciones}</Text>}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default function PantallaCalendario() {
  const [eventos, setEventos] = useState(eventosIniciales);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const agregarEvento = (nuevoEvento) => {
    setEventos([...eventos, nuevoEvento]);
  };

  const fechasMarcadas = eventos.reduce((acc, evento) => {
    acc[evento.fecha] = { marked: true, dotColor: '#4a9f4d' };
    return acc;
  }, {});

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Calendario de Siembra y Cosecha</Text>
      <Calendar
        onDayPress={(dia) => {
          setFechaSeleccionada(dia.dateString);
          setModalVisible(true);
        }}
        markedDates={fechasMarcadas}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#4a9f4d',
          selectedDayBackgroundColor: '#4a9f4d',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#4a9f4d',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#4a9f4d',
          selectedDotColor: '#ffffff',
          arrowColor: '#4a9f4d',
          monthTextColor: '#4a9f4d',
          indicatorColor: '#4a9f4d',
        }}
      />
      <ListaEventos eventos={eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))} />
      <FormularioEvento
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={agregarEvento}
        fechaSeleccionada={fechaSeleccionada}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
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
  modalContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContenido: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  botonCerrar: {
    alignSelf: 'flex-end',
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4a9f4d',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  contenedorTipo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  botonTipo: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#4a9f4d',
    borderRadius: 5,
  },
  botonTipoSeleccionado: {
    backgroundColor: '#4a9f4d',
  },
  textoBotonTipo: {
    color: '#4a9f4d',
    marginTop: 5,
  },
  textoBotonTipoSeleccionado: {
    color: '#fff',
  },
  botonEnviar: {
    backgroundColor: '#4a9f4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBotonEnviar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contenedorListaEventos: {
    marginTop: 20,
  },
  tituloListaEventos: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a9f4d',
  },
  itemEvento: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconoEvento: {
    marginRight: 10,
  },
  detallesEvento: {
    flex: 1,
  },
  fechaEvento: {
    fontWeight: 'bold',
  },
  cultivoEvento: {
    fontStyle: 'italic',
  },
  tipoEvento: {
    color: '#555',
  },
  observacionesEvento: {
    color: '#777',
  },
});
