import React from 'react';
import io from 'socket.io-client';

import Header from './components/header/component';
import SidebarLeft from './components/sidebarLeft/component';
import SidebarRight from './components/sidebarRight/component';
import Main from './main';
import Footer from './components/footer/component';

// Socket
const socket = io.connect();

const App = () => (
    <div className="hg">
        <Header socket={ socket } />
        <SidebarLeft />
        <Main socket={ socket } />
        <SidebarRight socket={ socket } />
        <Footer />
    </div>
);


export default App;
