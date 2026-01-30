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
        const parts = extractedText.split(/SPACE|\||,/)
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
        const slicedOriginal = parts.slice(start + 1, end);
        let courseCodes = []
        let subjectNames = []
        let days = []
        let time = []
        let room = []
        let temporary = {}
        let units = ['1.00','2.00','3.00','4.00','5.00','6.00','7.00','8.00','9.00','10.00']
        let valid = []

        function sliceCut(sliced){
            let i = 0
            while(!units.includes(sliced[i].trim()) && i <= sliced.length){
                if(sliced[i] !== " "){
                    valid.push(sliced[i])
                    i++
                }
                
            }
            return


        }
       sliceCut(slicedOriginal)
       console.log(valid)
        
        
    }
    fileReader.readAsArrayBuffer(fileInput);
}