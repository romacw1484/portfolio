// Terminal typing effect
const cyberTerminal = document.getElementById('cyber-terminal');
const commands = [
    '> npm run build-future',
    '> compiling innovation...',
    '> deploying solutions...',
    '> status: changing_world'
];

let cmdIndex = 0;
function typeCommand() {
    cyberTerminal.innerHTML = '';
    let i = 0;
    const typing = setInterval(() => {
        cyberTerminal.innerHTML += commands[cmdIndex][i];
        i++;
        if(i >= commands[cmdIndex].length) {
            clearInterval(typing);
            setTimeout(nextCommand, 2000);
        }
    }, 50);
}

function nextCommand() {
    cmdIndex = (cmdIndex + 1) % commands.length;
    typeCommand();
}

typeCommand();

// GSAP animations
gsap.from('header', { 
    y: -100, 
    opacity: 0, 
    duration: 1.5, 
    ease: "power4.out" 
});

gsap.to('.holographic', {
    repeat: -1,
    duration: 2,
    yoyo: true,
    ease: "power1.inOut",
    y: 10
});

// Scroll-triggered 3D effects
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const threeCanvas = document.querySelector('#three-canvas');
    threeCanvas.style.transform = `rotateZ(${scrollY * 0.1}deg)`;
});
