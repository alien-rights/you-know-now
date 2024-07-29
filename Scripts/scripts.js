document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const menu = document.querySelector('.menu');
    const menuText = menuIcon.querySelector('p');

    menuIcon.addEventListener('click', function() {
        menu.classList.toggle('active');
        if (menu.classList.contains('active')) {
            menuText.textContent = 'CLOSE';
        } else {
            menuText.textContent = 'MENU';
        }
    });
});


// Sticky navbar main pages
const mainNav = document.getElementById('navigation--main-page');
let mainNavTop = mainNav.offsetTop;

function makeNavSticky() {
    const scrollPosition = window.scrollY;

    if (scrollPosition > mainNavTop) {
        mainNav.classList.add('sticky');
        document.body.style.paddingTop = mainNav.offsetHeight + 'px';
    } else {
        mainNav.classList.remove('sticky');
        document.body.style.paddingTop = '0';
    }
}

window.addEventListener('scroll', makeNavSticky);
window.addEventListener('resize', () => {
    // Recalculate the nav's position on resize
    mainNavTop = mainNav.offsetTop;
    makeNavSticky();
});

// Initial call to set the correct state on page load
makeNavSticky();


// DRAWING CANVAS 404 PAGE
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    // ctx.fillStyle = '#F3F1EE';
    ctx.fillStyle = '#81A0CD';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const clearButton = document.getElementById('clearCanvas');

    function resizeCanvas() {
        const canvas = document.getElementById('drawingCanvas');
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    window.addEventListener('load', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    
    // Tool selection
    const pencilTool = document.getElementById('pencilTool');
    const eraserTool = document.getElementById('eraserTool');
    let currentTool = 'pencil';
    
    pencilTool.addEventListener('click', () => setTool('pencil'));
    eraserTool.addEventListener('click', () => setTool('eraser'));
    
    function setTool(tool) {
        currentTool = tool;
        pencilTool.classList.toggle('active', tool === 'pencil');
        eraserTool.classList.toggle('active', tool === 'eraser');
    }
    
    // Modify your existing drawing function to use the current tool
    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        if (currentTool === 'eraser') {
            ctx.strokeStyle = '#81A0CD';
        } else {
            ctx.strokeStyle = colorPicker.value;
        }
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    clearButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});