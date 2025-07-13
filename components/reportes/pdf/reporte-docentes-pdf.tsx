"use client"

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: "Helvetica",
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
    backgroundColor: "#10b981",
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
  // Anchos de columnas para docentes
  colNumero: { width: "8%" },
  colNombre: { width: "30%" },
  colEspecialidad: { width: "20%" },
  colTelefono: { width: "15%" },
  colEmail: { width: "27%" },

  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
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

interface ReporteDocentesPDFProps {
  data: any[]
  resumen: {
    total: number
    activos: number
  }
}

export default function ReporteDocentesPDF({ data, resumen }: ReporteDocentesPDFProps) {
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
                <Text style={styles.logoText}>👨‍🏫</Text>
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.schoolInfo}>Sistema de información para el  registro de matrícula escolar</Text>
                <Text style={styles.schoolDetails}>Liceo Bolivariano</Text>
                <Text style={styles.schoolDetails}>RIF: J-12345678-9</Text>
                <Text style={styles.schoolDetails}>contacto@liceo.edu.ve</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Reporte de Docentes</Text>
            <Text style={styles.reportDate}>Generado: {fechaGeneracion}</Text>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{resumen.total}</Text>
            <Text style={styles.summaryLabel}>Total Docentes</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{resumen.activos}</Text>
            <Text style={styles.summaryLabel}>Activos</Text>
          </View>
        </View>

        {/* Tabla de datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listado de Docentes</Text>
          <View style={styles.table}>
            {/* Header de tabla */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colNumero]}>N°</Text>
              <Text style={[styles.tableHeaderCell, styles.colNombre]}>Nombre Completo</Text>
              <Text style={[styles.tableHeaderCell, styles.colEspecialidad]}>Especialidad</Text>
              <Text style={[styles.tableHeaderCell, styles.colTelefono]}>Teléfono</Text>
              <Text style={[styles.tableHeaderCell, styles.colEmail]}>Email</Text>
            </View>

            {/* Filas de datos */}
            {data.map((docente, index) => (
              <View key={docente.id_docente} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : {}]}>
                <Text style={[styles.tableCell, styles.colNumero]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.colNombre]}>
                  {docente.nombres} {docente.apellidos}
                </Text>
                <Text style={[styles.tableCell, styles.colEspecialidad]}>{docente.especialidad || "N/A"}</Text>
                <Text style={[styles.tableCell, styles.colTelefono]}>{docente.telefono || "N/A"}</Text>
                <Text style={[styles.tableCellLast, styles.colEmail]}>{docente.email || "N/A"}</Text>
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
