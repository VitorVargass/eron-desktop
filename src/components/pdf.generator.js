import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import jsPDF from 'jspdf';
import { toast } from "react-toastify";

// Cole a string base64 do PDF aqui (certifique-se de que está completa e correta)
const pdfModelBase64 = "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL1Jlc291cmNlcyA0IDAgUi9NZWRpYUJveFswIDAgNTk1LjI1IDg0Mi4wNV0+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHMgWzEgMCBSXT4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUvUmVzb3VyY2VzL0ZvbnQ8PC9GMSA1IDAgUj4+Pj4KZW5kb2JqCjUgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhL1RvaU5FVC9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvUmVnaXN0cnk8PC9OYW1lL1R5cGUgL1N0eWxlL1JlZ3VsYXIvQWx0VGV4dFBhdGhzIFsvQFszNjBdIDEyMSAwIF0gXT4+Pj4KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUKMDAwMDAwMDAxMCAwMDAwMAowMDAwMDAwMDAyIDAwMDAwCjAwMDAwMDAwMDMgMDAwMDAKMDAwMDAwMDAwNCAwMDAwMAowMDAwMDAwMDA1IDAwMDAwCjAwMDAwMDAwMDYgMDAwMDAK..."; // Cole aqui a string base64 completa do PDF

const base64ToUint8Array = (base64) => {
    const raw = atob(base64.split(',')[1]);
    const uint8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
};

const generatePDF = async (selectedItem) => {
    try {
        // Converta a string base64 para um ArrayBuffer
        const modelPdfBytes = base64ToUint8Array(pdfModelBase64).buffer;
        const pdfDoc = await PDFDocument.load(modelPdfBytes);

        // Adicione uma nova página ao PDF
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Carregar uma fonte padrão
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Definir a posição e o texto a ser adicionado
        const { width, height } = firstPage.getSize();
        firstPage.drawText(`${selectedItem.cliente}`, {
            x: 150,
            y: height - 80,
            size: 12,
            font,
            color: rgb(0, 0, 0),
        });

        // Salve o PDF modificado como bytes
        const modifiedPdfBytes = await pdfDoc.save();

        // Carregue o PDF modificado no jsPDF
        const doc = new jsPDF();
        const pdfBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(modifiedPdfBytes)));
        doc.addFileToVFS('base.pdf', pdfBase64);
        doc.addFont('base.pdf', 'base', 'normal');
        doc.setFont('base');

        // Adicionar uma linha divisória
        doc.setDrawColor(0);
        doc.setFillColor(192, 192, 192);
        doc.rect(20, 105, 170, 0.5, 'F');

        // Adicionar cabeçalho da tabela de peças
        doc.text('Produto', 20, 115);
        doc.text('Quantidade', 90, 115);
        doc.text('Preço', 160, 115);

        let pecasArray = selectedItem.pecas;

        // Verifica se pecasArray é uma string e tenta parsear para JSON
        if (typeof pecasArray === 'string') {
            try {
                pecasArray = JSON.parse(pecasArray);
            } catch (error) {
                console.error("Erro ao parsear peças:", error);
                toast.error("Erro ao processar dados das peças.");
                return;
            }
        }

        // Agora usa pecasArray como um array
        if (Array.isArray(pecasArray)) {
            let y = 125;
            pecasArray.forEach(peca => {
                let precoFormatted = peca.preco;

                // Checa se preco é uma string e tenta converter para número
                if (typeof precoFormatted === 'string') {
                    precoFormatted = parseFloat(precoFormatted);
                }

                // Só tenta usar toFixed se precoFormatted for um número
                if (typeof precoFormatted === 'number') {
                    doc.text(peca.nome, 20, y);
                    doc.text(`${peca.quantidade}`, 90, y);
                    doc.text(`R$ ${precoFormatted.toFixed(2)}`, 160, y);
                    y += 10;
                } else {
                    console.error("Preço não é um número:", precoFormatted);
                    toast.error("Erro ao formatar preço.");
                }
            });
            doc.save(`${selectedItem.cliente}.pdf`);
        } else {
            console.error("Peças não estão em formato de array");
            toast.error("Dados das peças não estão no formato correto.");
        }
    } catch (error) {
        console.error("Erro ao carregar o PDF modelo:", error);
        toast.error("Erro ao carregar o PDF modelo.");
    }
};

const printPDF = async (selectedItem) => {
    try {
        const pdfDoc = await generatePDF(selectedItem);

        // Gera o PDF como um Blob
        const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });

        // Cria um URL para o Blob
        const blobUrl = URL.createObjectURL(pdfBlob);

        // Abre uma nova janela e carrega o PDF para impressão
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
