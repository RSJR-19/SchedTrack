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
        const units = new Set(['1.00','2.00','3.00','4.00','5.00','6.00','7.00','8.00','9.00','10.00'])
        const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']
        let valid = []
        let courseCodes = {}
        let daysOfWeek = {}

        function sliceCut(sliced){
            let i = 0
            while(!units.has(sliced[i].trim()) && i <= sliced.length){
                    if(i === 0){
                        let currentCode = sliced[i].trim()
                        let currentSubject = sliced[1].slice(currentCode.length + 1);
                        courseCodes[currentCode] = currentSubject;
                    }
                    else if(days.includes(sliced[i])){
                        daysOfWeek[days.indexOf(sliced[i].trim())] = 

                    }

                    valid.push(sliced[i])

                    i++
                
            }
            return


        }
       sliceCut(slicedOriginal)
       console.log(valid)
       console.log(courseCodes)
        
        
    }
    fileReader.readAsArrayBuffer(fileInput);
}