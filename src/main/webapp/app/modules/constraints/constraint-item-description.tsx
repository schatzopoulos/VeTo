import React from 'react';
import { Row, Col, Label, Button} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ConstraintItemDescription = (props) => {
    const entity = props.entity;
    const field = props.field;
    const {index, logicOp, operation, value} = props.data;
    const enabled = props.enabled;

    const handleRemoval = () => {
        props.handleRemoval({entity, field, index});
    }
    return (
        <Row form key={`${entity}_${field}_${index}`}>
            <Col md='1'>
            </Col>
            <Col md='2'>
                {
                    (index === 1)
                        ? <div className="">Set conditions:</div>
                        : <div className="">
                            <Label className="white">&#9656;</Label>
                        </div>
                }
            </Col>
            <Col md='1'>
                {(index!==1) && logicOp}
            </Col>
            <Col md='1'>
                {operation}
            </Col>
            <Col md='5'>
                {value}
            </Col>
            <Col md='2'>
                <Button disabled={!enabled} color="danger" outline size="sm" title="Remove constraint"
                                  onClick={handleRemoval}><FontAwesomeIcon icon="minus" /></Button>
            </Col>
        </Row>
    );
}

export default ConstraintItemDescription;
