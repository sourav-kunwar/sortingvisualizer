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
  },
  insertionSort: async function (arr, updateBars, stats) {
    let len = arr.length;
    for (let i = 1; i < len; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        stats.comparisons++;
        updateBars(arr, [j, j + 1]);
        await sleep(speed);
        j--;
      }
      arr[j + 1] = key;
      stats.swaps++;
      updateBars(arr, [j + 1]);
      await sleep(speed);
    }
  },
  quickSort: async function (arr, updateBars, stats, left = 0, right = arr.length - 1) {
    if (left < right) {
      let pivotIndex = await partition(arr, left, right, updateBars, stats);
      await algorithms.quickSort(arr, updateBars, stats, left, pivotIndex - 1);
      await algorithms.quickSort(arr, updateBars, stats, pivotIndex + 1, right);
    }
  },
  mergeSort: async function (arr, updateBars, stats, left = 0, right = arr.length - 1) {
    if (left < right) {
      let mid = Math.floor((left + right) / 2);
      await algorithms.mergeSort(arr, updateBars, stats, left, mid);
      await algorithms.mergeSort(arr, updateBars, stats, mid + 1, right);
      await merge(arr, left, mid, right, updateBars, stats);
    }
  }
};

async function partition(arr, left, right, updateBars, stats) {
  let pivot = arr[right];
  let i = left - 1;
  for (let j = left; j < right; j++) {
    stats.comparisons++;
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      stats.swaps++;
      updateBars(arr, [i, j]);
      await sleep(speed);
    }
  }
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  stats.swaps++;
  updateBars(arr, [i + 1, right]);
  await sleep(speed);
  return i + 1;
}

async function merge(arr, left, mid, right, updateBars, stats) {
  let leftArr = arr.slice(left, mid + 1);
  let rightArr = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    stats.comparisons++;
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
      stats.swaps++;
    }
    updateBars(arr, [k]);
    await sleep(speed);
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    updateBars(arr, [k]);
    await sleep(speed);
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    updateBars(arr, [k]);
    await sleep(speed);
    j++;
    k++;
  }
}

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
