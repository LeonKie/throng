const MOVE_PUCK = 'move_puck'
const UPDATE_OWN_POS = 'update_own_pos'

const movePuckAction = (xRel, yRel) => ({
    type: MOVE_PUCK,
    payload: {
        xRel,
        yRel,
    },
})

const updateOwnPos = (mouseX, mouseY) => ({
    type: UPDATE_OWN_POS,
    payload: {
        mouseX,
        mouseY,
    },
})

export { updateOwnPos, UPDATE_OWN_POS }
export { movePuckAction, MOVE_PUCK }
