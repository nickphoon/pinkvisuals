// Function to create buttons for separate chaining, linear probing, quadratic probing, and double hashing
function createButtons() {
    var separateChainingButton = document.createElement('button');
    separateChainingButton.textContent = 'Separate Chaining';
    separateChainingButton.id = 'separate-chaining-button';
    separateChainingButton.classList.add('hash-button');
    var linearProbingButton = document.createElement('button');
    linearProbingButton.textContent = 'Linear Probing';
    linearProbingButton.id = 'linear-probing-button';
    linearProbingButton.classList.add('hash-button');
    return [separateChainingButton, linearProbingButton];
}

// Function to create buttons for separate chaining, linear probing, quadratic probing, and double hashing
function createOperationButtons() {
    var insertButton = document.createElement('button');
    insertButton.textContent = 'Insert';
    insertButton.id = 'insert-button';
    insertButton.classList.add('operations-button');
    insertButton.addEventListener('click', handleInsertClick);
    var searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.id = 'search-button';
    searchButton.classList.add('operations-button');
    searchButton.addEventListener('click', handleSearchClick);
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.id = 'delete-button';
    deleteButton.classList.add('operations-button');
    deleteButton.addEventListener('click', handleDeleteClick);
    return [insertButton, searchButton, deleteButton];
}

function setUpWorkings(method) {
    algo = method;
    animation = anime.timeline({
        autoplay: true,
        update: function (anim) {
            seekProgress.value = animation.progress;
        }
    })
    // Perform separate chaining logic here
    var sliderContainer = document.querySelector('.reset-button-container');
    var slider = document.createElement('input');
    slider.classList.add("slider");
    slider.type = "range";
    slider.value = "0";
    slider.style.left = "5%";
    slider.style.width = "40%";
    slider.style.position = "absolute";
    sliderContainer.appendChild(slider);
    seekProgress = document.querySelector('.slider');
    // Create a container for the buttons
    var buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'operations-buttons-container';
    // Append the operation buttons to the buttonsContainer
    var operationButtons = createOperationButtons('sc');
    operationButtons.forEach(function (button) {
        buttonsContainer.appendChild(button);
    });
    // Create a text box
    var textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.id = 'text-box';
    textBox.classList.add('text-box');
    textBox.placeholder = "Enter a number to Search/Delete"
    // Append the text box to the buttonsContainer
    buttonsContainer.appendChild(textBox);
    workingsContainer.appendChild(buttonsContainer);
    clearWorkingsContainer();
    var arrayBoxes = document.querySelectorAll('.hash-button');
    arrayBoxes.forEach(function (box) {
        box.remove();
    });
}
// Function to handle separate chaining button click
function handleSeparateChainingClick() {
    setUpWorkings("sc");
    writeToWorkings("Separate Chaining");
    writeToWorkings("Also known as Open Hashing or Close Addressing");
    writeToWorkings("How it works: Insert at \\(i^{th}\\) chain (if not already there)");
    writeToWorkings("Drag slider to begin");
    steps.push([["Separate Chaining"], ["Also known as Open Hashing or Close Addressing"], ["How it works: Insert at \\(i^{th}\\) chain (if not already there)"], ["Drag slider to begin"]]);
    for (var i = 0; i < numbersArray.length; i++) {
        shiftBox(i, numbersArray[i].hash, null, animation, 100);
        steps.push([[`\\(h(${i})=${numbersArray[i].data}\\mod13=${numbersArray[i].hash}\\)`]]);
        if (counter[numbersArray[i].hash] > 0) {
            var j = counter[numbersArray[i].hash];
            for (var k = 0; k < numbersArray.length; k++) {
                if ((numbersArray[k].hash == numbersArray[i].hash) && k < i) {
                    shiftBox(k, numbersArray[k].hash, j, animation, 100);
                    j--;
                    steps.push([[`Collision! Shift the others up and slot new number at the front.`]]);
                }
            }
        }
        shiftBox(i, numbersArray[i].hash, 0, animation, 100);
        counter[numbersArray[i].hash]++;
        steps.push([[`Slot it into key number ${numbersArray[i].hash}`]]);
    }
    seekProgress.addEventListener('input', function () {
        var step = Math.round(animation.duration * (seekProgress.value / 100));
        animation.seek(step);
        clearWorkingsContainer();
        for (var i = 0; i < steps[Math.round(step / 100)].length; i++) {
            writeToWorkings(steps[Math.round(step / 100)][i]);
        }
    });
}

