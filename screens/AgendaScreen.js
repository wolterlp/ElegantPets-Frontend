import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card, Button, FAB, TextInput, IconButton } from 'react-native-paper';
import { LocaleConfig, Calendar } from 'react-native-calendars';

// Configure Locale for Calendar if needed
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr.','May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const COLORS = { gold: '#d4af37', black: '#000000', white: '#ffffff' };

export default function AgendaScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState({
      '2024-12-29': [{ id: 1, time: '10:00 AM', patient: 'Firulais', service: 'Baño' }],
      '2024-12-30': [{ id: 2, time: '14:00 PM', patient: 'Luna', service: 'Vacuna' }]
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [newAppt, setNewAppt] = useState({ time: '', patient: '', service: '' });

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addAppointment = () => {
    if (!newAppt.time || !newAppt.patient) return;
    
    const currentList = appointments[selectedDate] || [];
    setAppointments({
        ...appointments,
        [selectedDate]: [...currentList, { id: Math.random(), ...newAppt }]
    });
    setModalVisible(false);
    setNewAppt({ time: '', patient: '', service: '' });
    Alert.alert('Agendado', 'Cita creada exitosamente');
  };

  const dayAppointments = appointments[selectedDate] || [];

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: COLORS.gold },
          // Mark days with dots if they have appointments
          ...Object.keys(appointments).reduce((acc, date) => ({
             ...acc, [date]: { marked: true, dotColor: COLORS.gold, selected: date === selectedDate, selectedColor: date === selectedDate ? COLORS.gold : undefined }
          }), {})
        }}
        theme={{
            todayTextColor: COLORS.gold,
            arrowColor: COLORS.gold,
        }}
      />
      
      <View style={styles.listContainer}>
          <Text variant="titleMedium" style={styles.dateTitle}>Citas para: {selectedDate}</Text>
          <ScrollView>
             {dayAppointments.length === 0 ? (
                 <Text style={{ textAlign: 'center', marginTop: 20, color: '#777' }}>No hay citas para hoy.</Text>
             ) : (
                 dayAppointments.map(appt => (
                     <Card key={appt.id} style={styles.card}>
                         <Card.Content>
                             <Text style={styles.time}>{appt.time}</Text>
                             <Text style={styles.patient}>{appt.patient}</Text>
                             <Text style={styles.service}>{appt.service}</Text>
                         </Card.Content>
                     </Card>
                 ))
             )}
          </ScrollView>
      </View>

      <FAB
        icon="plus"
        label="Agendar Cita"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

       <Modal
            visible={modalVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setModalVisible(false)}
        >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.modalHeader}>
                    <Text variant="titleLarge">Nueva Cita ({selectedDate})</Text>
                    <IconButton icon="close" onPress={() => setModalVisible(false)} />
                </View>
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <TextInput label="Hora (ej: 10:00 AM)" value={newAppt.time} onChangeText={t => setNewAppt({...newAppt, time: t})} style={styles.input} mode="outlined" />
                    <TextInput label="Paciente" value={newAppt.patient} onChangeText={t => setNewAppt({...newAppt, patient: t})} style={styles.input} mode="outlined" />
                    <TextInput label="Servicio" value={newAppt.service} onChangeText={t => setNewAppt({...newAppt, service: t})} style={styles.input} mode="outlined" />
                    
                    <Button mode="contained" onPress={addAppointment} style={styles.saveButton}>GUARDAR</Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f9f9f9'
  },
  dateTitle: {
      marginBottom: 10,
      fontWeight: 'bold',
      textAlign: 'center'
  },
  card: {
      marginBottom: 10,
      backgroundColor: '#fff',
      borderLeftWidth: 4,
      borderLeftColor: COLORS.gold
  },
  time: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.black
  },
  patient: {
      fontSize: 16,
      color: '#333'
  },
  service: {
      fontSize: 14,
      color: '#666'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.gold,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: COLORS.gold,
  }
});
