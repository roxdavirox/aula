import React from 'react';
import NavbarContainer from '../containers/NavbarContainer';
import Sidebar from '../containers/SidebarContainer';
import Hero from '../components/ui/Hero';
import Loader from '../components/ui/Loader';

export default (props) => (
    <div>
        <NavbarContainer {...props} />
        <div className="container">
            <Sidebar {...props} />
            <Hero />
            <Loader style={{gridRow: '2', gridColumn: 'span 12'}} />
        </div>
    </div>
)