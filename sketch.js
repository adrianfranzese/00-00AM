"use strict";
p5.disableFriendlyErrors = true;
let source, bounds, pos, l, lupi
let blobs = []
let cats = false
let gifs = []

function keyReleased() {
  // Fullscreen on/off on "Spacebar" press
  if (keyCode == 32) {
    let fs = fullscreen()
    fullscreen(!fs)
  }
  // Press "enter" for cats
  if (keyCode == 13) {
    cats = !cats
  }
}

// Resize canvas to fit viewport
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Load text sources and gifs before anything else
function preload() {
  source = loadStrings("data/text.txt")
  lupi = loadImage('data/lupi.png')
  for (let i = 0; i < 18; i++) {
    let gif = 'data/gifs/' + i + '.gif'
    gifs.push(gif)
  }
}

function setup() {
  // Set scroll bounds to be bigger than the window
  bounds = {
    x: windowWidth * 3 - 350,
    y: windowHeight * 3 - 350
  }
  // canvas in BG
  createCanvas(windowWidth, windowHeight).id('background')

  displayText()

  // Make 8 blobs
  for (let i = 0; i < 8; i++) {
    newBlobs()
  }

  // SVG stuff (for red lines)
  let svg = document.getElementsByTagName('svg')[0];
  svg.setAttribute('width', bounds.x)
  svg.setAttribute('height', bounds.y)

  // Set auto-scroll every 10 secs
  setInterval(scrollRandom, 10000);
}

function scrollRandom() {
  scrollTo({
    top: random(0, bounds.x),
    left: random(0, bounds.y),
    behavior: "smooth"
  })
}

function draw() {
  background(0, 0, 0, 8)
  noStroke()
  fill(0, 0, 255, 90)

  // Draw the blobs (or cats)
  for (let i = 0; i < blobs.length; i++) {
    let blob = blobs[i]

    if (cats) {
      imageMode(CENTER)
      image(lupi, blob.x, blob.y, blob.size, blob.size)
    } else {
      ellipseMode(CENTER)
      ellipse(blob.x, blob.y, blob.size, blob.size)
    }

    // Move blob position
    blob.x += blob.dx
    blob.y += blob.dy

    // Bounce off window bounds
    if (blob.y > height || blob.y < 0) {
      blob.dy = blob.dy * -1
    }
    if (blob.x > width || blob.x < 0) {
      blob.dx = blob.dx * -1
    }
  }
}



function mousePressed() {
  removeElements()
  let lines = selectAll('line')
  if (lines.length > 0) {
    for (let i = 0; i < lines.length; i++) {
      lines[i].remove()
    }
  }
  displayText()
}

function displayText() {
  // Make random array of points within bounds
  pos = new Array(source.length)
  for (let i = 0; i < pos.length; i++) {
    pos[i] = {
      x: round(random(bounds.x)),
      y: round(random(bounds.y))
    }
  }

  // Position text and lines
  for (let [index, sentence] of source.entries()) {
    let p = createP(sentence).parent("#container").position(pos[index].x, pos[index].y)

    // Draw a line between this paragraph and the next
    let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line.style.stroke = "#f73b0c"
    if (index < pos.length - 1) {
      let nextPos = pos[index + 1]
      line.setAttribute('x1', pos[index].x)
      line.setAttribute('y1', pos[index].y)
      line.setAttribute('x2', nextPos.x)
      line.setAttribute('y2', nextPos.y)
      svg.appendChild(line);
    } else { // Link first and last together
      line.setAttribute('x1', pos[0].x)
      line.setAttribute('y1', pos[0].y)
      line.setAttribute('x2', pos[pos.length - 1].x)
      line.setAttribute('y2', pos[pos.length - 1].y)
    }
  }

  // pick a random loader gif
  createImg(random(gifs), 'loading...').id('gif')
}

// Make a blob object
function newBlobs() {
  let newBlob = {
    size: random(120, 300),
    x: random(width),
    y: random(height),
    dx: random(-0.8, 0.8),  // How many pixels the blob moves per frame
    dy: random(-0.8, 0.8)
  }
  blobs.push(newBlob)
}
