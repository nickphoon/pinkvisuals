function Node(value, left, right, parent = "", children = []) {
    this.value = value;
    this.right = right;
    this.left = left;
    this.parent = parent;
    this.children = children;
    this.isRight = null;
    this.isLeft = null;
}

function highlightNode(value, circleElements) {
  var currentIndex = 0;
  var targetNode = null;
  var targetFound = false;
  var previousNode = null;
  var previousDirection = null;
  reset(); // Reset the colors of all nodes to their original colors

  function traverseNextNode() {
    if (currentIndex >= circleElements.length) {
      console.log("Circle not found");
      displayMessage();
      return;
    }

    var currentNode = circleElements[currentIndex];
    var circle = currentNode.circle;

    // Remove the previous fill color
    circle.style("fill", function (d) {
      return d.children || d._children ? "lightblue" : "lightgray";
    });

    if (parseInt(currentNode.value[0]) === parseInt(value)) {
      // Found the circle with the correct value, highlight it yellow
      circle.style("fill", "yellow");
      targetNode = currentNode;
      targetFound = true;
      displayMessage();
      return; // Stop traversal when target node is found
    } else {
      // Determine the direction based on the comparison
      var direction = parseInt(value) < parseInt(currentNode.value[0]) ? "left" : "right";

      if (
        previousDirection === "right" &&
        direction === "right" &&
        previousNode !== null &&
        parseInt(currentNode.value[0]) < parseInt(previousNode.value[0])
      ) {
        // Skip highlighting the node if it's smaller than the previous node
        currentIndex += 2;
      } else {
        // Animate the comparison by filling the node with red for a brief duration
        circle
          .transition()
          .duration(500)
          .style("fill", "red")
          .transition()
          .duration(500)
          .style("fill", function (d) {
            return d.children || d._children ? "lightblue" : "lightgray";
          });

        // Move to the next node based on the direction
        if (direction === "left") {
          currentIndex = currentIndex + 1;
        } else {
          currentIndex = currentIndex + 2;
        }

        previousNode = currentNode;
        previousDirection = direction;
      }
    }

    // Move to the next node after a delay of 1 second
    setTimeout(traverseNextNode, 1000);
  }

  function displayMessage() {
    if (!targetFound) {
      var messageElement = document.getElementById("message");
      messageElement.textContent = "The number you are trying to find does not exist";
      messageElement.style.color = "red";
    }
  }

  // Start the traversal
  traverseNextNode();

  // Reset the color of the remaining nodes after the traversal is complete
  setTimeout(function () {
    circleElements.forEach(function (element) {
      if (element !== targetNode) {
        element.circle.style("fill", function (d) {
          return d.children || d._children ? "lightblue" : "lightgray";
        });
      }
    });
  }, (circleElements.length + 1) * 1000);
}


function createTree(arr) {
    for (var i = 1; i < arr.length; i++) {
        nodeDirection(arr[0], arr[i])
    }
    createData(arr[0]);
    remove();
    try {
        drawGraph(arr);
    } catch {
        console.log("No Input");
    }
}

function remove() {
    var graph = document.querySelector('svg');
    if (graph) { graph.parentElement.removeChild(graph) };
}

function nodeDirection(root, node) {
    var a = Number(node.value)
    var b = Number(root.value)
    if (a < b) {
        if (root.left == null) {
            root.left = node;
            node.isLeft = true;
        } else {
            nodeDirection(root.left, node);
        }
    } else if (a > b) {
        if (root.right == null) {
            root.right = node;
            node.isRight = true
        } else {
            nodeDirection(root.right, node);
        }
    }
}

function createData(node) {
  if (node == null) {
    return;
  }
  if (node.left) {
    node.children.push(node.left);
    node.left.parent = node;
    if (!node.right) {
      let newNode = new Node("Empty", null, null);
      newNode.isRight = true;
      node.children.push(newNode);
      newNode.parent = node;
    }
  }
  if (node.right) {
    node.children.push(node.right);
    node.right.parent = node;
    if (!node.left) {
      let newNode = new Node("Empty", null, null);
      newNode.isLeft = true;
      node.children.unshift(newNode);
      newNode.parent = node;
    }
  }
  createData(node.left);  // Recursive call for left child
  createData(node.right);  // Recursive call for right child
  // Add only non-"Empty" nodes to circleElements array
  if (node.value !== "Empty") {
    circleElements.push({ circle: null, value: node });
  }
}

function createNodes(list) {
    new_list = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i] == "") { continue }
        new_list.push(new Node(list[i], null, null));
    }
    createTree(new_list)
    if (new_list.length != 0) {
        document.querySelector(".btn").disabled = false
    } else {
        document.querySelector(".btn").disabled = true
    }
    return new_list
}

function reset(){
  circleElements.forEach(function (element) {
    element.circle.style("fill", function (d) {
      return d.children || d._children ? "lightblue" : "lightgray";
    });
  });
}

function preorderTraversal(circleElements) {
  var currentIndex = 0;
  var delay = 200; // Delay between each circle highlight (in milliseconds)
  reset();
  // Call the recursive traverseNode function on the circleElements
  traverseNode(circleElements[currentIndex]);

  function traverseNode(circleElement) {
    var circle = circleElement.circle;
    var node = circleElement.value;

    // Highlight the circle in green color after a delay
    setTimeout(function() {
      circle.style("fill", "green");
    }, currentIndex * delay);

    if (node.left) {
      traverseNode(node.left);
    }

    if (node.right) {
      traverseNode(node.right);
    }

    // Move to the next circle element
    currentIndex++;

    // Call traverseNode on the next circle element after a delay
    if (currentIndex < circleElements.length) {
      setTimeout(function() {
        traverseNode(circleElements[currentIndex]);
      }, currentIndex * delay);
    }
  }
}
// Call the preorder traversal function on circleElements
preorderTraversal(circleElements);
