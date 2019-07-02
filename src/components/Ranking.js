import React from 'react'
import Score from './Score';

export default class Ranking extends React.Component {

    render() {
        let { ranking } = this.props;
        return (
            <div className="ranking">
                <h4>Classement</h4>
                <div className="ranking-wrap">
                    {
                        ranking.map((el, index) => (
                            <Score order={index+1} name={el.name} score={el.score} key={el.uid}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}