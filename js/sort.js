let sortingPaused = false;
let recursing = false;

function setSortAlgorithm(algorithm) {
  sortAlgorithm = algorithm;
  document.getElementById('dropdownMenuLink').innerText = getAlgorithmName(algorithm);
  document.getElementById('sortName').innerText = getAlgorithmName(algorithm);
  randomizeData();
  updateLegend();
  if (chart) {
    chart.data.datasets[0].label = sortAlgorithm;
    displayChart()
    // chart.update();
  }
}

function getAlgorithmName(algorithm) {
  switch (algorithm) {
    case 'bubble':
      return 'Bubble Sort'
    case 'selection':
      return 'Selection Sort';
    case 'insertion':
      return 'Insertion Sort';
    case 'merge':
      return 'Merge Sort';
    case 'quick':
      return 'Quick Sort';
    default:
      return 'Sort Algorithms';
  }
}

function startVisualization(val) {

  sortingPaused = false;
  document.getElementById('randomizeButton').setAttribute('disabled', true);
  document.getElementById('sortDropdownButton').setAttribute('disabled', true);
  document.getElementById('start-btn').setAttribute('disabled', true);
  document.getElementById('pause-btn').removeAttribute('disabled');
  document.getElementById('quantityButton').setAttribute('disabled', true);

  startSorting(val);
}

function pauseVisualization() {
  sortingPaused = true;
  document.getElementById('randomizeButton').removeAttribute('disabled');
  document.getElementById('sortDropdownButton').removeAttribute('disabled');
  // document.getElementById('start-btn').removeAttribute('disabled');
  document.getElementById('pause-btn').setAttribute('disabled', true);
  document.getElementById('quantityButton').removeAttribute('disabled');

}

function startSorting(val) {
  data = val;
  sortingPaused = false;
  colors = Array(data.length).fill('rgba(0, 0, 0, 0.5)'); // Initialize colors array
  var delay = parseInt(document.getElementById('myRange').value); // Read the value from the range input

  switch (sortAlgorithm) {
    case 'bubble':
      bubbleSort(data, delay, chart,currentIteration);
      break;
    case 'selection':
      selectionSort(data, delay, chart,currentIteration);
      break;
    case 'insertion':
      insertionSort(data, delay, chart,currentIteration);
      break;
    case 'merge':
      if (!recursing) {
        mergeSort(data, delay, chart,currentIteration);
        recursing = 1;
      }
      break;
    case 'quick':
      if (!recursing) {
        quickSort(data, delay, chart);
        recursing = 1;
      }
      break;
    default:
      break;
  }
}

function updateChart(arr, labels, colors, delay, chart, resetColors = false) {

  chart.data.datasets[0].data = arr;
  chart.data.labels = labels;


  // Reset the background colors if resetColors is true
  if (resetColors) {
    chart.data.datasets[0].backgroundColor = Array(arr.length).fill('rgba(0, 0, 0, 0.5)');
  }

  // Update the background colors of the dataset
  if (colors && colors.length === arr.length) {
    chart.data.datasets[0].backgroundColor = colors;
  }
  chart.update();
}

function updateLegend() {
  const legendDiv = document.getElementById('legend');
  let legendHTML = '';

  switch (sortAlgorithm) {
    case 'selection':
      legendHTML = '<div style="display: flex; align-items: center;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(255, 255, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>Current Selection</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; margin-left: 10px;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(0, 255, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>Sorted</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; margin-left: 10px;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(255, 0, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>Minimum</span>' +
                    '</div>';
      break;
    case 'quick':
      legendHTML = '<div style="display: flex; align-items: center;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(255, 255, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>Pivot</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; margin-left: 10px;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(0, 0, 255, 0.8); margin-right: 5px;"></div>' +
                      '<span>&ltPivot</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; margin-left: 10px;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(255, 165, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>&gtPivot</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; margin-left: 10px;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(0, 255, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>Sorted</span>' +
                    '</div>';
      break;
    default:
      legendHTML = '<div style="display: flex; align-items: center;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(255, 255, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>Current Selection</span>' +
                    '</div>' +
                    '<div style="display: flex; align-items: center; margin-left: 10px;">' +
                      '<div style="width: 15px; height: 15px; background-color: rgba(0, 255, 0, 0.8); margin-right: 5px;"></div>' +
                      '<span>Sorted</span>' +
                    '</div>';
      break;
  }

  legendDiv.innerHTML = legendHTML;
}

