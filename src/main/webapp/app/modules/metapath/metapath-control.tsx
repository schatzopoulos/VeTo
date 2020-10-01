import React, { useState } from 'react';

import './metapath.css';

import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

// const testEntities = [
//     'Topic',
//     'Venue',
//     'Author'
// ];

const getNeighborsFromSchema = (currentNodeId, schema) => {
    const nodeInfo = {};
    console.log(currentNodeId);
    const neighborIds = [];
    schema.elements.forEach(el => {
        if (el.data.label !== undefined) {
            nodeInfo[el.data.id] = el.data.label;
        } else {
            if (el.data.source === currentNodeId) {
                if (!neighborIds.includes(el.data.target)) {
                    neighborIds.push(el.data.target);
                }
            } else if (el.data.target === currentNodeId) {
                if (!neighborIds.includes(el.data.source)) {
                    neighborIds.push(el.data.source);
                }
            }
        }
    });
    console.log('----------------');
    console.log(nodeInfo);
    console.log(neighborIds);
    console.log('----------------')
    const finalNodeInfo = {};
    neighborIds.forEach(id => {
        if (nodeInfo[id] !== undefined && finalNodeInfo[id] === undefined) {
            finalNodeInfo[id] = nodeInfo[id]
        }
    });
    console.log(finalNodeInfo);
    return Object.keys(finalNodeInfo).map(k => [k, finalNodeInfo[k]]);
}

const MetapathControl = (props) => {
    console.log(props.schema)
    const currentEntity = props.metapath[props.metapath.length - 1];
    console.log(props.metapath);
    const neighbors = getNeighborsFromSchema(currentEntity.data('id'), props.schema)

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const availableEntities = []
    neighbors.forEach(item => {
        availableEntities.push(<Button color="dark" onClick={() => {
            toggle();
            props.onNewEntity(item[0]);
        }} block>{item[1]}</Button>);
    })

    return (
        <div className="d-flex flex-column justify-content-center">
            <div className="pl-2px">
                <Button color="success" onClick={toggle} className="btn-circle circle-button-character-container">
                    +
                </Button>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Select a new entity to add</ModalHeader>
                    <ModalBody>
                        {availableEntities}
                    </ModalBody>
                </Modal>
            </div>
            <div className="pl-2px">
                <Button color="danger" className="btn-circle circle-button-character-container" onClick={() => {
                    props.onDelete();
                }}>
                    -
                </Button>
            </div>
        </div>
    );
}

export default MetapathControl;