const algorithms = {
  bubbleSort: async function (arr, updateBars, stats) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        stats.comparisons++;
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          stats.swaps++;
          updateBars(arr, [j, j + 1]);
          await sleep(speed);
        }
      }
    }
  },
  selectionSort: async function (arr, updateBars, stats) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      let minIndex = i;
      for (let j = i + 1; j < len; j++) {
        stats.comparisons++;
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        stats.swaps++;
        updateBars(arr, [i, minIndex]);
        await sleep(speed);
      }
    }
  }
};

let speed = 100;
let isPaused = false;
let barsContainer = document.getElementById("bars");
let stats = { swaps: 0, comparisons: 0, startTime: 0, endTime: 0 };

function generateArray(size = 20) {
  let arr = [];
  barsContainer.innerHTML = "";
  for (let i = 0; i < size; i++) {
    let value = Math.floor(Math.random() * 100) + 10;
    arr.push(value);
    let bar = document.createElement("div");
    bar.style.height = `${value * 3}px`;
    bar.classList.add("bar");
    barsContainer.appendChild(bar);
  }
  return arr;
}

function updateBars(arr, indices = []) {
  let bars = document.querySelectorAll(".bar");
  bars.forEach((bar, index) => {
    bar.style.height = `${arr[index] * 3}px`;
    bar.style.background = indices.includes(index) ? "red" : "blue";
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStatsDisplay() {
  document.getElementById("swapsCount").innerText = stats.swaps;
  document.getElementById("comparisonsCount").innerText = stats.comparisons;
  document.getElementById("timeTaken").innerText = ((stats.endTime - stats.startTime) / 1000).toFixed(2) + "s";
}

let array = generateArray();

document.getElementById("sortButton").addEventListener("click", async () => {
  let algorithm = document.getElementById("algorithmSelect").value;
  stats.swaps = 0;
  stats.comparisons = 0;
  stats.startTime = performance.now();
  await algorithms[algorithm](array, updateBars, stats);
  stats.endTime = performance.now();
  updateStatsDisplay();
});

document.getElementById("newArrayButton").addEventListener("click", () => {
  array = generateArray();
  stats.swaps = 0;
  stats.comparisons = 0;
  stats.startTime = 0;
  stats.endTime = 0;
  updateStatsDisplay();
});

document.getElementById("speedControl").addEventListener("input", (event) => {
  speed = 500 - event.target.value;
});
