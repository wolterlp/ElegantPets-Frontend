import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Card, FAB, Button, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = { gold: '#d4af37', black: '#000000', white: '#ffffff', red: '#d32f2f' };

export default function RecordatoriosScreen() {
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Vacuna Rabia - Firulais', date: '2025-01-10', active: true },
    { id: 2, title: 'Desparasitación - Luna', date: '2025-01-15', active: false },
  ]);

  const toggleSwitch = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id) => {
      Alert.alert('Eliminar', '¿Borrar recordatorio?', [
          { text: 'Cancelar' },
          { text: 'Eliminar', onPress: () => setReminders(prev => prev.filter(r => r.id !== id)) }
      ]);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={{ flex: 1 }}>
            <Text style={[styles.title, !item.active && styles.strikethrough]}>{item.title}</Text>
            <Text style={styles.date}>Vence: {item.date}</Text>
        </View>
        <Switch 
            value={item.active} 
            onValueChange={() => toggleSwitch(item.id)} 
            color={COLORS.gold} 
        />
        <Button textColor={COLORS.red} onPress={() => deleteReminder(item.id)}>X</Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reminders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Nuevo', 'Funcionalidad de agregar recordatorio aquí')}
        label="Nuevo Recordatorio"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
      marginBottom: 12,
  },
  cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  title: {
      fontSize: 16,
      fontWeight: 'bold'
  },
  date: {
      fontSize: 14,
      color: '#666'
  },
  strikethrough: {
      textDecorationLine: 'line-through',
      color: '#aaa'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.gold,
  }
});
