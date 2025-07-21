// app/reportes/BotonDescargaPDF.tsx

'use client'; // MUY IMPORTANTE: Define este como un componente de cliente

import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReporteInstitucionalPDF } from './ReporteInstitucionalPDF'; // Asegúrate que la ruta sea correcta
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

// Recibe las métricas como props desde el Server Component padre
export function BotonDescargaPDF({ metricas }: { metricas: any }) {
  const [isClient, setIsClient] = useState(false);

  // Este efecto solo se ejecuta en el cliente, asegurando que
  // PDFDownloadLink no intente renderizarse en el servidor.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mientras no estemos en el cliente, mostramos un botón deshabilitado
  if (!isClient) {
    return (
      <Button 
        variant="secondary" 
        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg"
        disabled
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Cargando...
      </Button>
    );
  }

  // Una vez en el cliente, renderizamos el link de descarga
  return (
    <PDFDownloadLink
      document={<ReporteInstitucionalPDF metricas={metricas} />}
      fileName={`Reporte_Institucional_${new Date().toISOString().split('T')[0]}.pdf`}
    >
      {({ loading: pdfLoading }) => (
        <Button 
          variant="secondary" 
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg"
          disabled={pdfLoading}
        >
          {pdfLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {pdfLoading ? 'Generando...' : 'Descargar PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}