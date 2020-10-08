import React from 'react';
import { Button, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

import './entity-box.css';
import ConstraintItem from 'app/modules/constraints/constraint-item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class EntityBox extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      referenceKeyModal: false,
      constraintsModal: false
    };
  }

  toggleReferenceKeyModal() {
    this.setState({
      referenceKeyModal: !this.state.referenceKeyModal
    });
  }

  toggleConstraintsModal() {
    this.setState({
      constraintsModal: !this.state.constraintsModal
    });
  }

  numberOfConstraints() {
    if (this.props.constraints) {
      const reducer = (constrainedFields, currentFieldConstraints) => {
        return (currentFieldConstraints.enabled && currentFieldConstraints.conditions[0].value) ? constrainedFields + 1 : constrainedFields;
      };
      return Object.values(this.props.constraints).reduce(reducer, 0);
    } else {
      return 0;
    }
  }

  render() {
    return (
      <div className="position-relative entity-box">
        <div>
          <Button color="dark" size="lg" className={'text-nowrap'}
                  disabled>{this.props.idIndexedSchema[this.props.entity]}</Button>
        </div>
        <div className="position-absolute ">
          {
            this.props.primaryEntity &&
            <div className={'d-inline-block'}>
              <Button color="link" onClick={this.toggleReferenceKeyModal.bind(this)}>
                <svg width="1em" height="1em" viewBox="0 0 16 16"
                     className={this.numberOfConstraints() === 0 ? 'bi bi-key-fill unset' : 'bi bi-key-fill text-secondary'}
                     fill={'currentColor'}
                     xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd"
                        d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
              </Button>
              <Modal isOpen={this.state.referenceKeyModal} toggle={this.toggleReferenceKeyModal.bind(this)}
                     className={'w-75 mw-100'}>
                <ModalHeader
                  toggle={this.toggleReferenceKeyModal.bind(this)}>{`Identifier for '${this.props.idIndexedSchema[this.props.entity]}'`}
                </ModalHeader>
                <ModalBody>
                  <Row>
                    <Col md='12' style={{ 'textAlign': 'center' }}>
                      <h5>Identifier for {this.props.idIndexedSchema[this.props.entity]} <FontAwesomeIcon style={{ color: '#17a2b8' }}
                                                                           icon="question-circle"
                                                                           title="Entities are presented with this attribute in the results" />
                      </h5>
                      <Input id="select-field-dropdown" type="select" value={this.state.selectField}
                             onChange={this.props.handleSelectFieldChange}>
                        {this.props.selectFieldOptions}
                      </Input>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <Button color={'dark'} onClick={this.toggleReferenceKeyModal.bind(this)}>Close</Button>
                </ModalFooter>
              </Modal>
            </div>
          }
          {
            this.props.constraints && this.props.datasetFolder &&
            <div className={'d-inline-block'}>
              <Button color="link" onClick={this.toggleConstraintsModal.bind(this)}
                      className="btn-circle circle-button-svg-container mx-1">
                <svg width="1em" height="1em" viewBox="0 0 16 16"
                     className={this.numberOfConstraints() === 0 ? 'bi bi-funnel-fill unset' : 'bi bi-funnel-fill text-secondary'}
                     fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd"
                        d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
                </svg>
              </Button>
              <Modal isOpen={this.state.constraintsModal} toggle={this.toggleConstraintsModal.bind(this)}
                     className={'w-75 mw-100'}>
                <ModalHeader
                  toggle={this.toggleConstraintsModal.bind(this)}>{`Constraints for '${this.props.idIndexedSchema[this.props.entity]}'`}
                </ModalHeader>
                <ModalBody>
                  <ConstraintItem
                    key={this.props.idIndexedSchema[this.props.entity]}
                    datasetFolder={this.props.datasetFolder}
                    entity={this.props.idIndexedSchema[this.props.entity]}
                    entityConstraints={this.props.constraints}
                    handleSwitch={this.props.handleSwitch}
                    handleDropdown={this.props.handleDropdown}
                    handleLogicDropdown={this.props.handleLogicDropdown}
                    handleInput={this.props.handleInput}
                    handleAddition={this.props.handleAddition}
                    handleRemoval={this.props.handleRemoval}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color={'dark'} onClick={this.toggleConstraintsModal.bind(this)}>Close</Button>
                </ModalFooter>
              </Modal>
            </div>
          }
          {this.numberOfConstraints() > 0 &&
          <div className={'d-inline-block text-muted'}>{`(${this.numberOfConstraints()})`}</div>
          }
        </div>
      </div>
    );
  }
}

export default EntityBox;