// Function to handle linear probing button click
function handleLinearProbingClick() {
    setUpWorkings("lp")
    // Perform linear probing logic here
    writeToWorkings("Linear Probing");
    writeToWorkings("Also known as Open Hashing or Close Addressing");
    writeToWorkings("How it works: Insert at \\(i^{th}\\) chain");
    writeToWorkings("If collision, try \\(i+1\\mod13\\) until find next open slot");
    writeToWorkings("Drag slider to begin");
    steps.push([["Linear Probing"], ["Also known as Open Hashing or Close Addressing"], ["How it works: Insert at \\(i^{th}\\) chain"], ["If collision, try \\(i+1\\mod m\\) until find next open slot"], ["Drag slider to begin"]]);
    hashTable = Array(13);
    for (var i = 0; i < hashTable.length; i++) {
        hashTable[i] = []; // Assign an empty array to each element
    }
    for (var i = 0; i < numbersArray.length; i++) {
        var min = 100;
        for (var j = 0; j < hashTable.length; j++) {
            if (min > hashTable[j].length) {
                min = hashTable[j].length;
            }
        }
        steps.push([[`\\(h(${i})=${numbersArray[i].data}\\mod13=${numbersArray[i].hash}\\)`]]);
        shiftBox(i, numbersArray[i].hash, min + 1, animation, 100);
        if (hashTable[numbersArray[i].hash].length == min) {
            steps.push([[`\\(h(${i})=${numbersArray[i].data}\\mod13=${numbersArray[i].hash}\\)`]]);
            shiftBox(i, numbersArray[i].hash, min, animation, 100);
            hashTable[numbersArray[i].hash].push(i);
        }
        else {
            var linProbe = numbersArray[i].hash
            while (hashTable[linProbe].length != min) {
                for (var k = 0; k < 5; k++) {
                    steps.push([[`Collision! Try \\((${linProbe}+1)\\mod13=${(linProbe + 1) % 13}\\)`]]);
                }
                linProbe = (linProbe + 1) % 13
                shiftBox(i, linProbe, min + 1, animation, 500);
            }
            shiftBox(i, linProbe, min, animation, 100);
            steps.push([[`Empty spot at ${linProbe}! Slot it in.`]]);
            hashTable[linProbe].push(i)
        }
    }
    seekProgress.addEventListener('input', function () {
        var step = Math.round(animation.duration * (seekProgress.value / 100));
        animation.seek(step);
        clearWorkingsContainer();
        for (var i = 0; i < steps[Math.round(step / 100)].length; i++) {
            writeToWorkings(steps[Math.round(step / 100)][i]);
        }
    });
}

