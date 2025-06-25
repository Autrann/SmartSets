import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
  registrosPorDia: { [dia: string]: Registro[] };
  isDark: boolean;
  colors: any;
  onVolver: () => void;
}

export default function HistoryScreen({ registrosPorDia, isDark, colors, onVolver }: Props) {
  const [abierto, setAbierto] = useState<{ [dia: string]: boolean }>({});

  const dias = Object.keys(registrosPorDia).sort((a, b) => b.localeCompare(a)); // recientes arriba

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, paddingHorizontal: 12, minHeight: 350 }]}>
      <Text style={[styles.bigText, { color: colors.text }]}>Historial de ejercicios</Text>
      {dias.length === 0 ? (
        <Text style={{ color: colors.subtext, marginVertical: 20 }}>No hay registros aún.</Text>
      ) : (
        <FlatList
          data={dias}
          keyExtractor={item => item}
          renderItem={({ item: dia }) => (
            <View>
              <Pressable onPress={() => setAbierto(prev => ({ ...prev, [dia]: !prev[dia] }))} style={styles.diaHeader}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.primary }}>
                  {dia}
                </Text>
                <Text style={{ color: colors.subtext }}>
                  {abierto[dia] ? '▲' : '▼'}
                </Text>
              </Pressable>
              {abierto[dia] && (
                registrosPorDia[dia].map(item => (
                  <View key={item.id} style={[styles.historialItem, { backgroundColor: isDark ? '#1d1d1d' : '#f4f4fa' }]}>
                    <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 17 }}>{item.nombre}</Text>
                    <Text style={{ color: colors.text, marginTop: 4 }}>Hora: <Text style={{ color: colors.subtext }}>{item.fecha.split(' ')[1]}</Text></Text>
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
                ))
              )}
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
  diaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6ecfa55',
    padding: 10,
    borderRadius: 7,
    marginTop: 8,
    marginBottom: 2,
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
