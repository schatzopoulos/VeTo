import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { 
	Row, 
	Col, 
	FormGroup, 
	Form, 
	Input, 
	Button, 
	Spinner,
	ListGroup,
	Progress,
	Container,
	Card, 
	CardBody,
	CustomInput, 
	
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import  _  from 'lodash';
import { 
	getJob,
	getResults, 
	getMoreResults 
} from './jobs.reducer';
import ResultsPanel from './results/results';
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

export class Jobs extends React.Component<IHomeProps> {
	readonly state: any = { 
		jobId: '',
	};
	polling: any;
	
	pollForResults() {
		this.polling = setInterval( () => {
			this.props.getResults(this.props.uuid);
		}, 1000);
	}

	componentDidUpdate(prevProps) {
		console.warn(this.props.loading);
		console.warn(prevProps.loading);
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

	execute(e) {
		e.preventDefault();
		this.props.getJob(this.state.jobId);
	}
	
	loadMoreResults() {
		this.props.getMoreResults(this.props.uuid, this.props.meta.page + 1);
	}

	onChangeInput(e) {
		const jobId = e.target.value;
		console.warn(jobId);
		this.setState({
			jobId
		});

	}

	render() {

		return (
			<Container fluid>
			<Row>
				<Col md="6">
					<Row>
						<Col>
							<h4>Search for job</h4>
							<Row>
								<Col md='10'>
									<Input name="job_id" id="job_id" placeholder="Please give a valid job id" onChange={this.onChangeInput.bind(this)} />
								</Col>
								<Col md='2'>
									<Button color="success" disabled={this.props.loading || this.state.jobId === ''} onClick={this.execute.bind(this)}>
										{/* <FontAwesomeIcon icon="search" />  */}
										Search
									</Button>
								</Col>
									&nbsp;
									
							</Row>
						</Col>
					</Row>
					
				</Col>

				<Col md='12'>
					<Container>
						{
							(this.props.error) &&
							<Col md={{size: 6, offset: 3}}>
								{this.props.error}
							</Col>
						}
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
						rerun={this.execute.bind(this)}
					/>
					</Container>
				</Col>
			</Row>
			</Container>
		);
	}
};

const mapStateToProps = (storeState: IRootState) => ({  
	loading: storeState.jobs.loading,
	progress: storeState.jobs.progress,
	progressMsg: storeState.jobs.progressMsg,
	error: storeState.jobs.error,
	docs: storeState.jobs.docs,
	meta: storeState.jobs.meta,
	uuid: storeState.jobs.uuid,  
	analysis: storeState.jobs.analysis,
});

const mapDispatchToProps = { 
	getJob,
	getResults,
	getMoreResults,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Jobs);



