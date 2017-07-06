import React from 'react';
import { Switch, Route } from 'react-router-dom';

import routes from './routes';

const Main = props => (
    <Switch>
        { routes(props).map(route => (
            <Route
              key={ route.id }
              path={ route.path }
              exact={ route.exact }
              component={ route.main }
            />
        )) }
    </Switch>
);

export default Main;
