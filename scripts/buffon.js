// Important global variables
const buffonCVWIDTH = 601;
const buffonCVHEIGHT = 600;
var MATCHNUM = 10000;
var buffonDUR = 0; // ms
var buffon_running_function = 0;
var interrupt_buffon = 0;
var buffon_is_paused = 0;
var match_spacing = 50

// Create canvas and get its context.
const buffon_canvas = document.getElementById('buffon-simulation');
buffon_canvas.width = buffonCVWIDTH;
buffon_canvas.height = buffonCVHEIGHT;
const buffonctx = buffon_canvas.getContext('2d');

// Get input and output elements
var cross_p = document.getElementById('matches-cross');
var buffon_ratio_p = document.getElementById('ratio-buffon');
var tot_matches = document.getElementsByName('total-buffon')[0];
var buffon_start_btn = document.getElementById('buffon-strtbtn');
tot_matches.value = MATCHNUM.toString();

function buffon_reset_indicators() {
    cross_p.textContent = 'Number of crossing matches: ';
    buffon_ratio_p.textContent = 'Pi estimation:';
}

function buffon_reset_canvas() {

    // Clear canvas.
    buffonctx.clearRect(0, 0, buffon_canvas.width, buffon_canvas.height);
    
    // Create circle.
    buffonctx.beginPath();
    buffonctx.strokeStyle = 'gold';
    for (let i = 0; i <= (buffonCVWIDTH-1)/match_spacing; i++) {
        buffonctx.rect(i * match_spacing, 0, 1, buffonCVHEIGHT);
    }
    buffonctx.stroke();
}

// Creates point at random coordinates.
function create_match() {

    // px and py are integers from 0 to canvas.width
    // (or height) minus 1 pixel
    let px = Math.floor(Math.random() * buffonCVWIDTH);
    let py = Math.floor(Math.random() * buffonCVHEIGHT);
    
    // Draw corresponding rectangle (which represents a point)
    buffonctx.beginPath();
    buffonctx.strokeStyle = 'red';
    buffonctx.rect(px, py, 1, 1);

    // Treat it as a point and check if the distance to
    // the circle's center satisfies the condition of being
    // inside it.
    let d_squared = Math.pow(px - buffonCVWIDTH/2, 2) + Math.pow(py - buffonCVHEIGHT/2, 2);
    if ( d_squared <= Math.pow(RADIUS, 2) ) {
        buffonctx.strokeStyle = 'green';
        buffonctx.stroke();
        return true;
    } else {
        buffonctx.stroke();
        return false;
    }
}

// Pauses or unpauses montecarlo
function buffon_pause(state) {
    if (state) {
        buffon_is_paused = 1;
        buffon_start_btn.textContent = 'Resume';
        buffon_start_btn.setAttribute('onclick', 'buffon_pause(0)');
    } else {
        buffon_is_paused = 0;
        buffon_start_btn.textContent = 'Pause';
        buffon_start_btn.setAttribute('onclick', 'buffon_pause(1)');
    }
}

// Gets called when the user clicks the button.
async function start_buffon() {
    if (buffon_running_function) return;
    buffon_running_function = 1;

    // Transform button into 'pause' button.
    buffon_pause(0);
    
    buffon_reset_canvas();

    let favourable = 0;
    let mnum = parseInt(tot_matches.value);
    if ( !isNaN(mnum) && mnum >= 1)
        MATCHNUM = mnum
    for (let i = 0; i < MATCHNUM; i++) {
        if (create_match()) {
            favourable++;
        }
        await sleep(buffonDUR);
        // By comparing areas, favourable/POINTNUM = pir^2/4r^2 = pi/4.
        let ratio = favourable / (i+1);
        cross_p.textContent = `Number of crossing matches: ${favourable}/${i+1}`;
        buffon_ratio_p.textContent = `Pi estimation: ${4 * ratio}`;
        while (buffon_is_paused) {
            await sleep(10);
            if (interrupt_buffon) {
                buffon_start_btn.textContent = 'Start';
                buffon_start_btn.setAttribute('onclick', 'start_buffon()');
                buffon_running_function = 0;
                return;
            }

            // Check if it isn't paused anymore and if that's not because
            // the user reseted.
            if (!buffon_is_paused && !interrupt_buffon) {
                
                // Transform button into 'pause' button.
                buffon_pause(0);
            }
        }
        if (interrupt_buffon) {
            buffon_start_btn.textContent = 'Start';
            buffon_start_btn.setAttribute('onclick', 'start_buffon()');
            buffon_running_function = 0;
            return;
        }
    }
    buffon_running_function = 0;
    buffon_start_btn.textContent = 'Restart';
    buffon_start_btn.setAttribute('onclick', 'start_buffon()');
}

// Stop running the calculation.
async function reset_buffon() {
    let was_running = buffon_running_function;
    interrupt_buffon = 1;
    await sleep(10);

    buffon_reset_canvas();
    buffon_reset_indicators();
    interrupt_buffon = 0;
    if (!was_running) {
        buffon_start_btn.textContent = 'Start';
    }
}

buffon_reset_canvas();
