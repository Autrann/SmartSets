import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, useColorScheme, View } from 'react-native';
import ConfigScreen from '../components/ConfigScreen';
import HistoryScreen from '../components/HistoryScreen';
import WorkoutScreen from '../components/WorkoutScreen';

type Registro = {
  id: string;
  nombre: string;
  seriesPlaneadas: number;
  seriesRealizadas: number;
  status: 'completado' | 'interrumpido';
  fecha: string;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = {
    background: isDark ? '#1a1a1a' : '#f5f5f5',
    card: isDark ? '#242424' : '#fff',
    text: isDark ? '#fafafa' : '#222',
    subtext: isDark ? '#bbbbbb' : '#666',
    border: isDark ? '#333' : '#e0e0e0',
    primary: '#47b5ff',
    buttonText: '#fff'
  };

  const [pantalla, setPantalla] = useState<'config' | 'workout' | 'historial'>('config');
  const [nombreEjercicio, setNombreEjercicio] = useState<string>('');
  const [series, setSeries] = useState<string>('');
  const [descanso, setDescanso] = useState<string>('');
  const [serieActual, setSerieActual] = useState<number>(1);
  const [timer, setTimer] = useState<number>(0);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { cargarHistorial(); }, []);
  const cargarHistorial = async () => {
    try {
      const json = await AsyncStorage.getItem('historial');
      setRegistros(json ? JSON.parse(json) : []);
    } catch (e) { }
  };
  const guardarRegistro = async (registro: Registro) => {
    const nuevosRegistros = [registro, ...registros];
    setRegistros(nuevosRegistros);
    await AsyncStorage.setItem('historial', JSON.stringify(nuevosRegistros));
  };
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const empezarEntrenamiento = () => {
    setPantalla('workout');
    setSerieActual(1);
    setTimer(0);
  };

  const terminarSerie = async () => {
    if (serieActual < parseInt(series)) {
      setTimer(parseInt(descanso));
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setSerieActual((s) => s + 1);
            setTimer(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      await guardarRegistro({
        id: Date.now().toString(),
        nombre: nombreEjercicio,
        seriesPlaneadas: parseInt(series),
        seriesRealizadas: parseInt(series),
        status: 'completado',
        fecha: new Date().toLocaleString(),
      });
      Alert.alert('¡Entrenamiento terminado!', '¡Buen trabajo!');
      setPantalla('config');
      limpiarInputs();
    }
  };

  const cancelarEntrenamiento = async () => {
    await guardarRegistro({
      id: Date.now().toString(),
      nombre: nombreEjercicio,
      seriesPlaneadas: parseInt(series),
      seriesRealizadas: serieActual - 1,
      status: 'interrumpido',
      fecha: new Date().toLocaleString(),
    });
    Alert.alert('Entrenamiento interrumpido', 'Se guardó el progreso realizado.');
    setPantalla('config');
    limpiarInputs();
  };

  const limpiarInputs = () => {
    setNombreEjercicio('');
    setSeries('');
    setDescanso('');
    setSerieActual(1);
    setTimer(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      {pantalla === 'config' && (
        <ConfigScreen
          nombreEjercicio={nombreEjercicio}
          setNombreEjercicio={setNombreEjercicio}
          series={series}
          setSeries={setSeries}
          descanso={descanso}
          setDescanso={setDescanso}
          onStart={empezarEntrenamiento}
          onVerHistorial={() => setPantalla('historial')}
          isDark={isDark}
          colors={colors}
        />
      )}
      {pantalla === 'workout' && (
        <WorkoutScreen
          nombreEjercicio={nombreEjercicio}
          serieActual={serieActual}
          series={series}
          timer={timer}
          onTerminarSerie={terminarSerie}
          onCancelar={cancelarEntrenamiento}
          isDark={isDark}
          colors={colors}
        />
      )}
      {pantalla === 'historial' && (
        <HistoryScreen
          registros={registros}
          isDark={isDark}
          colors={colors}
          onVolver={() => setPantalla('config')}
        />
      )}
      <Text style={{ marginTop: 40, color: colors.subtext, fontSize: 13, opacity: 0.7 }}>
        SmartSets Luis.Dev
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
