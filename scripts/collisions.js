// Important global variables
const colCVWIDTH = 600;
const colCVHEIGHT = 200;
var PIDIG = 1000;
var colDUR = 0; // ms
var colrunning_function = 0;
var interrupt_col = 0;
var colis_paused = 0;
var smallsize = 40;
var bigsize = 80;
var small_x = 70
var big_x = 350

// Create canvas and get its context.
const colcanvas = document.getElementById('collision-simulator');
colcanvas.width = colCVWIDTH;
colcanvas.height = colCVHEIGHT;
const colctx = colcanvas.getContext('2d');

// Get input and output elements
var colcur = document.getElementById('collision-number');
var colratio_p = document.getElementById('ratio-collision');
var pi_digits = document.getElementsByName('pi-digits')[0];
var colstart_btn = document.getElementById('collision-strtbtn');
pi_digits.value = PIDIG.toString();

function colreset_indicators() {
    colcur.textContent = 'Number of collisions:';
    colratio_p.textContent = 'Pi estimation:';
}

function colreset_canvas() {

    // Clear canvas.
    colctx.clearRect(0, 0, colcanvas.width, colcanvas.height);
    
    // Create the squares.
    colctx.beginPath();
    colctx.strokeStyle = 'blue';
    colctx.rect(small_x, colCVHEIGHT - smallsize, smallsize, smallsize);
    colctx.rect(big_x, colCVHEIGHT - bigsize, bigsize, bigsize);
    colctx.stroke();
}

// Creates point at random coordinates.
function colcreate_point() {

    // px and py are integers from 0 to canvas.width
    // (or height) minus 1 pixel
    let px = Math.floor(Math.random() * colCVWIDTH);
    let py = Math.floor(Math.random() * colCVHEIGHT);
    
    // Draw corresponding rectangle (which represents a point)
    colctx.beginPath();
    ctx.strokeStyle = 'red';
    colctx.rect(px, py, 1, 1);

    // Treat it as a point and check if the distance to
    // the circle's center satisfies the condition of being
    // inside it.
    let d_squared = Math.pow(px - colCVWIDTH/2, 2) + Math.pow(py - colCVHEIGHT/2, 2);
    if ( d_squared <= Math.pow(RADIUS, 2) ) {
        colctx.strokeStyle = 'green';
        colctx.stroke();
        return true;
    } else {
        colctx.stroke();
        return false;
    }
}

// Pauses or unpauses montecarlo
function collision_pause(state) {
    if (state) {
        colis_paused = 1;
        colstart_btn.textContent = 'Resume';
        colstart_btn.setAttribute('onclick', 'collision_pause(0)');
    } else {
        colis_paused = 0;
        colstart_btn.textContent = 'Pause';
        colstart_btn.setAttribute('onclick', 'collision_pause(1)');
    }
}

// Gets called when the user clicks the button.
async function start_collision() {
    if (colrunning_function) return;
    colrunning_function = 1;

    // Transform button into 'pause' button.
    collision_pause(0);
    
    colreset_canvas();

    let favourable = 0;
    let pnum = parseInt(pi_digits.value);
    if ( !isNaN(pnum) && pnum >= 1)
        PIDIG = pnum
    for (let i = 0; i < PIDIG; i++) {
        if (colcreate_point()) {
            favourable++;
        }
        await sleep(DUR);
        // By comparing areas, favourable/POINTNUM = pir^2/4r^2 = pi/4.
        let ratio = favourable / (i+1);
        colcur.textContent = `Number of collisions: ${favourable}/${i+1}`;
        colratio_p.textContent = `Pi estimation: ${4 * ratio}`;
        while (colis_paused) {
            await sleep(10);
            if (interrupt_col) {
                colstart_btn.textContent = 'Start';
                colstart_btn.setAttribute('onclick', 'start_collision()');
                colrunning_function = 0;
                return;
            }

            // Check if it isn't paused anymore and if that's not because
            // the user reseted.
            if (!colis_paused && !interrupt_col) {
                
                // Transform button into 'pause' button.
                collision_pause(0);
            }
        }
        if (interrupt_col) {
            colstart_btn.textContent = 'Start';
            colstart_btn.setAttribute('onclick', 'start_collision()');
            colrunning_function = 0;
            return;
        }
    }
    colrunning_function = 0;
    colstart_btn.textContent = 'Restart';
    colstart_btn.setAttribute('onclick', 'start_collision()');
}

// Stop running the calculation.
async function reset_collision() {
    let was_running = colrunning_function;
    interrupt_col = 1;
    await sleep(10);

    colreset_canvas();
    colreset_indicators();
    interrupt_col = 0;
    if (!was_running) {
        colstart_btn.textContent = 'Start';
    }
}

colreset_canvas();
