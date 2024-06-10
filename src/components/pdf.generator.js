import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from "react-toastify";
import pdfPath from '../assets/pdf-modelo.pdf'; // Caminho para o arquivo PDF

const loadPdfTemplate = async () => {
    try {
        const pdfBytes = await fetch(pdfPath).then(res => res.arrayBuffer());
        return await PDFDocument.load(pdfBytes);
    } catch (error) {
        console.error("Erro ao carregar o PDF modelo:", error);
        toast.error("Erro ao carregar o PDF modelo.");
        throw new Error("Não foi possível carregar o PDF modelo.");
    }
};

const generatePDF = async (selectedItem) => {
    let pdfDoc;
    try {
        // Carrega o PDF modelo
        pdfDoc = await loadPdfTemplate();
        const firstPage = pdfDoc.getPages()[0];
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const { height } = firstPage.getSize();

        firstPage.drawText(`${selectedItem.cliente}`, {
            x: 150,
            y: height - 80,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        if (typeof selectedItem.pecas === 'string') {
            selectedItem.pecas = JSON.parse(selectedItem.pecas);
        }

        if (Array.isArray(selectedItem.pecas)) {
            let y = 125;
            selectedItem.pecas.forEach(peca => {
                const precoFormatted = parseFloat(peca.preco) || 0;
                firstPage.drawText(`${peca.nome} ${peca.quantidade} R$ ${precoFormatted.toFixed(2)}`, {
                    x: 20,
                    y: y,
                    size: 10,
                    font,
                    color: rgb(0, 0, 0),
                });
                y += 10;
            });
        }

        const modifiedPdfBytes = await pdfDoc.save();
        return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    } catch (error) {
        console.error("Erro ao manipular o PDF:", error);
        toast.error("Erro ao manipular o PDF.");
        return null;
    }
};

const printPDF = async (selectedItem) => {
    try {
        const pdfBlob = await generatePDF(selectedItem);
        if (!pdfBlob) {
            console.error('Failed to generate PDF blob.');
            return;
        }
        const blobUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(blobUrl, '_blank');
        if (printWindow) {
            printWindow.onload = function() {
                printWindow.print();
            };
        } else {
            console.error('Failed to open print window.');
        }
    } catch (error) {
        console.error('Erro ao gerar o PDF para impressão:', error);
        toast.error('Erro ao gerar o PDF para impressão.');
    }
};

export { generatePDF, printPDF };
