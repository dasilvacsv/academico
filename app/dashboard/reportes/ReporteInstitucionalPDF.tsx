import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos optimizados para que el reporte quepa en una página A4.
// Se ha reducido el padding, los márgenes y el tamaño de algunas fuentes.
const styles = StyleSheet.create({
  // Estilo base de la página
  page: {
    padding: 25, // Reducido de 30
    fontSize: 8.5, // Reducido de 9
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  // Encabezado principal
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15, // Reducido de 20
    paddingBottom: 10, // Reducido de 15
    borderBottomWidth: 2,
    borderColor: '#4a90e2'
  },
  schoolInfo: {
    flexDirection: 'column',
    width: '70%'
  },
  reportInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '30%'
  },
  schoolName: {
    fontSize: 16, // Reducido de 18
    fontWeight: 'bold',
    marginBottom: 4, // Reducido de 5
    color: '#1f2937'
  },
  schoolDetails: {
    fontSize: 8, // Mantenido
    marginBottom: 2,
    color: '#4b5563'
  },
  reportTitle: {
    fontSize: 20, // Reducido de 22
    fontWeight: 'bold',
    marginBottom: 5, // Reducido de 6
    color: '#4a90e2'
  },
  reportDate: {
    fontSize: 8, // Reducido de 9
    color: '#6b7280'
  },
  // Secciones
  section: {
    marginBottom: 12, // Reducido de 20
  },
  sectionTitle: {
    fontSize: 13, // Reducido de 14
    fontWeight: 'bold',
    marginBottom: 8, // Reducido de 10
    color: '#1f2937',
    paddingBottom: 4, // Reducido de 5
    borderBottomWidth: 1,
    borderColor: '#e5e7eb'
  },
  // Grid para métricas generales
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#f8fafc',
    padding: 8, // Reducido de 12
    borderRadius: 5, // Reducido de 6
    width: '48.5%', // Ajustado ligeramente
    marginBottom: 8, // Reducido de 10
    borderLeftWidth: 3,
    borderLeftColor: '#4a90e2'
  },
  metricLabel: {
    fontSize: 8, // Reducido de 10
    color: '#6b7280',
    marginBottom: 3, // Reducido de 4
  },
  metricValue: {
    fontSize: 18, // Reducido de 20
    fontWeight: 'bold',
    color: '#1f2937'
  },
  // Tablas
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10, // Reducido de 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
  },
  tableHeaderCell: {
    fontSize: 8, // Reducido de 9
    fontWeight: 'bold',
    padding: 4, // Reducido de 6
    color: '#ffffff',
    borderRightWidth: 1,
    borderColor: '#374151'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff'
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb'
  },
  tableCell: {
    fontSize: 8,
    padding: 4, // Reducido de 5
    borderRightWidth: 1,
    borderColor: '#e5e7eb',
    color: '#374151'
  },
  // Anchos de columnas
  col_25: { width: '25%' },
  col_50: { width: '50%' },
  col_75: { width: '75%' },
  col_100: { width: '100%' },
  textAlignRight: { textAlign: 'right' },
  textAlignCenter: { textAlign: 'center' },

  // Pie de página
  footer: {
    position: 'absolute',
    bottom: 15, // Reducido de 20
    left: 25,
    right: 25,
    textAlign: 'center',
    paddingTop: 8, // Reducido de 10
    borderTopWidth: 1,
    borderColor: '#e5e7eb'
  },
  footerText: {
    fontSize: 7,
    color: '#6b7280'
  }
});

// Interfaces
interface ReporteInstitucionalPDFProps {
  metricas: any;
}

