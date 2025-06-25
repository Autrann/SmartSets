import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';

type Registro = {
  id: string;
  nombre: string;
  seriesPlaneadas: number;
  seriesRealizadas: number;
  status: 'completado' | 'interrumpido';
  fecha: string;
};

interface Props {
  registros: Registro[];
  isDark: boolean;
  colors: any;
  onVolver: () => void;
}

export default function HistoryScreen({ registros, isDark, colors, onVolver }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, paddingHorizontal: 12 }]}>
      <Text style={[styles.bigText, { color: colors.text }]}>Historial de ejercicios</Text>
      {registros.length === 0 ? (
        <Text style={{ color: colors.subtext, marginVertical: 20 }}>No hay registros aún.</Text>
      ) : (
        <FlatList
          data={registros}
          keyExtractor={item => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={[styles.historialItem, { backgroundColor: isDark ? '#1d1d1d' : '#f4f4fa' }]}>
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 17 }}>{item.nombre}</Text>
              <Text style={{ color: colors.text, marginTop: 4 }}>Fecha: <Text style={{ color: colors.subtext }}>{item.fecha}</Text></Text>
              <Text style={{ color: colors.text, marginTop: 2 }}>
                Series planeadas: {item.seriesPlaneadas} | Realizadas: {item.seriesRealizadas}
              </Text>
              <Text style={{
                marginTop: 2,
                color: item.status === 'completado' ? '#3bb36a' : '#f14b3b',
                fontWeight: 'bold'
              }}>
                {item.status === 'completado' ? 'Completado' : 'Interrumpido'}
              </Text>
            </View>
          )}
        />
      )}
      <CustomButton
        title="Volver"
        onPress={onVolver}
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
  historialItem: {
    marginVertical: 7,
    padding: 12,
    borderRadius: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
});