function swap(i, j,data) {
  const temp = data[i];
  data[i] = data[j];
  data[j] = temp;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------- */
/* Bubble Sort */
/* ------------------------------------------------------------- */

async function bubbleSort(data, delay, chart,currentIteration) {
  var isSwapped = false;
  var swapped = 0;
  for (let i = currentIteration; i < data.length; i++) {
    isSwapped = false;
    for (let j = currentIteration; j < data.length; j++) {
      delay = parseInt(document.getElementById('myRange').value);
      const colors = Array(data.length).fill('rgba(0, 0, 0, 0.8)');
      if (data[j] > data[j + 1]) {
        swap(j, j + 1,data);
        isSwapped = true;
        swapped = j
        colors[j + 1] = 'rgba(255,255,0,0.8)';
      }
      for (let k = data.length - 1; k >= 0; k--) {

        colors[k] = 'rgba(0,255,0,0.8)';
        if (data[k] < data[k - 1]) {
          break;
        }
      }
      await sleep(delay);
      updateChart(data, data.map(value => value.toString()), colors, delay, chart);

    }

    if (!isSwapped) {
      for (let k = 0; k < data.length; k++) {
        colors[k] = 'rgba(0, 255, 0, 0.8)';
      }
      updateChart(data, data.map(value => value.toString()), colors, delay, chart);
      break;
    }
    if (sortingPaused) {
      currentIteration = i + 1;
      document.getElementById('start-btn').removeAttribute('disabled');
      return;
      //break;
    }
  }
  document.getElementById('randomizeButton').removeAttribute('disabled');
  document.getElementById('sortDropdownButton').removeAttribute('disabled');
  document.getElementById('start-btn').removeAttribute('disabled');
  document.getElementById('pause-btn').setAttribute('disabled', true);
  document.getElementById('quantityButton').removeAttribute('disabled');

}

/* ------------------------------------------------------------- */
/* Selection Sort */
/* ------------------------------------------------------------- */

async function selectionSort(data, delay, chart, currentIteration) {
  for (let i = currentIteration; i < data.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < data.length; j++) {
      delay = parseInt(document.getElementById('myRange').value);
      if (data[j] < data[minIndex]) {
        minIndex = j;
      }
      const colors = Array(data.length).fill('rgba(0, 0, 0, 0.8)');
      for (let k = 0; k <= i; k++) {
        colors[k] = 'rgba(0, 255, 0, 0.8)';
      }
      colors[j] = 'rgba(255, 255, 0, 0.8)';
      colors[minIndex] = 'rgba(255, 0, 0, 0.8)';
      await sleep(delay);
      updateChart(data, data.map(value => value.toString()), colors, delay, chart);
    }

    if (minIndex !== i) {
      swap(i, minIndex, data);
      await sleep(delay);
      updateChart(data, data.map(value => value.toString()), colors, delay, chart);
    }

    if (sortingPaused) {
      currentIteration = i;
      document.getElementById('start-btn').removeAttribute('disabled');
      return;
    }
  }
  colors = Array(data.length).fill('rgba(0, 255, 0, 0.8)');
  updateChart(data, data.map(value => value.toString()), colors, delay, chart);
  document.getElementById('randomizeButton').removeAttribute('disabled');
  document.getElementById('sortDropdownButton').removeAttribute('disabled');
  document.getElementById('start-btn').removeAttribute('disabled');
  document.getElementById('pause-btn').setAttribute('disabled', true);
  document.getElementById('quantityButton').removeAttribute('disabled');
}

/* ------------------------------------------------------------- */
/* Insertion Sort */
/* ------------------------------------------------------------- */

async function insertionSort(data, delay, chart,currentIteration) {
  for (let i = currentIteration; i < data.length; i++) {
    console.log(i, "insertion");
    delay = parseInt(document.getElementById('myRange').value);
    let compareNum = data[i];
    let c;
    for (c = i; c > 0 && compareNum < data[c - 1]; c--) {
      let tmp = data[c];
      data[c] = data[c - 1];
      data[c - 1] = tmp;

      const colors = Array(data.length).fill('rgba(0, 0, 0, 0.8)'); // Initialize colors array

      // Set the color of the sorted bars to green
      for (let k = 0; k <= i; k++) {
        colors[k] = 'rgba(0, 255, 0, 0.8)';
      }

      // Set the color of the current bar being compared to yellow
      colors[c - 1] = 'rgba(255, 255, 0, 0.8)';
      await sleep(delay);
      updateChart(data, data.map(value => value.toString()), colors, delay, chart);
    }

    // Update the current iteration
    currentIteration = i + 1;

    if (sortingPaused) {
      document.getElementById('start-btn').removeAttribute('disabled');
      // Pause the sorting
      return;
    }
  }
  colors = Array(data.length).fill('rgba(0, 255, 0, 0.8)');
  updateChart(data, data.map(value => value.toString()), colors, delay, chart);
  // Reset the colors once the sorting is complete
  document.getElementById('randomizeButton').removeAttribute('disabled');
  document.getElementById('sortDropdownButton').removeAttribute('disabled');
  document.getElementById('start-btn').removeAttribute('disabled');
  document.getElementById('pause-btn').setAttribute('disabled', true);
  document.getElementById('quantityButton').removeAttribute('disabled');

}

