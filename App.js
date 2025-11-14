import React, { useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Linking, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Button, Text, Appbar } from 'react-native-paper';
import { Agenda } from 'react-native-calendars';
import * as SQLite from 'expo-sqlite';

const COLORS = {
  white: '#ffffff',
  gold: '#d4af37',
  black: '#000000',
};

// Simple SQLite init (placeholder for offline-ready). Skip on web.
const db = Platform.OS === 'web' ? null : SQLite.openDatabase('elegantpets.db');

const Stack = createNativeStackNavigator();

function Header({ title, navigation }) {
  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: COLORS.black }}>
      {navigation?.canGoBack() ? (
        <Appbar.BackAction color={COLORS.gold} onPress={() => navigation.goBack()} />
      ) : null}
      <Appbar.Content title={title} titleStyle={{ color: COLORS.white }} />
    </Appbar.Header>
  );
}

function HomeScreen({ navigation }) {
  const openWhatsApp = () => {
    const whatsappURL = 'https://wa.me/573137284698?text=Hola%20Elegant%20Pets%20Spa%2C%20quiero%20agendar%20una%20cita%20para%20mi%20mascota.';
    Linking.openURL(whatsappURL);
  };

  const openGoogleMaps = () => {
    const mapsURL = 'https://www.google.com/maps?q=Calle+7+%23+14-13,+Florida,+Valle,+Colombia';
    Linking.openURL(mapsURL);
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.white }]}>
      <Text style={styles.brandTitle}>Elegant Pets Spa</Text>
      <Text style={styles.brandSubtitle}>Cuidado premium para tus mascotas</Text>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Agenda')}>
          <Text style={styles.menuItemTitle}>Agenda y Citas</Text>
          <Text style={styles.menuItemSubtitle}>Calendario y reservas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Pacientes')}>
          <Text style={styles.menuItemTitle}>Pacientes</Text>
          <Text style={styles.menuItemSubtitle}>Propietarios y mascotas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HistoriaClinica')}>
          <Text style={styles.menuItemTitle}>Historia Clínica</Text>
          <Text style={styles.menuItemSubtitle}>Registros médicos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Recordatorios')}>
          <Text style={styles.menuItemTitle}>Recordatorios</Text>
          <Text style={styles.menuItemSubtitle}>Vacunas y grooming</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Servicios')}>
          <Text style={styles.menuItemTitle}>Servicios</Text>
          <Text style={styles.menuItemSubtitle}>Grooming y precios</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Configuracion')}>
          <Text style={styles.menuItemTitle}>Configuración</Text>
          <Text style={styles.menuItemSubtitle}>Preferencias del negocio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Tienda')}>
          <Text style={styles.menuItemTitle}>Tienda</Text>
          <Text style={styles.menuItemSubtitle}>Compra por WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <Button icon="whatsapp" mode="contained" style={styles.buttonWhatsApp} onPress={openWhatsApp}>
          Contactar por WhatsApp
        </Button>
        <Button icon="map" mode="contained" style={styles.buttonMap} onPress={openGoogleMaps}>
          Ver en Google Maps
        </Button>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

function AgendaScreen() {
  const items = useMemo(() => ({
    '2025-01-01': [{ name: 'Cita Grooming - Firulais', height: 60 }],
  }), []);

  return (
    <View style={styles.screenWrap}>
      <Agenda
        items={items}
        selected={new Date().toISOString().slice(0, 10)}
        theme={{
          agendaDayTextColor: COLORS.black,
          agendaDayNumColor: COLORS.gold,
          agendaTodayColor: COLORS.gold,
          dotColor: COLORS.gold,
          selectedDayBackgroundColor: COLORS.gold,
          selectedDayTextColor: COLORS.black,
        }}
      />
    </View>
  );
}

function PacientesScreen() {
  return (
    <View style={styles.screenWrap}>
      <Text>Listado y búsqueda de propietarios y mascotas (pendiente de API)</Text>
    </View>
  );
}

function HistoriaClinicaScreen() {
  return (
    <View style={styles.screenWrap}>
      <Text>Historia clínica, vacunas, tratamientos (pendiente de API)</Text>
    </View>
  );
}

function RecordatoriosScreen() {
  return (
    <View style={styles.screenWrap}>
      <Text>Recordatorios (vacunación, desparasitación, grooming)</Text>
    </View>
  );
}

function ConfiguracionScreen() {
  const openWhatsApp = () => {
    const whatsappURL = 'https://wa.me/573137284698?text=Hola%20Elegant%20Pets%20Spa%2C%20me%20gustaría%20más%20información.';
    Linking.openURL(whatsappURL);
  };
  const openGoogleMaps = () => {
    const mapsURL = 'https://www.google.com/maps?q=Calle+7+%23+14-13,+Florida,+Valle,+Colombia';
    Linking.openURL(mapsURL);
  };

  return (
    <View style={styles.screenWrap}>
      <Text style={styles.brandTitleSmall}>Elegant Pets Spa</Text>
      <Text>Dirección: Calle 7 #14-13, Florida Valle, Colombia</Text>
      <View style={styles.actionsRow}>
        <Button icon="whatsapp" mode="contained" style={styles.buttonWhatsApp} onPress={openWhatsApp}>
          WhatsApp
        </Button>
        <Button icon="map" mode="contained" style={styles.buttonMap} onPress={openGoogleMaps}>
          Google Maps
        </Button>
      </View>
      <Text>Personalización visual (colores, logo, etc.) próximamente</Text>
    </View>
  );
}

function TiendaScreen() {
  return (
    <View style={styles.screenWrap}>
      <Text>Tienda: productos con botón "Comprar por WhatsApp" (opcional)</Text>
    </View>
  );
}

function ServiciosScreen() {
  return (
    <View style={styles.screenWrap}>
      <Text>Servicios de grooming: lista y detalle (pendiente de API)</Text>
    </View>
  );
}

export default function App() {
  const paperTheme = {
    colors: {
      primary: COLORS.gold,
      secondary: COLORS.black,
      background: COLORS.white,
      surface: COLORS.white,
      text: COLORS.black,
      onPrimary: COLORS.black,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={({ navigation, route }) => ({
            header: () => <Header title={route.name} navigation={navigation} />,
          })}
        >
          <Stack.Screen name="Inicio" component={HomeScreen} />
          <Stack.Screen name="Agenda" component={AgendaScreen} />
          <Stack.Screen name="Pacientes" component={PacientesScreen} />
          <Stack.Screen name="HistoriaClinica" component={HistoriaClinicaScreen} />
          <Stack.Screen name="Recordatorios" component={RecordatoriosScreen} />
          <Stack.Screen name="Servicios" component={ServiciosScreen} />
          <Stack.Screen name="Configuracion" component={ConfiguracionScreen} />
          <Stack.Screen name="Tienda" component={TiendaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 16,
    color: COLORS.gold,
    marginBottom: 24,
  },
  brandTitleSmall: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 12,
  },
  buttonsWrap: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  menuGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#555',
  },
  buttonPrimary: {
    backgroundColor: COLORS.gold,
  },
  buttonSecondary: {
    borderColor: COLORS.gold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  buttonWhatsApp: {
    backgroundColor: '#25D366',
  },
  buttonMap: {
    backgroundColor: COLORS.black,
  },
  screenWrap: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
});
