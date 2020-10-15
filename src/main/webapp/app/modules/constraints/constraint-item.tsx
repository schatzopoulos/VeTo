import React from 'react';
import {
	Row,
	Col,
	Button,
	ListGroupItem,
} from 'reactstrap';
import ConstraintItemField from './constraint-item-field';
import _ from 'lodash';

export interface IConstraintItemProps {
	entity: string;

	datasetFolder: string,
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
        const constraintItemContents= [];
        _.map(this.props.entityConstraints, (fieldConstraints, field) => {
            const enabled = fieldConstraints['enabled'];
            const numberOfConditions = fieldConstraints.conditions.reduce(
                (conditionsNumber, condition) => (condition.value && condition.index>0) ? conditionsNumber+1 : conditionsNumber, 0
            )
            if (field === 'id') return '';

            return _.map(fieldConstraints['conditions'], (condition, index: number) => {

                return <ConstraintItemField
                    key={ `${entity}_${field}_${index}` }
                    data={ condition }
                    datasetFolder= { this.props.datasetFolder }
                    entity={ entity }
                    field={ field }
                    type={ fieldConstraints.type }
                    enabled={ enabled }
                    lastFieldCondition={index === fieldConstraints['conditions'].length - 1}
                    numberOfConditions={numberOfConditions}
                    handleSwitch={this.props.handleSwitch.bind(this)}
                    handleDropdown={this.props.handleDropdown.bind(this)}
                    handleLogicDropdown={this.props.handleLogicDropdown.bind(this)}
                    handleInput={this.props.handleInput.bind(this)}
                    handleAddition={this.props.handleAddition.bind(this)}
                    handleRemoval={this.props.handleRemoval.bind(this)}
                />;
            })
        }).filter(el=>!!el).forEach((element, index)=>{
            if (index!==0) {
                constraintItemContents.push(<hr/>);
            }
            constraintItemContents.push(element);
        })
		return (
			<ListGroupItem md='12' key={ entity }>
				<h5>{ entity }</h5>
                {constraintItemContents}
			</ListGroupItem>
        );
	}
};

export default ConstraintItem;



