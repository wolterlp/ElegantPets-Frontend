import React, { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Linking, TouchableOpacity, Platform, Image, ScrollView, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, Button, Text, Appbar, Card, Divider } from 'react-native-paper';
import Landing from './components/Landing';
import { Agenda } from 'react-native-calendars';
import * as SQLite from 'expo-sqlite';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      <Image
        source={require('./assets/iconos/apple-icon-180x180.png')}
        style={{ width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: COLORS.gold, marginHorizontal: 8 }}
        resizeMode="contain"
      />
      <Appbar.Content title={title} titleStyle={{ color: COLORS.white, fontWeight: '600' }} />
    </Appbar.Header>
  );
}

function HomeScreen({ navigation }) {
  return (
    <Landing
      onBook={() => navigation.navigate('SepararCita')}
      onServicios={() => navigation.navigate('Servicios')}
      onTienda={() => navigation.navigate('Tienda')}
      onContacto={() => navigation.navigate('Contacto')}
    />
  );
}

function AgendaScreen() {
  const items = useMemo(() => ({
    '2025-01-01': [
      { name: 'Baño Premium', pet: 'Firulais', duration: '60 min', price: '$45', service: 'bath' },
      { name: 'Corte Deluxe', pet: 'Luna', duration: '45 min', price: '$35', service: 'cut' },
    ],
    '2025-01-02': [
      { name: 'Grooming Gold', pet: 'Max', duration: '90 min', price: '$65', service: 'grooming' },
    ],
  }), []);

  return (
    <View style={styles.screenWrap}>
      <Agenda
        items={items}
        selected={new Date().toISOString().slice(0, 10)}
        renderItem={(item) => (
          <View style={styles.serviceCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <MaterialCommunityIcons
                name={item.service === 'bath' ? 'shower-head' : item.service === 'cut' ? 'content-cut' : 'dog'}
                size={18}
                color={COLORS.gold}
              />
              <Text style={styles.serviceTitle}> {item.name}</Text>
            </View>
            <Text style={styles.serviceMeta}>Mascota: {item.pet} • {item.duration} • {item.price}</Text>
          </View>
        )}
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
  const pets = [
    { id: '1', name: 'Firulais', breed: 'Golden Retriever', age: '3 años', photo: require('./assets/icon.png') },
    { id: '2', name: 'Luna', breed: 'Poodle', age: '2 años', photo: require('./assets/icon.png') },
    { id: '3', name: 'Max', breed: 'Bulldog', age: '5 años', photo: require('./assets/icon.png') },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.petCard}>
      <Image source={item.photo} style={styles.petPhoto} />
      <View style={{ flex: 1 }}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petInfo}>{item.breed} • {item.age}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={COLORS.gold} />
    </View>
  );

  return (
    <View style={styles.screenWrap}>
      <FlatList
        data={pets}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

function HistoriaClinicaScreen() {
  return (
    <ScrollView style={styles.screenWrap}>
      <Text style={styles.sectionTitle}>Historia Clínica</Text>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="stethoscope" size={18} color={COLORS.gold} />
        <Text style={styles.infoLabel}>Diagnóstico</Text>
      </View>
      <Card style={styles.infoCard}><Text>Sin antecedentes relevantes.</Text></Card>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="needle" size={18} color={COLORS.gold} />
        <Text style={styles.infoLabel}>Vacunas</Text>
      </View>
      <Card style={styles.infoCard}><Text>Rabia (2024), Moquillo (2024)</Text></Card>

      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="pill" size={18} color={COLORS.gold} />
        <Text style={styles.infoLabel}>Tratamientos</Text>
      </View>
      <Card style={styles.infoCard}><Text>Desparasitación trimestral</Text></Card>
    </ScrollView>
  );
}

function RecordatoriosScreen() {
  const reminders = [
    { id: '1', title: 'Vacuna Rabia', date: '2025-02-10' },
    { id: '2', title: 'Desparasitación', date: '2025-03-01' },
    { id: '3', title: 'Grooming Gold', date: '2025-01-20' },
  ];

  return (
    <View style={styles.screenWrap}>
      {reminders.map(r => (
        <View key={r.id} style={styles.reminderItem}>
          <View style={styles.reminderDot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.reminderTitle}>{r.title}</Text>
            <Text style={styles.reminderDate}>{r.date}</Text>
          </View>
          <MaterialCommunityIcons name="bell-outline" size={18} color={COLORS.gold} />
        </View>
      ))}
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
      <Divider style={{ marginVertical: 8 }} />
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={18} color={COLORS.gold} />
        <Text style={styles.infoLabel}>Calle 7 #14-13, Florida Valle, Colombia</Text>
      </View>
      <View style={styles.actionsRow}>
        <Button icon="whatsapp" mode="outlined" style={styles.buttonOutlined} textColor={COLORS.black} onPress={openWhatsApp}>
          WhatsApp
        </Button>
        <Button icon="map" mode="outlined" style={styles.buttonOutlined} textColor={COLORS.black} onPress={openGoogleMaps}>
          Google Maps
        </Button>
      </View>
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
  const whatsappNumber = '573137284698';
  const services = [
    { id: 'bath', name: 'Baño y secado profesional', desc: 'Baño completo y secado cuidadoso.', price: '$45' },
    { id: 'cut', name: 'Corte de pelo y peinado personalizado', desc: 'Estilo según raza y preferencia.', price: '$35' },
    { id: 'dental', name: 'Limpieza dental', desc: 'Higiene bucal para una sonrisa saludable.', price: '$30' },
    { id: 'nails', name: 'Corte de uñas', desc: 'Seguro y preciso para su comodidad.', price: '$15' },
    { id: 'fleas', name: 'Tratamientos antipulgas y garrapatas', desc: 'Protección efectiva y segura.', price: '$25' },
    { id: 'massage', name: 'Masajes relajantes', desc: 'Relajación y bienestar.', price: '$40' },
    { id: 'aroma', name: 'Aromaterapia y spa premium', desc: 'Experiencia sensorial premium.', price: '$55' },
    { id: 'pickup', name: 'Recogida y entrega a domicilio (opcional)', desc: 'Servicio puerta a puerta.', price: '$10+' },
  ];

  const openWhatsAppBooking = (serviceName) => {
    const msg = `Hola Elegant Pets Spa, quiero agendar una cita.%0A%F0%9F%90%BE Nombre: [Nombre del propietario]%20%20%F0%9F%90%95 Mascota: [Tipo de mascota]%20%20%F0%9F%92%86%E2%80%8D%E2%99%82%EF%B8%8F Servicio: ${serviceName}%20%20%F0%9F%93%85 Fecha y hora: [Fecha seleccionada]%0A%F0%9F%93%8D Dirección del spa: Calle 7 #14-13, Florida Valle%20%0A%F0%9F%8C%90 Google Maps: https://maps.google.com/?q=3.325972,-76.236619%0A%C2%A1Gracias!`;
    const url = `https://wa.me/${whatsappNumber}?text=${msg}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.screenWrap} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.sectionTitle}>Nuestros servicios</Text>
      <View style={styles.menuGrid}>
        {services.map(s => (
          <View key={s.id} style={styles.menuItem}>
            <Text style={styles.menuItemTitle}>{s.name}</Text>
            <Text style={styles.menuItemSubtitle}>{s.desc}</Text>
            <Text style={{ marginTop: 8, color: COLORS.black }}>Precio aprox: {s.price}</Text>
            <Button mode="outlined" style={[styles.buttonOutlined, { marginTop: 8 }]} onPress={() => openWhatsAppBooking(s.name)}>
              Separar cita
            </Button>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function SepararCitaScreen() {
  const [tipoMascota, setTipoMascota] = useState('perro');
  const [servicio, setServicio] = useState('Baño y secado profesional');
  const [fechaHora, setFechaHora] = useState('');
  const [propietario, setPropietario] = useState('');
  const [comentarios, setComentarios] = useState('');
  const whatsappNumber = '573137284698';

  const reservarWhatsApp = () => {
    const message = `Hola Elegant Pets Spa, quiero agendar una cita.%0A%F0%9F%90%BE Nombre: ${encodeURIComponent(propietario)}%20%20%F0%9F%90%95 Mascota: ${encodeURIComponent(tipoMascota)}%20%20%F0%9F%92%86%E2%80%8D%E2%99%82%EF%B8%8F Servicio: ${encodeURIComponent(servicio)}%20%20%F0%9F%93%85 Fecha y hora: ${encodeURIComponent(fechaHora)}%0A%F0%9F%93%8D Dirección del spa: Calle 7 #14-13, Florida Valle%20%0A%F0%9F%8C%90 Google Maps: https://maps.google.com/?q=3.325972,-76.236619%0A${encodeURIComponent(comentarios)}%0A%C2%A1Gracias!`;
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.screenWrap} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.sectionTitle}>Separar cita</Text>
      <Text style={{ color: '#666', marginBottom: 12 }}>Completa los datos y reserva por WhatsApp.</Text>
      <Card style={styles.infoCard}>
        <View style={{ gap: 10 }}>
          <Text style={styles.infoLabel}>Tipo de mascota (perro, gato, otro)</Text>
          <TextInput value={tipoMascota} onChangeText={setTipoMascota} style={styles.textInput} placeholder="perro" />
          <Text style={styles.infoLabel}>Servicio deseado</Text>
          <TextInput value={servicio} onChangeText={setServicio} style={styles.textInput} placeholder="Baño y secado profesional" />
          <Text style={styles.infoLabel}>Fecha y hora</Text>
          <TextInput value={fechaHora} onChangeText={setFechaHora} style={styles.textInput} placeholder="2025-01-20 10:00" />
          <Text style={styles.infoLabel}>Nombre del propietario</Text>
          <TextInput value={propietario} onChangeText={setPropietario} style={styles.textInput} placeholder="Tu nombre" />
          <Text style={styles.infoLabel}>Comentarios adicionales</Text>
          <TextInput value={comentarios} onChangeText={setComentarios} style={[styles.textInput, { minHeight: 80 }]} placeholder="Observaciones" multiline />
        </View>
      </Card>
      <Button mode="contained" style={styles.buttonPrimary} onPress={reservarWhatsApp}>Reservar por WhatsApp</Button>
    </ScrollView>
  );
}

function ContactoScreen() {
  const mapsURL = 'https://maps.google.com/?q=3.325972,-76.236619';
  const whatsappURL = 'https://wa.me/573137284698';

  return (
    <ScrollView style={styles.screenWrap} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.sectionTitle}>Contacto</Text>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={18} color={COLORS.gold} />
        <Text style={styles.infoLabel}>Calle 7 #14-13, Florida Valle</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="phone" size={18} color={COLORS.gold} />
        <Text style={styles.infoLabel}>Teléfono / WhatsApp: +57 3137284698</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.gold} />
        <Text style={styles.infoLabel}>Lunes a sábado: 8:00 a.m. – 6:00 p.m. • Domingo: cerrado</Text>
      </View>
      <View style={styles.actionsRow}>
        <Button icon="map" mode="outlined" style={styles.buttonOutlined} onPress={() => Linking.openURL(mapsURL)}>Abrir Google Maps</Button>
        <Button icon="whatsapp" mode="outlined" style={styles.buttonOutlined} onPress={() => Linking.openURL(whatsappURL)}>Contactar por WhatsApp</Button>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Mapa</Text>
      <ImageBackground source={require('./assets/page1/banner.jpg')} style={{ height: 200, borderRadius: 12, overflow: 'hidden' }} imageStyle={{ resizeMode: 'cover' }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => Linking.openURL(mapsURL)} />
      </ImageBackground>
      <Text style={{ color: '#666', marginTop: 8 }}>Toca el mapa para abrir en Google Maps.</Text>
    </ScrollView>
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
          <Stack.Screen name="Inicio" component={HomeScreen} options={{ header: () => null }} />
          <Stack.Screen name="Agenda" component={AgendaScreen} />
          <Stack.Screen name="Pacientes" component={PacientesScreen} />
          <Stack.Screen name="HistoriaClinica" component={HistoriaClinicaScreen} />
          <Stack.Screen name="Recordatorios" component={RecordatoriosScreen} />
          <Stack.Screen name="Servicios" component={ServiciosScreen} />
          <Stack.Screen name="SepararCita" component={SepararCitaScreen} />
          <Stack.Screen name="Contacto" component={ContactoScreen} />
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
  logo: {
    width: 96,
    height: 96,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: 8,
  },
  illustration: {
    width: '80%',
    height: 180,
    marginBottom: 24,
  },
  ctaButton: {
    borderColor: COLORS.gold,
    borderWidth: 1.5,
    borderRadius: 26,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    marginHorizontal: 24,
  },
  ctaLabel: {
    color: COLORS.black,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  buttonOutlined: {
    borderColor: COLORS.gold,
    borderWidth: 1.2,
    borderRadius: 24,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gold,
    padding: 12,
    marginRight: 10,
    ...Platform.select({
      ios: { shadowColor: COLORS.gold, shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
      web: {},
    }),
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  serviceMeta: {
    fontSize: 12,
    color: '#444',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
      web: {},
    }),
  },
  petPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginRight: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  petInfo: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: COLORS.black,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.black,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 12,
  },
  textInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 10,
  },
  reminderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.gold,
    marginRight: 12,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  reminderDate: {
    fontSize: 12,
    color: '#666',
  },
});
