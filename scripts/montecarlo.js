
// Create canvas and get its context.
const canvas = document.getElementById('montecarlo-simulation');
canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext('2d');
var radius = canvas.width/2

function reset_canvas() {

    // Clear canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create circle.
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

// Creates point at random coordinates.
function create_point() {

    // px and py are integers from 0 to canvas.width
    // (or height) minus 1 pixel
    let px = Math.floor(Math.random() * canvas.width);
    let py = Math.floor(Math.random() * canvas.height);
    
    // Draw corresponding rectangle (which represents a point)
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.rect(px, py, 1, 1);
    ctx.stroke();

    // Treat it as a point and check if the distance to
    // the circle's center satisfies the condition of being
    // inside it.
    let d_squared = Math.pow(px - canvas.width/2, 2) + Math.pow(py - canvas.height/2, 2);
    if ( d_squared <= Math.pow(radius, 2) ) {
        return true;
    } else {
        return false;
    }
}

// Gets called when the user clicks the button.
function start_montecarlo() {
    reset_canvas();
}

reset_canvas();
create_point();
