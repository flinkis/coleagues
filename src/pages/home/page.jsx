import React from "react";
import styles from "./style.css";
import NumberTilte from "../../common/components/title/title";


export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.content}>
                <h1>Home Page</h1>
                <NumberTilte number={3} />
                <p className={styles.welcomeText}>Thanks for being you!</p>
            </div>
        );
    }
}
