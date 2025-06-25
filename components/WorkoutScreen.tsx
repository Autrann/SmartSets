import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';

interface Props {
  nombreEjercicio: string;
  serieActual: number;
  series: string;
  timer: number;
  esperandoInicioSerie: boolean;
  onTerminarSerie: () => void;
  onIniciarNuevaSerie: () => void;
  onCancelar: () => void;
  isDark: boolean;
  colors: any;
}

export default function WorkoutScreen({
  nombreEjercicio,
  serieActual,
  series,
  timer,
  esperandoInicioSerie,
  onTerminarSerie,
  onIniciarNuevaSerie,
  onCancelar,
  isDark,
  colors,
}: Props) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.bigText, { color: colors.text }]}>{nombreEjercicio}</Text>
      <Text style={[styles.subText, { color: colors.subtext }]}>
        Serie <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{serieActual}</Text> de <Text style={{ fontWeight: 'bold' }}>{series}</Text>
      </Text>
      {/* Lógica: descanso terminado, esperar botón para comenzar nueva serie */}
      {esperandoInicioSerie ? (
        <CustomButton
          title="Comenzar nueva serie"
          onPress={onIniciarNuevaSerie}
          style={{ backgroundColor: colors.primary }}
        />
      ) : timer === 0 ? (
        <CustomButton title="Terminé la serie" onPress={onTerminarSerie} />
      ) : (
        <Text style={[styles.timerText, { color: colors.primary }]}>
          Descanso: <Text style={{ fontWeight: 'bold' }}>{timer}s</Text>
        </Text>
      )}
      <CustomButton
        title="Cancelar ejercicio"
        onPress={onCancelar}
        style={{ backgroundColor: '#ff6060', marginTop: 14 }}
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
  subText: {
    fontSize: 18,
    marginBottom: 18,
    marginTop: 6,
  },
  timerText: {
    fontSize: 36,
    margin: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});
