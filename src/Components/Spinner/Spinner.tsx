import React from 'react';
// import PropTypes from 'prop-types';
import './Spinner.scss';

const Spinner = () => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner">
        <ul className="spinner__list">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <ul className="spinner__list">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  )
}


export default Spinner
