import React from 'react';
import { 
	Row, 
	Col, 
	ListGroup, 
	ListGroupItem,
} from 'reactstrap';
import ConstraintItemField from './constraint-item-field';
import  { uniq, has } from 'lodash';

export interface IConstraintItemProps {
	entity: string;
	node: any,
	entityConstraints: any,

	// functions
    handleSwitch: any,
    handleDropdown: any,
	handleInput: any,
	handleRemoveEntity: any
}

export class ConstraintItem extends React.Component<IConstraintItemProps> {

    constructor(props) {
        super(props);
    }

	componentWillUnmount() {
		this.props.handleRemoveEntity(this.props.entity);
	}

	render() {
		const node = this.props.node;
		const entity = this.props.entity;
		
        return (
			<ListGroupItem md='12' key={node.data('id')}> 
				<h5>{ node.data('label') }</h5>
				{
					node.data('attributes').map( (attr) => {
						const field = attr.name;
						const type = attr.type;

						let isDisabled = true;
						if (has(this.props.entityConstraints, [ field, 'enabled' ])) {
							isDisabled  = !this.props.entityConstraints[field]['enabled'];
						}

						return <ConstraintItemField 
							key={ field } 
							entity={ entity } 
							field={ field } 
							type={ type } 
							disabled={ isDisabled } 
							handleSwitch={this.props.handleSwitch.bind(this)}
							handleDropdown={this.props.handleDropdown.bind(this)}
							handleInput={this.props.handleInput.bind(this)}
						/>;
						
					})
				}							
			</ListGroupItem>
        );
	}
};

export default ConstraintItem;



