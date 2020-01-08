import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Card, Row, Col, Alert, InputGroup, InputGroupAddon, InputGroupText, Input, Button, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import CytoscapeComponent from 'react-cytoscapejs';
import { any } from 'prop-types';
export type IHomeProp = StateProps;

export class Home extends React.Component<IHomeProp> {
	readonly state: any = { 
		account: undefined,
		metapath: '',
		metapathNodes: [],
		neighbors: undefined,
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

		if (!node) {
			nodes.animate({
				style: { 'background-color': 'grey', 'border-width': '0px' }
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

			const metapath = this.state.metapath + node.data('id');
			const metapathNodes = [...this.state.metapathNodes];	// copy array
			metapathNodes.push(node);

			this.setState({
				metapath,
				metapathNodes, 
			}, () => {
				this.animateNeighbors(node);
			});
			
		});
	}
	
	/**
	 * Delete last character of the metapath
	 */
	deleteLast() {

		const metapath = this.state.metapath.substr(0, this.state.metapath.length-1);
		const metapathNodes = [...this.state.metapathNodes];	// copy array
		metapathNodes.pop();
		const node = metapathNodes[metapathNodes.length-1];
		this.setState({
			metapath,
			metapathNodes,
		}, () => {
			this.animateNeighbors(node);
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
			width: '200px', 
			height: '200px',
		};

		const layout = { 
			name: 'cose',
			animate: false,
		};  

		return (
			<Row>
				<Col md="6">
					<h2>Welcome to SpOT</h2>
					
					<Card>
						<CytoscapeComponent cy={ (cy) => { this.cy = cy } } elements={elements} style={style} layout={layout} zoomingEnabled={false} />
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
