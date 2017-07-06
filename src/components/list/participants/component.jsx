import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import general_style from '../../../common/general.css';

const ParticipantList = (props) => {
    const { authenticatedUser, tournament, signup } = props;
    const participating = !_.isEmpty(authenticatedUser) && !_.some(tournament.participants, ['uid', authenticatedUser.uid]);
    const participantList = _.isEmpty(tournament.participants) ?
        () => <li> No one has signed up play. </li> :
        tournament.participants.map(participant => <li key={ participant.uid }>{ participant.name }</li>);

    return (
        <div >
            { participating &&
                <div>
                    <p>Loged in as { authenticatedUser.name }</p>
                    <button onClick={ signup }>Sign up</button>
                </div>
            }
            <h3>Participants</h3>
            <ul className={ general_style.list }>
                { participantList }
            </ul>
        </div>
    );
};

ParticipantList.propTypes = {
    tournament: PropTypes.object.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    signup: PropTypes.func.isRequired,
};

ParticipantList.defaultProps = {
    authenticatedUser: null,
    signup: null,
};

export default ParticipantList;
