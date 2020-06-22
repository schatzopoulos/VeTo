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
	getStatus,
	getResults, 
	getMoreResults 
} from './jobs.reducer';
import ResultsPanel from './results/results';
import { __metadata } from 'tslib';
import { timingSafeEqual } from 'crypto';

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
			this.props.getStatus(this.props.uuid);
		}, 1000);
	}

	componentDidMount() {
		if (this.props['match']['params']['jobId']) {
			this.setState({
				jobId: this.props['match']['params']['jobId']
			}, () => {
				this.props.getJob(this.state.jobId);
			});
		}
	}

	componentDidUpdate(prevProps) {

		// new uuid detected, start polling
		if (this.props.loading && !prevProps.loading) {
			this.pollForResults();
		} else if (prevProps.loading && !this.props.loading) {
			clearInterval(this.polling);
		}
console.warn(prevProps);
		_.forOwn(this.props.status, (completed, analysis) => {
			if (completed && ( (prevProps.status && ! prevProps.status[analysis]) || (!prevProps.status) )) {
				this.props.getResults(analysis, this.props.uuid);
			}
		});
	}

	componentWillUnmount() {
		clearInterval(this.polling);
	}

	execute(e) {
		e.preventDefault();
		this.props.getJob(this.state.jobId);
	}
	
	loadMoreResults(analysis, nextPage) {
		this.props.getMoreResults(analysis, this.props.uuid, nextPage);
	}

	onChangeInput(e) {
		const jobId = e.target.value;
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
									<Input name="job_id" id="job_id" placeholder="Please give a valid job id" onChange={this.onChangeInput.bind(this)} value={this.state.jobId} />
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
						(this.props.loading) &&
						<Row className="small-grey text-center">
							<Col>
								{this.props.description}
							</Col>
						</Row>
					}
					{
						(this.props.loading) && <Progress animated color="info" value={this.props.progress}>{this.props.progressMsg}</Progress>
					}
					<ResultsPanel 
						results={this.props.results}
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
	description: storeState.jobs.description,
	error: storeState.jobs.error,
	results: storeState.jobs.results,
	status: storeState.jobs.status,
	uuid: storeState.jobs.uuid,  
	analysis: storeState.jobs.analysis,
});

const mapDispatchToProps = { 
	getJob,
	getStatus,
	getResults,
	getMoreResults,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Jobs);



