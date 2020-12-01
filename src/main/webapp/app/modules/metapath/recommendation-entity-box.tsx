import React from 'react';
import { Button, Col } from 'reactstrap';

import './recommendation-entity-box.css';

const RecommendationEntityBox = (props) => {
    if (props.emphasize) {
        return (
            <Col xs={'auto'} className={'position-relative recommendation-entity-box px-1'}>
                <Button className="text-nowrap emphasized" size="lg" onClick={props.onClick}
                        onMouseEnter={props.onMouseEnter} onMouseOut={props.onMouseOut}>{props.entity}</Button>
            </Col>
        );
    } else {
        return (
            <Col xs={'auto'} className={'position-relative recommendation-entity-box px-1'}>
                <Button className="text-nowrap" size="lg" disabled
                        onMouseEnter={props.onMouseEnter} onMouseOut={props.onMouseOut}>{props.entity}</Button>
            </Col>
        );
    }
};

export default RecommendationEntityBox;