// Function to handle the click event for the Insert button
function handleInsertClick() {
    if (document.querySelector('.slider')) {
        animation.seek(Math.round(animation.duration));
        document.querySelector('.slider').remove();
    }
    clearWorkingsContainer();
    for (var i = numbersArray.length - 1; i >= 0; i--) {
        anime({
            targets: numbersArray[i].box,
            duration: 500,
            backgroundColor: "#0F0",
        });
    }
    spawnBox();
    var newBox = numbersArray.length - 1;
    updateCoordinates(newBox);
    var hash = numbersArray[newBox].hash;
    var cursor = anime.timeline({
        autoplay: true,
    });
    switch (algo) {
        case "sc":
            counter[hash]++;
            var j = counter[hash];
            writeToWorkings(`\\(${numbersArray[newBox].data}\\mod13=${numbersArray[newBox].hash}\\)`);
            writeToWorkings(`Look at key number ${numbersArray[newBox].hash}`);
            writeToWorkings("Insert at the front");
            for (var i = 0; i < numbersArray.length; i++) {
                if (numbersArray[i].hash != hash) {
                    continue;
                }
                j--;
                newShiftBox(i, hash, j);
            }
            return;
        case "lp":
            var min = 100;
            writeToWorkings(`\\(h(${newBox})=${numbersArray[newBox].data}\\mod13=${numbersArray[newBox].hash}\\)`);
            for (var j = 0; j < hashTable.length; j++) {
                if (min > hashTable[j].length) {
                    min = hashTable[j].length;
                }
            }
            if (hashTable[numbersArray[newBox].hash].length == min) {
                newShiftBox(newBox, numbersArray[newBox].hash, min, cursor, 100);
                hashTable[numbersArray[newBox].hash].push(newBox);
            }
            else {
                writeToWorkings(`If collision, look for next empty slot.`);
                cursor.add({
                    targets: numbersArray[newBox].box,
                    duration: 1000,
                    easing: 'easeInOutQuad',
                });
                var linProbe = numbersArray[newBox].hash;
                while (hashTable[linProbe].length != min) {
                    linProbe = (linProbe + 1) % 13;
                    shiftBox(newBox, linProbe, min + 1, cursor, 500);
                }
                shiftBox(newBox, linProbe, min, cursor, 100);
                hashTable[linProbe].push(newBox);
                writeToWorkings(`Empty slot found at ${linProbe}!`);
            }
            return;
    }
    // Perform the insert operation using the value from the text box
}

