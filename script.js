const algorithms = {
    bubbleSort: async function (arr, updateBars) {
      let len = arr.length;
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            updateBars(arr, [j, j + 1]);
            await sleep(speed);
          }
        }
      }
    },
    selectionSort: async function (arr, updateBars) {
      let len = arr.length;
      for (let i = 0; i < len; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
          if (arr[j] < arr[minIndex]) {
            minIndex = j;
          }
        }
        if (minIndex !== i) {
          [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
          updateBars(arr, [i, minIndex]);
          await sleep(speed);
        }
      }
    },
    insertionSort: async function (arr, updateBars) {
      let len = arr.length;
      for (let i = 1; i < len; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          updateBars(arr, [j, j + 1]);
          await sleep(speed);
          j--;
        }
        arr[j + 1] = key;
        updateBars(arr, [j + 1]);
        await sleep(speed);
      }
    },
    quickSort: async function (arr, updateBars, left = 0, right = arr.length - 1) {
      if (left < right) {
        let pivotIndex = await partition(arr, left, right, updateBars);
        await algorithms.quickSort(arr, updateBars, left, pivotIndex - 1);
        await algorithms.quickSort(arr, updateBars, pivotIndex + 1, right);
      }
    },
  };
  
  async function partition(arr, left, right, updateBars) {
    let pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        updateBars(arr, [i, j]);
        await sleep(speed);
      }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    updateBars(arr, [i + 1, right]);
    await sleep(speed);
    return i + 1;
  }
  
  let speed = 100;
  let isPaused = false;
  let barsContainer = document.getElementById("bars");
  
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
  
  function togglePause() {
    isPaused = !isPaused;
    document.getElementById("pauseButton").innerText = isPaused ? "Resume" : "Pause";
  }
  
  let array = generateArray();
  
  document.getElementById("sortButton").addEventListener("click", async () => {
    let algorithm = document.getElementById("algorithmSelect").value;
    await algorithms[algorithm](array, updateBars);
  });
  
  document.getElementById("newArrayButton").addEventListener("click", () => {
    array = generateArray();
  });
  
  document.getElementById("speedControl").addEventListener("input", (event) => {
    speed = 500 - event.target.value;
  });
  
  document.getElementById("pauseButton").addEventListener("click", togglePause);
  