//
// 1) Fireworks Code (OPTIONAL)
//    Only runs if there's a button with id="fireButton" in your HTML.
//

document.addEventListener("DOMContentLoaded", function() {
  let fireCanvas, fireCtx;
  let canvasCreated = false;

  const fireButton = document.getElementById("fireButton"); // If you have a button with this ID

  function createCanvas() {
    fireCanvas = document.createElement("canvas");
    document.body.appendChild(fireCanvas);
    fireCtx = fireCanvas.getContext("2d");

    // Adjust the fireworks canvas size and position
    fireCanvas.width = window.innerWidth;
    fireCanvas.height = 200; // Height of the fireworks area
    fireCanvas.style.position = "fixed";
    fireCanvas.style.bottom = "0";
    fireCanvas.style.left = "0";
    fireCanvas.style.pointerEvents = "none"; // Allows clicks through
    fireCanvas.style.zIndex = "1000"; // Ensures it's above other content

    canvasCreated = true;
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function Firework() {
    this.x = random(0, fireCanvas.width);
    this.y = fireCanvas.height + 10;
    this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
    this.particles = [];

    this.explode = function() {
      for (let i = 0; i < 30; i++) {
        this.particles.push(new Particle(this.x, this.y - 10, this.color));
      }
    };

    this.update = function() {
      this.particles = this.particles.filter((p) => p.lifeSpan > 0);
      this.particles.forEach((p) => p.update());
    };

    this.draw = function() {
      this.particles.forEach((p) => p.draw());
    };
  }

  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-2, -5);
    this.lifeSpan = random(30, 60);
    this.color = color;

    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.04; // Gravity
      this.lifeSpan--;
    };

    this.draw = function() {
      fireCtx.fillStyle = this.color;
      fireCtx.beginPath();
      fireCtx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
      fireCtx.fill();
    };
  }

  let fireworks = [];

  function loop() {
    if (canvasCreated) {
      fireCtx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);

      fireworks.forEach((fw) => {
        fw.update();
        fw.draw();
      });

      fireworks = fireworks.filter((fw) => fw.particles.length > 0);

      if (fireworks.length > 0) {
        requestAnimationFrame(loop);
      }
    }
  }

  // If the button exists, attach the event listener
  if (fireButton) {
    fireButton.addEventListener("click", function() {
      if (!canvasCreated) createCanvas();
      let firework = new Firework();
      firework.explode();
      fireworks.push(firework);
      requestAnimationFrame(loop);
    });
  }
});

//
// 2) Animated Swirl/Pattern Code
//    This runs inside the final card (with id="c"), filling the card.
//

document.addEventListener("DOMContentLoaded", function() {
  const animationContainer = document.querySelector(".animation-card");
  const c = document.querySelector("#c");
  const bgCtx = c.getContext("2d");

  // Resize the canvas to match the card's size
  function resizeCanvas() {
    c.width = animationContainer.offsetWidth;
    c.height = animationContainer.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Simple pseudo-random function
  function pseudoRandom(seed) {
    return Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
  }

  // Noise using pseudoRandom
  function noise(x, y) {
    const seed = x * 137 + y * 149;
    return pseudoRandom(seed) % 1;
  }

  // Color palette array (HS L)
  const palette = [
    [197, 100, 4.5],
    [190, 100, 22.5],
    [181, 87.5, 31.4],
    [160, 40.8, 70.2],
    [45, 60.4, 78.2],
    [39, 100, 46.7],
    [30, 98, 40],
    [19, 96.8, 37.3],
    [5, 81.3, 37.6],
    [358, 64, 37.1],
  ];

  // Convert palette index to HSL string
  const getHsl = (index) => {
    const [h, s, l] = palette[index % palette.length];
    return `hsl(${h}deg, ${s}%, ${l}%)`;
  };

  // Main swirl drawing function
  function drawMainCircle(time, offset) {
    // We'll draw a swirl pattern, then tile it in the card
    const sw = 100;
    const sh = 300;
    const partCanvas = document.createElement("canvas");
    const partCtx = partCanvas.getContext("2d");
    partCanvas.width = sw;
    partCanvas.height = sh;

    // Draw vertical swirl lines
    const waves = 10;
    for (let i = 1; i < waves; i++) {
      partCtx.beginPath();
      const top = ((sh / waves) * i + (time / 5000) * (sh / 2)) % sh;
      const size = 25 + Math.sin(i + time / 1000) * 15;
      const x = sw / 2;
      const y = top;

      partCtx.moveTo(x, y - size * 1.25);
      partCtx.lineTo(x + size, y - size * 0.75);
      partCtx.lineTo(x + size, y + size * 0.75);
      partCtx.lineTo(x, y + size * 1.25);
      partCtx.lineTo(x - size, y + size * 0.75);
      partCtx.lineTo(x - size, y - size * 0.75);
      partCtx.closePath();

      partCtx.fillStyle = getHsl(i);
      partCtx.strokeStyle = getHsl(i + 4);
      partCtx.lineWidth = 5;

      partCtx.fill();
      partCtx.stroke();
    }

    // Crop with a triangle shape
    partCtx.globalCompositeOperation = "destination-in";
    partCtx.fillStyle = "black";
    partCtx.beginPath();
    partCtx.moveTo(sw / 2, 0);
    partCtx.lineTo(sw, sh);
    partCtx.lineTo(0, sh);
    partCtx.closePath();
    partCtx.fill();

    // Reset composite
    partCtx.globalCompositeOperation = "source-over";

    // Now revolve these swirls in a circle
    const circleCanvas = document.createElement("canvas");
    const circleCtx = circleCanvas.getContext("2d");
    circleCanvas.width = sh * 2;
    circleCanvas.height = sh * 2;
    circleCtx.translate(sh, sh);

    const count = 20;
    const angle = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      circleCtx.drawImage(partCanvas, -sw / 2, 0);
      circleCtx.rotate(angle);
    }

    // Crop to a hex shape
    const step = 400;
    const half = step / 2;
    circleCtx.globalCompositeOperation = "destination-in";
    circleCtx.fillStyle = "red";
    circleCtx.beginPath();
    circleCtx.moveTo(0, -half * 1.25);
    circleCtx.lineTo(half, -half * 0.75);
    circleCtx.lineTo(half, half * 0.75);
    circleCtx.lineTo(0, half * 1.25);
    circleCtx.lineTo(-half, half * 0.75);
    circleCtx.lineTo(-half, -half * 0.75);
    circleCtx.closePath();
    circleCtx.fill();
    circleCtx.globalCompositeOperation = "source-over";

    // Finally, tile these shapes across the card canvas
    for (let yy = offset; yy < c.height + step; yy += step) {
      for (let xx = offset; xx < c.width + step; xx += step) {
        bgCtx.resetTransform();
        bgCtx.translate(xx + half * ((yy / step) % 2), yy);

        for (let i = 0; i < count; i++) {
          bgCtx.drawImage(circleCanvas, -sw / 2, 0);
        }
      }
    }
  }

  function animate(time) {
    requestAnimationFrame(animate);
    bgCtx.clearRect(0, 0, c.width, c.height);
    // Offset of -400 just as an example
    drawMainCircle(time, -400);
  }

  animate(0);
});


