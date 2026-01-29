function displayName(){
    const fileInput = document.getElementById('fileInput');
    
}

async function PDFToText(){
    const fileInput = document.getElementById('fileInput').files[0];

    const pdfTextContent = document.getElementById('pdfTextContent')

    const fileReader = new FileReader();
    fileReader.onload = async function(){
        const pdfData = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({data: pdfData}).promise;
        let extractedText = "";
        for (let i = 1; i <= pdf.numPages; i++){
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            textContent.items.forEach((item)=>{

                extractedText += item.str + "SPACE";
            })
        }
        const parts = extractedText.split(/SPACE|\|/)
        let start;
        let end;
        for(let i = 0; i <= parts.length; i++){
            if(parts[i] === 'UNITS'){
                start = i
            }
            else if(parts[i] === 'TOTAL UNITS'){
                end = i
                break;
            }

        }
        const sliced = parts.slice(start, end);
        console.log(sliced)
    }
    fileReader.readAsArrayBuffer(fileInput);
}