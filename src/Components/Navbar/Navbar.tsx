import React from 'react';
// import PropTypes from 'prop-types';
import swapIcon from '../../Assets/module-swap.png';
import './Navbar.scss';

function Navbar(props: any) {

  return (
    <div id="navbar-component">
      <nav className="navbar">
        <ul className="navbar__list">
          <li className="navbar__item">
            <div onClick={props.toggleSwitch}
              className="swap-icon-wrapper">
              <img className={`swap-toggle-${props.toggleSwitchState}`}
                src={swapIcon} alt="swap indicator" />
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