export function ReporteInstitucionalPDF({ metricas }: ReporteInstitucionalPDFProps) {
  const {
    metricas_generales,
    distribucion_genero,
    distribucion_nivel,
    distribucion_turno,
    grados_ocupacion,
    rendimiento_academico,
  } = metricas;

  // Función para formatear números (ej: 1000 -> 1.000)
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-VE').format(value || 0);
  };

  return (
    <Document author="Sistema de Gestión Académica" title={`Reporte Institucional - ${new Date().toLocaleDateString()}`}>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.schoolInfo}>
            <Text style={styles.schoolName}>Complejo Educativo José Manuel Matute Salazar</Text>
            <Text style={styles.schoolDetails}>RIF: J-12345678-9 | Anaco, Anzoátegui, Venezuela</Text>
            <Text style={styles.schoolDetails}>Año Escolar: 2024-2025</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={styles.reportTitle}>REPORTE</Text>
            <Text style={styles.reportDate}>Fecha: 21/07/2025</Text>
          </View>
        </View>

        {/* Métricas Generales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métricas Generales</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Estudiantes</Text>
              <Text style={styles.metricValue}>{formatNumber(metricas_generales.total_estudiantes)}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Grados</Text>
              <Text style={styles.metricValue}>{formatNumber(metricas_generales.total_grados)}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Matrícula Actual</Text>
              <Text style={styles.metricValue}>{formatNumber(metricas_generales.matriculas_actuales)}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Pre-Inscritos</Text>
              <Text style={styles.metricValue}>{formatNumber(metricas_generales.pre_inscritos)}</Text>
            </View>
          </View>
        </View>

        {/* Distribución de Estudiantes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribución de Estudiantes</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* Por Nivel */}
            <View style={{ width: '48.5%' }}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.col_75]}>Nivel Educativo</Text>
                  <Text style={[styles.tableHeaderCell, styles.col_25, styles.textAlignCenter]}>Cant.</Text>
                </View>
                {distribucion_nivel.map((item: any, index: number) => (
                  <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <Text style={[styles.tableCell, styles.col_75]}>{item.nivel_educativo}</Text>
                    <Text style={[styles.tableCell, styles.col_25, styles.textAlignCenter]}>{formatNumber(item.estudiantes)}</Text>
                  </View>
                ))}
              </View>
            </View>
            {/* Por Género y Turno */}
            <View style={{ width: '48.5%' }}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.col_75]}>Género</Text>
                  <Text style={[styles.tableHeaderCell, styles.col_25, styles.textAlignCenter]}>Cant.</Text>
                </View>
                {distribucion_genero.map((item: any, index: number) => (
                  <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <Text style={[styles.tableCell, styles.col_75]}>{item.genero}</Text>
                    <Text style={[styles.tableCell, styles.col_25, styles.textAlignCenter]}>{formatNumber(item.cantidad)}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.col_75]}>Turno</Text>
                  <Text style={[styles.tableHeaderCell, styles.col_25, styles.textAlignCenter]}>Cant.</Text>
                </View>
                {distribucion_turno.map((item: any, index: number) => (
                  <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                    <Text style={[styles.tableCell, styles.col_75]}>{item.turno}</Text>
                    <Text style={[styles.tableCell, styles.col_25, styles.textAlignCenter]}>{formatNumber(item.estudiantes)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Ocupación de Grados (limitado a 6 para ahorrar espacio) */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Grados con Mayor Ocupación</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, {width: '50%'}]}>Grado</Text>
              <Text style={[styles.tableHeaderCell, {width: '25%'}, styles.textAlignCenter]}>Inscritos/Cap.</Text>
              <Text style={[styles.tableHeaderCell, {width: '25%'}, styles.textAlignCenter]}>Ocupación</Text>
            </View>
            {grados_ocupacion.slice(0, 6).map((grado: any, index: number) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, {width: '50%'}]}>{grado.grado_completo}</Text>
                <Text style={[styles.tableCell, {width: '25%'}, styles.textAlignCenter]}>
                  {grado.estudiantes_inscritos}/{grado.capacidad_maxima}
                </Text>
                <Text style={[styles.tableCell, {width: '25%'}, styles.textAlignCenter]}>
                  {grado.porcentaje_ocupacion}%
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Rendimiento Académico */}
        <View style={{ width: '100%' }} wrap={false}>
          {rendimiento_academico && rendimiento_academico.total_registros > 0 && (
            <>
              <Text style={styles.sectionTitle}>Rendimiento Académico</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.col_50]}>Categoría</Text>
                  <Text style={[styles.tableHeaderCell, styles.col_50, styles.textAlignCenter]}>N° Estudiantes</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.col_50]}>Excelente (18-20)</Text>
                  <Text style={[styles.tableCell, styles.col_50, styles.textAlignCenter]}>{formatNumber(rendimiento_academico.excelente)}</Text>
                </View>
                <View style={styles.tableRowAlt}>
                  <Text style={[styles.tableCell, styles.col_50]}>Bueno (14-17)</Text>
                  <Text style={[styles.tableCell, styles.col_50, styles.textAlignCenter]}>{formatNumber(rendimiento_academico.bueno)}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.col_50]}>Regular (10-13)</Text>
                  <Text style={[styles.tableCell, styles.col_50, styles.textAlignCenter]}>{formatNumber(rendimiento_academico.regular)}</Text>
                </View>
                <View style={styles.tableRowAlt}>
                  <Text style={[styles.tableCell, styles.col_50]}>Deficiente (&lt;10)</Text>
                  <Text style={[styles.tableCell, styles.col_50, styles.textAlignCenter]}>{formatNumber(rendimiento_academico.deficiente)}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Pie de página */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Reporte generado por el Sistema de Gestión Académica | Complejo Educativo José Manuel Matute Salazar
          </Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )} />
        </View>
      </Page>
    </Document>
  );
}