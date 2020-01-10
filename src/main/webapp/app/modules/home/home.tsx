import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Card, 
	Row, 
	Col, 
	Alert, 
	InputGroup, 
	InputGroupAddon, 
	InputGroupText, 
	Input, 
	Button, 
	Label,
	CardTitle, 
	CardText,	
	InputGroupButtonDropdown,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	ListGroupItem,
	ListGroup,
	ListGroupItemHeading,
	ListGroupItemText,
	Container,

} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import CytoscapeComponent from 'react-cytoscapejs';
import { any } from 'prop-types';
import  _ from 'lodash';
import { loadMoreDataWhenScrolled } from 'react-jhipster';
import { NODATA } from 'dns';
export type IHomeProp = StateProps;

export class Home extends React.Component<IHomeProp> {
	readonly state: any = { 
		account: undefined,
		metapath: [],
		neighbors: undefined,
		constraints: {},
	};
	cy: any;

	validMove(node) {
		// allow first move to be anywhere
		if (!this.state.neighbors) {
			return true;
		}

		return this.state.neighbors.contains(node);
	}

	animateNeighbors(node) {
		const nodes = this.cy.filter('node');

		// metapath was reset, so we can move to all nodes
		if (!node) {
			this.setState({
				neighbors: undefined,
			}, () => {
				nodes.animate({
					style: { 'background-color': 'grey', 'border-width': '0px' }
				});
			});
			return;
		}

		node.animate({
			style: { 'border-color': 'red', 'border-width': '2px' },
		});
		
		const neighbors = node.neighborhood();

		nodes.not(neighbors).animate({
			style: { 'background-color': 'grey' }
		}); 

		nodes.not(node).animate({
			style: { 'border-width': '0px' }
		});

		neighbors.animate({
			style: { 'background-color': 'green' },
		});

		this.setState({
			neighbors
		});
	}

	componentDidMount() {
		
		// center align graph 
		this.cy.center();

		// init all nodes with grey color
		const nodes = this.cy.filter('node');
		nodes.animate({
			style: { 'background-color': 'grey', 'border-width': '0px' }
		}); 

		// change state and animate on node click
		this.cy.on('tap', 'node', (e) => {
			
			const node = e.target;

			if (!this.validMove(node)) {
				alert("This selection is not allowed, please select on of the nodes denoted with green color");
				return;
			}

			const metapath = [...this.state.metapath];	// copy array
			metapath.push(node);

			this.setState({
				metapath, 
			}, () => {
				this.animateNeighbors(node);
			});
			
		});
	}
	
	/**
	 * Delete last character of the metapath
	 */
	deleteLast() {

		// const metapath = this.state.metapath.substr(0, this.state.metapath.length-1);
		const metapath = [...this.state.metapath];	// copy array
		metapath.pop();
		const node = metapath[metapath.length-1];

		this.setState({
			metapath,
		}, () => {
			this.animateNeighbors(node);
		});

	}

	checkNested(obj, ...args) {
		for (let i = 0; i < args.length; i++) {
			if (!obj || !(args[i] in obj)) {
			return false;
			}
			obj = obj[args[i]];
		}
		return true;
	}

	checkAndCreateConstraints(constraints, options) {
		if (! (options.entity in constraints)) {
			constraints[options.entity] = {};
		}

		// create object for attribute, if not present
		if (! (options.field in constraints[options.entity])) {
			constraints[options.entity][options.field] = {
				operation: '=',
				value: ''
			}
		}
	}

	handleDropdownChange(options, e) {
		
		// create object for entity, if not present
		const constraints = {...this.state.constraints};
		this.checkAndCreateConstraints(constraints, options);

		constraints[options.entity][options.field]['operation'] = e.target.textContent;

		this.setState({
			constraints 
		});
	}

