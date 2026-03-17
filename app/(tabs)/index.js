import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView, Platform, SafeAreaView,
  ScrollView,
  StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { datosChat } from './cerebro';

// --- CONFIGURACIÓN ---
const API_URL = 'https://asistente-movil-free.onrender.com/registro';
const normalizar = (texto) => texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s+]/gi, "");

// --- COMPONENTES AUXILIARES ---
const CajaDeCodigo = ({ titulo, codigo, explicacion }) => (
  <View style={styles.bloqueCodigo}>
    <View style={styles.pestanaCodigo}><Text style={styles.tituloCodigo}>{titulo}</Text></View>
    <View style={styles.cajaNegra}><Text style={styles.textoCodigo}>{codigo}</Text></View>
    {explicacion && (<View style={styles.notaPie}><Text style={styles.explicacionCodigo}>{explicacion}</Text></View>)}
  </View>
);

// --- COMPONENTE: PANEL DE ADMINISTRADOR ---
const AdminPanel = ({ usuarios, alCerrar, alEliminar, alAgregar }) => (
  <SafeAreaView style={styles.chatOverlay}>
    <View style={styles.headerChatLargo}>
      <View><Text style={styles.tituloAppHeader}>PANEL DE CONTROL</Text><Text style={styles.subtituloAppHeader}>GESTIÓN DE USUARIOS</Text></View>
      <TouchableOpacity onPress={alCerrar} style={styles.btnCerrarSesion}><Text style={styles.btnCerrarSesionTexto}>VOLVER</Text></TouchableOpacity>
    </View>
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList data={usuarios} extraData={usuarios} keyExtractor={(item) => item.matricula.toString()} renderItem={({ item }) => (
        <View style={styles.itemUsuario}>
          <View><Text style={{ color: '#fff', fontWeight: 'bold' }}>{item.nombre} {item.apellido}</Text><Text style={{ color: '#38bdf8', fontSize: 12 }}>{item.rol?.toUpperCase()} - MAT: {item.matricula}</Text></View>
          <TouchableOpacity onPress={() => alEliminar(item.matricula)} style={styles.btnEliminar}><Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>BORRAR</Text></TouchableOpacity>
        </View>
      )} />
      <TouchableOpacity style={styles.btnAzulNeon} onPress={alAgregar}><Text style={styles.btnTextoBlanco}>+ REGISTRAR NUEVO</Text></TouchableOpacity>
    </View>
  </SafeAreaView>
);

// --- COMPONENTE: REGISTRO ---
const RegistroScreen = ({ alRegistrar, irALogin }) => {
  const [rol, setRol] = useState('alumno');
  const [form, setForm] = useState({ nombre: '', apellido: '', materia: '', semestre: '', matricula: '', password: '' });
  return (
    <ImageBackground source={require('../../assets/images/fondo-servidores.jpg')} style={styles.fullBackground} blurRadius={3}>
      <SafeAreaView style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.centerScroll}>
          <Text style={styles.authMainTitle}>REGISTRO</Text>
          <View style={styles.glassBoxRegistro}>
            <View style={styles.rolSelectorNeon}>
              <TouchableOpacity onPress={() => setRol('alumno')} style={[styles.rolBtn, rol === 'alumno' && styles.rolBtnActivo]}><Text style={styles.rolTexto}>Alumno</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setRol('maestro')} style={[styles.rolBtn, rol === 'maestro' && styles.rolBtnActivo]}><Text style={styles.rolTexto}>Maestro</Text></TouchableOpacity>
            </View>
            <Text style={styles.labelInput}>Nombre</Text><TextInput style={styles.authInput} placeholder="Oscar" placeholderTextColor="#64748b" onChangeText={t => setForm({ ...form, nombre: t })} />
            <Text style={styles.labelInput}>Primer Apellido</Text><TextInput style={styles.authInput} placeholder="Herrera" placeholderTextColor="#64748b" onChangeText={t => setForm({ ...form, apellido: t })} />
            {rol === 'maestro' && (<><Text style={styles.labelInput}>Materia</Text><TextInput style={styles.authInput} placeholder="Ej: POO" placeholderTextColor="#64748b" onChangeText={t => setForm({ ...form, materia: t })} /></>)}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: '48%' }}><Text style={styles.labelInput}>Semestre</Text><TextInput style={styles.authInput} placeholder="9" keyboardType="numeric" placeholderTextColor="#64748b" onChangeText={t => setForm({ ...form, semestre: t })} /></View>
              <View style={{ width: '48%' }}><Text style={styles.labelInput}>Matrícula</Text><TextInput style={styles.authInput} placeholder="2021..." keyboardType="numeric" placeholderTextColor="#64748b" onChangeText={t => setForm({ ...form, matricula: t })} /></View>
            </View>
            <Text style={styles.labelInput}>Contraseña</Text><TextInput style={styles.authInput} placeholder="*****" secureTextEntry placeholderTextColor="#64748b" onChangeText={t => setForm({ ...form, password: t })} />
            <TouchableOpacity style={styles.btnAzulNeon} onPress={() => alRegistrar({ ...form, rol })}><Text style={styles.btnTextoBlanco}>GUARDAR REGISTRO</Text></TouchableOpacity>
            <TouchableOpacity onPress={irALogin} style={{ marginTop: 15 }}><Text style={styles.linkTexto}>Regresar al Login</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

