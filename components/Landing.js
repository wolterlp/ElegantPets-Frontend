import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, ImageBackground, TouchableOpacity, Pressable, StyleSheet, useWindowDimensions, TextInput, Linking, Image, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import Svg, { Use } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';


const COLORS = {
  white: '#ffffff',
  gold: '#FFD700', //'#d4af37',
  goldDark: '#b38f2a',
  black: '#000000',
};

const SERVICES = [
  {
    name: 'Baño y secado profesional',
    desc: 'Baño premium con productos suaves y secado seguro.',
    price: 'Desde $30.000',
    image: require('../assets/page1/BanoSecadoProfesional2.png'),
  },
  {
    name: 'Corte de pelo y peinado personalizado',
    desc: 'Estilo según la raza y preferencias del propietario.',
    price: 'Desde $35.000',
    image: require('../assets/page1/cortePelo.jpg'),
  },
  {
    name: 'Limpieza dental',
    desc: 'Higiene bucal para una sonrisa sana y fresca.',
    price: 'Desde $25.000',
    image: require('../assets/page1/cepillandose2.png'),
  },
  {
    name: 'Corte de uñas',
    desc: 'Corte seguro y limado sin estrés.',
    price: 'Desde $10.000',
    image: require('../assets/page1/corteUnas.png'),
  },
  {
    name: 'Tratamientos antipulgas y garrapatas',
    desc: 'Protección efectiva y cuidadosa contra parásitos.',
    price: 'Desde $30.000',
    image: require('../assets/page1/pexelsphoto3377909.jpeg'),
    image: require('../assets/page1/TratamientosAntipulgasGarrapatas2.png'),
  },
  {
    name: 'Masajes relajantes y spa premium',
    desc: 'Relajación y bienestar para tu mejor amigo.',
    price: 'Desde $20.000',
    image: require('../assets/page1/pexelsphoto3377909.jpeg'),
  },
  {
    name: 'Primeros auxilios',
    desc: 'Cuidado rápido y seguro ante emergencias.',
    price: 'Desde $40.000',
    image: require('../assets/page1/primerosAuxilios.png'),
  },
  {
    name: 'Recogida y entrega a domicilio (opcional)',
    desc: 'Comodidad total con transporte seguro.',
    price: 'Consultar tarifas',
    image: require('../assets/page1/transporteMascota.png'),
  },
];

const SPECIALIZED_SERVICES = [
  {
    name: 'Reproducción bovina: inseminación artificial',
    desc: 'Servicio profesional para mejorar la eficiencia reproductiva.',
    price: 'Consultar precio',
    image: require('../assets/page1/inseminacionBovina.jpg'),
  },
  {
    name: 'Identificación bovina: marcación y tatuado',
    desc: 'Métodos seguros para la identificación del ganado.',
    price: 'Consultar precio',
    image: require('../assets/page1/marcacionBovina.png'),
  },
  {
    name: 'Formulación de dietas y planes nutricionales',
    desc: 'Dietas personalizadas según especie y necesidades.',
    price: 'Consultar precio',
    image: require('../assets/page1/dietasNutricion3.jpg'),
  },
  {
    name: 'Acuicultura: diagnóstico de patologías',
    desc: 'Detección y manejo de enfermedades en sistemas acuícolas.',
    price: 'Consultar precio',
    image: require('../assets/page1/patologiasAcuicultura2.png'),
  },
  {
    name: 'Acuicultura: nutrición y alimentación',
    desc: 'Planes nutricionales para peces y organismos acuáticos.',
    price: 'Consultar precio',
    image: require('../assets/page1/nutricionAcuicultura.png'),
  },
  {
    name: 'Nutrición en aves de postura',
    desc: 'Manejo nutricional para mejorar la producción y bienestar.',
    price: 'Consultar precio',
    image: require('../assets/page1/avesPosturaNutricion.png'),
  },
];


