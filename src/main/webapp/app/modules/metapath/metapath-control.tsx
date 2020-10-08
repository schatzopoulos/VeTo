import React, { useState } from 'react';

import './metapath.css';

import { Button, Modal, ModalHeader, ModalBody , Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';

// const testEntities = [
//     'Topic',
//     'Venue',
//     'Author'
// ];

const getNeighborsFromSchema = (currentNodeId, schema) => {
    const nodeInfo = {};
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
    const finalNodeInfo = {};
    neighborIds.forEach(id => {
        if (nodeInfo[id] !== undefined && finalNodeInfo[id] === undefined) {
            finalNodeInfo[id] = nodeInfo[id]
        }
    });
    return Object.keys(finalNodeInfo).map(k => [k, finalNodeInfo[k]]);
}

const MetapathControl = (props) => {
    const currentEntity = props.metapath[props.metapath.length - 1];
    const neighbors = getNeighborsFromSchema(currentEntity.data('id'), props.schema)

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    const openMenu = () => setModal(true);
    const closeMenu = () => setModal(false);

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
                <div onMouseEnter={openMenu} onMouseLeave={closeMenu} className={'position-relative'}>
                  <Button color="success" className="btn-circle circle-button-character-container" on>
                    +
                  </Button>
                  <div className={'overflow-scroll metapath-control-options '+ (modal ? 'd-block' : 'd-none')}>
                    {availableEntities}
                  </div>
                </div>
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