/* ------------------------------------------------------------- */
/* Merge Sort */
/* ------------------------------------------------------------- */

async function mergeSort(data, delay, chart, start = 0) {
  delay = parseInt(document.getElementById('myRange').value);

  if (data.length <= 1) {
    return data;
  }

  const middle = Math.floor(data.length / 2);
  const left = data.slice(0, middle);
  const right = data.slice(middle);

  await sleep(delay);

  const sortedLeft = await mergeSort(left, delay, chart, start);
  const sortedRight = await mergeSort(right, delay, chart, start + middle);
  return merge(sortedLeft, sortedRight, chart, start, delay);
}

async function merge(left, right, chart, start, delay) {
  delay = parseInt(document.getElementById('myRange').value);
  if (sortingPaused) {
    document.getElementById('start-btn').removeAttribute('disabled');
    // Pause the sorting
    try {
      throw new Error();
    }
    catch {
      while (sortingPaused) {
        await sleep(1000)
        console.log(sortingPaused)
        if (!sortingPaused) {
          break;
        }
      }
    }
  }
  let merged = [];
  let i = 0;
  let j = 0;

  const colors = Array(data.length).fill('rgba(0, 0, 0, 0.8)'); // Initialize colors array

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      merged.push(left[i]);
      colors[start + i + j] = 'rgba(255, 255, 0, 0.8)'; // Set color for the merged element
      i++;
    } else {
      merged.push(right[j]);
      colors[start + i + j] = 'rgba(255, 255, 0, 0.8)'; // Set color for the merged element
      j++;
    }
    await sleep(delay);
    updateChart(data, data.map(value => value.toString()), colors, delay, chart);
  }

  while (i < left.length) {
    merged.push(left[i]);
    colors[start + i + j] = 'rgba(255, 255, 0, 0.8)'; // Set color for the merged element
    i++;
    await sleep(delay);
    updateChart(data, data.map(value => value.toString()), colors, delay, chart);
  }

  while (j < right.length) {
    merged.push(right[j]);
    colors[start + i + j] = 'rgba(255, 255, 0, 0.8)'; // Set color for the merged element
    j++;
    await sleep(delay);
    updateChart(data, data.map(value => value.toString()), colors, delay, chart);
  }

  // Loop to update the colors to green
  for (let k = start; k < start + merged.length; k++) {
    colors[k] = 'rgba(0, 255, 0, 0.8)'; // Set color for the merged element to green
    await sleep(delay);
    updateChart(data, data.map(value => value.toString()), colors, delay, chart);
  }

  // Update the original data array with the merged values
  for (let k = 0; k < merged.length; k++) {
    data[start + k] = merged[k];
  }
  await sleep(delay);
  updateChart(data, data.map(value => value.toString()), colors, delay, chart);

  if (merged.length == colors.length) {
    document.getElementById('randomizeButton').removeAttribute('disabled');
    document.getElementById('sortDropdownButton').removeAttribute('disabled');
    document.getElementById('start-btn').removeAttribute('disabled');
    document.getElementById('pause-btn').setAttribute('disabled', true);
    document.getElementById('quantityButton').removeAttribute('disabled');

    recursing = 0;
  }

  return merged;
}

/* ------------------------------------------------------------- */
/* Quick Sort */
/* ------------------------------------------------------------- */