// Function to handle the click event for the Search button
function handleSearchClick() {
    if (document.querySelector('.slider')) {
        animation.seek(Math.round(animation.duration));
        document.querySelector('.slider').remove();
    }
    var textBox = document.getElementById('text-box');
    var value = textBox.value;
    for (var i = numbersArray.length - 1; i >= 0; i--) {
        anime({
            targets: numbersArray[i].box,
            duration: 100,
            backgroundColor: "#0F0",
        });
    }
    cursor = anime.timeline({
        autoplay: true,
    });
    clearWorkingsContainer();
    // Perform the search operation using the value from the text box
    switch (algo) {
        case "sc":
            writeToWorkings([`\\(${value}\\mod13=${value % 13}\\)`]);
            writeToWorkings([`Look in key number ${value % 13}`]);
            writeToWorkings(["Stop when found"]);
            for (var i = numbersArray.length - 1; i >= 0; i--) {
                if (value != '') {
                    if (numbersArray[i].hash == value % 13) {
                        cursor.add({
                            targets: numbersArray[i].box,
                            duration: 100,
                            backgroundColor: "#FF0",
                        });
                        if (numbersArray[i].data == value) {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
                if (i == 0) {
                    for (var i = numbersArray.length - 1; i >= 0; i--) {
                        anime({
                            targets: numbersArray[i].box,
                            duration: 500,
                            delay: 1000,
                            backgroundColor: "#0F0",
                        });
                    }
                }
            }
            return;
        case "lp":
            var count = 0;
            var found = false;
            var hash = value % 13;
            writeToWorkings([`\\(${value}\\mod13=${value % 13}\\)`]);
            writeToWorkings([`Look in key number ${value % 13}`]);
            while (!found) {
                for (var i = 0; i < hashTable[hash].length; i++) {
                    cursor.add({
                        targets: numbersArray[hashTable[hash][i]].box,
                        duration: 100,
                        backgroundColor: "#FF0",
                    }, "+=100");
                    if (numbersArray[hashTable[hash][i]].data == value) {
                        writeToWorkings(`Found in ${hash}!`)
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    hash = (hash + 1) % 13;
                    writeToWorkings([`Not found, look in next key, ${hash}`]);
                    count++;
                }
                if (count == 13) {
                    writeToWorkings("Key not found!");
                    break;
                }
            }
            return;
    }
}

// Function to handle the click event for the Delete button
function handleDeleteClick() {
    clearWorkingsContainer();
    if (document.querySelector('.slider')) {
        animation.seek(Math.round(animation.duration));
        document.querySelector('.slider').remove();
    }

    var cursor = anime.timeline({
        autoplay: true,
    });
    for (var i = numbersArray.length - 1; i >= 0; i--) {
        anime({
            targets: numbersArray[i].box,
            duration: 100,
            backgroundColor: "#0F0",
        });
    }
    var textBox = document.getElementById('text-box');
    var value = textBox.value;
    var deleteIndex;
    // Perform the delete operation using the value from the text box
    switch (algo) {
        case "sc":
            var pos = 0;
            writeToWorkings([`\\(${value}\\mod13=${value % 13}\\)`]);
            writeToWorkings([`Look in key number ${value % 13}`]);
            writeToWorkings(["Delete when found"]);
            writeToWorkings("Shift the keys accordingly");
            for (var i = numbersArray.length - 1; i >= 0; i--) {
                if (value != '') {
                    if (numbersArray[i].hash == value % 13) {
                        pos++;
                        cursor.add({
                            targets: numbersArray[i].box,
                            duration: 500,
                            delay: 100,
                            backgroundColor: "#FF0",
                        }, 500);
                        if (numbersArray[i].data == value) {
                            deleteIndex = i
                            counter[numbersArray[i].hash]--;
                            cursor.add({
                                targets: numbersArray[i].box,
                                duration: 500,
                                backgroundColor: "#FF0",
                                opacity: 0,
                            });
                            break;
                        }
                    }
                }
                else {
                    return;
                }
            }
            var count = 1;
            for (var j = deleteIndex - 1; j >= 0; j--) {
                if (numbersArray[j].hash == value % 13) {
                    shiftBox(j, numbersArray[j].hash, pos - count, cursor);
                    count--;
                }
            }
            for (var i = numbersArray.length - 1; i >= 0; i--) {
                cursor.add({
                    targets: numbersArray[i].box,
                    duration: 50,
                    backgroundColor: "#0F0",
                });
            }
            numbersArray.splice(deleteIndex, 1);
            return;
        case "lp":
            var found = false;
            var hash = value % 13;
            var count = 0;
            writeToWorkings([`\\(${value}\\mod13=${value % 13}\\)`]);
            writeToWorkings([`Look in key number ${value % 13}`]);
            while (!found) {
                for (var i = 0; i < hashTable[hash].length; i++) {
                    cursor.add({
                        targets: numbersArray[hashTable[hash][i]].box,
                        duration: 100,
                        backgroundColor: "#FF0",
                    }, "+=100");
                    if (numbersArray[hashTable[hash][i]].data == value) {
                        writeToWorkings(`Found in ${hash}!`);
                        found = true;
                        cursor.add({
                            targets: numbersArray[hashTable[hash][i]].box,
                            duration: 100,
                            backgroundColor: "#FF0",
                            opacity: 0,
                        }, "+=100");
                        for (var j = i + 1; j < hashTable[hash].length; j++) {
                            shiftBox(hashTable[hash][j], hash, j - 1, cursor, 100);
                        }
                        hashTable[hash].splice(i, 1);
                        break;
                    }
                }
                if (!found) {
                    hash = (hash + 1) % 13;
                    writeToWorkings([`Not found, look in next key, ${hash}`]);
                    count++;
                }
                if (count == 13) {
                    writeToWorkings("Key does not exist...");
                    break;
                }
            }
            return;
    }
}

// Function to append a <p> tag with custom text in workings-container
function writeToWorkings(text) {
    workingsContainer = document.querySelector('.workings-container');
    var paragraph = document.createElement('p');
    paragraph.innerHTML = text; // Use innerHTML instead of textContent
    workingsContainer.appendChild(paragraph);

    // Re-render MathJax equations
    MathJax.typeset();
}

// Function to clear all <p> tags in workings-container
function clearWorkingsContainer() {
    workingsContainer = document.querySelector('.workings-container');
    var paragraphs = workingsContainer.querySelectorAll('p');
    paragraphs.forEach(function (paragraph) {
        paragraph.remove();
    });
}

// Function to handle spawn button click
function handleSpawnClick() {
    spawnButton.removeEventListener('click', handleSpawnClick);
    spawnButton.style.display = 'none';
    var index = 12;
    for (var i = 0; i < 13; i++) {
        var num = createNum();
        var num2 = createNum();
        num2.box.textContent = i;
        numbersArray.push(num);
        secondNumbersArray.push(num2);
        numbersArray[i].box.style.zIndex = index;
        arrayContainer.appendChild(numbersArray[i].box);
        secondArrayContainer.appendChild(num2.box);
        index--;
    }
    var boxWidth = numbersArray[0].box.offsetWidth;
    var containerWidth = arrayContainer.offsetWidth;
    var initialX = containerWidth;
    // Position the array boxes outside the container
    anime.set('.box', {
        translateX: function (el, i) {
            return initialX + i * boxWidth + 'px';
        },
        opacity: 0,
    });

    anime({
        targets: '.box',
        translateX: '0px',
        opacity: 1,
        duration: 500,
        delay: anime.stagger(100),
        easing: 'easeInOutQuad',
        complete: function () {
            // Show the reset button
            resetButton.style.opacity = '1';
            resetButton.disabled = false;
            resetButton.addEventListener('click', handleResetClick);
            clearWorkingsContainer();

            // Create and animate the menu title
            var menuTitle = document.createElement('p');
            menuTitle.textContent = 'Select Hashing Method';
            menuTitle.id = 'menu-title';
            menuTitle.style.fontSize = "1vw";
            menuTitle.style.border = "10px double blue";
            menuTitle.style.backgroundColor = "yellow";
            menuTitle.style.textAlign = "center";
            menuTitle.style.width = "80%";
            menuTitle.style.height = "10%";
            menuTitle.style.top = "10%";
            menuTitle.style.position = "absolute";
            workingsContainer.appendChild(menuTitle);
            anime.set('#menu-title', {
                translateY: '100%',
                opacity: 0,
            });

            anime({
                targets: '#menu-title',
                translateY: '0%',
                opacity: 1,
                duration: 500,
                delay: 0,
                scale: 1,
                rotate: '1turn',
                easing: 'easeInOutQuad',
            });
            // Create buttons and append them to the workings container
            var buttons = createButtons();
            buttons.forEach(function (button, index) {
                workingsContainer.appendChild(button);

                // Set initial position of the button outside the container
                anime.set(button, {
                    translateY: '100%',
                    opacity: 0,
                });

                // Animate the button into the container
                anime({
                    targets: button,
                    translateY: '0%',
                    opacity: 1,
                    duration: 500,
                    delay: 200 * index,
                    scale: 1,
                    rotate: '1turn',
                    easing: 'easeInOutQuad',
                });
            });

            // Attach event listeners to the buttons
            var separateChainingButton = document.getElementById('separate-chaining-button');
            separateChainingButton.addEventListener('click', handleSeparateChainingClick);

            var linearProbingButton = document.getElementById('linear-probing-button');
            linearProbingButton.addEventListener('click', handleLinearProbingClick);
        },
    });
    for (var i = 0; i < secondNumbersArray.length; i++) {
        var rect = secondNumbersArray[i].box.getBoundingClientRect();
        secondNumbersArray[i].x = rect.left;
        secondNumbersArray[i].y = rect.top;
    }
    for (var i = 0; i < numbersArray.length; i++) {
        numbersArray[i].box.style.position = "absolute";
        updateCoordinates(i);
    }
}

// Function to handle reset button click
function handleResetClick() {
    clearWorkingsContainer();
    // Remove the array boxes
    var arrayBoxes = document.querySelectorAll('.box, .hash-button, .slider, .operations-button, .text-box');
    arrayBoxes.forEach(function (box) {
        box.remove();
    });
    writeToWorkings("A <b>hash table</b>, aka <b>hash map</b>, is a data structure that implements an associative array or dictionary.It is an abstract data type that <mark> maps keys to values</mark>.");
    writeToWorkings("Ideally, the hash function will assign each key to a unique bucket, but most hash tables designs employ an <b>imperfect</b> hash function, which might cause <mark>hash collisions</mark> where the hash function generates the same index for more than one key. Such collisions are typically accomodated in some way");
    writeToWorkings("Since we are using a size 13 hash table, the hash function we will be using is:");
    writeToWorkings("\\(h(k)=k\\mod m\\)");
    writeToWorkings("Where \\(k=key\\) and \\(m=sizeOfTable\\)");
    writeToWorkings("Time complexity of a hash table:");
    writeToWorkings("Average of \\(\\Theta(1)\\); worst case of \\(O(n)\\)");
    // Reset the spawn button
    spawnButton.style.display = 'block';
    spawnButton.addEventListener('click', handleSpawnClick);

    // Hide and disable the reset button
    resetButton.style.opacity = '0';
    resetButton.disabled = true;
    numbersArray = [];
    secondNumbersArray = [];
    steps = [];
    counter = Array(13).fill(0);
    hashTable = Array(13);
}

function createNum() {
    var data = Math.floor(Math.random() * 1000);
    var box = document.createElement("div");
    box.classList.add("box");
    box.textContent = data;
    var hash = data % 13;
    var num = {
        "data": data,
        "box": box,
        "x": 0,
        "y": 0,
        "hash": hash,
    }
    return num;
}

function updateCoordinates(i) {
    var rect = numbersArray[i].box.getBoundingClientRect();
    numbersArray[i].x = rect.left;
    numbersArray[i].y = rect.top;
    return
}

function shiftBox(source, dest, pos, anim, speed) {
    var offset = numbersArray[source].box.offsetHeight * (pos + 1.3);
    distanceX = secondNumbersArray[dest].x - numbersArray[source].x;
    distanceY = secondNumbersArray[dest].y - numbersArray[source].y - offset;

    anim.add({
        targets: numbersArray[source].box,
        translateX: distanceX,
        translateY: distanceY,
        backgroundColor: "#0F0",
        duration: speed,
        easing: 'easeInOutQuad',
        rotate: "1turn",
    });

}
function newShiftBox(source, dest, pos) {
    var offset = numbersArray[source].box.offsetHeight * (pos + 1.3);
    distanceX = secondNumbersArray[dest].x - numbersArray[source].x;
    distanceY = secondNumbersArray[dest].y - numbersArray[source].y - offset;

    anime({
        targets: numbersArray[source].box,
        translateX: distanceX,
        translateY: distanceY,
        backgroundColor: "#0F0",
        duration: 100,
        delay: 1000,
        easing: 'easeInOutQuad',
        rotate: "1turn",
    });

}

function spawnBox() {
    var dimensions = numbersArray[0].box.getBoundingClientRect();
    numbersArray.push(createNum());
    var box = numbersArray.length - 1;
    arrayContainer.appendChild(numbersArray[box].box);
    anime({
        targets: numbersArray[box].box,
        translateX: '0',
        opacity: 1,
        duration: 500,
        easing: 'easeInOutQuad',
    });
}

var counter = Array(13).fill(0);
var numbersArray = [];
var secondNumbersArray = [];
var steps = [];
var animation, seekProgress, algo;
var workingsContainer = document.querySelector('.workings-container');
var arrayContainer = document.getElementById('array-container');
var secondArrayContainer = document.getElementById("second-array-container");
var secondArrayData = [...Array(13).keys()]
var hashTable = Array(13);
var spawnButton = document.getElementById('spawn-button');
var resetButton = document.getElementById('reset-button');

resetButton.style.opacity = '0';
resetButton.disabled = true;
resetButton.addEventListener('click', handleResetClick);
spawnButton.addEventListener('click', handleSpawnClick);