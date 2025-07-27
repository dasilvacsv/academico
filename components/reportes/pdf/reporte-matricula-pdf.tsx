"use client"

import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

// Registrar fuentes para mejor tipografía
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2",
      fontWeight: 700,
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderColor: "#1a1a1a",
  },
  headerLeft: {
    flexDirection: "column",
    width: "60%",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
    width: "40%",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: 700,
  },
  schoolInfo: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 2,
  },
  schoolDetails: {
    fontSize: 9,
    marginBottom: 1,
    color: "#4b5563",
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
    color: "#1a1a1a",
  },
  reportDate: {
    fontSize: 10,
    color: "#6b7280",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: "#f3f4f6",
    padding: 8,
    marginBottom: 0,
    color: "#1a1a1a",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1f2937",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 700,
    padding: 6,
    color: "#ffffff",
    borderRightWidth: 1,
    borderColor: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableRowEven: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    fontSize: 8,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableCellLast: {
    fontSize: 8,
    padding: 6,
  },
  // Anchos de columnas
  colNumero: { width: "8%" },
  colNombre: { width: "25%" },
  colGrado: { width: "15%" },
  colRepresentante: { width: "22%" },
  colTelefono: { width: "15%" },
  colEstatus: { width: "15%" },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f3f4f6",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 16,
    fontWeight: 700,
    color: "#1f2937",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 25,
    right: 25,
    textAlign: "center",
    fontSize: 8,
    color: "#6b7280",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 10,
  },
})

interface ReporteMatriculaPDFProps {
  data: any[]
  filtros: {
    anoEscolar: string
    estatus: string
    grado: string
  }
  resumen: {
    total: number
    inscritos: number
    preInscritos: number
  }
}

export default function ReporteMatriculaPDF({ data, filtros, resumen }: ReporteMatriculaPDFProps) {
  const fechaGeneracion = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>🎓</Text>
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.schoolInfo}>Sistema de información para el  registro de matrícula escolar</Text>
                <Text style={styles.schoolDetails}>Complejo Educativo</Text>
                <Text style={styles.schoolDetails}>RIF: J-12345678-9</Text>
                <Text style={styles.schoolDetails}>contacto@liceo.edu.ve</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Reporte de Matrícula</Text>
            <Text style={styles.reportDate}>Generado: {fechaGeneracion}</Text>
            <Text style={styles.reportDate}>Año Escolar: {filtros.anoEscolar}</Text>
            {filtros.estatus && filtros.estatus !== "todos" && (
              <Text style={styles.reportDate}>Estatus: {filtros.estatus}</Text>
            )}
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{resumen.total}</Text>
            <Text style={styles.summaryLabel}>Total Estudiantes</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{resumen.inscritos}</Text>
            <Text style={styles.summaryLabel}>Inscritos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{resumen.preInscritos}</Text>
            <Text style={styles.summaryLabel}>Pre-inscritos</Text>
          </View>
        </View>

        {/* Tabla de datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listado de Estudiantes</Text>
          <View style={styles.table}>
            {/* Header de tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNumero]}>N°</Text>
              <Text style={[styles.tableHeaderCell, styles.colNombre]}>Estudiante</Text>
              <Text style={[styles.tableHeaderCell, styles.colGrado]}>Grado</Text>
              <Text style={[styles.tableHeaderCell, styles.colRepresentante]}>Representante</Text>
              <Text style={[styles.tableHeaderCell, styles.colTelefono]}>Teléfono</Text>
              <Text style={[styles.tableHeaderCell, styles.colEstatus]}>Estatus</Text>
            </View>

            {/* Filas de datos */}
            {data.map((estudiante, index) => (
              <View key={estudiante.id_matricula} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                <Text style={[styles.tableCell, styles.colNumero]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.colNombre]}>{estudiante.nombre_estudiante}</Text>
                <Text style={[styles.tableCell, styles.colGrado]}>
                  {estudiante.grados
                    ? `${estudiante.grados.nivel_educativo} - ${estudiante.grados.nombre} ${estudiante.grados.seccion}`
                    : "Sin asignar"}
                </Text>
                <Text style={[styles.tableCell, styles.colRepresentante]}>{estudiante.nombre_representante}</Text>
                <Text style={[styles.tableCell, styles.colTelefono]}>{estudiante.telefono_representante || "N/A"}</Text>
                <Text style={[styles.tableCellLast, styles.colEstatus]}>
                  {estudiante.estatus === "inscrito" ? "Inscrito" : "Pre-inscrito"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Sistema de información para el  registro de matrícula escolar - Reporte generado automáticamente el {fechaGeneracion}
        </Text>
      </Page>
    </Document>
  )
}
