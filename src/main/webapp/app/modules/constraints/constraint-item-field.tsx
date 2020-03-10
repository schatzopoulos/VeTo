import './constraint-item.scss';

import React from 'react';
import { 
	Row, 
	Col, 
	Input, 
	Label,
    CustomInput,
    Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AutocompleteInput from '../datasets/autocomplete-input';
import _ from 'lodash';

export interface IConstraintItemFieldProps {
    datasetFolder: string,
    data: any,
    entity: string,
    field: string,
    type: string,
    enabled: boolean,

    // functions
    handleSwitch: any,
    handleDropdown: any,
    handleLogicDropdown: any,
    handleInput: any,
    handleAddition: any,
    handleRemoval: any,
}

export class ConstraintItemField extends React.Component<IConstraintItemFieldProps> {

    constructor(props) {
        super(props);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleLogicDropdown = this.handleLogicDropdown.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleRemoval = this.handleRemoval.bind(this);
    }

    handleSwitch() {        
        this.props.handleSwitch({ 
            entity: this.props.entity,
            field: this.props.field,
        });
    }

    handleDropdown(e) {
        this.props.handleDropdown({
            entity: this.props.entity,
            field: this.props.field,
            index: this.props.data.index,
        }, 
        e.target.value);
    }

    handleLogicDropdown(e) {
        this.props.handleLogicDropdown({
            entity: this.props.entity,
            field: this.props.field,
            index: this.props.data.index,
        }, 
        e.target.value);
    }

    handleInput(e) {
        
        let value = '';

        // autocomplete input
        if (Array.isArray(e) && !_.isEmpty(e)) {
            [value] = e;
            value = value['name'];
        } 

        // input for numeric fields
        if (!Array.isArray(e)) {
            value = e.target.value;
        }

        this.props.handleInput({
            entity: this.props.entity,
            field: this.props.field,
            index: this.props.data.index,
        }, 
        value);
    }

    handleAddition(e) {
        e.preventDefault();

        this.props.handleAddition({
            entity: this.props.entity,
            field: this.props.field,
            index: this.props.data.index,
        });
    }

    handleRemoval(e) {
        e.preventDefault();

        this.props.handleRemoval({
            entity: this.props.entity,
            field: this.props.field,
            index: this.props.data.index,
        });
    }

	render() {
        const entity = this.props.entity;
        const field = this.props.field;
        const type = this.props.type;
        const enabled = this.props.enabled;
        const data = this.props.data;
        const index = data.index;

        let inputField =  <AutocompleteInput 
            id="targetEntityInput"
            onChange={this.handleInput}								
            entity={entity}
            field={field}
            folder={this.props.datasetFolder}
            disabled={!enabled}
            placeholder={''}
            size="sm"
        />
        if (type === 'numeric') {
            inputField = <Input disabled={ !enabled } value={data.value || ''} bsSize="sm" type='number' onChange={this.handleInput}/>;
        } 

        let opOptions = [ <option key='1' value="=">=</option> ];
        if (type === 'numeric') {
            opOptions = opOptions.concat([
            <option key='2' value=">">&gt;</option>,
            <option key='3' value="<">&lt;</option>,
            <option key='4' value=">=">&ge;</option>,
            <option key='5' value="<=">&le;</option>]);
        }

        return (
            <Row form key={`${entity}_${field}_${index}`}>
                <Col md='1'>
                    {
                        (index === 0) && <CustomInput type="switch" id={entity + '.' + field + '_switch'} onChange={this.handleSwitch} checked={enabled}/>
                    }
                </Col>
                <Col md='2'>
                    {
                        (index === 0)
                            ? <div>
                                <Label>{ field }</Label> <span className='attribute-type'>(:{type})</span>
                            </div>
                            : <div className="">
                                <Label className="white">&#9656;</Label>
                            </div>
                    }
                </Col>
                <Col md='1'>
                    {
                        (index !== 0) &&
                        <Input disabled={ !enabled } value={data.logicOp} type="select" name="andOrDropdown" id={`${ entity }_${ field }_${index}`} bsSize="sm" onChange={this.handleLogicDropdown}>
                            <option value="or">or</option>
                            { (type === 'numeric') && 
                                <option value="and">and</option>
                            }
                        </Input>
                    }        
                </Col>
                <Col md='1'>
                    <Input disabled={ !enabled } value={data.operation} type="select" name="opDropdown" id={`${entity}_${field}_${index}`} bsSize="sm" onChange={this.handleDropdown}>
                        { opOptions }
                    </Input>
                </Col>
                <Col md='6'>
                    { inputField }
                </Col>
                <Col md='1'>
                    {
                        (index === 0) 
                            ?   <Button disabled={ !enabled } color="info" outline size="sm" title="Add constraint" onClick={this.handleAddition}><FontAwesomeIcon icon="plus" /></Button>
                            :   <Button disabled={ !enabled } color="danger" outline size="sm" title="Remove constraint" onClick={this.handleRemoval}><FontAwesomeIcon icon="minus" /></Button>

                    }
                </Col>
            </Row>
        );
	}
};

export default ConstraintItemField;



