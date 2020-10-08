import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './recommendation-entity-box.css'

const EntityConnector = (props) => {
    if (props.recommendation) {
      if (props.emphasize) {
        return (
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon="play" className="recommendation-connector emphasized m-1" />
          </div>
        );
      } else {
        return (
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon="play" className="recommendation-connector m-1" />
          </div>
        );
      }
    } else {
      return (
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon="play" className="text-dark m-1" />
        </div>
      );
    }
}

export default EntityConnector;
