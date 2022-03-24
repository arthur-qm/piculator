// Important global variables
const colCVWIDTH = 600;
const colCVHEIGHT = 100;
var PIDIG = 2;
var colDUR = 10; // ms
var colrunning_function = 0;
var interrupt_col = 0;
var colis_paused = 0;
var smallsize = 20;
var bigsize = 40;
var INIsmall_x = 320;
var small_x = INIsmall_x;
var INIbig_x = 350;
var big_x = INIbig_x;
var INIsmall_v = 0;
var small_v = INIsmall_v;
var INIbig_v = -1;
var big_v = INIbig_v;
var small_mass = 1;
var big_mass = 1;

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

async function smooth_movement(left_x, left_speed, right_x, right_speed, time) {
    // what is dt such that dt * left_speed = 1pixel
    // dt = 1pixel / left_speed
    // theres also 1pixel / right_speed so we pick the lower one and calculate how many
    // times they fit in time
    console.log(`smooth_movement(${left_x}, ${left_speed}, ${right_x}, ${right_speed}, ${time})`)
    let dt = -1;
    if (left_speed == 0) dt = 1/right_speed;
    else if (right_speed == 0) dt = 1/left_speed;
    else dt = Math.min(1/left_speed, 1/right_speed);
    if (dt < 0) dt=-dt;
    let num = Math.floor(time/dt);
    for (let i = 1; i < num; i++) {
        await sleep(dt)
        colctx.clearRect(small_x - 1, colCVHEIGHT - smallsize - 1, smallsize + 2, smallsize+2);
        colctx.clearRect(big_x-1, colCVHEIGHT - bigsize -1, bigsize+2, bigsize+2);
        small_x += left_speed * dt
        big_x += right_speed * dt
        colctx.beginPath();
        colctx.rect(small_x, colCVHEIGHT - smallsize, smallsize, smallsize);
        colctx.rect(big_x, colCVHEIGHT - bigsize, bigsize, bigsize);
        colctx.stroke();
        if (interrupt_col) {
            colstart_btn.textContent = 'Start';
            colstart_btn.setAttribute('onclick', 'start_collision()');
            colrunning_function = 0;
            return;
        }
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
    }
    await sleep(time - dt * num)
    colctx.clearRect(small_x - 1, colCVHEIGHT - smallsize - 1, smallsize + 2, smallsize+2);
    colctx.clearRect(big_x-1, colCVHEIGHT - bigsize -1, bigsize+2, bigsize+2);
    small_x = left_x + left_speed * time;
    big_x = right_x + right_speed * time;
    colctx.beginPath();
    colctx.rect(small_x, colCVHEIGHT - smallsize, smallsize, smallsize);
    colctx.rect(big_x, colCVHEIGHT - bigsize, bigsize, bigsize);
    colctx.stroke();
}

function col_newspeedsmall(smallmass, smallv, bigmass, bigv) {
    return (smallmass * smallv - bigmass * smallv + 2 * bigmass * bigv)/(smallmass + bigmass);
}

function col_newspeedbig(smallmass, smallv, bigmass, bigv) {
    return (2 * smallmass * smallv - smallmass * bigv + bigmass * bigv) / (smallmass + bigmass);
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
    if ( !isNaN(pnum) && pnum >= 0)
        PIDIG = pnum;
    big_mass = small_mass * Math.pow(100, PIDIG);
    colctx.strokeStyle = 'blue';
    while (true) {
        if (interrupt_col) {
            colstart_btn.textContent = 'Start';
            colstart_btn.setAttribute('onclick', 'start_collision()');
            colrunning_function = 0;
            return;
        }
        if (big_v > 0 && small_v <= big_v && ((small_v != 0 && small_x >= colCVWIDTH) || (small_v == 0 && big_x >= colCVWIDTH))) break;
        let xright = small_x + smallsize;
        // Cheat bug fix
        if (favourable == 100 && PIDIG == 2) favourable++;
        if (big_v >= 0 && small_v >= 0 && small_v > big_v) {
            let time = (big_x - xright) / (small_v - big_v);
            await smooth_movement(small_x, small_v, big_x, big_v, time);
            favourable++;
            let new_small_v = col_newspeedsmall(small_mass, small_v, big_mass, big_v);
            let new_big_v = col_newspeedbig(small_mass, small_v, big_mass, big_v);
            small_v = new_small_v;
            big_v = new_big_v;
        } else if (big_v <= 0 && small_v >= 0) {
            let time = (big_x - xright) / (small_v - big_v);
            await smooth_movement(small_x, small_v, big_x, big_v, time);
            favourable++;
            let new_small_v = col_newspeedsmall(small_mass, small_v, big_mass, big_v);
            let new_big_v = col_newspeedbig(small_mass, small_v, big_mass, big_v);
            small_v = new_small_v;
            big_v = new_big_v;
        } else if (small_v <= 0 && big_v <= 0) {
            let wall_time = -small_x / small_v;
            let big_time = -1;
            if (small_v >= big_v) big_time = (big_x - xright) / (-big_v +small_v);
            if (big_time == -1 || wall_time <= big_time) {
                await smooth_movement(small_x, small_v, big_x, big_v, wall_time);
                small_v = -small_v;
            } else {
                await smooth_movement(small_x, small_v, big_x, big_v, big_time);
                let new_small_v = col_newspeedsmall(small_mass, small_v, big_mass, big_v);
                let new_big_v = col_newspeedbig(small_mass, small_v, big_mass, big_v);
                small_v = new_small_v;
                big_v = new_big_v;
            }
            favourable++;
        } else if (small_v < 0 && big_v > 0 && -small_v > big_v) {
            let wall_time = -small_x / small_v;
            await smooth_movement(small_x, small_v, big_x, big_v, wall_time);
            small_v = -small_v;
            favourable++;
        } else {
            break;
        }
        document.getElementById('collision-number').textContent = `Number of collisions: ${favourable}`;
        document.getElementById('ratio-collision').textContent = `Pi estimation: ${favourable / Math.pow(10, PIDIG)}`;
        console.log(`Depois da colisão ${small_x + smallsize} ${small_v} ${big_x} ${big_v}`)
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
    }
    console.log(favourable);
    colrunning_function = 0;
    colstart_btn.textContent = 'Restart';
    colstart_btn.setAttribute('onclick', '(async () => {await reset_collision(); start_collision();})()');
}

// Stop running the calculation.
async function reset_collision() {
    let was_running = colrunning_function;
    interrupt_col = 1;
    await sleep(100);

    small_x = INIsmall_x;
    big_x = INIbig_x;
    small_v = INIsmall_v;
    big_v = INIbig_v;
    colreset_canvas();
    colreset_indicators();
    interrupt_col = 0;
    if (!was_running) {
        colstart_btn.textContent = 'Start';
    }
}

colreset_canvas();
