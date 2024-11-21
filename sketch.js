let frontPageImage, secondPageImage, thirdPageImage, fourthPageImage, endPageImage;
let glassImage, plasticImage, otherImage;
let sortingBackgroundImage; // Background for the trash sorting game
let backgroundSound; // Variable to hold the background sound
let currentPage = 1;
let trashItems = [];
let draggedItem = null;
let lastClickTime = 0;
let score = 0;
let timer = 30;

// Hole variables for the fourth page
let holes = [
  { x: 200, y: 300, size: 50, particles: [], filled: false, clickStartTime: null },
  { x: 400, y: 250, size: 70, particles: [], filled: false, clickStartTime: null },
  { x: 300, y: 450, size: 90, particles: [], filled: false, clickStartTime: null },
  { x: 150, y: 150, size: 60, particles: [], filled: false, clickStartTime: null },
  { x: 500, y: 400, size: 80, particles: [], filled: false, clickStartTime: null }
];

// Variables for the fifth page game
let bins = [
  { x: 100, y: 600, type: 'glass', color: 'blue' },
  { x: 300, y: 600, type: 'plastic', color: 'red' },
  { x: 500, y: 600, type: 'other', color: 'green' }
];

function preload() {
  frontPageImage = loadImage('FC.png');
  secondPageImage = loadImage('Instru.png');
  thirdPageImage = loadImage('3rd.png');
  
  // Load trash images
  glassImage = loadImage('GB.png');
  plasticImage = loadImage('Glass.png');
  otherImage = loadImage('Trash.png');
  
  // Load background image for the sorting game
  sortingBackgroundImage = loadImage('Beach.png'); // Replace with your image file
  
  // Load background image for the last page
  endPageImage = loadImage('End.png');
  // Load the background sound
  backgroundSound = loadSound('song.mp3'); // Replace with your sound file
}

function setup() {
  createCanvas(800, 800);
  generateTrashItems(10); // Initialize trash items for the third page game
    // Play and loop the background sound
  if (backgroundSound) {
    backgroundSound.loop();
  }

}

function draw() {
  if (currentPage === 1) {
    image(frontPageImage, 0, 0, width, height);
  } else if (currentPage === 2) {
    image(secondPageImage, 0, 0, width, height);
  } else if (currentPage === 3) {
    playGamePageThree();
  } else if (currentPage === 4) {
    playHoleFillingGame();
  } else if (currentPage === 5) {
    playTrashSortingGame();
  } else if (currentPage === 6) {
    playFinalGame(); // New game on the last page
  }
}

function playGamePageThree() {
  image(thirdPageImage, 0, 0, width, height);
  
  // Display trash items for the third page
  for (let item of trashItems) {
    if (!item.collected) {
      let img = item.type === 'glass' ? glassImage : 
                item.type === 'plastic' ? plasticImage : otherImage;
      image(img, item.x, item.y, 90, 90);
    }
  }
  
  textSize(20);
  fill(0);
  text("Score: " + score, 10, 20);
  text("Time left: " + timer, 10, 40);
  
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }
  
  if (trashItems.every(item => item.collected) && timer > 0) {
    generateTrashItems(10);
  }
  
  if (timer === 0) {
    currentPage = 4;
    timer = 20;
    trashItems = [];
  }
}

// Function to generate initial trash items for the third page game
function generateTrashItems(count) {
  trashItems = [];
  for (let i = 0; i < count; i++) {
    let type = random(['glass', 'plastic', 'other']);
    trashItems.push({
      x: random(width - 120),
      y: random(height - 120),
      type: type,
      collected: false,
      sorted: false
    });
  }
}

