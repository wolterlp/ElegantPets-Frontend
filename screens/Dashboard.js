import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, useTheme, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MENU_ITEMS = [
  { title: 'Pacientes', icon: 'paw', screen: 'Pacientes', desc: 'Gestionar mascotas y dueños' },
  { title: 'Historia Clínica', icon: 'clipboard-pulse', screen: 'HistoriaClinica', desc: 'Consultas y tratamientos' },
  { title: 'Agenda', icon: 'calendar-clock', screen: 'Agenda', desc: 'Citas y programación' },
  { title: 'Recordatorios', icon: 'bell-ring', screen: 'Recordatorios', desc: 'Vacunas y alertas' },
  { title: 'Tienda', icon: 'store', screen: 'Tienda', desc: 'Inventario y ventas' },
  { title: 'Usuarios', icon: 'account-group', screen: 'Usuarios', desc: 'Roles y permisos' },
];

export default function DashboardScreen({ navigation, onLogout }) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Panel de Control</Text>
        <Button mode="text" onPress={onLogout} icon="logout">Salir</Button>
      </View>
      
      <ScrollView contentContainerStyle={styles.grid}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.cardWrapper}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: theme.colors.primary }]}>
                  <MaterialCommunityIcons name={item.icon} size={32} color="#fff" />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center', // Para que se centren si hay espacio
  },
  cardWrapper: {
    width: '47%', // Casi la mitad
    minWidth: 150,
    maxWidth: 200,
  },
  card: {
    height: 180,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