async function quickSort(arr, delay, chart, start = 0, end = arr.length - 1) {
  // pause function
  if (sortingPaused) {
    document.getElementById('start-btn').removeAttribute('disabled');
    try {
      throw new Error();
    }
    catch {
      while (sortingPaused) {
        await sleep(1000)
        console.log(sortingPaused)
        if (!sortingPaused) {
          break;
        }
      }
    }
  }
  delay = parseInt(document.getElementById('myRange').value);
  
  // sorted
  if (start >= end) {
    sorted = true;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i] > data[i + 1]) {
        sorted = false;
        break;
      }
    }
    if (sorted) {
      for (let k = data.length - 1; k >= 0; k--) {
        colors[k] = 'rgba(0,255,0,0.8)';
        if (data[k] < data[k - 1]) {
          break;
        }
      }
      updateChart(data, data.map(value => value.toString()), colors, delay, chart);
      document.getElementById('randomizeButton').removeAttribute('disabled');
      document.getElementById('sortDropdownButton').removeAttribute('disabled');
      document.getElementById('start-btn').removeAttribute('disabled');
      document.getElementById('pause-btn').setAttribute('disabled', true);
      document.getElementById('quantityButton').removeAttribute('disabled');

      recursing = 0;
    }
    return;
  }

  // unsorted
  const pivotIndex = await partition(arr, delay, chart, start, end);
  await Promise.all([
    quickSort(arr, delay, chart, start, pivotIndex - 1),
    quickSort(arr, delay, chart, pivotIndex + 1, end)
  ]);
}

async function partition(arr, delay, chart, start, end) {
  delay = parseInt(document.getElementById('myRange').value);

  const colors = Array(data.length).fill('rgba(0, 0, 0, 0.8)');

  const pivotValue = arr[start];
  let pivotIndex = start;

  for (let i = start+1; i < end+1; i++) {
    if (arr[i] < pivotValue) {
      pivotIndex++
      await swap(i, pivotIndex, arr);
      await sleep(delay);
    }

    colors[start] = 'rgba(255,255,0,0.8)';
    colors[i] = 'rgba(255,255,0,0.8)';
    for (let j = start + 1; j <= pivotIndex; j++) {
      colors[j] = 'rgba(0, 0, 255, 0.8)';
    }
    for (let k = pivotIndex + 1; k <= i; k++) {
      colors[k] = 'rgba(255, 165, 0, 0.8)';
    }

    await sleep(delay);
    updateChart(data, data.map(value => value.toString()), colors, delay, chart);
  }

  await swap(start, pivotIndex, arr);

  await sleep(delay);
  updateChart(data, data.map(value => value.toString()), colors, delay, chart);

  // pausing
  if (sortingPaused) {
    document.getElementById('start-btn').removeAttribute('disabled');
    try {
      throw new Error();
    }
    catch {
      while (sortingPaused) {
        await sleep(1000)
        console.log(sortingPaused)
        if (!sortingPaused) {
          break;
        }
      }
    }
  }

  return pivotIndex;
}

function displayChart() {
  showRandomizeButton();
  if (chart) {
    chart.destroy();
  }

  const ctx = document.getElementById('chart');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(value => value.toString()),
      datasets: [{
        label: sortAlgorithm,
        data: data,
        borderWidth: 1
      }]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Data'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });
}

function showRandomizeButton() {
  document.getElementById('randomizeButton').removeAttribute('hidden');
  document.getElementById('sortDropdownButton').removeAttribute('hidden');
  if (document.getElementById('comparisonButton') !== null) {
    document.getElementById('comparisonButton').removeAttribute('hidden');
  }
}

function randomizeData() {
  currentIteration = 0;
  data = data.map(() => Math.floor(Math.random() * 1000));
  labels = data.map(value => value.toString());
  if (chart) {
    chart.data.datasets[0].data = data;
    chart.data.labels = labels;
    chart.update();
  }
}
function dataQuantity(dataQuantity){
  data = [...Array(dataQuantity)].map(() => Math.floor(Math.random() * 1000));
  randomizeData();

}

function defaultSort(sortOrder) {
  var sortedData = data.slice();

  sortedData.sort(function (a, b) {
    if (sortOrder === 'ascending') {
      return a - b;
    } else if (sortOrder === 'descending') {
      return b - a;
    }
    return 0;
  });
  data = sortedData;
  labels = data.map(value => value.toString());
  if (chart) {
    chart.data.datasets[0].data = sortedData;
    chart.data.labels = labels;
    chart.update();
  }
}

function compare() {

  const currentLocation = window.location.href;
  const newPageURL = currentLocation.substring(0, currentLocation.lastIndexOf('/') + 1) + 'compare.html';
  window.location.replace(newPageURL);
  // Handle the selected options here
  // console.log('Selected options:', selectedOptions);
}