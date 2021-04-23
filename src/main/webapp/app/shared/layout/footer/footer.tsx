import './footer.scss';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Col, Row } from 'reactstrap';

const Footer = props => (
    <div className="footer page-content">
        <Row>
            <Col md="6" className={'text-left'}>
                <p>ATHENA Research Center &copy; 2021</p>
            </Col>
            <Col md={'6'} className={'text-right'}>
                <FontAwesomeIcon icon={faGithub} /> Link to <a href={'https://github.com/schatzopoulos/VeTo'} target={'_blank'}>VeTo
                code</a>
            </Col>
        </Row>
    </div>
);

export default Footer;
