import React from 'react';
import { Link } from 'react-router-dom';

import styles from './style.css';

const Sidebar = () => (
    <aside className="hg__left">
        <nav className={ styles.nav }>
            <Link className={ styles.item } to="/">Home</Link>
            <Link className={ styles.item } to="/game">Create a New Duel</Link>
            <Link className={ styles.item } to="/gametype">Create/Edit Game-types</Link>
            <Link className={ styles.item } to="/tournament">Create/Edit Tournaments</Link>
        </nav>
    </aside>
);

export default Sidebar;
