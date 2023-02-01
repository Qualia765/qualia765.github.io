var c = document.getElementById("canvas")
var ctx = c.getContext("2d")

function loop(count,callback) {
    for(let i = 0; i < count; i++)
        callback(i)
}

var state
var newState
var counts

reset = function() {
    state = []
    newState = []
    counts = []
    loop(c.width/10,i=>{
        state.push([])
        newState.push([])
        counts.push([])
        loop(c.height/10,j=>{
            state[i].push(0)
            newState[i].push(state[i][j])
            counts[i].push(0)
        })
    })
}

reset()

function loopState(callback) {
    let x = 0
    state.forEach(i => {
        let y = 0
        i.forEach(j => {
            callback(x,y)
            y++
        })
        x++
    })
}

function draw(){
    ctx.clearRect(0, 0, c.width, c.height)
    loopState((x,y) => {
        if (state[x][y]) ctx.fillRect(x*10,y*10,10,10)
    })
}
draw()

function offset(which,x,y,xOff,yOff) {
    return which[(x-xOff+state.length) % state.length][(y-yOff+state[0].length) % state[0].length]
}

function adjacent(x,y,callback) {
    callback((x-1+state.length) % state.length,(y-1+state[0].length) % state[0].length)
    callback((x-1+state.length) % state.length,y)
    callback((x-1+state.length) % state.length,(y+1) % state[0].length)
    callback(x,(y-1+state[0].length) % state[0].length)
    callback(x,(y+1) % state[0].length)
    callback((x+1) % state.length,(y-1+state[0].length) % state[0].length)
    callback((x+1) % state.length,y)
    callback((x+1) % state.length,(y+1) % state[0].length)
}

function rule(count, current){
    //return true
/*     if (Math.random() < 0.05) return Math.random() < 0.5

    if (count == 64) return false
    if (count > 36) return true
    if (count == 28 || count == 29) return Math.random() < 0.5
    if (count < 24) return false
    if (count == 0) return true
    return current */
    if (count < 2) return false
    if (count == 3) return true
    if (count > 3) return false
    return current
}

function updateState(){
    loopState((x,y) => {
        let count = 0;
        adjacent(x,y,(X,Y)=>{
            if (state[X][Y]) count++
        })
        counts[x][y] = count
    })

    loopState((x,y) => {
        newState[x][y] = rule(counts[x][y],state[x][y])
/*         let count = 0;
        adjacent(x,y,i=>{
            count += counts[x][y]
        })

        newState[x][y] = rule(count,state[x][y]) */
    })

    loopState((x,y) => {
        state[x][y] = newState[x][y]
    })
}

function main() {
    updateState()
    draw()
}

var SIMULATE = document.getElementById('activeCheckbox').checked

setInterval(function(){
    if (SIMULATE) main()
}, 50)

var selectedState = false
var mouseDown = false


var mouseX = 0;
var mouseY = 0;

function updateMosPos(e) {
    CRECT = c.getBoundingClientRect() // Gets CSS pos, and width/height
    mouseX = Math.round((e.clientX - CRECT.left-5)/10) // Subtract the 'left' of the canvas 
    mouseY = Math.round((e.clientY - CRECT.top-5)/10)  // from the X/Y positions to make 
    //ctx.fillRect(mouseX*10-3,mouseY*10-3,6,6)
    //ctx.moveTo(mouseX,mouseY)
}

c.addEventListener("mousemove", e => {
    if (!mouseDown) return
    updateMosPos(e)
    state[mouseX][mouseY] = selectedState
    draw()
})
c.addEventListener("mousedown", e => {
    updateMosPos(e)
    selectedState = !state[mouseX][mouseY]
    state[mouseX][mouseY] = selectedState
    mouseDown = true
    draw()
})
c.addEventListener("mouseup", () => {
    mouseDown = false
})
c.addEventListener("mouseout", () => {
    mouseDown = false
})