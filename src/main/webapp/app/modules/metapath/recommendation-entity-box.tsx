import React from 'react';
import { Button } from 'reactstrap';

import './recommendation-entity-box.css';

const RecommendationEntityBox = (props) => {
  if (props.emphasize) {
    return (
      <Button className="text-nowrap recommendation-entity-box emphasized" size="lg" onClick={props.onClick} onMouseEnter={props.onMouseEnter} onMouseOut={props.onMouseOut}>{props.entity}</Button>
    );
  } else {
    return (
      <Button className="text-nowrap recommendation-entity-box" size="lg" disabled onMouseEnter={props.onMouseEnter} onMouseOut={props.onMouseOut}>{props.entity}</Button>
    );
  }
};

export default RecommendationEntityBox;
