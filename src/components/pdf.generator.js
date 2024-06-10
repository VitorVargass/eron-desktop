import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from "react-toastify";
import pdfPath from '../assets/pdf-modelo-a4.pdf'; // Caminho para o arquivo PDF

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
        let firstPage = pdfDoc.getPages()[0];
        let font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let { height } = firstPage.getSize();

        const drawText = (text, options) => {
            firstPage.drawText(text || '', options);  // Usa string vazia se text for undefined
        };



        const checkAndAddPage = () => {
            let y = height - 272;
            if (y < 500) {  // Supõe que 50 é a margem inferior mínima antes de criar uma nova página
                firstPage = pdfDoc.addPage();
                height = firstPage.getSize().height;
                y = height - 100;  // Reset y to the top of the new page
            }
        };

        firstPage.drawText(selectedItem.cliente || 'N/A', {
            x: 100,
            y: height - 228,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.marca || 'N/A', {
            x: 100,
            y: height - 252,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.modelo || 'N/A', {
            x: 105,
            y: height - 277,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.ano || 'N/A', {
            x: 357,
            y: height - 228,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.placa || 'N/A', {
            x: 370,
            y: height - 252,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.telefone || 'N/A', {
            x: 390,
            y: height - 276,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.data || 'N/A', {
            x: 160,
            y: height - 336,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.totalPreco || 'N/A', {
            x: 115,
            y: height - 750,
            size: 17,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(selectedItem.maoDeObra || 'N/A', {
            x: 430,
            y: height - 750,
            size: 17,
            font,
            color: rgb(0, 0, 0),
        });


        // Adicionar cabeçalho da tabela de peças
        firstPage.drawText('Produto', {
            x: 45,
            y: height - 360,
            size: 16,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText('Unid.', {
            x: 390,
            y: height - 360,
            size: 16,
            font,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText('Quant.', {
            x: 450,
            y: height - 360,
            size: 16,
            font,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText('Preco', {
            x: 520,
            y: height - 360,
            size: 16,
            font,
            color: rgb(0, 0, 0),
        });


        if (typeof selectedItem.pecas === 'string') {
            selectedItem.pecas = JSON.parse(selectedItem.pecas);
        }

        if (Array.isArray(selectedItem.pecas)) {
            let y = height - 380;  // Posição inicial logo abaixo dos cabeçalhos
            selectedItem.pecas.forEach(peca => {
                const precoFormatted = parseFloat(peca.preco) || 0;
                const precoUnitarioFormat = parseFloat(peca.precoUnitario) || 0;
                drawText(peca.nome || 'N/A', {
                    x: 45,  // Alinha com o cabeçalho 'Produto'
                    y: y,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                });
                drawText(`R$ ${precoUnitarioFormat.toFixed(2)}`, {
                    x: 380,  // Alinha com o cabeçalho 'Unid.'
                    y: y,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                });
                drawText(`${peca.quantidade || 0}`, {
                    x: 470,  // Alinha com o cabeçalho 'Quant.'
                    y: y,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                });
                drawText(`R$ ${precoFormatted.toFixed(2)}`, {
                    x: 520,  // Alinha com o cabeçalho 'Preco'
                    y: y,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                });
                y -= 15;
                checkAndAddPage(); // Move para a próxima linha abaixo
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
            printWindow.onload = function () {
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

export { printPDF, downloadPDF };
