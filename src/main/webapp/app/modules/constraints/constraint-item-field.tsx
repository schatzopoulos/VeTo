import './constraint-item.scss';

import React from 'react';
import {
    Row,
    Col,
    Input,
    Label,
    CustomInput,
    Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AutocompleteInput from '../datasets/autocomplete-input';
import _ from 'lodash';
import { examples } from './constraint-examples';

export interface IConstraintItemFieldProps {
    datasetFolder: string,
    data: any,
    entity: string,
    field: string,
    type: string,
    enabled: boolean,
    lastFieldCondition: boolean,
    numberOfConditions: number,

    // functions
    handleSwitch: any,
    handleDropdown: any,
    handleLogicDropdown: any,
    handleAddition: any
}

export class ConstraintItemField extends React.Component<IConstraintItemFieldProps> {

    readonly state = {
        logicOperation: this.props.data.logicOp,
        conditionOperation: this.props.data.operation,
        value: this.props.data.value,
        fieldIndex: 0,
        additionActive: false
    };

    constructor(props) {
        super(props);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleLogicDropdown = this.handleLogicDropdown.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
    }

    handleSwitch() {
        this.props.handleSwitch({
            entity: this.props.entity,
            field: this.props.field
        });
    }

    handleDropdown(e) {
        const operation = e.target.value;
        this.setState({
            conditionOperation: operation
        });
        if (this.props.data.index > 0) {
            this.props.handleDropdown({
                    entity: this.props.entity,
                    field: this.props.field,
                    index: this.props.data.index
                },
                e.target.value);
        }
    }

    handleLogicDropdown(e) {
        const logicOp = e.target.value;
        this.setState({
            logicOperation: logicOp
        });
        if (this.props.data.index > 0) {
            this.props.handleLogicDropdown({
                    entity: this.props.entity,
                    field: this.props.field,
                    index: this.props.data.index
                },
                e.target.value);
        }
    }

    handleInput(val, callback=()=>{}) {
        console.log('ConstraintItemField: handleInput - watching val: '+val);
        if (val) {
            this.setState({
                value: val
            },callback);
        } else {
            this.setState({
                value: ''
            },callback)
        }
    }

    handleValidValue(isValid) {
        this.setState({
            additionActive: isValid
        });
    }

    submitCurrentValue() {
        if (this.state.additionActive) {
            const logicOp = this.state.logicOperation;
            const conditionOp = this.state.conditionOperation;
            const value = this.state.value;

            console.log(`New condition: ${logicOp} ${conditionOp} ${value}`);

            this.props.handleAddition({
                    entity: this.props.entity,
                    field: this.props.field
                },
                logicOp,
                conditionOp,
                value
            );

            this.setState({
                additionActive:false,
                value: this.props.data.value,
                fieldIndex: this.state.fieldIndex+1
            });
        }
    }

    handleAddition(e) {
        if (e) {
            e.preventDefault();
            this.submitCurrentValue();
        }
    }

    getExample(entity, field) {
        let example = null;
        if (Object.prototype.hasOwnProperty.call(examples, `${entity}.${field}`)) {
            example = examples[`${entity}.${field}`];
        }
        return example;
    }

    handleNumericalInput(e) {
        const numberString = e.target.value;
        console.log('ConstraintItemField: handleNumericalInput() - watching numberString: '+numberString);
        if (numberString) {
            const number = Number.parseInt(numberString,10);
            this.setState({
                value: number,
                additionActive: true
            });
        } else {
            this.setState({
                value: '',
                additionActive: false
            });
        }
    }

    handleNumericalInputEnter(e){
        if (e.key==='Enter') {
            this.submitCurrentValue();
        }
    }

    render() {
        const entity = this.props.entity;
        const field = this.props.field;
        const type = this.props.type;
        const enabled = this.props.enabled;
        const data = this.props.data;
        const index = data.index;

        console.log('ConstaintItemField: render() - watching props.data: ');
        console.log(this.props.data);
        console.log('ConstaintItemField: render() - watching state: ');
        console.log(this.state);
        console.log('ConstraintItemField: render() - watching index: '+index);

        const inputField = (type === 'numeric')
            ? <Input disabled={!enabled} defaultValue={''} onChange={this.handleNumericalInput.bind(this)} bsSize="sm"
                         type='number' value={this.state.value || ''} onKeyDown={this.handleNumericalInputEnter.bind(this)}/>
            : <AutocompleteInput
                id="targetEntityInput"
                onChange={this.handleInput} // callback used to register the value of the field each time
                hasValidValue={this.handleValidValue.bind(this)}    // callback that is used to show to the parent whether
                // to enable the addition button or not
                additionTriggerCallback={this.submitCurrentValue.bind(this)}    // callback that child can use to register
                // the value directly
                entity={entity} // used for the recommendations REST request
                field={field}   // used for the recommendations REST request
                folder={this.props.datasetFolder}   // used for the recommendations REST request
                disabled={!enabled}
                placeholder={''}
                size="sm"
                index={this.state.fieldIndex}
            />;


        let opOptions = [<option key='1' value="=">=</option>];
        if (type === 'numeric') {
            opOptions = opOptions.concat([
                <option key='2' value=">">&gt;</option>,
                <option key='3' value="<">&lt;</option>,
                <option key='4' value=">=">&ge;</option>,
                <option key='5' value="<=">&le;</option>]);
        }

        const example = this.getExample(entity, field);
        // console.log(!enabled || !this.state.value)

        return (
            <Row form key={`${entity}_${field}_${index}`} className={index === 0 ? 'mb-3' : ''}>
                <Col md='1'>
                    {
                        (index === 0) &&
                        <CustomInput type="switch" id={entity + '.' + field + '_switch'}
                                     onChange={this.handleSwitch}
                                     checked={enabled} />
                    }
                </Col>
                <Col md='2'>
                    {
                        (index === 0)
                            ? <div>
                                <Label>{field}</Label> <span className='attribute-type'>(:{type})</span>
                            </div>
                            : (index === 1)
                            ? <div className="">Set conditions:</div>
                            : <div className="">
                                <Label className="white">&#9656;</Label>
                            </div>
                    }
                </Col>
                <Col md='1'>
                    {index === 0
                        ? this.props.numberOfConditions>0
                            ? <Input disabled={!enabled} value={this.state.logicOperation || 'or'} type="select" name="andOrDropdown"
                                     id={`${entity}_${field}_${index}`} bsSize="sm" onChange={this.handleLogicDropdown}>
                                <option value="or">or</option>
                                {(type === 'numeric') &&
                                <option value="and">and</option>
                                }
                            </Input>
                            : <span></span>
                        : index === 1
                            ? <span></span>
                            : <Input disabled={!enabled} value={data.logicOp} type="select" name="andOrDropdown"
                                     id={`${entity}_${field}_${index}`} bsSize="sm"
                                     onChange={this.handleLogicDropdown}>
                                <option value="or">or</option>
                                {(type === 'numeric') &&
                                <option value="and">and</option>
                                }
                            </Input>
                    }
                </Col>
                <Col md='1'>
                    {index === 0
                        ? <Input disabled={!enabled} defaultValue={data.operation} type="select" name="opDropdown"
                                 id={`${entity}_${field}_${index}`} bsSize="sm" onChange={this.handleDropdown}>
                            {opOptions}
                        </Input>
                        : <Input disabled={!enabled} value={data.operation} type="select" name="opDropdown"
                                 id={`${entity}_${field}_${index}`} bsSize="sm" onChange={this.handleDropdown}>
                            {opOptions}
                        </Input>
                    }
                </Col>
                <Col md='6'>
                    {inputField}
                </Col>
                <Col md='1'>
                    <Button
                        disabled={!enabled || !this.state.additionActive}
                        color={'success'}
                        outline
                        size={'sm'}
                        title={'Add condition'}
                        onClick={this.handleAddition}><FontAwesomeIcon
                        icon={'plus'} />
                    </Button>
                </Col>
                <Col md={{ offset: 4, size: 5 }}>
                    {
                        (example && this.props.lastFieldCondition) &&
                        <span className='attribute-type'>e.g. {example}</span>
                    }
                </Col>
            </Row>
        );
    }
};

export default ConstraintItemField;



