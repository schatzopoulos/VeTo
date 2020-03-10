import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
	Row, 
	Col, 
	InputGroup, 
	InputGroupAddon, 
	Input, 
	Button, 
	Spinner,
	ListGroup,
	Progress,
	Container,
	Card, 
	CardBody,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import CytoscapeComponent from 'react-cytoscapejs';
import  _  from 'lodash';
import { 
	rankingRun,
	simjoinRun,
	simsearchRun,
	getResults, 
	getMoreResults 
} from '../analysis/analysis.reducer';
import { getDatasetSchemas } from '../datasets/datasets.reducer';
import ResultsPanel from '../analysis/results/results';
import ConstraintItem from '../constraints/constraint-item';
import { __metadata } from 'tslib';
import AutocompleteInput from '../datasets/autocomplete-input';

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
		dataset: "DBLP",
		selectField: '',
		targetEntity: '',
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
			this.props.getResults(this.props.analysis, this.props.uuid);
		}, 1000);
	}

	componentDidUpdate(prevProps) {

		// new uuid detected, start polling
		if (this.props.loading && !prevProps.loading) {
			this.pollForResults();
		} else if (prevProps.loading && !this.props.loading) {
			clearInterval(this.polling);
		}

		if (!prevProps.schemas && this.props.schemas) {
			this.initCy();
		}

	}

	componentWillUnmount() {
		clearInterval(this.polling);
	}

	componentDidMount() {
		if (!this.props.schemas) {
			this.props.getDatasetSchemas();
		}		
		
		if (this.cy) { 
			this.initCy();
		}
	}
	tapNode(e) {
			
		const node = e.target;

		if (!this.validMove(node)) {
			alert("This selection is not allowed, please select on of the nodes denoted with green color");
			return;
		}

		// set metapath
		const metapath = [...this.state.metapath];	// copy array
		metapath.push(node);
		const metapathStr = metapath.map(n => n.data('label').substr(0,1)).join('');

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

		const newState = { ... this.state };
		newState.metapath = metapath;
		newState.metapathStr = metapathStr;
		newState.constraints = constraints;

		// select first attribute from the options
		if (this.state.selectField === '') {
			newState.selectField = node.data('attributes').filter( (attr) => attr.name !== 'id')[0].name;
		}

		this.setState(newState, () => {
			this.animateNeighbors(node);
		});
		
	}
	initCy() {
		// center align graph 
		this.cy.center();

		// init all nodes with grey color
		const nodes = this.cy.filter('node');
		nodes.animate({
			style: { 'background-color': 'grey', 'border-width': '0px' }
		}); 

		// change state and animate on node click
		this.cy.on('tap', 'node', (e) => this.tapNode(e) );
	}
	
	/**
	 * Delete last character of the metapath
	 */
	deleteLast() {

		const metapath = [...this.state.metapath];	// copy array
		metapath.pop();
		const metapathStr = metapath.map(n => n.data('label').substr(0,1)).join('');

		const node = metapath[metapath.length-1];

		// keep constraints for nodes that are in the metapath
		const constraints = {};
		_.forOwn(this.state.constraints, (entityConstraint, entity) => {
			const e = entity.substr(0, 1);
			if (metapathStr.includes(e)) {
				constraints[entity] = entityConstraint;
			}
		});
		
		const newState = { ... this.state };
		newState.metapath = metapath; 
		newState.metapathStr = metapathStr;
		newState.constraints = constraints;

		// clear select field when metapath is deleted
		if (metapath.length === 0) {
			newState.selectField = '';
		}

		this.setState(newState, () => {
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
				logicOp: (index > 0) ? 'or' : undefined,
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

	getSelectFieldOptions() {
		if (this.state.metapath.length === 0) {
			return { selectedEntity: '', selectFieldOptions: [] };
		}

		const selectFieldOptions = [];
		const firstNode = this.state.metapath[0];

		const selectedEntity = firstNode.data('label');
		_.forOwn(firstNode.data('attributes'), (value, key) => {
			if (value.name !== 'id') {
				selectFieldOptions.push(
					<option key={key} value={value.name}>{value.name} (:{value.type})</option>
				);
			}
		});

		return { selectedEntity, selectFieldOptions };
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
		let analysis = null;

		switch(this.state.analysis) {
			case 'ranking': 
				analysis = this.props.rankingRun; break;
			case 'simjoin':
				analysis = this.props.simjoinRun; break;
			case 'simsearch':
				analysis = this.props.simsearchRun; break;
			default:
				alert("This type of analysis will be implemented soon");
		}

		analysis(
			(this.state.analysis === 'ranking') ? this.state.metapathStr : this.getJoinPath(), 
			this.state.constraints, 
			this.props.schemas[this.state.dataset]['folder'],
			this.state.selectField,
			this.state.targetEntity,
		);
	}
	runExample(e) {

		console.log(this.state.analysis);
		const newState = { ... this.state };

		const nodes = this.cy.filter('node');
		console.log(nodes);

		switch(this.state.analysis) {
			case 'ranking': {
				const node = nodes.select('label=MiRNA');

				console.log(node);

				newState.dataset = 'Bio';
				newState.metapathStr = "MGDGM";
				newState.selectField = "name";
				newState.constraints = {"Disease":{"name":{"nextIndex":1,"enabled":true,"type":"string","conditions":[{"index":0,"value":"Adenocarcinoma","operation":"="}]}}};
				break;
			}
			case 'simjoin':
				newState.dataset = 'DBLP';
				newState.metapathStr = "VPTPV";
				newState.selectField = "name";
				break;
			case 'simsearch':
				newState.dataset = 'DBLP';
				newState.metapathStr = "VPAPV";
				newState.selectField = "name";
				newState.targetEntity = 360;
				break;
			default:
				alert("This type of analysis will be implemented soon");
		}

		this.setState(newState, () => {
			this.changeSchema(); 
			this.execute(e);
		});
	}
	loadMoreResults() {
		this.props.getMoreResults(this.props.analysis, this.props.uuid, this.props.meta.page + 1);
	}

	handleAnalysisDropdown(e) {
		this.setState({
			analysis: e.target.value,
			targetEntity: '',
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

	checkMetapathLength() {
		const metapath = this.state.metapathStr;

		return (metapath.length >= 3);
	}
	getJoinPath() {
		const metapath = this.state.metapathStr;	
		const midPos = Math.ceil(metapath.length / 2);
		return metapath.substr(0, midPos);
	}
	reverseString(str) {
		const splitString = str.split("");
		const reverseArray = splitString.reverse();
		const joinArray = reverseArray.join("");
		return joinArray;
	}
	checkSymmetricMetapath() {
		
		const metapath = this.state.metapathStr;	

		if (metapath.length < 3 || metapath.length % 2 === 0)
			return false;

		// CHECKS MATCHING FIRST AND LAST CHARACTER
		// const firstLetter = metapath.substr(0, 1);
		// const lastLetter = metapath.substr(metapath.length-1, 1);

		// if (firstLetter !== lastLetter)
		// 	return false;
		
		const midPos = Math.ceil(metapath.length / 2);

		const firstHalf = metapath.substr(0, midPos-1);
		const lastHalf = metapath.substr(midPos, metapath.length-1);
		// console.log("first " + firstHalf);
		// console.log("last " + lastHalf);
		
		return ( firstHalf === this.reverseString(lastHalf) );
	}

	checkConstraints() {
		if (this.state.analysis === 'simjoin' || this.state.analysis === 'simsearch')
			return true;

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

	getSchema() {
		const style = { 
			width: '100%', 
			height: '200px',
		};

		const layout = { 
			name: 'cose',
			animate: false,
		};

		let elements;
		if (this.props.schemas) { 
			elements = this.props.schemas[this.state.dataset]['elements'];
		}

		let schema;
		if (elements) {
			schema = <CytoscapeComponent cy={ (cy) => { this.cy = cy } } elements={elements} style={style} layout={layout} zoomingEnabled={false} />;
		} else {
			schema = <Spinner style={{ width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto' }} type="grow" color="info" />;
		}

		return schema;
	}
	changeSchema() {

		const elements = this.props.schemas[this.state.dataset]['elements'];

		this.cy.elements().remove(); 
		this.cy.add(elements)
		const newLayout = this.cy.layout({ 
			name: 'cose',
			animate: false,
		});
		newLayout.run();
		this.cy.center();

	}
	resetSchemaColors() {
		const nodes = this.cy.filter('node');

		nodes.animate({
			style: { 'border-width': '0px', 'background-color': 'grey' }
		});
	}
	handleDatasetDropdown(e) {
		e.preventDefault();

		const newState = { ...this.state };
		newState.metapath = [];
		newState.metapathStr = '';
		newState.neighbors = undefined;
		newState.constraints = {};
		newState.selectField = '';
		newState.dataset = e.target.value;

		this.setState(newState, () => {	
			this.changeSchema();
			this.resetSchemaColors();
		});
	}
	getDatasetOptions() {
		let options = [];
		if (this.props.schemas) {
			options = _.map(this.props.schemas, (value, key) => {
				return <option key={key} value={key}>{key}</option>;
			});
		}
		return options;
	}
	handleSelectFieldChange(e) {
		e.preventDefault();

		const newState = { ...this.state };
		newState.selectField = e.target.value;
		this.setState(newState);
	}
	handleTargetEntity(e) {

		let selected;

		if (_.isEmpty(e)) {
			selected = '';
		} else {
			[selected] = e;
			selected = selected.id;
		}

		this.setState({
			targetEntity: selected,
		});
	}
	render() {
		const datasetOptions = this.getDatasetOptions();
		const schema = this.getSchema();
		let datasetFolder = '';
		if (this.props.schemas) {
			datasetFolder = this.props.schemas[this.state.dataset]['folder'];
		}

		const constraintsPanel = <Row>
		<Col md="12">
			<h4>3. Select constraints</h4>
		</Col>
		<Col md="12">
			{
				<ListGroup>
					{
						(this.state.metapathStr.length > 0) ?
						_.map(this.state.constraints, (entityConstraints, entity) => {
							return <ConstraintItem 
								key={ entity }
								datasetFolder= { datasetFolder }
								entity={ entity }
								entityConstraints={ entityConstraints }
								handleSwitch={this.handleConstraintSwitch.bind(this)}
								handleDropdown={this.handleConstraintOpDropdown.bind(this)}
								handleLogicDropdown={this.handleConstraintLogicOpDropdown.bind(this)}
								handleInput={this.handleConstraintInputChange.bind(this)}
								handleAddition={this.handleConstraintAddition.bind(this)}
								handleRemoval={this.handleConstraintRemoval.bind(this)}

							/>;
						})
						: 'No constraints can be applied'
					}
					</ListGroup>
			}
		</Col>
		</Row>;

		const validMetapathLength = this.checkMetapathLength();
		const validMetapath = this.checkSymmetricMetapath();
		const validConstraints = this.checkConstraints();
		const validTargetEntity = (this.state.analysis !== 'simsearch') || (this.state.analysis === 'simsearch' && this.state.targetEntity !== '');
		const { selectedEntity, selectFieldOptions }: any = this.getSelectFieldOptions();
		
		return (
			<Container fluid>
			<Row>
				<Col md="6">
					<Row>
						<Col md="12">
							<h4>1. Select dataset</h4>
							<Input value={this.state.dataset} type="select" name="dataset" id="dataset" onChange={this.handleDatasetDropdown.bind(this)}>
								{ datasetOptions }
							</Input>
						</Col>
					</Row>
					<br/>

					<h4>2. Select metapath</h4>
					<Card className="mx-auto">		
						{ schema }
					</Card>

					<br/>
					<Row>
						<Col md='6' style={{'textAlign': 'center'}}>
							<h5>Current metapath</h5>
							<InputGroup>
								<Input placeholder="Select nodes on the graph to define the metapath" value={this.state.metapathStr} disabled={true}/>
								<InputGroupAddon addonType="append">
									<Button color="danger" title="Delete last node" onClick={this.deleteLast.bind(this)} ><FontAwesomeIcon icon="arrow-left" /></Button>
								</InputGroupAddon>
							</InputGroup>
							
						</Col>
						<Col md='6' style={{'textAlign': 'center'}}>
							<h5>Select key attribute { (selectedEntity) && <span> for entity { selectedEntity }</span>}</h5>
							<Input id="select-field-dropdown" type="select" value={this.state.selectField} onChange={this.handleSelectFieldChange.bind(this)} disabled={this.state.metapath.length === 0}>
								{ selectFieldOptions }
							</Input>
							
						</Col>

					</Row>
					
				</Col>
				<Col md="6">
					
					{
						constraintsPanel		
					}

					<br/>
					<h4>4. Select analysis type</h4>
					<Input id="analysis-dropdown" type="select" value={this.state.analysis} onChange={this.handleAnalysisDropdown.bind(this)} >
						<option value={"ranking"}>Ranking</option>
						<option value={"simjoin"}>Similarity Join</option>
						<option value={"simsearch"}>Similarity Search</option>
					</Input>
					{
						(this.state.analysis === "simsearch") &&
							<div>
								<br/>
								<h4>5. Select target entity</h4>
								<AutocompleteInput 
									id="targetEntityInput"
									placeholder={ _.isEmpty(this.state.metapath) ? "Select metapath first" : `Search for ${selectedEntity} entities by ${this.state.selectField}`}
									onChange={this.handleTargetEntity.bind(this)}								
									entity={selectedEntity}
									field={this.state.selectField}
									folder={datasetFolder}
									disabled={_.isEmpty(this.state.metapath)}
								/>
							</div>
					}
					<br/>
					<Col md={{ size: 4, offset: 8 }}>
						<Row>
							{/* <Col md="6">
								<Button block color="success" outline onClick={this.runExample.bind(this)}>
									<FontAwesomeIcon icon="play" /> Execute example
								</Button>
							</Col> */}
							<Col md="12">
								<Button block color="success" disabled={this.props.loading || !validMetapath || !validConstraints || !validTargetEntity} onClick={this.execute.bind(this)}>
									<FontAwesomeIcon icon="play" /> Execute analysis
								</Button>
							</Col>
						</Row>
					</Col>
				</Col>
				
				{
					(!validMetapathLength || !validMetapath || !validConstraints || !validTargetEntity) &&
					<Col md={{size: 4, offset: 4}}>
						<br/>
						<Row className="small-grey">
							<Card>
								<CardBody>
									<b>Please note that:</b>
									<ul>
										{
											(!validMetapathLength) &&
											<li>
												The metapath should containt at least 3 entities.
											</li>
										}
										{
											(!validMetapath) && 
											<li>
												The metapath should be symmetric  e.g. APVPA
											</li>
										}
										{
											(!validConstraints) &&
											<li>
												You should provide at least one constraint.
											</li>
										}
										{
											(!validTargetEntity) &&
											<li>
												You should specify target entity for search.
											</li>
										}
									</ul>
								</CardBody>
							</Card>
						</Row>
					</Col>
				}

				<Col md='12'>
					<Container>
					<br/>
					{
						(this.props.loading) && <Progress animated color="info" value={this.props.progress}>{this.props.progressMsg}</Progress>
					}
					<ResultsPanel 
						docs={this.props.docs}
						meta={this.props.meta}
						analysis={this.props.analysis}
						analysisId={this.props.uuid}
						loadMore={this.loadMoreResults.bind(this)}
					/>
					</Container>
				</Col>
			</Row>
			</Container>
		);
	}
};

const mapStateToProps = (storeState: IRootState) => ({  
	loading: storeState.analysis.loading,
	progress: storeState.analysis.progress,
	progressMsg: storeState.analysis.progressMsg,
	error: storeState.analysis.error,
	docs: storeState.analysis.docs,
	meta: storeState.analysis.meta,
	uuid: storeState.analysis.uuid,  
	analysis: storeState.analysis.analysis,
	schemas: storeState.datasets.schemas,
});

const mapDispatchToProps = { 
	rankingRun, 
	simjoinRun,
	simsearchRun,
	getResults,
	getMoreResults,
	getDatasetSchemas,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Home);



