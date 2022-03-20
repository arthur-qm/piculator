// Important global variables
const CVWIDTH = 600
const CVHEIGHT = 600
const RADIUS = CVWIDTH/2
var POINTNUM = 10000
var DUR = 0 // ms
var running_function = 0
var interrupt_montecarlo = 0

// Create canvas and get its context.
const canvas = document.getElementById('montecarlo-simulation');
canvas.width = CVWIDTH;
canvas.height = CVHEIGHT;
const ctx = canvas.getContext('2d');

// Get input and output elements
var ins_p = document.getElementById('inside-montecarlo')
var ratio_p = document.getElementById('ratio-montecarlo')
var tot_points = document.getElementsByName('total-montecarlo')[0]
tot_points.value = POINTNUM.toString()

function reset_indicators() {
    ins_p.textContent = 'Inside:'
    ratio_p.textContent = 'Pi estimation:'
}

function reset_canvas() {

    // Clear canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create circle.
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.arc(canvas.width/2, canvas.height/2, RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
}

// Creates point at random coordinates.
function create_point() {

    // px and py are integers from 0 to canvas.width
    // (or height) minus 1 pixel
    let px = Math.floor(Math.random() * CVWIDTH);
    let py = Math.floor(Math.random() * CVHEIGHT);
    
    // Draw corresponding rectangle (which represents a point)
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.rect(px, py, 1, 1);

    // Treat it as a point and check if the distance to
    // the circle's center satisfies the condition of being
    // inside it.
    let d_squared = Math.pow(px - CVWIDTH/2, 2) + Math.pow(py - CVHEIGHT/2, 2);
    if ( d_squared <= Math.pow(RADIUS, 2) ) {
        ctx.strokeStyle = 'green'
        ctx.stroke();
        return true;
    } else {
        ctx.stroke();
        return false;
    }
}

// Gets called when the user clicks the button.
async function start_montecarlo() {
    if (running_function) return;
    running_function = 1
    
    reset_canvas();

    let favourable = 0
    let pnum = parseInt(tot_points.value)
    if ( !isNaN(pnum) && pnum >= 1)
        POINTNUM = pnum
    for (let i = 0; i < POINTNUM; i++) {
        if (create_point()) {
            favourable++
        }
        await sleep(DUR)
        // By comparing areas, favourable/POINTNUM = pir^2/4r^2 = pi/4.
        let ratio = favourable / (i+1)
        ins_p.textContent = `Inside: ${favourable}/${i+1}`
        ratio_p.textContent = `Pi estimation: ${4 * ratio}`
        if (interrupt_montecarlo) break;
    }
    running_function = 0
}

// Stop running the calculation.
async function reset_montecarlo() {
    interrupt_montecarlo = 1
    await sleep(10)

    reset_canvas()
    reset_indicators()
    interrupt_montecarlo = 0
}

reset_canvas();
