// Important global variables
var CVWIDTH = 600;
var CVHEIGHT = 600;
var RADIUS = CVWIDTH/2;
var POINTNUM = 1000;
var DUR = 0; // ms
var running_function = 0;
var interrupt_montecarlo = 0;
var is_paused = 0;

// Create canvas and get its context.
const canvas = document.getElementById('montecarlo-simulation');
canvas.width = CVWIDTH;
canvas.height = CVHEIGHT;
const ctx = canvas.getContext('2d');

// Get input and output elements
var ins_p = document.getElementById('inside-montecarlo');
var ratio_p = document.getElementById('ratio-montecarlo');
var tot_points = document.getElementsByName('total-montecarlo')[0];
var start_btn = document.getElementById('montecarlo-strtbtn');
tot_points.value = POINTNUM.toString();

function reset_indicators() {
    ins_p.textContent = 'Inside:';
    ratio_p.textContent = 'Pi estimation:';
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
        ctx.strokeStyle = 'green';
        ctx.stroke();
        return true;
    } else {
        ctx.stroke();
        return false;
    }
}

// Pauses or unpauses montecarlo
function montecarlo_pause(state) {
    if (state) {
        is_paused = 1;
        start_btn.textContent = 'Resume';
        start_btn.setAttribute('onclick', 'montecarlo_pause(0)');
    } else {
        is_paused = 0;
        start_btn.textContent = 'Pause';
        start_btn.setAttribute('onclick', 'montecarlo_pause(1)');
    }
}

// Gets called when the user clicks the button.
async function start_montecarlo() {
    if (running_function) return;
    running_function = 1;

    // Transform button into 'pause' button.
    montecarlo_pause(0);
    
    reset_canvas();

    let favourable = 0;
    let pnum = parseInt(tot_points.value);
    if ( !isNaN(pnum) && pnum >= 1)
        POINTNUM = pnum
    for (let i = 0; i < POINTNUM; i++) {
        if (create_point()) {
            favourable++;
        }
        await sleep(DUR);
        // By comparing areas, favourable/POINTNUM = pir^2/4r^2 = pi/4.
        let ratio = favourable / (i+1);
        ins_p.textContent = `Inside: ${favourable}/${i+1}`;
        ratio_p.textContent = `Pi estimation: ${4 * ratio}`;
        while (is_paused) {
            await sleep(10);
            if (interrupt_montecarlo) {
                start_btn.textContent = 'Start';
                start_btn.setAttribute('onclick', 'start_montecarlo()');
                running_function = 0;
                return;
            }

            // Check if it isn't paused anymore and if that's not because
            // the user reseted.
            if (!is_paused && !interrupt_montecarlo) {
                
                // Transform button into 'pause' button.
                montecarlo_pause(0);
            }
        }
        if (interrupt_montecarlo) {
            start_btn.textContent = 'Start';
            start_btn.setAttribute('onclick', 'start_montecarlo()');
            running_function = 0;
            return;
        }
    }
    running_function = 0;
    start_btn.textContent = 'Restart';
    start_btn.setAttribute('onclick', 'start_montecarlo()');
}

// Stop running the calculation.
async function reset_montecarlo() {
    let was_running = running_function;
    interrupt_montecarlo = 1;
    await sleep(10);

    reset_canvas();
    reset_indicators();
    interrupt_montecarlo = 0;
    if (!was_running) {
        start_btn.textContent = 'Start';
    }
}

reset_canvas();