	handleInputChange(options, e) {

		// create object for entity, if not present
		const constraints = {...this.state.constraints};
		this.checkAndCreateConstraints(constraints, options);

		constraints[options.entity][options.field]['value'] = e.target.value;

		this.setState({
			constraints 
		});
	}
	render() {
		console.log(this.state.constraints);

		const elements = [
			{ data: { id: 'P', label: 'Paper', attributes: [ { name: 'id', type: 'integer' } , { name: 'title', type: 'string' }, { name: 'year', type: 'integer' } ] } },
			{ data: { id: 'A', label: 'Author', attributes: [ { name: 'id', type: 'integer' } , { name: 'name', type: 'string' } ] } },
			{ data: { id: 'V', label: 'Venue', attributes: [ { name: 'id', type: 'integer' } , { name: 'name', type: 'string' } ] } },
			{ data: { id: 'T', label: 'Topic', attributes: [ { name: 'id', type: 'integer' } , { name: 'name', type: 'string' } ] } },
			{ data: { source: 'P', target: 'P'} },
			{ data: { source: 'A', target: 'P', label: 'Edge from Node1 to Node2' } },
			{ data: { source: 'T', target: 'P', label: 'Edge from Node1 to Node2' } },
			{ data: { source: 'V', target: 'P', label: 'Edge from Node1 to Node2' } }
		];

		const style = { 
			width: '100%', 
			height: '200px',
		};

		const layout = { 
			name: 'cose',
			animate: false,
		};  
		const metapathStr = this.state.metapath.map(n => n.data('id')).join('');

		const constraintsPanel = <Row>
			<Col md="12">
				<h4>Constraints</h4>
			</Col>
			<Col md="12">
			<ListGroup>
				{
					_.uniq(this.state.metapath).map( (node: any) => {
						return <ListGroupItem md='12' key={node.data('id')}> 
								<h5>{ node.data('label') }</h5>
							{
								node.data('attributes').map( (attr) => {

									// check if operation for this dropdown was changed
									let dropDownValue = '=';
									if (this.checkNested(this.state.constraints, node.data('label'), attr.name, 'operation')) {
										dropDownValue = this.state.constraints[node.data('label')][attr.name]['operation'];
									}

									const constraintOptions = {
										entity: node.data('label'),
										field: attr.name,
									};

									return <Row key={attr.name} className='attribute-row'>
									<Col md='4' key={attr.name}>
										<Label>{attr.name}</Label> <span className='attribute-type'>(:{attr.type})</span>
									</Col>
									<Col md='2'>
									<UncontrolledDropdown>
										<DropdownToggle caret>
											{dropDownValue}
										</DropdownToggle>
										<DropdownMenu onClick={this.handleDropdownChange.bind(this, constraintOptions)}>
											<DropdownItem >{'='}</DropdownItem>
											<DropdownItem>{'>'}</DropdownItem>
											<DropdownItem>{'<'}</DropdownItem>
											<DropdownItem>{'>='}</DropdownItem>
											<DropdownItem>{'<='}</DropdownItem>

										</DropdownMenu>
									</UncontrolledDropdown>
								  </Col>
								  <Col md='6'><Input onChange={this.handleInputChange.bind(this, constraintOptions)}/></Col>
								  </Row>;
								})
							}							
						</ListGroupItem>
					})
				}
			</ListGroup>
			</Col>
		</Row>;

		
		return (
			<Row>
				<Col md="12">
					<h2>Welcome to SpOT</h2>
				</Col>
				<Col md="6">
					<Card>
						<CytoscapeComponent cy={ (cy) => { this.cy = cy } } elements={elements} style={style} layout={layout} zoomingEnabled={false} />
					</Card>
					<br/>
					<h4>Metapath</h4>
					<InputGroup>
						<Input placeholder="Select graph nodes to define the metapath" value={metapathStr} disabled={true}/>
						<InputGroupAddon addonType="append">
							<Button color="danger" title="Delete last node" onClick={this.deleteLast.bind(this)} ><FontAwesomeIcon icon="arrow-left" /></Button>
						</InputGroupAddon>
					</InputGroup>
					
				</Col>
				<Col md="6">
					{
						(this.state.metapath.length > 0) && constraintsPanel		
					}
				</Col>
				<Col md='12'>
					<Button color="success" block disabled style={{height: '100%'}}>Run</Button>
				</Col>
			</Row>
		);
	}
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