function playHoleFillingGame() {
  background(194, 178, 128);

  for (let hole of holes) {
    if (!hole.filled) {
      fill(139, 69, 19);
      ellipse(hole.x, hole.y, hole.size);
    }

    for (let i = hole.particles.length - 1; i >= 0; i--) {
      let p = hole.particles[i];
      fill(194, 178, 128);
      ellipse(p.x, p.y, 5);
      p.y += 1;

      if (p.y > hole.y + hole.size / 4) {
        hole.particles.splice(i, 1);
        hole.size -= 0.1;
      }
    }

    if (hole.size <= 20) {
      hole.filled = true;
    }

    if (mouseIsPressed) {
      let d = dist(mouseX, mouseY, hole.x, hole.y);
      if (d < hole.size / 2 && !hole.filled) {
        if (hole.clickStartTime === null) {
          hole.clickStartTime = millis();
        } else if (millis() - hole.clickStartTime >= 5000) {
          hole.filled = true;
        }

        for (let j = 0; j < 5; j++) {
          hole.particles.push({ x: mouseX + random(-5, 5), y: mouseY });
        }
      }
    } else {
      hole.clickStartTime = null;
    }
  }
}

function playTrashSortingGame() {
  image(sortingBackgroundImage, 0, 0, width, height); // Display the background image

  // Draw bins without text labels
  for (let bin of bins) {
    fill(bin.color);
    rect(bin.x, bin.y, 100, 100);
  }

  // Draw larger trash items
  for (let item of trashItems) {
    if (!item.sorted) {
      let img = item.type === 'glass' ? glassImage : 
                item.type === 'plastic' ? plasticImage : otherImage;
      image(img, item.x, item.y, 80, 80); // Increased size to 80x80
    }
  }

  // Display score
  textSize(20);
  fill(0);
  text("Score: " + score, 10, 20);
}

// New function for the final game page
function playFinalGame() {
  image(endPageImage, 0, 0, width, height); // Display the end page background

  // Placeholder for final game content or completion message
}

// Function to handle clicks on trash items in the third-page game
function handleThirdPageClick() {
  let doubleClickInterval = 300; // 300 ms for double-click
  let currentTime = millis();

  for (let i = 0; i < trashItems.length; i++) {
    let d = dist(mouseX, mouseY, trashItems[i].x + 25, trashItems[i].y + 25);
    if (d < 25 && !trashItems[i].collected) {
      if (currentTime - lastClickTime < doubleClickInterval) {
        trashItems[i].collected = true;
        score++;
        lastClickTime = 0;
      } else {
        lastClickTime = currentTime;
      }
      break;
    }
  }
}

// Function to handle dragging trash items in the fifth-page game
function handleTrashSortingClick() {
  for (let item of trashItems) {
    let d = dist(mouseX, mouseY, item.x + 40, item.y + 40);
    if (d < 40 && !item.sorted) {
      draggedItem = item;
      break;
    }
  }
}

function mousePressed() {
  if (currentPage === 3) {
    handleThirdPageClick(); // Handle clicks for the third-page game
  } else if (currentPage === 5) {
    handleTrashSortingClick(); // Handle clicks for the fifth-page game
  }
}

function mouseDragged() {
  if (draggedItem) {
    draggedItem.x = mouseX - 40;
    draggedItem.y = mouseY - 40;
  }
}

function mouseReleased() {
  if (currentPage === 5 && draggedItem) {
    for (let bin of bins) {
      let d = dist(draggedItem.x + 40, draggedItem.y + 40, bin.x + 50, bin.y + 50);
      if (d < 50 && draggedItem.type === bin.type) {
        draggedItem.sorted = true;
        score++;
        break;
      }
    }
    draggedItem = null;
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    if (currentPage === 1) {
      currentPage = 2;
    } else if (currentPage === 2) {
      currentPage = 3;
    } else if (currentPage === 3) {
      currentPage = 4;
    } else if (currentPage === 4) {
      currentPage = 5;
      generateTrashItems(10); // Set up items for the sorting game
    } else if (currentPage === 5) {
      currentPage = 6; // Move to the final game page after sorting game
    } else if (currentPage === 6) {
      // Restart the game when Enter is pressed on the final page
      resetGame();
    }
  }
}

// Function to reset game variables and start from the beginning
function resetGame() {
  currentPage = 1;
  score = 0;
  timer = 30;
  trashItems = [];
  holes.forEach(hole => {
    hole.size = random(50, 100);
    hole.particles = [];
    hole.filled = false;
    hole.clickStartTime = null;
  });
  generateTrashItems(10); // Re-generate initial trash items for page 3
}
