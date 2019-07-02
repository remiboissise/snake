import React from 'react';

export default class Score extends React.Component {
    render() {
        let { order, name, score } = this.props;
        return(
            <div className='row'>
                <p className='column'>{order}.</p>
                <p className='column'>{name}</p>
                <p className='column'>{score}</p>
            </div>
        )
    }
} 