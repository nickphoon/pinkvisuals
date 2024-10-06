//variable Declaration
const enqueue = document.querySelector(".enqueue");
const dequeue = document.querySelector(".dequeue");
const reset = document.querySelector(".reset");
const bucket = document.querySelector(".main-stack-bucket");
const input = document.querySelector(".text");
const message = document.querySelector(".message");
const messageBox = document.querySelector(".message-box");
const box = document.querySelectorAll(".box");
const queueArray = [];

//for disable all buttons
const buttonDisable = () => {
	enqueue.disabled = true;
	enqueue.classList.add("disable-button");
	dequeue.disabled = true;
	dequeue.classList.add("disable-button");
	reset.disabled = true;
	reset.classList.add("disable-button");
	
};

//for enable all buttons
const buttonEnable = () => {
	dequeue.disabled = false;
	dequeue.classList.remove("disable-button");
	enqueue.disabled = false;
	enqueue.classList.remove("disable-button");
	reset.disabled = false;
	reset.classList.remove("disable-button");
	// input.disabled = false;
};

//When the push button will be clicked
enqueue.addEventListener("click", () => {
	//if the queue is full
	if (queueArray.length == 5) {
		message.innerHTML = "Queue Full";
		messageBox.classList.add("error-message");
		setTimeout(() => {
			messageBox.classList.remove("error-message");
		}, 1200);
		return;
	}
	let itemValue;
	do {
		itemValue = Math.floor(Math.random() * 10);
	  } while (queueArray.includes("Person " + itemValue));
	queueArray.push("Person "+ itemValue); //push the value into the queue
	//creating a new element
	const element = document.createElement("img");
	element.classList.add("ele");
    element.src = "img/stickman.png"; // Replace with the actual man image source
	const container = document.createElement("div");
    container.classList.add("ele-container");
    const textElement = document.createElement("span"); // Change div to span here
    textElement.classList.add("ele-text");
    textElement.innerText = itemValue;
    container.appendChild(element);
    container.appendChild(textElement);
    bucket.appendChild(container);
	// Update the front and rear values
	box[0].innerHTML = queueArray[0];
	box[1].innerHTML = queueArray[queueArray.length - 1];
	//clear the input box
	//adding the animation for a new pushed element
	element.classList.add("ele-add");
	//disable all buttons
	buttonDisable();
	//after pushing the element
	setTimeout(() => {
		//remove the animation
		element.classList.remove("ele-add");
		//update the Last Enqueued Item Value
		box[1].innerHTML = "Person "+ itemValue;
		message.innerHTML = `${queueArray[queueArray.length - 1]} just entered the queue.`;
		//Enable all buttons
		buttonEnable();
	}, 1500);
});

//When the pop button will be clicked
dequeue.addEventListener("click", () => {
	//if the queue is Empty
	if (queueArray.length == 0) {
		messageBox.classList.add("error-message");
		message.innerHTML = "Queue Empty";
		setTimeout(() => {
			messageBox.classList.remove("error-message");
		}, 1200);
		return;
	}

	//adding the popping animation
	bucket.firstElementChild.classList.add("ele-remove");
	//disable all buttons
	buttonDisable();
	//start popping the element
	setTimeout(() => {
		//delete the element from the bucket
		bucket.removeChild(bucket.firstElementChild);
		//Storing the popped value
		const itemValue = queueArray.shift();
		//updating the last popped item
		box[2].innerHTML = itemValue;
		//updating the Top
		if (queueArray.length == 0) {
			box[2].innerHTML = itemValue;
			box[1].innerHTML = "";
			box[0].innerHTML = "";
		} else {
			box[2].innerHTML = itemValue;
            box[0].innerHTML = queueArray[0];
		}
		//adding the message
		message.innerHTML = `${itemValue} just left.`;
		//Enable all buttons
		buttonEnable();
	}, 1500);
});

//When the reset button will be clicked
reset.addEventListener("click", () => {
	//clear the full array
	while (queueArray.length > 0) {
		queueArray.shift();
	}
	//clear all fields
	box[0].innerHTML = "";
	box[1].innerHTML = "";
	box[2].innerHTML = "";
	message.innerHTML = "";
	//clear all elements from the bucket
	while (bucket.firstChild) {
		bucket.removeChild(bucket.firstChild);
	}
});