function updateClock() {
  let time = new Date();
  let h = time.getHours();
  let m = time.getMinutes();
  
  // Add leading zero for single-digit numbers
  document.getElementById("hour").innerHTML = h < 10 ? "0" + h : h;
  document.getElementById("min").innerHTML = m < 10 ? "0" + m : m;
}

// Update clock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call



document.addEventListener("DOMContentLoaded", function() {
    const fireButton = document.getElementById('fireButton');
    let canvasCreated = false;
    let canvas, ctx;

    function createCanvas() {
        canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');

        // Adjust the canvas size and position
        canvas.width = window.innerWidth;
        canvas.height = 200;  // Height of the fireworks area
        canvas.style.position = 'fixed';
        canvas.style.bottom = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';  // Allows clicking through the canvas
        canvas.style.zIndex = '1000';  // Ensures it is above other content but below overlays

        canvasCreated = true;
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function Firework() {
        this.x = random(0, canvas.width);
        this.y = canvas.height + 10;
        this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
        this.particles = [];

        this.explode = function() {
            for (let i = 0; i < 30; i++) {
                this.particles.push(new Particle(this.x, this.y - 10, this.color));
            }
        };

        this.update = function() {
            this.particles = this.particles.filter(p => p.lifeSpan > 0);
            this.particles.forEach(p => p.update());
        };

        this.draw = function() {
            this.particles.forEach(p => p.draw());
        };
    }

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = random(-3, 3);
        this.vy = random(-2, -5);
        this.lifeSpan = random(30, 60);
        this.color = color;

        this.update = function() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.04;  // Gravity
            this.lifeSpan--;
        };

        this.draw = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        };
    }

    let fireworks = [];

    function loop() {
        if (canvasCreated) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear only the part of the canvas

            fireworks.forEach(fw => {
                fw.update();
                fw.draw();
            });

            fireworks = fireworks.filter(fw => fw.particles.length > 0);

            if (fireworks.length > 0) {
                requestAnimationFrame(loop);
            }
        }
    }

    fireButton.addEventListener('click', function() {
        if (!canvasCreated) createCanvas();
        let firework = new Firework();
        firework.explode();
        fireworks.push(firework);
        requestAnimationFrame(loop);
    });
});

const nowActivities = [
  "Currently doing school work 📓",
  "Running the New York Botanical Gardens right now! 🏃",
  "Messing with my Raspberry Pi 💻",
  "Exploring NYC coffee shops ☕",
  "Building interactive web projects!",
  "Studying for exams 📚"
];

function updateNow() {
  const nowBox = document.getElementById("now-text");
  nowBox.innerText = nowActivities[Math.floor(Math.random() * nowActivities.length)];
}

setInterval(updateNow, 10000); // Changes every 5 seconds