export default function Landing({ onLogin }) {
  const { width, height } = useWindowDimensions();
  const isMobile = width <= 768;
  const heroHeight = height;
  const textWidth = width > 991 ? 740 : width > 767 ? 540 : 340;
  const kickerText = 'ELEGANT PETS SPA';
  const baseFont = 72; // tamaño objetivo en pantallas grandes
  const letterSpace = 10; // coincide con styles.heroKicker.letterSpacing
  const avgCharFactor = 0.62; // ancho aproximado por carácter
  const estimateWidth = (f) => kickerText.length * avgCharFactor * f + letterSpace * (kickerText.length - 1);
  let titleSize = baseFont;
  while (estimateWidth(titleSize) > textWidth - 16 && titleSize > 14) {
    titleSize -= 1;
  }
  const heroPadTop = width > 991 ? 120 : width > 767 ? 96 : 72;
  const cellMinHBig = width > 991 ? 331 : width > 767 ? 257 : width > 575 ? 578 : 364;
  const cellMinHSmall = width > 991 ? 289 : width > 767 ? 224 : width > 575 ? 504 : 317;
  const scrollRef = useRef(null);
  const anchors = useRef({ eslogan: 0, servicios: 0, especializados: 0, tienda: 0, cita: 0, contacto: 0 });

  const HEADER_H = 64;
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const scrollTo = (key) => {
    setMenuOpen(false); // Close menu on selection
    const y = anchors.current[key] ?? 0;
    if (scrollRef.current) scrollRef.current.scrollTo({ y: Math.max(y - HEADER_H, 0), animated: true });
  };

  const [ownerName, setOwnerName] = useState('');
  const [petType, setPetType] = useState('');
  const [serviceWanted, setServiceWanted] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [comments, setComments] = useState('');

  const openWhatsApp = (overrides) => {
    const to = '573136685471';
    const name = overrides?.ownerName ?? ownerName;
    const pet = overrides?.petType ?? petType;
    const service = overrides?.serviceWanted ?? serviceWanted;
    const dt = overrides?.dateTime ?? dateTime;
    const msg = `Hola Elegant Pets Spa, quiero agendar una cita.\n🐾 Nombre: ${name}\n🐕 Mascota: ${pet}\n💆‍♂️ Servicio: ${service}\n📅 Fecha y hora: ${dt}\n\n📍 Dirección del spa: Calle 7 #14-13, Florida Valle\n🌐 Google Maps: https://maps.google.com/?q=3.325972,-76.236619\n¡Gracias!`;
    const url = `https://wa.me/${to}?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url);
  };

  const openExternal = (url) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank'); // abre en nueva pestaña
    } else {
      Linking.openURL(url);       // abre en app móvil
    }
  };

  return (
    <View style={styles.page}>
      <View style={[styles.header, isScrolled && styles.headerScrolled]}>
        <TouchableOpacity style={styles.logoWrap} onPress={() => scrollTo('eslogan')}>
          <Image
            source={require('../assets/homeLogo4.png')}
            style={[styles.headerLogoLarge, isMobile && { width: 140, height: 82, top: 10 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <View style={styles.headerSpacer} />
        
        {!isMobile ? (
          <View style={styles.headerMenu}>
            <Pressable style={styles.headerNavLink} onPress={() => scrollTo('servicios')}>
              {({ hovered }) => (
                <Text style={[styles.headerLink, hovered && styles.headerLinkHover]}>Servicios Spa</Text>
              )}
            </Pressable>
            <Pressable style={styles.headerNavLink} onPress={() => scrollTo('especializados')}>
              {({ hovered }) => (
                <Text style={[styles.headerLink, hovered && styles.headerLinkHover]}>Servicios Especializados</Text>
              )}
            </Pressable>
            <Pressable style={styles.headerNavLink} onPress={() => scrollTo('cita')}>
              {({ hovered }) => (
                <Text style={[styles.headerLink, hovered && styles.headerLinkHover]}>Separar cita</Text>
              )}
            </Pressable>
            {/* Tienda → enlace externo */}
            <Pressable
              style={styles.headerNavLink}
              onPress={() => openExternal('https://mi-tienda.com')}
            >
              {({ hovered }) => (
                <Text style={[styles.headerLink, hovered && styles.headerLinkHover]}>Tienda</Text>
              )}
            </Pressable>

            <Pressable style={styles.headerNavLink} onPress={() => scrollTo('contacto')}>
              {({ hovered }) => (
                <Text style={[styles.headerLink, hovered && styles.headerLinkHover]}>Contacto</Text>
              )}
            </Pressable>

             {/* Login Button */}
             <Pressable style={styles.headerNavLink} onPress={onLogin}>
              {({ hovered }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="person-circle-outline" size={20} color={COLORS.gold} />
                  <Text style={[styles.headerLink, hovered && styles.headerLinkHover]}>Ingresar</Text>
                </View>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
             <TouchableOpacity onPress={onLogin} style={styles.mobileMenuBtn}>
                <Ionicons name="person-circle-outline" size={28} color={COLORS.gold} />
             </TouchableOpacity>
             <TouchableOpacity onPress={toggleMenu} style={styles.mobileMenuBtn}>
                <Ionicons name={menuOpen ? "close" : "menu"} size={32} color={COLORS.gold} />
             </TouchableOpacity>
          </View>
        )}
        
        {/* Mobile Menu Dropdown */}
        {isMobile && menuOpen && (
          <View style={styles.mobileMenuDropdown}>
            <TouchableOpacity style={styles.mobileMenuItem} onPress={() => scrollTo('servicios')}>
              <Text style={styles.mobileMenuText}>Servicios Spa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileMenuItem} onPress={() => scrollTo('especializados')}>
              <Text style={styles.mobileMenuText}>Servicios Especializados</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileMenuItem} onPress={() => scrollTo('cita')}>
              <Text style={styles.mobileMenuText}>Separar cita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileMenuItem} onPress={() => { setMenuOpen(false); openExternal('https://mi-tienda.com'); }}>
              <Text style={styles.mobileMenuText}>Tienda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.mobileMenuItem} onPress={() => scrollTo('contacto')}>
              <Text style={styles.mobileMenuText}>Contacto</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <ScrollView
        ref={scrollRef}
        style={styles.wrap}
        contentContainerStyle={{ paddingBottom: 40 }}
        onScroll={(e) => setIsScrolled(e.nativeEvent.contentOffset.y > 8)}
        scrollEventThrottle={16}
      >
        <ImageBackground
          source={require('../assets/page1/pexelsphoto406014.jpeg')}
          style={[styles.hero, { height: heroHeight, width: '100%', paddingTop: heroPadTop }]}
          imageStyle={styles.heroImage}
          onLayout={(e) => { anchors.current.eslogan = e.nativeEvent.layout.y; }}
        >
          <View style={[styles.heroTextBox, { width: textWidth, maxWidth: textWidth }]}>
            <Text style={[styles.bannerKicker, { color: '#FFD700' }, isMobile && { fontSize: 12, letterSpacing: 2 }]}>Jency Paola</Text>
            <Text 
              numberOfLines={isMobile ? 0 : 1} 
              style={[styles.heroKicker, { fontSize: isMobile ? 30 : titleSize }, isMobile && { letterSpacing: 2, lineHeight: 42, textAlign: 'center' }]}
            >
              {kickerText}
            </Text>
            <Text style={[styles.heroTagline, isMobile && { fontSize: 16, paddingHorizontal: 10 }]}>Dale a tu peludo todo el amor, el lujo y el cuidado que se merece.</Text>
          </View>
        </ImageBackground>

        {/* Servicios */}
        <View style={styles.servicesWrap} onLayout={(e) => (anchors.current.servicios = e.nativeEvent.layout.y)}>
          <Text style={styles.sectionHeading}>Servicios</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <View key={s.name} style={[styles.serviceCard, isMobile && { flexBasis: '100%', maxWidth: '100%' }]}>
                <ImageBackground source={s.image} style={styles.serviceImage} imageStyle={{ borderRadius: 12 }} />
                <View style={styles.serviceBody}>
                  <Text style={styles.serviceTitle}>{s.name}</Text>
                  <Text style={styles.serviceDesc}>{s.desc}</Text>
                  <Text style={styles.servicePrice}>{s.price}</Text>
                  <TouchableOpacity onPress={() => openWhatsApp({ serviceWanted: s.name })} style={styles.serviceButton}><Text style={styles.serviceButtonLabel}>Separar cita</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <ImageBackground
          source={require('../assets/page1/pexelsphoto3452072.jpeg')}
          style={styles.banner}
          imageStyle={styles.bannerImage}
        >
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerBox}>
            <Text style={styles.bannerTitle}>Tu compañero merece lo mejor, nosotros se lo damos</Text>
            <Text style={styles.bannerKicker}>EXPERIENCIA SPA PREMIUM</Text>
          </View>
        </ImageBackground>

        {/* Separar cita */}
        <View style={styles.separatorGlowContainer}>
          <View style={styles.separatorGlow} />
        </View>

        <View style={styles.citaSection} onLayout={(e) => (anchors.current.cita = e.nativeEvent.layout.y)}>

          <View style={[styles.citaRow, isMobile && { flexDirection: 'column', alignItems: 'center', gap: 0 }]}>
            {/* Imagen a la izquierda sin zoom */}
            <Image
              source={require('../assets/page1/gatoalreves1.png')}
              style={[styles.citaImageLeft, isMobile && { width: '100%', height: 300, marginBottom: 20 }]}
              resizeMode="contain" // mantiene proporción sin zoom
            />

            {/* Formulario a la derecha */}
            <View style={[styles.citaFormRight, isMobile && { width: '100%', alignItems: 'center' }]}>
              <Text style={[styles.sectionHeading2, isMobile && { marginLeft: 0, alignSelf: 'center' }]}>Separar cita</Text>

              <View style={styles.formGrid}>
                <TextInput
                  value={petType}
                  onChangeText={setPetType}
                  placeholder="Tipo de mascota (perro, gato, otro)"
                  style={styles.input}
                />
                <TextInput
                  value={serviceWanted}
                  onChangeText={setServiceWanted}
                  placeholder="Servicio deseado"
                  style={styles.input}
                />
                <TextInput
                  value={dateTime}
                  onChangeText={setDateTime}
                  placeholder="Fecha y hora"
                  style={styles.input}
                />
                <TextInput
                  value={ownerName}
                  onChangeText={setOwnerName}
                  placeholder="Nombre del propietario"
                  style={styles.input}
                />
                <TextInput
                  value={comments}
                  onChangeText={setComments}
                  placeholder="Comentarios adicionales"
                  style={styles.input}
                  multiline
                />
              </View>

              <TouchableOpacity onPress={openWhatsApp} style={styles.ctaButton}>
                <Text style={styles.ctaLabel}>Reservar por WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        
       {/* Servicios Veterinarios Especializados */}
        <View style={styles.servicesWrap} onLayout={(e) => (anchors.current.especializados = e.nativeEvent.layout.y)}>
          <Text style={styles.sectionHeading}>Servicios Veterinarios Especializados</Text>
          <View style={styles.servicesGrid}>
            {SPECIALIZED_SERVICES.map((s) => (
              <View key={s.name} style={[styles.serviceCard, isMobile && { flexBasis: '100%', maxWidth: '100%' }]}>
                <ImageBackground
                  source={s.image}
                  style={styles.serviceImage}
                  imageStyle={{ borderRadius: 12 }}
                />
                <View style={styles.serviceBody}>
                  <Text style={styles.serviceTitle}>{s.name}</Text>
                  <Text style={styles.serviceDesc}>{s.desc}</Text>
                  <Text style={styles.servicePrice}>{s.price}</Text>
                  <TouchableOpacity
                    onPress={() => openWhatsApp({ serviceWanted: s.name })}
                    style={styles.serviceButton}
                  >
                    <Text style={styles.serviceButtonLabel}>Solicitar información</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>


        {/* Contacto */}
        <View
          onLayout={(e) => (anchors.current.contacto = e.nativeEvent.layout.y)}
          style={[styles.contactWrap, { marginTop: 60 }]}   // separación extra
        >
          <Text style={styles.sectionHeading}>Contacto</Text>

          <View style={styles.mapWrap}>
            <View style={styles.mapCard}>
              {Platform.OS === 'web' ? (
                <iframe
                  title="Mapa Elegant Pets Spa"
                  src="https://maps.google.com/maps?q=3.325972,-76.236619&z=16&output=embed"
                  style={styles.mapIframe}
                  frameBorder="0"
                  loading="lazy"
                />
              ) : (
                <WebView
                  style={styles.mapWeb}
                  source={{
                    uri: 'https://maps.google.com/maps?q=3.325972,-76.236619&z=16&output=embed',
                  }}
                />
              )}
            </View>
          </View>

          <TouchableOpacity onPress={() => Linking.openURL('https://maps.google.com/?q=3.325972,-76.236619')}>
            <Text style={styles.link}>Abrir en Google Maps</Text>
          </TouchableOpacity>

          <Text style={styles.contactText}>Dirección: Calle 7 #14-13, Florida Valle</Text>

          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/573136685471')}>
            <Text style={styles.contactText}>Teléfono / WhatsApp: +57 313 668 5471</Text>
          </TouchableOpacity>

          <Text style={styles.contactText}>
            Horario: Lunes a sábado: 8:00 a.m. – 5:30 p.m. · Domingo: cerrado
          </Text>

          <View style={styles.socialRow}>
            <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
              <Text style={styles.link}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
              <Text style={styles.link}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIcon} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  wrap: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  headerScrolled: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.25)',

    // 🔥 Nuevo estándar para sombras en Expo Web
    boxShadow: '0px 4px 12px rgba(0,0,0,0.25)',
  },
  logoWrap: {
    height: 64,
    justifyContent: 'center',
  },
  headerLogoLarge: {
    top: 25,
    width: 280,
    height: 165,
  },
  headerSpacer: {
    flex: 1,
  },
  logoWrap: {
    height: 40,
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 30,
  },
  headerSpacer: {
    flex: 1,
  },
  headerMenu: {
    flexDirection: 'row',
    gap: 16,
  },
  headerNavLink: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gold,
    /*fontFamily: 'Open Sans, sans-serif',*/
  },
  headerLinkHover: {
    color: COLORS.goldDark,
  },
  hero: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'visible',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  heroTextBox: {
    alignItems: 'center',
    paddingHorizontal: 16,
    width: 824,
    maxWidth: 824,
  },
  heroKicker: {
    textTransform: 'uppercase',
    letterSpacing: 10,
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#111111',
    fontWeight: '700',
    textAlign: 'center',
  },
  heroTagline: {
    color: '#111111',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  featureCard: {
    width: '32%',
    minWidth: 220,
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gold,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  featureDesc: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
  },
  banner: {
    height: 695,
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  bannerBox: {
    maxWidth: 600,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '400',
  },
  bannerKicker: {
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 10,
    marginTop: 10,
  },
  ctaBox: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
  },
  ctaButton: {
    borderColor: COLORS.gold,
    borderWidth: 1.5,
    borderRadius: 26,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctaLabel: {
    color: COLORS.black,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  primaryButtonsRow: {
    marginTop: 16,
    width: '100%',
    gap: 10,
  },
  primaryButtonOutline: {
    borderColor: COLORS.gold,
    borderWidth: 1.2,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'stretch',
  },
  primaryButtonLabel: {
    color: COLORS.black,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Section 3 styles
  section3Wrap: {
    width: '100%',
    maxWidth: 928,
    alignSelf: 'center',
    marginTop: 60,
    paddingHorizontal: 12,
  },
  section3Row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  sectionTextCell: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 30,
  },
  sectionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.gold,
    marginBottom: 16,
    alignSelf: 'center',
  },
  sectionTextTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.black,
  },
  sectionTextBody: {
    fontSize: 14,
    color: '#555',
    marginTop: 12,
    textAlign: 'center',
  },
  sectionImageCell: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
    alignSelf: 'center',
  },
  sectionHeading2: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 12,
    alignSelf: 'flex-start',
    marginLeft: 240,
  },
  sectionSub: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  servicesWrap: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  serviceCard: {
    flexBasis: '48%',        // sigue ocupando 48% de ancho
    flexGrow: 1,
    maxWidth: 340,           // ← limita el tamaño máximo del card
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    marginBottom: 12,
  },

  serviceImage: {
    width: '100%',
    height: 160,           // fija una altura razonable
    resizeMode: 'cover',
  },
  serviceBody: {
    padding: 12,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  serviceDesc: {
    fontSize: 13,
    color: '#555',
    marginTop: 8,
  },
  servicePrice: {
    fontSize: 13,
    color: COLORS.gold,
    marginTop: 6,
    fontWeight: '600',
  },
  serviceButton: {
    marginTop: 10,
    borderColor: COLORS.gold,
    borderWidth: 1.2,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  serviceButtonLabel: {
    color: COLORS.black,
    fontWeight: '600',
  },
  shopWrap: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  formWrap: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  formGrid: {
    width: '100%',
    maxWidth: 680,
    gap: 10,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  contactWrap: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  mapWrap: {
    width: '100%',
    marginBottom: 12,
    alignItems: 'center',
    marginHorizontal: -16,
  },
  mapCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'center',
  },
  mapWeb: {
    width: '100%',
    height: 480,
  },
  mapIframe: {
    width: '100%',
    height: 480,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  link: {
    color: COLORS.gold,
    fontWeight: '600',
  },


  citasContainer: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  citasContent: {
    backgroundColor: 'transparent', // panel fino
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
  },

  citasTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },

  citasText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },

  citasButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },

  citasButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  /*
    separatorGlowContainer: {
      width: '100%',
      alignItems: 'center',
      marginVertical: 20,
    },
  
    separatorGlow: {
      width: '70%',
      height: 3,
      //backgroundColor: '#d4af37',
      borderRadius: 50,
      //shadowColor: '#d4af37',
      shadowOpacity: 0.9,
      //shadowRadius: 10,
      elevation: 8,
    },
  */
  citaSection: {
    marginBottom: 40,
    top: 40,
    width: '100%',
    paddingBottom: 20,  // si quieres espacio al final
    overflow: 'hidden',
  },

  /*
  citasContainer: {
    width: '100%',
    minHeight: 600,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },*/

  citasContainer: {
    width: '100%',
    minHeight: 600,
    justifyContent: 'flex-start', // ← pega el contenido al top
    paddingVertical: 0,           // ← elimina padding superior
    paddingHorizontal: 20,        // deja algo de espacio lateral
    borderRadius: 0,              // opcional si quieres que se vea clara, sin curvas
    overflow: 'hidden',
  },

  formWrap: {
    alignItems: 'flex-end',
    width: '100%',
  },

  citaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 20,
  },

  citaImageLeft: {
    width: 400,         // ancho fijo
    height: 500,        // controla la altura según tu diseño
  },

  citaFormRight: {
    flex: 1,
    alignItems: 'flex-start',
  },

  // Mobile Menu Styles
  mobileMenuBtn: {
    padding: 8,
  },
  mobileMenuDropdown: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // Add shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  mobileMenuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mobileMenuText: {
    fontSize: 18,
    color: COLORS.black, // Darker color for menu items
    fontWeight: '500',
    textAlign: 'center',
  },

});
