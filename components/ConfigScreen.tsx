import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import CustomButton from './CustomButton';

interface Props {
  nombreEjercicio: string;
  setNombreEjercicio: (text: string) => void;
  series: string;
  setSeries: (text: string) => void;
  descanso: string;
  setDescanso: (text: string) => void;
  onStart: () => void;
  onVerHistorial: () => void;
  isDark: boolean;
  colors: any;
}

export default function ConfigScreen({
  nombreEjercicio,
  setNombreEjercicio,
  series,
  setSeries,
  descanso,
  setDescanso,
  onStart,
  onVerHistorial,
  isDark,
  colors,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.bigText, { color: colors.text }]}>Nuevo ejercicio</Text>
      <Text style={[styles.label, { color: colors.subtext }]}>Nombre del ejercicio:</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#232323' : '#f3f8ff' }]}
        value={nombreEjercicio}
        onChangeText={setNombreEjercicio}
        placeholder="Ej: Press Banca"
        placeholderTextColor={isDark ? '#555' : '#aaa'}
      />
      <Text style={[styles.label, { color: colors.subtext }]}>Número de series:</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#232323' : '#f3f8ff' }]}
        keyboardType="numeric"
        value={series}
        onChangeText={setSeries}
        placeholder="Ej: 4"
        placeholderTextColor={isDark ? '#555' : '#aaa'}
      />
      <Text style={[styles.label, { color: colors.subtext }]}>Tiempo de descanso (segundos):</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: isDark ? '#232323' : '#f3f8ff' }]}
        keyboardType="numeric"
        value={descanso}
        onChangeText={setDescanso}
        placeholder="Ej: 60"
        placeholderTextColor={isDark ? '#555' : '#aaa'}
      />
      <CustomButton
        title="Empezar entrenamiento"
        onPress={onStart}
        disabled={!nombreEjercicio || !series || !descanso}
      />
      <CustomButton
        title="Ver registros"
        onPress={onVerHistorial}
        style={{ backgroundColor: isDark ? '#444' : '#bbb' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 18,
    padding: 28,
    borderWidth: 1,
    alignItems: 'center',
  },
  bigText: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  label: {
    marginBottom: 3,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    width: '100%',
    marginBottom: 7,
  },
});
