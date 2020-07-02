//require createStore from 'redux'

const { createStore } = require('redux')
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const x_center = canvas.width / 2
const y_center = canvas.height / 2

import { movePuckAction, updateOwnPos } from './actions'
import { RootReducer } from './reducer'

ctx.fillStyle = '#FF0000'
ctx.beginPath()
ctx.arc(x_center, y_center, 100, 0, 2 * Math.PI)
ctx.stroke()

//game constanst parametes
const answerRad = 100

const initialState = {
    question: 'Wo gehts heute hin?',
    answer: ['Indisch', 'Chinesisch', 'Italienisch', 'Döner'],
    puck: [x_center, y_center],
    angles: [Math.PI],
}

const store = createStore(
    RootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

showGameSetup()

function showGameSetup() {
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.arc(x_center, y_center, 100, 0, 2 * Math.PI)
    ctx.stroke()

    const { answer } = store.getState()
    // calc answer Positions
    const sectionSize = (2 * Math.PI) / answer.length

    const answerPositions = answer.map((a, i) => {
        const angle = sectionSize * (i + 1)
        const xx = x_center + answerRad * Math.cos(angle)
        const yy = y_center + answerRad * Math.sin(angle)
        return [xx, yy]
    })
    drawQuestions(answerPositions)
}

function drawQuestions(answerPositions) {
    answerPositions.forEach((a, i) => {
        ctx.beginPath()
        ctx.arc(a[0], a[1], 5, 0, 2 * Math.PI)
        ctx.fill()
    })
}

function showAllPlayers() {
    getMousePos(canvas)
    store.dispatch(updateOwnPos(mouseX, mouseY))

    const { puck, angles } = store.getState()
    ctx.beginPath()
    ctx.arc(puck[0], puck[1], 10, 0, 2 * Math.PI)
    ctx.fill()

    const playerPositions = angles.map((a) => {
        const xx = puck[0] + 15 * Math.cos(a)
        const yy = puck[1] + 15 * Math.sin(a)
        return [xx, yy]
    })

    drawQuestions(playerPositions)
}

function updatePuck(pick_old) {
    const { puck, angles } = store.getState()
    const puckVec = angles.reduce(
        (T, a) => {
            const xx = 15 * Math.cos(a)
            const yy = 15 * Math.sin(a)
            return [T[0] + xx, T[1] + yy]
        },
        [0, 0]
    )

    store.dispatch(movePuckAction(puckVec[0], puckVec[1]))
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    }
}

function loop() {
    updatePuck()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    showGameSetup()
    showAllPlayers()
}

window.setInterval(loop, 100)
