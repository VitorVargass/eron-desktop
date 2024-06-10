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

        const drawText = (text, options) => {
            firstPage.drawText(text || '', options);  // Usa string vazia se text for undefined
        };

        firstPage.drawText(selectedItem.cliente || 'N/A', {
            x: 75,
            y: height - 160,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.marca || 'N/A', {
            x: 72,
            y: height - 176,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.modelo || 'N/A', {
            x: 75,
            y: height - 193,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.ano || 'N/A', {
            x: 255,
            y: height - 160,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.placa || 'N/A', {
            x: 260,
            y: height - 177,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.telefone || 'N/A', {
            x: 275,
            y: height - 193,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.data || 'N/A', {
            x: 115,
            y: height - 235,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.totalPreco || 'N/A', {
            x: 80,
            y: height - 523,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.maoDeObra || 'N/A', {
            x: 300,
            y: height - 523,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });


        // Adicionar cabeçalho da tabela de peças
        firstPage.drawText('Produto',  {
            x: 25,
            y: height - 260,
            size: 12,
            font,
            color: rgb(0, 0, 0),
    });

    firstPage.drawText('Unid.',  {
        x: 260,
        y: height - 260,
        size: 12,
        font,
        color: rgb(0, 0, 0),
});
    firstPage.drawText('Quant.',  {
        x: 300,
        y: height - 260,
        size: 12,
        font,
        color: rgb(0, 0, 0),
});
firstPage.drawText('Preco',  {
    x: 350,
    y: height - 260,
    size: 12,
    font,
    color: rgb(0, 0, 0),
});
        

        if (typeof selectedItem.pecas === 'string') {
            selectedItem.pecas = JSON.parse(selectedItem.pecas);
        }

        if (Array.isArray(selectedItem.pecas)) {
            let y = height - 272;  // Posição inicial logo abaixo dos cabeçalhos
            selectedItem.pecas.forEach(peca => {
                const precoFormatted = parseFloat(peca.preco) || 0;
                drawText(peca.nome || 'N/A', {
                    x: 25,  // Alinha com o cabeçalho 'Produto'
                    y: y,
                    size: 10,
                    font,
                    color: rgb(0, 0, 0),
                });
                drawText(peca.unidade || 'N/A', {
                    x: 260,  // Alinha com o cabeçalho 'Unid.'
                    y: y,
                    size: 10,
                    font,
                    color: rgb(0, 0, 0),
                });
                drawText(`${peca.quantidade || 0}`, {
                    x: 310,  // Alinha com o cabeçalho 'Quant.'
                    y: y,
                    size: 10,
                    font,
                    color: rgb(0, 0, 0),
                });
                drawText(`R$ ${precoFormatted.toFixed(2)}`, {
                    x: 350,  // Alinha com o cabeçalho 'Preco'
                    y: y,
                    size: 10,
                    font,
                    color: rgb(0, 0, 0),
                });
                y -= 15;  // Move para a próxima linha abaixo
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

const downloadPDF = async (selectedItem) => {
    try {
        const pdfBlob = await generatePDF(selectedItem);
        if (!pdfBlob) {
            console.error('Failed to generate PDF blob for download.');
            toast.error('Falha ao gerar o arquivo PDF para download.');
            return;
        }
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Ordem_de_Servico_${selectedItem.cliente}.pdf`; // Nome do arquivo PDF
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Erro ao gerar o PDF para download:', error);
        toast.error('Erro ao gerar o PDF para download.');
    }
};

export {printPDF, downloadPDF };
