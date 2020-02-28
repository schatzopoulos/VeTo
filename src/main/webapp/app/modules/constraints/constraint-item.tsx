import React from 'react';
import { 
	Row, 
	Col, 
	ListGroup, 
	ListGroupItem,
} from 'reactstrap';
import ConstraintItemField from './constraint-item-field';
import _ from 'lodash';

export interface IConstraintItemProps {
	entity: string;
	// node: any,
	entityConstraints: any,

	// functions
    handleSwitch: any,
	handleDropdown: any,
	handleLogicDropdown: any,
	handleInput: any,
	handleAddition: any,
	handleRemoval: any,
}

export class ConstraintItem extends React.Component<IConstraintItemProps> {

    constructor(props) {
        super(props);
    }

	render() {
		const entity = this.props.entity;

		return (
			<ListGroupItem md='12' key={ entity }>
				<h5>{ entity }</h5>

				{

					_.map(this.props.entityConstraints, (fieldConstraints, field) => {
						const enabled = fieldConstraints['enabled'];
						if (field === 'id') return '';
						
						return _.map(fieldConstraints['conditions'], (condition, index: number) => {

							return <ConstraintItemField 
								key={ `${entity}_${field}_${index}` } 
								data={ condition }
								entity={ entity } 
								field={ field } 
								type={ fieldConstraints.type } 
								enabled={ enabled } 
								handleSwitch={this.props.handleSwitch.bind(this)}
								handleDropdown={this.props.handleDropdown.bind(this)}
								handleLogicDropdown={this.props.handleLogicDropdown.bind(this)}
								handleInput={this.props.handleInput.bind(this)}
								handleAddition={this.props.handleAddition.bind(this)}
								handleRemoval={this.props.handleRemoval.bind(this)}
							/>;
						})
					})
				}
			</ListGroupItem>
        );
	}
};

export default ConstraintItem;



