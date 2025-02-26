document.addEventListener("DOMContentLoaded", function () {
    const projects = {
        personalComputer: [
            {
                title: "Custom Raspberry Pi Computer",
                description: "This was a small project I had in the summer of '24, where I built a Raspberry Pi 4 model with a built-in ice cooler and a specially fitted case for optimal airflow. The Raspi is running the OS very well, as I use it for simpler projects and reading the news. It stays extremely cool under more intensive tasks as well. I hooked it up to an older HP Compaq LA2205wg monitor which required a special connector. Pleased with the setup!",
                images: ["pics/IMG_3102-preview.jpg"], // Ensure it's an array
                code: `# Enabling a cooling fan for Raspberry Pi
import RPi.GPIO as GPIO

fan_pin = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(fan_pin, GPIO.OUT)
GPIO.output(fan_pin, GPIO.HIGH)  # Turns fan on`
            }
        ],
        ePaperDisplay: [
            {
                title: "E-paper Display Dashboard",
                description: "Using an E-paper screen to display real-time weather, news, and Raspberry Pi system info. Below are images and a short video demo of the project in action.",
                images: ["pics/IMG_4332.jpg", "pics/IMG_4331.jpg"],  // Multiple images
                video: "pics/IMG_4334.mp4",  // Video file
                code: `# Displaying text on an E-paper screen
from waveshare_epd import epd2in13_V2
import time

epd = epd2in13_V2.EPD()
epd.init()
epd.Clear(0xFF)

epd.display_string("Hello, World!")`
            }
        ]
    };

    function renderProjects(sectionId, projectList) {
        const container = document.getElementById(sectionId);

        if (!container) {
            console.error(`⚠️ ERROR: No section found with ID '${sectionId}'`);
            return;
        }

        projectList.forEach((project, index) => {
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-card");

            let mediaContent = "";

            // Display images (if any)
            if (project.images && project.images.length > 0) {
                mediaContent += `<div class="project-images">`;
                project.images.forEach(image => {
                    mediaContent += `<img src="${image}" class="project-image" alt="Project Image">`;
                });
                mediaContent += `</div>`;
            }

            // Display video (if any)
            if (project.video) {
                mediaContent += `
                    <div class="video-container">
                        <video id="video-${sectionId}-${index}" class="project-video" controls>
                            <source src="${project.video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <button class="play-button" data-video="video-${sectionId}-${index}">▶ Play Video</button>
                    </div>
                `;
            }

            projectCard.innerHTML = `
                <div class="project-title">${project.title}</div>
                <div class="project-description">${project.description}</div>
                ${mediaContent}
                <div class="show-more" data-index="${index}" data-section="${sectionId}">Show Code</div>
                <pre class="hidden" id="${sectionId}-code-${index}"><code>${project.code}</code></pre>
            `;

            container.appendChild(projectCard);
        });
    }

    // ✅ Render both sections
    renderProjects("personal-computer", projects.personalComputer);
    renderProjects("e-paper-display", projects.ePaperDisplay);

    // "Show Code" Button Toggle
    document.querySelectorAll(".show-more").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            const section = this.getAttribute("data-section");
            const codeBlock = document.getElementById(`${section}-code-${index}`);
            codeBlock.classList.toggle("hidden");
        });
    });

    // Play button logic for videos
    document.querySelectorAll(".play-button").forEach(button => {
        button.addEventListener("click", function () {
            const videoId = this.getAttribute("data-video");
            const video = document.getElementById(videoId);
            if (video.paused) {
                video.play();
                this.textContent = "⏸ Pause Video";
            } else {
                video.pause();
                this.textContent = "▶ Play Video";
            }
        });
    });
});
