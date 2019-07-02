import React from 'react'

export default class Instruction extends React.Component {

    render() {
        return (
            <div className="instructions">
                <h4>Instructions</h4>
                <div className="instructions-wrap">
                    <p>Thanks to your snake catch a maximum of apple without biting you. If you get to one edge you come out of the other.</p>
                    <p>Controllable entirely on the keyboard with the arrow keys and 'z', 's', 'q', 'd'. Press the space bar to start the game and pause it.</p>
                    <p>Have fun <span role="img" aria-label="smile">😁</span></p>
                </div>
            </div>
        )
    }
}