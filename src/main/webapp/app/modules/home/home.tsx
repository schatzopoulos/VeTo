import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, 
	Row, 
	Col, 
	InputGroup, 
	InputGroupAddon, 
	Input, 
	Button, 
	Label,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	ListGroupItem,
	ListGroup,
	CustomInput,
	Progress,
	Container,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import CytoscapeComponent from 'react-cytoscapejs';
import  _  from 'lodash';
import { loadMoreDataWhenScrolled } from 'react-jhipster';
import { rankingRun, rankingGetResults } from '../ranking/ranking.reducer';
import RankingResultsPanel from '../ranking/results/results'
import ConstraintItem from '../constraints/constraint-item';
import { __metadata } from 'tslib';

export interface IHomeProps extends StateProps, DispatchProps {
	loading: boolean;
	progress: number;
	progressMsg: string;
	error: string;
	docs: any;
	meta: any;
	uuid: string;
};

export class Home extends React.Component<IHomeProps> {
	readonly state: any = { 
		metapath: [],
		metapathStr: '',
		neighbors: undefined,
		constraints: {},
		analysis: "ranking",
	};
	cy: any;
	polling: any;
	
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
			style: { 'background-color': 'green' },
		});
		
		const neighbors = node.neighborhood();

		nodes.not(neighbors).animate({
			style: { 'border-width': '0px' }
		}); 

		nodes.not(node).animate({
			style: { 'border-width': '0px', 'background-color': 'grey' }
		});

		neighbors.animate({
			style: { 'border-color': 'red', 'border-width': '2px' },
			
		});

		this.setState({
			neighbors
		});
	}

	pollForResults() {
		this.polling = setInterval( () => {
			this.props.rankingGetResults(this.props.uuid);
		}, 1000);
	}

	componentDidUpdate(prevProps) {

		// new uuid detected, start polling
		if (this.props.loading && !prevProps.loading) {
			this.pollForResults();
		} else if (prevProps.loading && !this.props.loading) {
			clearInterval(this.polling);
		}
	}

	componentWillUnmount() {
		clearInterval(this.polling);
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

			// set metapath
			const metapath = [...this.state.metapath];	// copy array
			metapath.push(node);
			const metapathStr = metapath.map(n => n.data('id')).join('');

			// set constraints 
			const constraints = {...this.state.constraints};
			// const attrs = node.data('attributes').filter(n => (n.name !== 'id'));
			_.forOwn(node.data('attributes'), (value) => {
				const entity = node.data('label');
				const field = value.name;

				// create constraints for node, if not already present
				if ( !(entity in constraints) || !(field in constraints[entity])) {
					this.checkAndCreateConstraints(constraints, { 
						entity, 
						field, 
					}, value.type);
				}
			});

			this.setState({
				metapath, 
				metapathStr,
				constraints,
			}, () => {
				this.animateNeighbors(node);
			});
			
		});
	}
	
	/**
	 * Delete last character of the metapath
	 */
	deleteLast() {

		const metapath = [...this.state.metapath];	// copy array
		metapath.pop();
		const metapathStr = metapath.map(n => n.data('id')).join('');

		const node = metapath[metapath.length-1];

		this.setState({
			metapath,
			metapathStr,
		}, () => {
			this.animateNeighbors(node);
		});	
	}

	checkAndCreateConstraints(constraints, { entity, field }, type=null) {
		if (! (entity in constraints)) {
			constraints[entity] = {};
		}

		// create object for attribute, if not present
		if (! (field in constraints[entity])) {
			constraints[entity][field] = {
				nextIndex: 0,
				enabled: true,
				type,
				conditions: [],
			};
		} 
		
		const index = constraints[entity][field]['nextIndex'];
		constraints[entity][field]['nextIndex'] += 1;

		const found = constraints[entity][field]['conditions'].includes(c => c.index === index);
		if (!found) {
			constraints[entity][field]['conditions'].push({
				index,
				value: null,
				operation: '=',
				logicOp: (index > 0) ? 'and' : undefined,
			});		
		}
	}

	handleConstraintOpDropdown({ entity, field, index }, value) {
		const constraints = {...this.state.constraints};
		const found = constraints[entity][field]['conditions'].find(c => c.index === index);
		if (found) {
			found['operation'] = value;
		}

		this.setState({
			constraints 
		});
	}

	handleConstraintLogicOpDropdown({ entity, field, index }, value) {
		const constraints = {...this.state.constraints};
		const found = constraints[entity][field]['conditions'].find(c => c.index === index);
		if (found) {
			found['logicOp'] = value;
		}

		this.setState({
			constraints 
		});
	}

	handleConstraintInputChange({ entity, field, index }, value) {
		const constraints = {...this.state.constraints};

		const found = constraints[entity][field]['conditions'].find(c => c.index === index);
		if (found) {
			found['value'] = value;
		}

		this.setState({
			constraints 
		});
	}

	handleConstraintAddition({ entity, field, index }) {
		const constraints = {...this.state.constraints};

		this.checkAndCreateConstraints(constraints, { entity, field});
		this.setState({
			constraints,
		});
	}

	handleConstraintRemoval({ entity, field, index }) {
		const constraints = {...this.state.constraints};

		constraints[entity][field]['conditions'] = constraints[entity][field]['conditions'].filter(n => n.index !== index);
		this.setState({
			constraints,
		});
	}

	execute(e) {
		e.preventDefault();

		if (this.state.analysis === 'ranking') {
			this.props.rankingRun(this.state.metapathStr, this.state.constraints);
		} else {
			alert("This type of analysis will be implemented soon");
		}
	}

	handleAnalysisDropdown(e) {
		this.setState({
			analysis: e.target.value,
		});
	}

	handleConstraintSwitch({ entity, field }) {
		// create object for entity, if not present
		const constraints = {...this.state.constraints};
		
		constraints[entity][field]['enabled'] = !constraints[entity][field]['enabled'];

		this.setState({
			constraints 
		});
	}

	handleRemoveEntityConstraints(entity) {
		const constraints = {...this.state.constraints};
		delete constraints[entity];
		this.setState({
			constraints 
		});
	}

	checkMetapath() {

		const metapath = this.state.metapathStr;

		if (metapath.length < 3)
			return false;

		const firstLetter = metapath.substr(0, 1);
		const lastLetter = metapath.substr(metapath.length-1, 1);

		if (firstLetter !== lastLetter)
			return false;
		
		return true;
	}

	checkConstraints() {
		
		const constraints = {};
		_.forOwn(this.state.constraints, (entityConstraint, entity) => {
			const e = entity.substr(0, 1);
			let entityConditions = [];
		
			_.forOwn(entityConstraint, ({ enabled, type, conditions }, field) => {
				if (enabled) {
					entityConditions = conditions
					.filter(element => element.value)
					.map(element => {
						let value;
						if (type === 'numeric') {
							value = parseInt(element.value, 10);
						} else {
							value = `'${element.value}'`;
						}
						return `${element.logicOp || ''} ${field} ${element.operation} ${value}`;
					});
				}
			
				if (entityConditions.length > 0) {
					constraints[e] = entityConditions.join(' ');
				}
			});
		});
		
		return !_.isEmpty(constraints);
	}

	getSchemaInfo() {
		const elements = [
			{ data: { id: 'P', label: 'Paper', attributes: [ { name: 'id', type: 'numeric' } , { name: 'year', type: 'numeric' } ] } },
			{ data: { id: 'A', label: 'Author', attributes: [ { name: 'id', type: 'numeric' } , { name: 'name', type: 'string' } ] } },
			{ data: { id: 'V', label: 'Venue', attributes: [ { name: 'id', type: 'numeric' } , { name: 'name', type: 'string' } ] } },
			{ data: { id: 'T', label: 'Topic', attributes: [ { name: 'id', type: 'numeric' } , { name: 'name', type: 'string' } ] } },
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

		return { elements, style, layout };
	}
	render() {
		const { elements, style, layout } = this.getSchemaInfo();

		// console.log(this.state.constraints);

		const constraintsPanel = <Row>
		<Col md="12">
			<h4>Constraints</h4>
		</Col>
		<Col md="12">
		<ListGroup>
			{
				_.map(this.state.constraints, (entityConstraints, entity) => {

					return <ConstraintItem 
						key={ entity }
						entity={ entity }
						entityConstraints={ entityConstraints }
						handleSwitch={this.handleConstraintSwitch.bind(this)}
						handleDropdown={this.handleConstraintOpDropdown.bind(this)}
						handleLogicDropdown={this.handleConstraintLogicOpDropdown.bind(this)}
						handleInput={this.handleConstraintInputChange.bind(this)}
						handleRemoveEntity={this.handleRemoveEntityConstraints.bind(this)}
						handleAddition={this.handleConstraintAddition.bind(this)}
						handleRemoval={this.handleConstraintRemoval.bind(this)}

					/>;
				})
			}
		</ListGroup>
		</Col>
		</Row>;

		const validMetapath = this.checkMetapath();
		const validConstraints = this.checkConstraints();

		return (
			<Container fluid>
			<Row>
				<Col md="6">
					<h4>Query Builder</h4>
					<Card>
						<CytoscapeComponent cy={ (cy) => { this.cy = cy } } elements={elements} style={style} layout={layout} zoomingEnabled={false} />
					</Card>
					<br/>
					<Row>
						<Col md="6">
							<h4>Metapath</h4>
							<InputGroup>
								<Input placeholder="Select nodes on the graph to define the metapath" value={this.state.metapathStr} disabled={true}/>
								<InputGroupAddon addonType="append">
									<Button color="danger" title="Delete last node" onClick={this.deleteLast.bind(this)} ><FontAwesomeIcon icon="arrow-left" /></Button>
								</InputGroupAddon>
							</InputGroup>
							
						</Col>

						<Col md="6">
							<h4>Analysis</h4>
							<Input id="analysis-dropdown" type="select" value={this.state.analysis} onChange={this.handleAnalysisDropdown.bind(this)} >
								<option value={"ranking"}>Ranking</option>
								<option value={"associations"}>Metapath Associations</option>
								<option value={"topk"}>Top-k Similarity</option>
							</Input>
						</Col>
					</Row>
					{
						(!validMetapath || !validConstraints) &&
						<Row>
							<Col>
								<div className="small-grey">
									Note: 
									<ul>
										{
											(!validMetapath) && 
											<li>
												Give symmetric metapath with at least 3 nodes e.g. APPA
											</li>
										}
										{
											(!validConstraints) &&
											<li>
												Give at least one constraint
											</li>
										}
									</ul>
								</div>
							</Col>
						</Row>
					}
				</Col>
				<Col md="6">
					{
						(this.state.metapath.length > 0) && constraintsPanel		
					}
				</Col>
				<Col md='12'>
					<br/>
					<Button color="success" disabled={this.props.loading || !validMetapath || !validConstraints} onClick={this.execute.bind(this)}>
						<FontAwesomeIcon icon="play" /> Run
					</Button>
				</Col>
				<Col md='12'>
					<Container>
					<br/>
					{
						(this.props.loading) && <Progress animated color="info" value={this.props.progress}>{this.props.progressMsg}</Progress>
					}
					{
						(this.props.docs) && (
							(this.props.docs.length > 0) 
							? <div>
								<h2>Results</h2>
								<div className="small-grey">
									{this.props.meta.page} of {this.props.meta.totalPages} pages. ({this.props.meta.totalRecords} results)
								</div>
								<RankingResultsPanel docs={this.props.docs}/>
							</div>
							: <div style={{ textAlign: "center" }}>No results found for the specified query</div>
						)
					}
					</Container>
				</Col>
			</Row>
			</Container>
		);
	}
};

const mapStateToProps = (storeState: IRootState) => ({  
	loading: storeState.ranking.loading,
	progress: storeState.ranking.progress,
	progressMsg: storeState.ranking.progressMsg,
	error: storeState.ranking.error,
	docs: storeState.ranking.docs,
	meta: storeState.ranking.meta,
	uuid: storeState.ranking.uuid,  
});

const mapDispatchToProps = { rankingRun, rankingGetResults };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Home);



