import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  useColorScheme,
  Vibration,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import ConfigScreen from "../components/ConfigScreen";
import HistoryScreen from "../components/HistoryScreen";
import WorkoutScreen from "../components/WorkoutScreen";

type Registro = {
  id: string;
  nombre: string;
  seriesPlaneadas: number;
  seriesRealizadas: number;
  status: "completado" | "interrumpido";
  fecha: string; // formato: '2025-06-25 15:22:11'
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = {
    background: isDark ? "#1a1a1a" : "#f5f5f5",
    card: isDark ? "#242424" : "#fff",
    text: isDark ? "#fafafa" : "#222",
    subtext: isDark ? "#bbbbbb" : "#666",
    border: isDark ? "#333" : "#e0e0e0",
    primary: "#47b5ff",
    buttonText: "#fff",
  };

  const [pantalla, setPantalla] = useState<"config" | "workout" | "historial">(
    "config"
  );
  const [nombreEjercicio, setNombreEjercicio] = useState<string>("");
  const [series, setSeries] = useState<string>("");
  const [descanso, setDescanso] = useState<string>("");
  const [serieActual, setSerieActual] = useState<number>(1);
  const [timer, setTimer] = useState<number>(0);
  const [esperandoInicioSerie, setEsperandoInicioSerie] =
    useState<boolean>(false); // Nuevo
  const [registros, setRegistros] = useState<Registro[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSeriesChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    setSeries(clean);
  };

  const handleDescansoChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, "");
    setDescanso(clean);
  };

  useEffect(() => {
    cargarHistorial();
  }, []);
  const cargarHistorial = async () => {
    try {
      const json = await AsyncStorage.getItem("historial");
      setRegistros(json ? JSON.parse(json) : []);
    } catch (e) {}
  };
  const guardarRegistro = async (registro: Registro) => {
    const nuevosRegistros = [registro, ...registros];
    setRegistros(nuevosRegistros);
    await AsyncStorage.setItem("historial", JSON.stringify(nuevosRegistros));
  };
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const empezarEntrenamiento = () => {
    setPantalla("workout");
    setSerieActual(1);
    setTimer(0);
    setEsperandoInicioSerie(false);
  };

  // Nueva lógica para terminar la serie (al final del descanso muestra botón para comenzar la nueva)
  const terminarSerie = async () => {
    if (serieActual < parseInt(series)) {
      setTimer(parseInt(descanso));
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            Vibration.vibrate();
            setSerieActual((s) => s + 1); // Aquí automáticamente pasa a la siguiente serie
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
        status: "completado",
        fecha: getFechaDiaHora(),
      });
      Toast.show({
        type: "success",
        text1: "¡Entrenamiento terminado!",
        text2: "¡Buen trabajo!",
        position: "top",
        visibilityTime: 2500,
        autoHide: true,
        topOffset: 50,
      });

      setPantalla("config");
      limpiarInputs();
    }
  };

  // Botón para empezar la siguiente serie
  const iniciarNuevaSerie = () => {
    setEsperandoInicioSerie(false);
    setSerieActual((s) => s + 1);
  };

  const cancelarEntrenamiento = async () => {
    await guardarRegistro({
      id: Date.now().toString(),
      nombre: nombreEjercicio,
      seriesPlaneadas: parseInt(series),
      seriesRealizadas: serieActual - (esperandoInicioSerie ? 0 : 1),
      status: "interrumpido",
      fecha: getFechaDiaHora(),
    });
    Toast.show({
      type: "success",
      text1: "¡Entrenamiento terminado!",
      text2: "¡Buen trabajo!",
      position: "top",
      visibilityTime: 2500,
      autoHide: true,
      topOffset: 50,
    });

    setPantalla("config");
    limpiarInputs();
  };

  const limpiarInputs = () => {
    setNombreEjercicio("");
    setSeries("");
    setDescanso("");
    setSerieActual(1);
    setTimer(0);
    setEsperandoInicioSerie(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Agrupa los registros por día (YYYY-MM-DD)
  const registrosPorDia = registros.reduce((acc, registro) => {
    const fechaDia = registro.fecha.split(" ")[0];
    acc[fechaDia] = acc[fechaDia] || [];
    acc[fechaDia].push(registro);
    return acc;
  }, {} as { [dia: string]: Registro[] });

  return (
    <>
      <View
        style={[styles.mainContainer, { backgroundColor: colors.background }]}
      >
        {pantalla === "config" && (
          <ConfigScreen
            nombreEjercicio={nombreEjercicio}
            setNombreEjercicio={setNombreEjercicio}
            series={series}
            setSeries={handleSeriesChange}
            descanso={descanso}
            setDescanso={handleDescansoChange}
            onStart={empezarEntrenamiento}
            onVerHistorial={() => setPantalla("historial")}
            isDark={isDark}
            colors={colors}
          />
        )}
        {pantalla === "workout" && (
          <WorkoutScreen
            nombreEjercicio={nombreEjercicio}
            serieActual={serieActual}
            series={series}
            timer={timer}
            esperandoInicioSerie={esperandoInicioSerie}
            onTerminarSerie={terminarSerie}
            onIniciarNuevaSerie={iniciarNuevaSerie}
            onCancelar={cancelarEntrenamiento}
            isDark={isDark}
            colors={colors}
          />
        )}
        {pantalla === "historial" && (
          <HistoryScreen
            registrosPorDia={registrosPorDia}
            isDark={isDark}
            colors={colors}
            onVolver={() => setPantalla("config")}
          />
        )}
        <Text
          style={{
            marginTop: 40,
            color: colors.subtext,
            fontSize: 13,
            opacity: 0.7,
          }}
        >
          SmartSets Luis.Dev
        </Text>
      </View>
      <Toast />
    </>
  );
}

// Utilidad: retorna "YYYY-MM-DD HH:MM:SS"
function getFechaDiaHora() {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
