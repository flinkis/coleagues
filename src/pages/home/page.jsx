import React from "react";
import styles from "./style.css";
import NumberTilte from "./NumberTilte";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DataFromDB: {
                number: 0,
                user: ''
            }
        };

        this.listNumeber = this.listNumeber.bind(this)
    }

    tick() {
        console.log('here!');
    }

    listNumeber(number) {
        this.setState({number: number + 1});
    }

    componentWillMount() {
        this.setState({
            DataFromDB: {
                number: 0,
                user: 'Pelle'
            },
            number: 1
        });
    }

    render() {
        return (
            <div className={styles.content}>
                <h1>Home Page</h1>
                Hello {this.state.DataFromDB.user}.
                <NumberTilte number={this.state.number}/>
                <p className={styles.welcomeText}>Thanks for being you!</p>
            </div>
        );
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000 );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }
}
