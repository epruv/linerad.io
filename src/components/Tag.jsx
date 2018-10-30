import PropTypes from 'prop-types';
import React from 'react';
import '../styles/Tag.scss';

const Tag = props => (
  <li className="Tag">
    <button type="button" onClick={() => props.onClick(props.value)}>
      {props.image && <img alt="" src={props.image} />}
      {props.value}
    </button>
  </li>
);

Tag.propTypes = {
  image: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default Tag;
