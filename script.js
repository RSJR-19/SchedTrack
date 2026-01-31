function displayName() {
    const fileInput = document.getElementById('fileInput');
}
let schedule;
let scheduleToday;


function getSchedToday(schedule){
    const date = new Date();
    let dayToday = 1//date.getDay();
    let timeToSubject = {}
    let rawStart = []
    let rawEnd = []
    let timeStart =[]
    let timeEnd =[]
    let courseCodes = []
    let subjects = []
    let rooms = []
    let addedTime = 0
    
    scheduleToday = schedule[dayToday][1]
    scheduleToday.forEach(subject =>{
        courseCodes.push(subject[0].trim());
        subjects.push(subject[1].trim());
        rooms.push(subject[3].trim());
    })
    scheduleToday.forEach(time =>{
        time[2] = time[2].split('-')
        rawStart.push(time[2][0])
        rawEnd.push(time[2][1])
    })
    let schedIndex = 0;
    rawStart.forEach(time =>{
        addedTime = 0
        let cleanedTime = ""
        if(time.includes('PM')){
            addedTime = 1200;
        }
        for (const digit of time){
            if (Number.isFinite(Number(digit))){
                
                cleanedTime += digit
            }
        }
        let arrangedTime = parseInt(cleanedTime.trim()) + addedTime
        timeToSubject[arrangedTime] = [courseCodes[schedIndex], subjects[schedIndex], rooms[schedIndex]]
        timeStart.push(arrangedTime);
        schedIndex ++
    })
    rawEnd.forEach(time =>{
        addedTime = 0
        let cleanedTime = ""
        if(time.includes('PM')){
            addedTime = 1200;
        }
        for (const digit of time){
            if (Number.isFinite(Number(digit))){ 
                cleanedTime += digit
            }
        }
        let arrangedTime = parseInt(cleanedTime.trim()) + addedTime
        
        timeEnd.push(arrangedTime);
    })
    console.log(bubble(timeStart))
    console.log(bubble(timeEnd))

}

function bubble(x){
    let is_sorted = false
    while (!is_sorted){
        is_sorted = true;
        for(let i = 0; i < x.length - 1; i++){
            if (x[i] > x[i + 1]){
                [x[i], x[i + 1]] = [x[i + 1], x[i]]
                is_sorted = false;
            }
        }

    }
    return x
}






window.addEventListener('load', ()=>{
    if (JSON.parse(localStorage.getItem('schedule') !== null)){
        schedule = JSON.parse(localStorage.getItem('schedule'))
        getSchedToday(schedule);
    }
    else{
        alert('none');
    }
})



async function PDFToText() {
    const fileInput = document.getElementById('fileInput').files[0];
    if (!fileInput) return;

    const fileReader = new FileReader();

    fileReader.onload = async function () {
        const pdfData = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            textContent.items.forEach(item => {
                extractedText += item.str + "SPACE";
            });
        }

        cleanExtractedText(extractedText);
    };

    fileReader.readAsArrayBuffer(fileInput);
}

function cleanExtractedText(text) {
    const parts = text.split(/SPACE|\||,/);

    let start = -1;
    let end = -1;

    for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "UNITS"){
            start = i;
        }
        else if (parts[i] === "TOTAL UNITS") {
            end = i;
            break;
        }
    }

    if (start === -1 || end === -1) return;

    let finalSlice = parts
        .slice(start + 1, end)
        .map(p => p.trim())
        .filter(p => p.length > 2);

    const units = new Set(['1.00','2.00','3.00','4.00','5.00','6.00','7.00','8.00','9.00','10.00']);
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

    const daysOfWeek = {
        0: ["SUN", []],
        1: ["MONDAY", []],
        2: ["TUESDAY", []],
        3: ["WEDNESDAY", []],
        4: ["THURSDAY", []],
        5: ["FRIDAY", []],
        6: ["SATURDAY", []]
    };

    while (finalSlice.length > 0) {
        finalSlice = sliceCut(finalSlice, units, days, daysOfWeek);
    }

    schedule = daysOfWeek;
    localStorage.setItem('schedule', JSON.stringify(schedule));
    getSchedToday(schedule);
    console.log('added');
}

function sliceCut(sliced, units, days, daysOfWeek) {
    let elementCount = 1;
    let dayCount = 0;
    let newClass = [];

    let i = 0;

    while (i < sliced.length && sliced[i] && !units.has(sliced[i])) {
        if (i === 0) {
            const currentCode = sliced[i];
            const currentSubject = sliced[1] ? sliced[1].slice(currentCode.length + 1) : "";
            newClass.push(currentCode, currentSubject);
        }
        else if (days.includes(sliced[i])) {
            if (!sliced[i + 1] || !sliced[i + 2]) break;
            newClass.push(sliced[i + 1], sliced[i + 2]);

            daysOfWeek[days.indexOf(sliced[i])][1].push([...newClass]);

            if (dayCount === 0) {
                dayCount++;
                newClass.length = 2;
            }
        }

        i++;
        elementCount++;
    }

    return sliced.slice(elementCount);
}