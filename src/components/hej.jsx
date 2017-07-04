import React from 'react';
import PropTypes from 'prop-types';

class Hej extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeName: '',
        };

        this.changeName = this.changeName.bind(this);
    }

    changeName() {
        const { name, name2 } = this.props;
        const { activeName } = this.state;

        this.setState({
            activeName: activeName !== name2 ? name2 : name,
        });
    }

    render() {
        const { activeName } = this.state;
        const { name } = this.props;

        return (
            <div>
                <p>Hej på { activeName || name }</p>
                <button onClick={ this.changeName }>Change name</button>
            </div>
        );
    }
}

Hej.propTypes = {
    name: PropTypes.string,
    name2: PropTypes.string,
};

Hej.defaultProps = {
    name: '',
    name2: '',
};

export default Hej;
