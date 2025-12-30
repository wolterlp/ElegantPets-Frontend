import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Card, Button, Searchbar, FAB, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { clinicalHistoryApi } from '../services/api';

const COLORS = { gold: '#d4af37', black: '#000000', white: '#ffffff', background: '#f4f4f4' };

export default function HistoriaClinicaScreen() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [formData, setFormData] = useState({
      patientName: '',
      date: new Date().toISOString().split('T')[0],
      motive: '',
      diagnosis: '',
      treatment: ''
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
        await new Promise(r => setTimeout(r, 500)); // Simulating network
        // Mock Data
        setHistory([
            { id: 1, patientName: 'Firulais', date: '2024-12-28', motive: 'Control General', diagnosis: 'Paciente sano', treatment: 'Dieta balanceada' },
            { id: 2, patientName: 'Luna', date: '2024-11-15', motive: 'Vacunación', diagnosis: 'Saludable', treatment: 'Rabia y Moquillo' }
        ]);
    } catch (e) {
        Alert.alert('Error', 'Error cargando historial');
    } finally {
        setLoading(false);
    }
  };

  const handleSave = () => {
      // Mock Save
      const newEntry = { id: Math.random(), ...formData };
      setHistory([newEntry, ...history]);
      setModalVisible(false);
      setFormData({ patientName: '', date: new Date().toISOString().split('T')[0], motive: '', diagnosis: '', treatment: '' });
      Alert.alert('Guardado', 'Historia clínica agregada');
  };

  const filteredHistory = history.filter(h => h.patientName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
       <Searchbar
        placeholder="Buscar historia por mascota..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {loading ? <ActivityIndicator color={COLORS.gold} /> : (
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
            {filteredHistory.map((item) => (
                <Card style={styles.card} key={item.id}>
                <Card.Title 
                    title={`${item.patientName} - ${item.date}`} 
                    subtitle={`Motivo: ${item.motive}`} 
                    left={(props) => <MaterialCommunityIcons {...props} name="clipboard-pulse" color={COLORS.gold} size={40} />}
                />
                <Card.Content>
                    <View style={styles.infoRow}>
                    <Text style={{ fontWeight: 'bold' }}>Diagnóstico:</Text>
                    <Text> {item.diagnosis}</Text>
                    </View>
                    <View style={styles.infoRow}>
                    <Text style={{ fontWeight: 'bold' }}>Tratamiento:</Text>
                    <Text> {item.treatment}</Text>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <Button textColor={COLORS.gold}>Ver Detalles</Button>
                </Card.Actions>
                </Card>
            ))}
        </ScrollView>
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        label="Nueva Historia"
      />

       <Modal
            visible={modalVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setModalVisible(false)}
        >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.modalHeader}>
                    <Text variant="titleLarge">Nueva Historia Clínica</Text>
                    <IconButton icon="close" onPress={() => setModalVisible(false)} />
                </View>
                <ScrollView contentContainerStyle={styles.modalContent}>
                    <TextInput label="Nombre Paciente" value={formData.patientName} onChangeText={t => setFormData({...formData, patientName: t})} style={styles.input} mode="outlined" />
                    <TextInput label="Fecha (YYYY-MM-DD)" value={formData.date} onChangeText={t => setFormData({...formData, date: t})} style={styles.input} mode="outlined" />
                    <TextInput label="Motivo Consulta" value={formData.motive} onChangeText={t => setFormData({...formData, motive: t})} style={styles.input} mode="outlined" />
                    <TextInput label="Diagnóstico" value={formData.diagnosis} onChangeText={t => setFormData({...formData, diagnosis: t})} style={styles.input} mode="outlined" multiline />
                    <TextInput label="Tratamiento" value={formData.treatment} onChangeText={t => setFormData({...formData, treatment: t})} style={styles.input} mode="outlined" multiline />
                    <Button mode="contained" onPress={handleSave} style={styles.saveButton}>GUARDAR</Button>
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
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: '#f1f1f1',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
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
