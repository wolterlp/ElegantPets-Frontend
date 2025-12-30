import React from 'react';
import { Image, Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider, Appbar, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Screens
import Landing from './components/Landing';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/Dashboard';
import PacientesScreen from './screens/PacientesScreen';
import AgendaScreen from './screens/AgendaScreen';
import HistoriaClinicaScreen from './screens/HistoriaClinicaScreen';
import RecordatoriosScreen from './screens/RecordatoriosScreen';
import TiendaScreen from './screens/TiendaScreen';
import UsuariosScreen from './screens/UsuariosScreen';

// SQLite Placeholder
import * as SQLite from 'expo-sqlite';
const db = Platform.OS === 'web' ? null : SQLite.openDatabase('elegantpets.db');

const COLORS = {
  white: '#ffffff',
  gold: '#d4af37',
  black: '#000000',
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Header({ title, navigation, back }) {
  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: COLORS.black }}>
      {back ? <Appbar.BackAction color={COLORS.gold} onPress={navigation.goBack} /> : null}
      <Image
        source={require('./assets/iconos/apple-icon-180x180.png')}
        style={{ width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: COLORS.gold, marginHorizontal: 8 }}
        resizeMode="contain"
      />
      <Appbar.Content title={title} titleStyle={{ color: COLORS.white, fontWeight: '600' }} />
    </Appbar.Header>
  );
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.gold,
    secondary: COLORS.black,
    background: COLORS.white,
    surface: COLORS.white,
    onPrimary: COLORS.black,
  },
};

const AuthenticatedDrawer = () => {
    const { logout } = useAuth();
    // We can pass logout to Dashboard or add a Logout button in DrawerContent
    
    return (
        <Drawer.Navigator 
            initialRouteName="Dashboard"
            screenOptions={{
                headerStyle: { backgroundColor: COLORS.black },
                headerTintColor: COLORS.gold,
                drawerActiveTintColor: COLORS.gold,
                drawerInactiveTintColor: COLORS.black,
            }}
        >
            <Drawer.Screen 
                name="Dashboard" 
                options={{ title: 'Panel de Control' }} 
            >
                {(props) => <DashboardScreen {...props} onLogout={logout} />}
            </Drawer.Screen>
            <Drawer.Screen name="Pacientes" component={PacientesScreen} />
            <Drawer.Screen name="HistoriaClinica" component={HistoriaClinicaScreen} options={{ title: 'Historia Clínica' }}/>
            <Drawer.Screen name="Agenda" component={AgendaScreen} />
            <Drawer.Screen name="Recordatorios" component={RecordatoriosScreen} />
            <Drawer.Screen name="Tienda" component={TiendaScreen} />
            <Drawer.Screen name="Usuarios" component={UsuariosScreen} />
        </Drawer.Navigator>
    );
};

const NavigationWrapper = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ 
          header: (props) => <Header {...props} />,
          headerShown: true
      }}>
        {!isAuthenticated ? (
          // Public Stack
          <>
            <Stack.Screen 
              name="Home" 
              options={{ headerShown: false }} 
            >
               {(props) => <Landing {...props} onLogin={() => props.navigation.navigate('Login')} />}
            </Stack.Screen>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Authenticated Stack (Now Drawer)
          <Stack.Screen 
            name="AppDrawer" 
            component={AuthenticatedDrawer} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationWrapper />
      </PaperProvider>
    </AuthProvider>
  );
}

