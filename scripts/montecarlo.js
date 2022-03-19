const canvas = document.getElementById('montecarlo-simulation')
canvas.width = 600
canvas.height = 600
const ctx = canvas.getContext('2d')

function reset_canvas() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Create circle
    ctx.beginPath()
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, 2 * Math.PI)
    ctx.stroke()
}

function start_montecarlo() {
    reset_canvas()
}

reset_canvas()
