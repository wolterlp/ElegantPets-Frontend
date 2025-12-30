import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Card, FAB, Button, Avatar, Modal, Portal, Provider, TextInput, Chip, Checkbox, Divider, List } from 'react-native-paper';

const COLORS = { gold: '#d4af37', black: '#000000', white: '#ffffff', gray: '#f0f0f0' };

export default function UsuariosScreen() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Admin User', email: 'admin@elegantpets.com', role: 'Administrador', permissions: ['all'] },
    { id: '2', name: 'Juan Veterinario', email: 'juan@elegantpets.com', role: 'Veterinario', permissions: ['view_patients', 'create_history'] },
    { id: '3', name: 'Ana Recepción', email: 'ana@elegantpets.com', role: 'Recepción', permissions: ['view_agenda', 'create_appointment'] },
  ]);

  const [visible, setVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Available Roles
  const roles = ['Administrador', 'Veterinario', 'Recepción', 'Groomer'];
  
  // Available Permissions
  const availablePermissions = [
      { key: 'manage_users', label: 'Gestionar Usuarios' },
      { key: 'manage_patients', label: 'Gestionar Pacientes' },
      { key: 'create_history', label: 'Crear Historia Clínica' },
      { key: 'view_agenda', label: 'Ver Agenda' },
      { key: 'manage_inventory', label: 'Gestionar Inventario' },
  ];

  const showModal = (user = null) => {
      setEditingUser(user || { name: '', email: '', role: 'Veterinario', permissions: [] });
      setVisible(true);
  };
  const hideModal = () => setVisible(false);

  const handleSave = () => {
    if (editingUser.id) {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        Alert.alert('Actualizado', `Permisos actualizados para ${editingUser.name}`);
    } else {
        setUsers([...users, { ...editingUser, id: Math.random().toString() }]);
        Alert.alert('Creado', 'Nuevo usuario creado');
    }
    hideModal();
  };

  const togglePermission = (key) => {
      if (editingUser.permissions.includes(key)) {
          setEditingUser({ ...editingUser, permissions: editingUser.permissions.filter(p => p !== key) });
      } else {
          setEditingUser({ ...editingUser, permissions: [...editingUser.permissions, key] });
      }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.userInfo}>
            <Avatar.Text size={40} label={item.name.substring(0,2).toUpperCase()} style={{ backgroundColor: COLORS.gold }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <Chip icon="account-key" textStyle={{ fontSize: 10, height: 12 }} style={styles.roleChip}>{item.role}</Chip>
            </View>
            <Button mode="text" onPress={() => showModal(item)}>Editar</Button>
        </View>
        <Divider style={{ marginVertical: 8 }} />
        <Text style={{ fontSize: 10, color: '#666' }}>Permisos: {item.permissions.includes('all') ? 'Acceso Total' : item.permissions.join(', ')}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <Provider>
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                <ScrollView>
                    <Text style={styles.modalTitle}>{editingUser?.id ? 'Editar Permisos' : 'Nuevo Usuario'}</Text>
                    
                    <TextInput 
                        label="Nombre" 
                        value={editingUser?.name} 
                        onChangeText={t => setEditingUser({...editingUser, name: t})} 
                        style={styles.input}
                    />
                     <TextInput 
                        label="Email" 
                        value={editingUser?.email} 
                        onChangeText={t => setEditingUser({...editingUser, email: t})} 
                        style={styles.input}
                    />

                    <Text style={styles.sectionTitle}>Rol</Text>
                    <View style={styles.chipContainer}>
                        {roles.map(role => (
                            <Chip 
                                key={role} 
                                selected={editingUser?.role === role} 
                                onPress={() => setEditingUser({...editingUser, role})}
                                style={styles.chip}
                            >
                                {role}
                            </Chip>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Permisos Específicos</Text>
                    {availablePermissions.map(perm => (
                        <Checkbox.Item 
                            key={perm.key}
                            label={perm.label}
                            status={editingUser?.permissions?.includes(perm.key) ? 'checked' : 'unchecked'}
                            onPress={() => togglePermission(perm.key)}
                            color={COLORS.gold}
                        />
                    ))}

                    <Button mode="contained" onPress={handleSave} style={styles.saveBtn} buttonColor={COLORS.gold} textColor={COLORS.black}>
                        Guardar Cambios
                    </Button>
                </ScrollView>
            </Modal>
        </Portal>

        <View style={styles.container}>
        <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
        />
        <FAB
            icon="plus"
            label="Nuevo Usuario"
            style={styles.fab}
            onPress={() => showModal()}
        />
        </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { marginBottom: 10, backgroundColor: 'white', elevation: 2 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  name: { fontWeight: 'bold', fontSize: 16 },
  email: { fontSize: 12, color: '#666' },
  roleChip: { marginTop: 4, backgroundColor: '#f0f0f0', alignSelf: 'flex-start', height: 24 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: COLORS.gold },
  modalContainer: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: COLORS.black },
  input: { marginBottom: 12, backgroundColor: 'white' },
  sectionTitle: { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { marginRight: 4, marginBottom: 4 },
  saveBtn: { marginTop: 20 }
});
