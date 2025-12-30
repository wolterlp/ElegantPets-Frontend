import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Text, FAB, Searchbar, Button, TextInput, ActivityIndicator, IconButton, Surface, Chip, Avatar, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { patientsApi } from '../services/api';

const COLORS = {
  gold: '#d4af37',
  black: '#000000',
  white: '#ffffff',
  background: '#f4f4f4',
  error: '#B00020'
};

export default function PacientesScreen() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Initial Form State
  const initialFormState = {
    // Propietario
    ownerName: '',
    ownerDocument: '',
    ownerPhone: '',
    ownerAddress: '',
    ownerEmail: '',
    // Mascota
    petName: '',
    species: '',
    breed: '',
    sex: '',
    age: '', // Puede ser fecha nacimiento o edad texto
    color: '',
    weight: '',
    photo: null, // Url o base64
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = patients.filter(p => 
        (p.petName && p.petName.toLowerCase().includes(lowerQuery)) ||
        (p.ownerName && p.ownerName.toLowerCase().includes(lowerQuery)) ||
        (p.ownerDocument && p.ownerDocument.includes(lowerQuery)) ||
        (p.breed && p.breed.toLowerCase().includes(lowerQuery)) ||
        (p.species && p.species.toLowerCase().includes(lowerQuery))
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // INTENTO DE CONEXIÓN AL BACKEND
      try {
        const response = await patientsApi.getAll();
        setPatients(response.data);
      } catch (err) {
        console.log('Backend offline, using mock data');
        // MOCK DATA
        setPatients([
          { 
            id: '1', 
            ownerName: 'Juan Perez', ownerDocument: '111222333', ownerPhone: '3001234567', ownerEmail: 'juan@mail.com', ownerAddress: 'Calle 1 # 2-3',
            petName: 'Firulais', species: 'Perro', breed: 'Golden Retriever', sex: 'Macho', age: '3 años', color: 'Dorado', weight: '25kg'
          },
          { 
            id: '2', 
            ownerName: 'Maria Gomez', ownerDocument: '444555666', ownerPhone: '3109876543', ownerEmail: 'maria@mail.com', ownerAddress: 'Carrera 4 # 5-6',
            petName: 'Luna', species: 'Perro', breed: 'Poodle', sex: 'Hembra', age: '2 años', color: 'Blanco', weight: '8kg'
          },
          { 
            id: '3', 
            ownerName: 'Carlos Ruiz', ownerDocument: '777888999', ownerPhone: '3201112233', ownerEmail: 'carlos@mail.com', ownerAddress: 'Av Principal 10',
            petName: 'Michi', species: 'Gato', breed: 'Persa', sex: 'Hembra', age: '1 año', color: 'Gris', weight: '4kg'
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
      let newErrors = {};
      
      // Validaciones Propietario
      if (!formData.ownerName) newErrors.ownerName = 'El nombre del propietario es requerido';
      if (!formData.ownerDocument) newErrors.ownerDocument = 'Documento requerido';
      if (!formData.ownerPhone) newErrors.ownerPhone = 'Teléfono requerido';
      
      // Validaciones Mascota
      if (!formData.petName) newErrors.petName = 'Nombre mascota requerido';
      if (!formData.species) newErrors.species = 'Especie requerida';
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
        Alert.alert('Atención', 'Por favor complete los campos obligatorios');
        return;
    }

    try {
        if (editingPatient) {
            // Update
            await patientsApi.update(editingPatient.id, formData);
            
            // Mock Update Local (Optimistic UI)
            setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...p, ...formData } : p));
            Alert.alert('Éxito', 'Paciente actualizado');
        } else {
            // Create
            const response = await patientsApi.create(formData);
            const newPatientId = response.data?.id || Math.random().toString();

            // Mock Create Local (Optimistic UI)
            setPatients(prev => [...prev, { id: newPatientId, ...formData }]);
            Alert.alert('Éxito', 'Paciente registrado');
        }
        closeModal();
    } catch (error) {
        console.error('Save Error:', error);
        Alert.alert('Error', error.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar Eliminación', '¿Estás seguro de eliminar este paciente y su propietario?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: async () => {
             try {
                await patientsApi.delete(id);
                setPatients(prev => prev.filter(p => p.id !== id));
             } catch (e) {
                Alert.alert('Error', 'No se pudo eliminar del backend');
             }
        }}
    ]);
  };

  const openModal = (patient = null) => {
    setErrors({});
    if (patient) {
        setEditingPatient(patient);
        setFormData({ ...patient });
    } else {
        setEditingPatient(null);
        setFormData(initialFormState);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPatient(null);
  };

  const renderItem = ({ item }) => (
    <Surface style={styles.petCard} elevation={2}>
      <View style={styles.cardHeader}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Avatar.Icon 
                size={40} 
                icon={item.species?.toLowerCase() === 'gato' ? 'cat' : 'dog'} 
                style={{backgroundColor: COLORS.gold, marginRight: 10}} 
                color={COLORS.black}
            />
            <View>
                <Text style={styles.petName}>{item.petName}</Text>
                <Text style={styles.petSub}>{item.breed} • {item.sex}</Text>
            </View>
        </View>
        <Chip icon="file-document-outline" style={{backgroundColor: '#eee'}} textStyle={{fontSize: 10}}>
             {item.ownerDocument}
        </Chip>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.rowInfo}>
            <MaterialCommunityIcons name="account" size={16} color="#666" />
            <Text style={styles.infoText}> {item.ownerName}</Text>
        </View>
        <View style={styles.rowInfo}>
            <MaterialCommunityIcons name="phone" size={16} color="#666" />
            <Text style={styles.infoText}> {item.ownerPhone}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
         <Button mode="text" labelStyle={{color: COLORS.gold}} onPress={() => openModal(item)}>Editar</Button>
         <Button mode="text" labelStyle={{color: COLORS.error}} onPress={() => handleDelete(item.id)}>Eliminar</Button>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar por nombre, cédula, raza..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={{fontSize: 14}}
      />
      
      {loading ? (
        <ActivityIndicator animating={true} color={COLORS.gold} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
            data={filteredPatients}
            keyExtractor={(p) => p.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron resultados.</Text>}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => openModal()}
        label="Nuevo Registro"
        color={COLORS.black}
      />

        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={closeModal}
        >
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"} 
                    style={{ flex: 1 }}
                >
                <View style={styles.modalHeader}>
                    <Text variant="titleLarge" style={{fontWeight:'bold'}}>
                        {editingPatient ? 'Editar Registro' : 'Nuevo Registro'}
                    </Text>
                    <IconButton icon="close" onPress={closeModal} />
                </View>

                <ScrollView contentContainerStyle={styles.modalContent}>
                    
                    {/* SECTION: PROPIETARIO */}
                    <Text style={styles.sectionTitle}>Datos del Propietario</Text>
                    
                    <TextInput 
                        label="Nombre Completo *" 
                        value={formData.ownerName} 
                        onChangeText={t => setFormData({...formData, ownerName: t})}
                        style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                        error={!!errors.ownerName}
                    />
                    {errors.ownerName && <HelperText type="error">{errors.ownerName}</HelperText>}

                    <View style={styles.rowInputs}>
                        <View style={{flex:1, marginRight: 8}}>
                             <TextInput 
                                label="Cédula / NIT *" 
                                value={formData.ownerDocument} 
                                onChangeText={t => setFormData({...formData, ownerDocument: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                                keyboardType="numeric"
                                error={!!errors.ownerDocument}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <TextInput 
                                label="Teléfono *" 
                                value={formData.ownerPhone} 
                                onChangeText={t => setFormData({...formData, ownerPhone: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                                keyboardType="phone-pad"
                                error={!!errors.ownerPhone}
                            />
                        </View>
                    </View>

                    <TextInput 
                        label="Dirección" 
                        value={formData.ownerAddress} 
                        onChangeText={t => setFormData({...formData, ownerAddress: t})}
                        style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                    />
                    <TextInput 
                        label="Correo Electrónico" 
                        value={formData.ownerEmail} 
                        onChangeText={t => setFormData({...formData, ownerEmail: t})}
                        style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                        keyboardType="email-address"
                    />


                    {/* SECTION: MASCOTA */}
                    <Text style={styles.sectionTitle}>Datos de la Mascota</Text>

                    <TextInput 
                        label="Nombre Mascota *" 
                        value={formData.petName} 
                        onChangeText={t => setFormData({...formData, petName: t})}
                        style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                        error={!!errors.petName}
                    />

                    <View style={styles.rowInputs}>
                         <View style={{flex:1, marginRight: 8}}>
                            <TextInput 
                                label="Especie (Perro, Gato...)*" 
                                value={formData.species} 
                                onChangeText={t => setFormData({...formData, species: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <TextInput 
                                label="Raza" 
                                value={formData.breed} 
                                onChangeText={t => setFormData({...formData, breed: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                            />
                        </View>
                    </View>

                    <View style={styles.rowInputs}>
                        <View style={{flex:1, marginRight: 8}}>
                            <TextInput 
                                label="Sexo (M/H)" 
                                value={formData.sex} 
                                onChangeText={t => setFormData({...formData, sex: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <TextInput 
                                label="Edad / Nacimiento" 
                                value={formData.age} 
                                onChangeText={t => setFormData({...formData, age: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                            />
                        </View>
                    </View>

                     <View style={styles.rowInputs}>
                        <View style={{flex:1, marginRight: 8}}>
                            <TextInput 
                                label="Color" 
                                value={formData.color} 
                                onChangeText={t => setFormData({...formData, color: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                            />
                        </View>
                        <View style={{flex:1}}>
                            <TextInput 
                                label="Peso (kg)" 
                                value={formData.weight} 
                                onChangeText={t => setFormData({...formData, weight: t})}
                                style={styles.input} mode="outlined" dense activeOutlineColor={COLORS.gold}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                    
                    <Button 
                        mode="contained" 
                        onPress={handleSave} 
                        style={styles.saveButton}
                        labelStyle={{ fontWeight: 'bold' }}
                        contentStyle={{height: 48}}
                    >
                        GUARDAR REGISTRO
                    </Button>
                    <View style={{height: 40}} /> 
                </ScrollView>
            </KeyboardAvoidingView>
            </View>
        </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 2
  },
  petCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden'
  },
  cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 16,
  },
  petName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
  },
  petSub: {
      fontSize: 13,
      color: '#666',
      marginTop: 2
  },
  divider: {
      height: 1,
      backgroundColor: '#eee',
      marginHorizontal: 16
  },
  cardBody: {
      padding: 16,
      paddingTop: 12
  },
  rowInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6
  },
  infoText: {
      fontSize: 14,
      color: '#444'
  },
  cardActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingRight: 8,
      paddingBottom: 4,
      backgroundColor: '#fafafa'
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
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: COLORS.gold,
      marginBottom: 12,
      marginTop: 8,
      textTransform: 'uppercase',
      letterSpacing: 1
  },
  input: {
    marginBottom: 12,
    backgroundColor: COLORS.white,
  },
  rowInputs: {
      flexDirection: 'row',
      marginBottom: 0
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 40,
      color: '#888',
      fontSize: 16
  }
});
