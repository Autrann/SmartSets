import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';

// Puedes usar el Picker de React Native (nativo) o de @react-native-picker/picker
import { Picker } from '@react-native-picker/picker';

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
  const fechasDisponibles = Object.keys(registrosPorDia).sort((a, b) => b.localeCompare(a));
  const [selectedDate, setSelectedDate] = useState<string>(fechasDisponibles[0] || '');

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, paddingHorizontal: 12, minHeight: 300 }]}>
      <Text style={[styles.bigText, { color: colors.text }]}>Historial de ejercicios</Text>
      
      {fechasDisponibles.length === 0 ? (
        <Text style={{ color: colors.subtext, marginVertical: 20 }}>No hay registros aún.</Text>
      ) : (
        <>
          <Text style={{ marginBottom: 8, color: colors.primary, fontWeight: 'bold' }}>
            Selecciona una fecha:
          </Text>
          <View style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            marginBottom: 12,
            width: '100%',
            overflow: 'hidden',
            backgroundColor: isDark ? '#1a1a1a' : '#f9f9f9',
          }}>
            <Picker
              selectedValue={selectedDate}
              onValueChange={(itemValue) => setSelectedDate(itemValue)}
              mode="dropdown"
              style={{ color: colors.text }}
              dropdownIconColor={colors.primary}
            >
              {fechasDisponibles.map(fecha => (
                <Picker.Item key={fecha} label={fecha} value={fecha} />
              ))}
            </Picker>
          </View>

          {/* Lista solo los registros de la fecha seleccionada */}
          <FlatList
            data={selectedDate ? registrosPorDia[selectedDate] : []}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={[styles.historialItem, { backgroundColor: isDark ? '#1d1d1d' : '#f4f4fa' }]}>
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
            )}
          />
        </>
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
