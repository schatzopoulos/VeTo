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

export interface IConstraintItemFieldProps {
    entity: string,
    field: string,
    type: string,
    disabled: boolean,

    // functions
    handleSwitch: any,
    handleDropdown: any,
    handleInput: any,
}

export class ConstraintItemField extends React.Component<IConstraintItemFieldProps> {

    constructor(props) {
        super(props);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleSwitch() {        
        this.props.handleSwitch({ 
            entity: this.props.entity,
            field: this.props.field 
        });
    }

    handleDropdown(e) {
        this.props.handleDropdown({
            entity: this.props.entity,
            field: this.props.field 
        }, 
        e.target.value);
    }

    handleInput(e) {
        let value = e.target.value;
        if (this.props.type === 'numeric') {
            value = parseInt(value, 10);
        }

        this.props.handleInput({
            entity: this.props.entity,
            field: this.props.field 
        }, 
        value);
    }

	render() {
        const entity = this.props.entity;
        const field = this.props.field;
        const type = this.props.type;
        const disabled = this.props.disabled;

        let inputField = <Input disabled={ disabled } bsSize="sm" onChange={this.handleInput}/>;
        if (type === 'numeric') {
            inputField = <Input disabled={ disabled } bsSize="sm" type='number' onChange={this.handleInput}/>;
        } 
        return (
            <Row form key={ field }>
                <Col md='1'>
                    <CustomInput type="switch" id={entity + '.' + field + '_switch'} onClick={this.handleSwitch} />
                </Col>
                <Col md='2'>
                    <Label>{ field }</Label> <span className='attribute-type'>(:{type})</span>
                </Col>
                <Col md='1'>
                    {/* <Input disabled={ disabled } type="select" name="opDropdown" id={`${ entity }_${ field }`} bsSize="sm" onClick={this.handleDropdown}>
                        <option value="=">=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&ge;</option>
                        <option value="<=">&le;</option>
                    </Input> */}
                </Col>
                <Col md='1'>
                    <Input disabled={ disabled } type="select" name="opDropdown" id={`${ entity }_${ field }`} bsSize="sm" onClick={this.handleDropdown}>
                        <option value="=">=</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value=">=">&ge;</option>
                        <option value="<=">&le;</option>
                    </Input>
                </Col>
                <Col md='6'>
                    { inputField }
                </Col>
                <Col md='1'>
                    <Button color="info" outline size="sm" title="Add constraint"><FontAwesomeIcon icon="plus" /></Button>
                </Col>
            </Row>
        );
	}
};

export default ConstraintItemField;



