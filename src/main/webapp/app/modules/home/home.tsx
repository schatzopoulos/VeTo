import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Card, Row, Col, Alert, InputGroup, InputGroupAddon, InputGroupText, Input, Button, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import CytoscapeComponent from 'react-cytoscapejs';
export type IHomeProp = StateProps;

interface IHomeState {
	readonly account: any;
	readonly cy: any;
	initCy: boolean;		// flag to init cytoscape only once
	metapath: string;
}

export class Home extends React.Component<IHomeProp> {
	readonly state: IHomeState = { 
		account: undefined,
		cy: undefined,
		initCy: true,
		metapath: '',
	};

	/**
	 * Initialize cytoscape graph
	 * @param cy cytoscape object
	 */
	handleCy(cy) {
				
		if (this.state.initCy === true) {

			cy.on('tap', 'node', (e) => {
				const node = e.target;
				const nodeId = node.data('id');
				this.setState({
					metapath: this.state.metapath + nodeId
				});
			});

			cy.on('mouseover', 'node', function(e){
				const sel = e.target;
				console.log(sel.outgoers());
				const neighbors = sel.outgoers().union(sel.incomers());
				neighbors.animate({
					style: { 'background-color': "red" }
				});
			});

			// cy.on('mouseout', 'node', function(e){
			// 	const sel = e.target;
			// 	cy.elements().removeClass('semitransp');
			// 	sel.removeClass('highlight').outgoers().removeClass('highlight');
			// });

			// set flag that cytoscape is initialized
			this.setState({ initCy: false });
		}
	}
	
	/**
	 * Delete last character of the metapath
	 */
	deleteLast() {

		this.setState({
			metapath: this.state.metapath.substr(0, this.state.metapath.length-1)
		});
	}
	render() {
		const elements = [
			{ data: { id: 'P', label: 'Paper' } },
			{ data: { id: 'A', label: 'Author' } },
			{ data: { id: 'V', label: 'Venue' } },
			{ data: { id: 'T', label: 'Topic' } },
			{ data: { source: 'P', target: 'P'} },
			{ data: { source: 'A', target: 'P', label: 'Edge from Node1 to Node2' } },
			{ data: { source: 'T', target: 'P', label: 'Edge from Node1 to Node2' } },
			{ data: { source: 'V', target: 'P', label: 'Edge from Node1 to Node2' } }
		];

		const style = { 
			width: '600px', 
			height: '600px',
			'node.highlight': { 
				'border-color': '#FFF',
				'border-width': '2px'
			}
		};

		const layout = { 
			name: 'cose',
			animate: false,
		};  

		return (
			<Row>
				<Col md="5">
					<h2>Welcome to SpOT</h2>
					
					<Card>
						<CytoscapeComponent cy={this.handleCy.bind(this)} elements={elements} style={style} layout={layout} zoomingEnabled={false} />
					</Card>
					
				</Col>
				<Col md="4">
					<Label>metapath</Label>
					<InputGroup>
						<Input placeholder="Select graph nodes to define the metapath" value={this.state.metapath} disabled={true}/>
						<InputGroupAddon addonType="append">
							<Button color="danger" title="Delete last node" onClick={this.deleteLast.bind(this)} ><FontAwesomeIcon icon="arrow-left" /></Button>
						</InputGroupAddon>
					</InputGroup>
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
