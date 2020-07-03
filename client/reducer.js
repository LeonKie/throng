import { MOVE_PUCK, UPDATE_OWN_POS } from './actions'

const RootReducer = (state, action) => {
    switch (action.type) {
        case MOVE_PUCK: {
            const {
                payload: { xRel, yRel },
            } = action
            const {
                puck: [puckX, puckY],
            } = state
            const puck = [puckX + xRel, puckY + xRel]

            console.log(puck)
            return { ...state, puck }
        }
        case UPDATE_OWN_POS:
            const {
                payload: { mouseX, mouseY },
            } = action
            const {
                puck: [puckX, puckY],
                angles,
            } = state

            const angleRadians = Math.atan2(mouseY - puckY, mouseX - puckX)
            const angl = [angleRadians, ...angles.slice(1)]
            return { ...state, angles: angl }
    }

    return state
}

export { RootReducer }
