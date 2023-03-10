import React from 'react';
import './Match.css';

class Match extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.matchData.matchDate.slice(0, 10),
            time: this.props.matchData.matchTime.toLowerCase(),
            wpm: this.props.matchData.score
        }
    }

    render() {
        const data = this.state;
        return (
            <div className="Match">
                <div className="outercontainer">
                    <div className='innercontainer'>
                        <div className="date">{data.date}</div>
                        <div className="time">{data.time}</div>
                        <div className="wpm">{data.wpm}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Match;