// --- COMPONENTE: LOGIN ---
const LoginScreen = ({ alLogin, irARegistro }) => {
  const [mat, setMat] = useState('');
  const [pass, setPass] = useState('');
  return (
    <ImageBackground source={require('../../assets/images/fondo-servidores.jpg')} style={styles.fullBackground}>
      <View style={styles.overlay}>
        <View style={styles.heroLayout}>
          <View style={styles.heroSide}>
            <Text style={{ fontSize: 50 }}>🚀</Text>
            <Text style={styles.heroTitulo}>IMPULSA TU CARRERA PROFESIONAL EN PROGRAMACIÓN</Text>
            <Text style={styles.heroSub}>Domina los lenguajes que construyen el futuro.</Text>
          </View>
          <View style={styles.glassBoxLogin}>
            <Text style={styles.authTituloLogin}>Acceso</Text>
            <TextInput style={styles.authInput} placeholder="Matrícula" keyboardType="numeric" placeholderTextColor="#64748b" onChangeText={setMat} />
            <TextInput style={[styles.authInput, { marginTop: 10 }]} placeholder="Contraseña" secureTextEntry placeholderTextColor="#64748b" onChangeText={setPass} />
            <TouchableOpacity style={styles.btnFucsiaNeon} onPress={() => alLogin(mat, pass)}><Text style={styles.btnTextoBlanco}>¡SÍ, QUIERO ENTRAR!</Text></TouchableOpacity>
            <TouchableOpacity onPress={irARegistro} style={{ marginTop: 20 }}><Text style={styles.linkTexto}>Regístrate aquí</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

// --- MAIN APP ---
export default function MainApp() {
  const [vista, setVista] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [baseUsuarios, setBaseUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [chat, setChat] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState(null); // ESTADO PARA EL CONTEXTO
  const flatListRef = useRef(null);

  const cargarUsuarios = async () => {
    try { const res = await fetch(`${API_URL}/usuarios`); const data = await res.json(); setBaseUsuarios(Array.isArray(data) ? data : []); } catch (e) { console.error(e); }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const manejarRegistro = async (nuevoU) => {
    try {
      const res = await fetch(`${API_URL}/usuarios`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(nuevoU) });
      if (res.ok) {
        Alert.alert("Éxito", "Usuario registrado");
        await cargarUsuarios();
        setVista(usuario?.rol === 'maestro' ? 'admin' : 'login');
      } else Alert.alert("Error", "No se pudo registrar");
    } catch (e) { Alert.alert("Error", "Servidor no responde"); }
  };

  const eliminarUsuario = async (mat) => {
    await fetch(`${API_URL}/usuarios/${mat}`, { method: 'DELETE' });
    await cargarUsuarios();
  };

  const manejarLogin = async (m, p) => {
    try {
      const res = await fetch(`${API_URL}/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ matricula: m, password: p }) });
      const data = await res.json();
      if (res.ok) {
        setUsuario(data.user);
        setVista('chat');
        setChat([{ id: 0, texto: `¡Bienvenido ${data.user.nombre}! Eres usuario ${data.user.rol}.`, esMio: false }]);
      }
      else Alert.alert("Error", "Matrícula o contraseña incorrectos.");
    } catch (e) { Alert.alert("Error", "Servidor no responde."); }
  };

  const manejarEnvio = () => {
    if (!mensaje.trim()) return;
    const txt = normalizar(mensaje);
    const nMsg = { id: Date.now(), texto: mensaje, esMio: true };
    
    let botMsg = { id: Date.now() + 1, esMio: false, texto: "No encontré ese término. Intenta con 'Java' o escribe 'temas'.", codigos: null };

    // 1. Detección de Lenguaje (Cambio de Contexto)
    const lang = datosChat.find(item => item.tipo === "concepto" && item.palabrasClave.some(p => txt.includes(p)));
    
    if (lang) {
      setCategoriaActual(lang.categoria);
      botMsg = { ...lang, id: Date.now() + 1, esMio: false, texto: lang.definicion };
    } 
    // 2. Detección de petición de 'temas'
    else if (txt.includes("temas")) {
      if (!categoriaActual) {
        botMsg = { id: Date.now() + 1, esMio: false, texto: "Aún no has seleccionado un lenguaje. Por favor, escribe 'Java', 'Python', 'C++' o 'HTML' para empezar." };
      } else {
        const temas = datosChat.filter(item => item.categoria === categoriaActual && item.tipo === 'tecnico');
        botMsg = { id: Date.now() + 1, esMio: false, texto: `📚 Temas en ${categoriaActual.toUpperCase()}:\n\n` + temas.map(t => `• ${t.nombre}`).join("\n") };
      }
    } 
    // 3. Búsqueda técnica normal
else {
      let res = null;

      // Paso 1: Intentar buscar SOLO en la categoría actual
      if (categoriaActual) {
        res = datosChat.find(item => 
          item.categoria === categoriaActual && 
          item.palabrasClave.some(p => txt.includes(p))
        );
      }

      // Paso 2: Si no se encontró en la categoría, buscar globalmente (o avisar)
      if (!res) {
        res = datosChat.find(item => item.palabrasClave.some(p => txt.includes(p)));
      }

      if (res) {
        botMsg = { ...res, id: Date.now() + 1, esMio: false, texto: res.definicion };
      }
    }

    setChat(prev => [...prev, nMsg, botMsg]);
    setMensaje('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

  };

  if (vista === 'registro') return <RegistroScreen alRegistrar={manejarRegistro} irALogin={() => setVista(usuario?.rol === 'maestro' ? 'admin' : 'login')} />;
  if (vista === 'admin') return <AdminPanel usuarios={baseUsuarios} alCerrar={() => setVista('chat')} alEliminar={eliminarUsuario} alAgregar={() => setVista('registro')} />;
  if (vista === 'login') return <LoginScreen alLogin={manejarLogin} irARegistro={() => setVista('registro')} />;

  return (
    <ImageBackground source={require('../../assets/images/fondo-servidores.jpg')} style={styles.fullBackground} blurRadius={10}>
       <SafeAreaView style={styles.chatOverlay}>
          <View style={styles.headerChatLargo}>
             <View style={{flexDirection:'row', alignItems:'center'}}>
               <View style={styles.badgeIconoCuadrado}><Text style={{fontSize:22}}>🎓</Text></View>
               <View style={{marginLeft:10}}><Text style={styles.tituloAppHeader}>APOYO EDUCATIVO</Text><Text style={styles.subtituloAppHeader}>PROGRAMACIÓN</Text></View>
             </View>
             <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{alignItems:'flex-end', marginRight:15}}><Text style={styles.rolHeader}>{usuario?.rol?.toUpperCase()}</Text><Text style={styles.nombreHeader}>{usuario?.nombre}</Text></View>
                {usuario?.rol === 'maestro' && <TouchableOpacity onPress={() => setVista('admin')} style={[styles.btnCerrarSesion, {backgroundColor: '#38bdf8', marginRight:8}]}><Text style={styles.btnCerrarSesionTexto}>ADMIN</Text></TouchableOpacity>}
                <TouchableOpacity onPress={() => {setUsuario(null); setVista('login');}} style={styles.btnCerrarSesion}><Text style={styles.btnCerrarSesionTexto}>SALIR</Text></TouchableOpacity>
             </View>
          </View>
          <FlatList ref={flatListRef} data={chat} extraData={chat} keyExtractor={i => i.id.toString()} renderItem={({ item }) => (
            <View style={[styles.burbuja, item.esMio ? styles.mio : styles.bot]}>
              <Text style={{color:'#fff', fontSize:15}}>{item.texto}</Text>
              {item.codigos?.map((c, i) => <CajaDeCodigo key={i} titulo={c.titulo} codigo={c.cuerpo} explicacion={c.explicacion} />)}
            </View>
          )} />
          <KeyboardAvoidingView behavior={Platform.OS==="ios"?"padding":"height"} style={styles.inputArea}>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.input} value={mensaje} onChangeText={setMensaje} placeholder="Escribe tu duda..." placeholderTextColor="#64748b"/>
              <TouchableOpacity onPress={manejarEnvio}><Text style={{fontSize:22, color:'#e91e63'}}>➤</Text></TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
       </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullBackground: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(8, 28, 52, 0.85)', justifyContent: 'center', alignItems: 'center' },
  chatOverlay: { flex: 1, backgroundColor: 'rgba(8, 28, 52, 0.7)' },
  centerScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  glassBoxRegistro: { width: '100%', maxWidth: 400, padding: 25, backgroundColor: 'rgba(30, 41, 59, 0.95)', borderRadius: 15, borderWidth: 2, borderColor: '#38bdf8' },
  glassBoxLogin: { width: 380, padding: 30, backgroundColor: 'rgba(30, 41, 59, 0.9)', borderRadius: 15, borderWidth: 1, borderColor: '#38bdf8' },
  authMainTitle: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  authTituloLogin: { fontSize: 38, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  labelInput: { color: '#fff', fontSize: 13, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  authInput: { backgroundColor: '#fff', borderRadius: 8, padding: 12, color: '#000', fontSize: 16 },
  rolSelectorNeon: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 5, marginBottom: 15 },
  rolBtn: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 8 },
  rolBtnActivo: { backgroundColor: '#5856d6' },
  rolTexto: { color: '#fff', fontWeight: 'bold' },
  btnAzulNeon: { backgroundColor: '#5856d6', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnFucsiaNeon: { backgroundColor: '#e91e63', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 25 },
  btnTextoBlanco: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkTexto: { color: '#38bdf8', fontWeight: 'bold', textAlign: 'center' },
  headerChatLargo: { width: '100%', padding: 20, backgroundColor: 'rgba(15, 23, 42, 0.9)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#38bdf8', paddingTop: 40 },
  badgeIconoCuadrado: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  tituloAppHeader: { color: '#fff', fontWeight: '900', fontSize: 16 },
  subtituloAppHeader: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  rolHeader: { color: '#38bdf8', fontSize: 10, fontWeight: '900' },
  nombreHeader: { color: '#fff', fontWeight: 'bold', fontSize: 15, textTransform: 'uppercase' },
  btnCerrarSesion: { backgroundColor: '#ef4444', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  btnCerrarSesionTexto: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  itemUsuario: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.2)' },
  btnEliminar: { backgroundColor: '#ef4444', padding: 10, borderRadius: 8 },
  bloqueCodigo: { marginTop: 15, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#38bdf8' },
  pestanaCodigo: { backgroundColor: '#0f172a', padding: 8 },
  tituloCodigo: { color: '#38bdf8', fontSize: 11, fontWeight: 'bold' },
  cajaNegra: { backgroundColor: '#020617', padding: 15 },
  textoCodigo: { color: '#a5b4fc', fontFamily: Platform.OS === 'web' ? 'Courier' : 'monospace', fontSize: 13 },
  notaPie: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderLeftWidth: 4, borderLeftColor: '#38bdf8' },
  explicacionCodigo: { color: '#fff', fontSize: 12, opacity: 0.9 },
  burbuja: { padding: 15, borderRadius: 18, marginVertical: 8, maxWidth: '85%' },
  mio: { alignSelf: 'flex-end', backgroundColor: '#e91e63' },
  bot: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  inputArea: { padding: 15, backgroundColor: 'rgba(0,0,0,0.2)' },
  inputWrapper: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 20, alignItems: 'center', height: 50 },
  input: { flex: 1, color: '#000' },
  heroLayout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: '5%' },
  heroSide: { flex: 1, maxWidth: 450, paddingRight: 30 },
  heroTitulo: { fontSize: 32, fontWeight: '900', color: '#fff' },
  heroSub: { color: '#cbd5e1', fontSize: 16, marginTop: 10 }
});
