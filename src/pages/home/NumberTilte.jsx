import React from 'react';
import PropTypes from 'prop-types';

class NumberTilte extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <p>Number: {this.props.number}</p>;
    }
}

NumberTilte.propTypes = {
  number: PropTypes.number
};

export default NumberTilte;