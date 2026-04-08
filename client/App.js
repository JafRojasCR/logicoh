import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';

/**
 * LogicOh! - Pantalla principal
 * Muestra el "Concepto del Día": un término aleatorio de razonamiento
 * lógico y vocabulario universitario (UCR/TEC).
 */

// URL del endpoint desplegado en Vercel
const URL_API = 'https://logicoh.com/api/get-word';

// Paleta de colores oscuros coherente con la estética de la app
const PALETA_OSCURA = [
  '#1E1E1E',
  '#1A3A5F',
  '#2D3436',
  '#2C3E50',
  '#30336B',
  '#130F40',
];

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [concepto, setConcepto] = useState(null);

  // Valor animado para la transición de opacidad
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Devuelve un color aleatorio de la paleta oscura
  const obtenerColorAleatorio = () => {
    return PALETA_OSCURA[Math.floor(Math.random() * PALETA_OSCURA.length)];
  };

  const obtenerConcepto = useCallback(async () => {
    // Desvanecer antes de cargar el nuevo concepto
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      setCargando(true);
      try {
        const respuesta = await fetch(URL_API);
        const datos = await respuesta.json();

        if (!datos.style) {
          datos.style = {
            backgroundColor: obtenerColorAleatorio(),
            textColor: '#FFFFFF',
          };
        }

        setConcepto(datos);
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        // Concepto de respaldo cuando no hay conexión
        setConcepto({
          term: 'Silogismo',
          category: 'sustantivo',
          definition:
            'Argumento lógico que deriva una conclusión a partir de dos premisas relacionadas entre sí.',
          example:
            'Todo ser humano es mortal; Sócrates es un ser humano; por lo tanto, Sócrates es mortal.',
          style: {
            backgroundColor: obtenerColorAleatorio(),
            textColor: '#FFFFFF',
          },
        });
      } finally {
        setCargando(false);
        // Aparecer suavemente con el nuevo concepto
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [fadeAnim]);

  useEffect(() => {
    obtenerConcepto();
  }, [obtenerConcepto]);

  if (cargando && !concepto) {
    return (
      <View style={[estilos.contenedor, { backgroundColor: '#000' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const { term, category, definition, example, style } = concepto;

  return (
    <SafeAreaView
      style={[estilos.contenedor, { backgroundColor: style?.backgroundColor || '#1E1E1E' }]}
    >
      <StatusBar barStyle="light-content" />

      <Animated.View
        style={{ flex: 1, opacity: fadeAnim, width: '100%', justifyContent: 'center' }}
      >
        {/* Etiqueta de categoría */}
        <View style={estilos.etiquetaContenedor}>
          <Text style={estilos.etiquetaTexto}>
            {category ? category.toUpperCase() : 'CONCEPTO VITAL'}
          </Text>
        </View>

        {/* Bloque principal del concepto */}
        <View style={estilos.contenido}>
          <Text style={[estilos.termino, { color: style?.textColor || '#FFF' }]}>
            {term}
          </Text>

          <View style={estilos.divisor} />

          <Text style={[estilos.definicion, { color: style?.textColor || '#FFF' }]}>
            {definition}
          </Text>

          {example ? (
            <Text style={[estilos.ejemplo, { color: style?.textColor || '#AAA' }]}>
              "{example}"
            </Text>
          ) : null}
        </View>

        {/* Pie de pantalla interactivo */}
        <TouchableOpacity
          style={estilos.pie}
          onPress={obtenerConcepto}
          activeOpacity={0.7}
        >
          <Text style={estilos.pieIcono}>↑</Text>
          <Text style={estilos.pieTexto}>TOCA PARA REFRESCAR</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  etiquetaContenedor: {
    position: 'absolute',
    top: 50,
    left: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
  },
  etiquetaTexto: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1.5,
  },
  contenido: {
    width: '100%',
    marginTop: -20,
  },
  termino: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -1.5,
    fontFamily: 'monospace',
  },
  divisor: {
    height: 6,
    width: 65,
    backgroundColor: '#FFF',
    marginVertical: 28,
  },
  definicion: {
    fontSize: 24,
    lineHeight: 34,
    marginBottom: 24,
    fontWeight: '300',
    fontFamily: 'monospace',
  },
  ejemplo: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    opacity: 0.6,
    fontFamily: 'monospace',
  },
  pie: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  pieIcono: {
    color: '#FFF',
    fontSize: 30,
    marginBottom: 8,
  },
  pieTexto: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
});
