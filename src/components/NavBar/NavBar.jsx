import React from 'react';
import './Navbar.css';

const Navbar = ({image , color }) => {
    return (
        <nav className="navbar " style={{backgroundColor : color}}>
            <div className="navbar-logo">
                <img src={image} alt="Logo" />
            </div>
        </nav>
    );
};

export default Navbar;
