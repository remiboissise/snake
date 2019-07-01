import React from 'react';

export default class Score extends React.Component {
    render() {
        let { text, value } = this.props;
        return(
            <span className="score">{text} : {value}</span>
        )
    }
} 