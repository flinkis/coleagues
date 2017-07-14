import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from '../../helpers/routes';
import styles from './style.css';

const Header = props => (
    <header className={ [styles.header, 'hg__header'].join(' ') }>
        <Switch>
            { routes(props).map(route => (
                <Route
                    key={ route.id }
                    path={ route.path }
                    exact={ route.exact }
                    component={ route.header }
                />
            )) }
        </Switch>
    </header>
);

export default Header;
