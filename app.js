function analyzeFile() {
    const input = document.getElementById("fileInput");
    const file = input.files[0];
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const text = event.target.result;
      const data = parseData(text);
      const results = analyzeData(data);
      displayResults(results);
    };
  
    reader.readAsText(file);
  }
  
  function parseData(text) {
    return text.trim().split("\n").map((line) => line.split(" "));
  }
  
  function analyzeData(data) {
    const shifts = [];
    let currentWorker = "";
    let currentShift = [];
  
    data.forEach((entry) => {
      if (entry.length === 0) return;
  
      const [day, worker, hours] = entry;
      if (currentWorker !== worker) {
        if (currentWorker !== "") {
          shifts.push(currentShift);
        }
        currentWorker = worker;
        currentShift = [[day, hours]];
      } else {
        currentShift.push([day, hours]);
      }
    });
    shifts.push(currentShift);
  
    const results = {
      sevenConsecutiveDays: [],
      shortBreaks: [],
      longShifts: [],
    };
  
    shifts.forEach((shift) => {
      if (hasSevenConsecutiveDays(shift)) {
        results.sevenConsecutiveDays.push(shift[0][1]);
      }
      if (hasShortBreak(shift)) {
        results.shortBreaks.push(shift[0][1]);
      }
      if (hasLongShift(shift)) {
        results.longShifts.push(shift[0][1]);
      }
    });
  
    return results;
  }
  
  function hasSevenConsecutiveDays(shift) {
    const days = shift.map((day) => day[0]);
    return days.length === 7;
  }
  
  function hasShortBreak(shift) {
    for (let i = 1; i < shift.length; i++) {
      const diff = parseInt(shift[i][1]) - parseInt(shift[i - 1][1]);
      if (diff < 10 && diff > 1) {
        return true;
      }
    }
    return false;
  }
  
  function hasLongShift(shift) {
    return shift.some((day) => parseInt(day[1]) > 14);
  }
  
  function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
      <h2>Work Analysis Results:</h2>
      <h3>Worked for 7 consecutive days:</h3>
      <p>${results.sevenConsecutiveDays.join(", ")}</p>
      <h3>Had short breaks (less than 10 hours):</h3>
      <p>${results.shortBreaks.join(", ")}</p>
      <h3>Had long shifts (more than 14 hours):</h3>
      <p>${results.longShifts.join(", ")}</p>
    `;
  }