// services/pdfGenerator.js
import jsPDF from 'jspdf';

export const generarPDFTransferencia = async (datosPedido, datosCliente) => {
    return new Promise((resolve) => {
        // Crear nuevo PDF
        const doc = new jsPDF();

        // Configuración inicial
        const pageWidth = doc.internal.pageSize.getWidth();
        let yPosition = 20;

        // Función para añadir texto con salto de línea automático
        const addText = (text, x, y, maxWidth = 180) => {
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
            return lines.length * 7;
        };

        // Encabezado
        doc.setFillColor(46, 125, 50); // Verde AgroSoft
        doc.rect(0, 0, pageWidth, 60, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('🌱 AGROSOFT', pageWidth / 2, 25, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Tu mercado agrícola de confianza', pageWidth / 2, 35, { align: 'center' });

        doc.setFontSize(16);
        doc.text('COMPROBANTE DE TRANSFERENCIA BANCARIA', pageWidth / 2, 48, { align: 'center' });

        // Restablecer color
        doc.setTextColor(0, 0, 0);
        yPosition = 70;

        // Información del Pedido
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('📦 INFORMACIÓN DEL PEDIDO', 20, yPosition);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        yPosition += 10;
        yPosition += addText(`Número de Pedido: ${datosPedido.numeroPedido}`, 20, yPosition);
        yPosition += addText(`Fecha: ${datosPedido.fecha}`, 20, yPosition);
        yPosition += addText(`Total a Pagar: ${datosPedido.total}`, 20, yPosition);
        yPosition += addText(`Vencimiento: ${datosPedido.vencimiento}`, 20, yPosition);
        yPosition += 5;

        // Información del Cliente
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        yPosition += addText('👤 INFORMACIÓN DEL CLIENTE', 20, yPosition);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        yPosition += 10;
        yPosition += addText(`Nombre: ${datosCliente.nombreCompleto}`, 20, yPosition);
        yPosition += addText(`Email: ${datosCliente.correo}`, 20, yPosition);
        yPosition += addText(`Teléfono: ${datosCliente.telefono}`, 20, yPosition);
        yPosition += addText(`Dirección: ${datosCliente.direccion}`, 20, yPosition);
        yPosition += 10;

        // Verificar si necesitamos nueva página
        if (yPosition > 200) {
            doc.addPage();
            yPosition = 20;
        }

        // Datos Bancarios
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        yPosition += addText('🏦 DATOS BANCARIOS PARA TRANSFERENCIA', 20, yPosition);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        yPosition += 10;

        // Marco para datos bancarios
        doc.setDrawColor(33, 150, 243); // Azul
        doc.setFillColor(227, 242, 253); // Azul claro
        doc.rect(15, yPosition - 5, pageWidth - 30, 80, 'FD');

        yPosition += 5;
        yPosition += addText(`Banco: BANCO AGRARIO DE COLOMBIA`, 25, yPosition);
        yPosition += addText(`Tipo de Cuenta: Cuenta Corriente`, 25, yPosition);
        yPosition += addText(`Número de Cuenta: 123-456789-01`, 25, yPosition);
        yPosition += addText(`Titular: AGROSOFT SAS`, 25, yPosition);
        yPosition += addText(`NIT: 900.123.456-7`, 25, yPosition);
        yPosition += addText(`Referencia/Concepto: PEDIDO-${datosPedido.numeroPedido}`, 25, yPosition);

        yPosition += 15;

        // Información importante
        doc.setDrawColor(255, 193, 7); // Amarillo
        doc.setFillColor(255, 243, 205); // Amarillo claro
        doc.rect(15, yPosition, pageWidth - 30, 30, 'FD');

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(133, 100, 4);
        yPosition += 8;
        doc.text('💡 IMPORTANTE', 25, yPosition);

        doc.setFont('helvetica', 'normal');
        yPosition += 7;
        doc.text(`• Transfiere el monto exacto de: ${datosPedido.total}`, 25, yPosition);
        yPosition += 7;
        doc.text('• Usa la referencia exacta para identificar tu pago', 25, yPosition);

        // Pie de página
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('📞 Línea de atención: 01-800-AGROSOFT (24767638) | 📧 Email: soporte@agrosoft.com', pageWidth / 2, 285, { align: 'center' });
        doc.text('🌐 Website: www.agrosoft.com | Este es un comprobante automático, por favor no responder', pageWidth / 2, 290, { align: 'center' });


        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
    });
};

