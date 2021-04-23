import './home.scss';

import React from 'react';
import { connect } from 'react-redux';
import {
	Row,
	Col,
	FormGroup,
	FormText,
	Input,
	Button,
	PaginationLink,
	Form,
	Container,
	Pagination,
	PaginationItem,
	Card,
	Label,
	ModalBody,
	Modal,
	ModalFooter,
	ModalHeader,
	Progress
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import { __metadata, __importDefault } from 'tslib';
import { Link } from 'react-router-dom';
import AutocompleteInput from '../datasets/autocomplete-input';
import { CONNREFUSED } from 'dns';
import axios from 'axios';
import { AsyncHook } from 'async_hooks';
import { analysisRun, getMoreResults, getResults, getStatus } from '../analysis/analysis.reducer';
import ResultsPanel from '../analysis/results/results';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export interface IHomeProps extends StateProps, DispatchProps {
    loading: boolean;
    progress: number;
    progressMsg: string;
    error: string;
    docs: any;
    meta: any;
    uuid: string;
}

export class Home extends React.Component<IHomeProps> {
	readonly state: any = {
		expertSet: [],
		expertSetFile: '',
		currentPage: 0,
		pagesCount: 1,
		configurationActive: false,
		simThreshold: 0.2,
		simMinValues: 3,
		simsPerExpert: 100,
		apvWeight: 50,
		aptWeight: 50,
		outputSize: 500,
	};
	_authorsInput: any;
	_pageSize = 10;
    polling: any;
	marks:any = {
        0: '0',
        20: '0.2',
        40: '0.4',
        60: '0.6',
        80: '0.8',
        100: '1.0',
	};
	
	pollForResults() {
        this.polling = setInterval(() => {
            this.props.getStatus(this.props.uuid);
        }, 2000);
	}
	
	componentDidUpdate(prevProps) {

        // new uuid detected, start polling
        if (this.props.loading && !prevProps.loading) {
            this.pollForResults();
        } else if (prevProps.loading && !this.props.loading) {
            clearInterval(this.polling);
        }

		if (prevProps.loading && !this.props.loading) {
			this.props.getResults(this.props.uuid);
		}
	}
	
	componentWillUnmount() {
        clearInterval(this.polling);
	}
	
	expertFileUpload(e) {
		e.preventDefault();
		if (!this.state['expertSetFile']) {
			alert("Please select file to upload")
			return;
		}
		const expertFile = this.state['expertSetFile'];

		const reader = new FileReader();

		reader.onload = this.readExpertFile.bind(this, reader);

		reader.readAsText(expertFile);

	}

	async readExpertFile(reader, event) {
		const content = reader.result;
		const fileContent = event.target.result;
		const allLines = (fileContent as string).split(/\r\n|\n/);

		for (const expert of allLines) {
			await axios.get(`api/datasets/get`, {
				params: {
					term: expert,
				}
			}).then((response) => {
				let newExpert;

				if (!_.isEmpty(response.data)) {
					newExpert = response.data;
					newExpert.valid = true;
				} else {
					newExpert = {
						name: expert,
						valid: false,
					};
				}
				this.addExpert(newExpert);
			});
		}
	}
	onExpertFileChange(e) {
		const newState = {};
		newState[e.target.name] = e.target.files[0];
		this.setState(newState);
	}
	handleSelect(e) {

		if (_.isEmpty(e)) {
			return;
		}

		const [selected] = e;
		selected.valid = true;
		this.addExpert(selected);
	}
	addExpert(expert) {
		const newState = { ... this.state };
		newState['expertSet'].push(expert);

		// keep unique experts
		newState['expertSet'] = _.uniqBy(newState['expertSet'], 'name');
		newState['pagesCount'] = this.getUpdatedPagesCount(newState['expertSet'].length);

		this.setState(newState);
	}
	removeExpert(idx, e) {
		e.preventDefault();

		const newState = { ... this.state };
		newState['expertSet'].splice(idx, 1);
		newState['pagesCount'] = this.getUpdatedPagesCount(newState['expertSet'].length);

		this.setState(newState);
	}
	changeExpertSetPage(e, index) {

		e.preventDefault();

		this.setState({
			currentPage: index
		});
	}
	getUpdatedPagesCount(resultsLength) {
		return Math.ceil(resultsLength / this._pageSize)
	}
	toggleConfiguration() {
		this.setState({
			configurationActive: !this.state.configurationActive
		});
	}
	handleAdvancedOptions(e) {
		const newState = { ...this.state };
		newState[e.target.id] = e.target.value;
		this.setState(newState);
	}
	loadMoreResults(nextPage) {
        this.props.getMoreResults(this.props.uuid, nextPage);
    }
	execute(event) {
		const expertIds = this.state.expertSet.filter(e => e.valid).map(e => e.id);

        this.props.analysisRun(
            expertIds,
			this.state.simThreshold,
			this.state.simMinValues,
			this.state.simsPerExpert,
			this.state.apvWeight / 100,
			this.state.aptWeight / 100,
			this.state.outputSize,
        );
	}
	handleAptWeight(value) {
		this.setState({
			aptWeight: value,
			apvWeight: 100 - value,
		});
	}
	handleApvWeight(value) {
		this.setState({
			aptWeight: 100 - value,
			apvWeight: value
		});
    }
	render() {
		return (
			<Container>
				<Row>
					<Col md="6">
						<h5>Search for experts</h5>
						<AutocompleteInput
							id="targetEntityInput"
							placeholder={"Start typing the name of an expert"}
							onChange={this.handleSelect.bind(this)}
							disabled={false}
							ref={(ref) => this._authorsInput = ref}
						/>
					</Col>
					<Col md='1'>
						<h5 style={{ paddingTop: '35px'}}>or</h5>
					</Col>
					<Col md='5'>
						<Form>
							<Row>
								<Col md='8'>
									<h5>Upload experts file <FontAwesomeIcon
										style={{ color: '#17a2b8' }}
										icon="question-circle"
										title="File that contains one expert name per line." />
									</h5>
								</Col>
								<Col md='8'>
									<FormGroup>
										
										<Input type="file" name="expertSetFile" id="expertSetFile" required={true} onChange={this.onExpertFileChange.bind(this)} />
									</FormGroup>
								</Col>
								<Col md='4' style={{ textAlign: 'right'}}>
									<Button disabled={this.props.loading} onClick={this.expertFileUpload.bind(this)} size='sm'>
										<FontAwesomeIcon icon="upload" /> Upload
									</Button>
								</Col>
							</Row>
						</Form>
						
					</Col>
				</Row>
				<Row style={{paddingBottom: '20px', paddingTop: '20px'}}>
						<Col md='4'>
							<h5>Similarity weights</h5>
							Topics <Slider min={0} marks={this.marks} included={false} value={this.state.aptWeight} defaultValue={0.5} onChange={this.handleAptWeight.bind(this)} />
							{/* <br/><small style={{color: 'grey'}}>Similarity weights for Topics and Venue should sum up to 1.</small> */}

						</Col>
						<Col md='4'>
							<h5>&nbsp;</h5>
							Venues <Slider min={0} marks={this.marks} included={false} value={this.state.apvWeight} defaultValue={0.5} onChange={this.handleApvWeight.bind(this)}/>
						</Col>
						<Col md='4'>
						
							<Button outline size='sm' color="info" title="Advanced Options"
								className="float-right" active={this.state.configurationActive}
								onClick={this.toggleConfiguration.bind(this)}>
								<FontAwesomeIcon icon="cogs" /> Configuration
							</Button>
							<Modal isOpen={this.state.configurationActive}
								toggle={this.toggleConfiguration.bind(this)} className={'w-75 mw-100'}>
								<ModalHeader>
									Coinfiguration
								</ModalHeader>
								<ModalBody>
									<Container>
										<Row>
											<Col md='6'>
												<Card className={'configuration-card'}>
													<h5>Expert Similarity</h5>

													<Label for="simThreshold">
														Threshold <FontAwesomeIcon style={{ color: '#17a2b8' }}
															icon="question-circle"
															title="Lower threshold of similarity score to consider two experts are similar." />
													</Label>
													<Input id="simThreshold" value={this.state.simThreshold}
														bsSize="sm"
														type='number'
														onChange={this.handleAdvancedOptions.bind(this)} />
													{
														(this.state.simThreshold === '') &&
														<span className="attribute-type text-danger">
															This field cannot be empty.
												</span>
													}

													<br />
													<Label for="simMinValues">
														Min. number of metapath instances <FontAwesomeIcon
															style={{ color: '#17a2b8' }}
															icon="question-circle"
															title="Minumum number of metapath instances required for each entity to be considered during the similarity calculation." />
													</Label>
													<Input id="simMinValues" value={this.state.simMinValues}
														bsSize="sm"
														type='number'
														onChange={this.handleAdvancedOptions.bind(this)} />
													{
														(this.state.simMinValues === '') &&
														<span className="attribute-type text-danger">
															This field cannot be empty.
												</span>
													}
												</Card>

											</Col>
											<Col md='6'>
												<Card className={'configuration-card'}>
													<h5>VeTo Method</h5>

													<Label for="simsPerExpert">
														Similarities per expert <FontAwesomeIcon
															style={{ color: '#17a2b8' }}
															icon="question-circle"
															title="Number of similar experts to be considered per expert in the input." />
													</Label>
													<Input id="simsPerExpert" value={this.state.simsPerExpert}
														bsSize="sm"
														type='number'
														onChange={this.handleAdvancedOptions.bind(this)} />
													{
														(this.state.simsPerExpert === '') &&
														<span className="attribute-type text-danger">
															This field cannot be empty.
												</span>
													}

													<br />
													<Label for="outputSize">
														Number of experts in the result <FontAwesomeIcon
															style={{ color: '#17a2b8' }}
															icon="question-circle"
															title="Max. number of experts to be retrieved." />
													</Label>
													<Input id="outputSize" value={this.state.outputSize}
														bsSize="sm"
														type='number'
														onChange={this.handleAdvancedOptions.bind(this)} />
													{
														(this.state.outputSize === '') &&
														<span className="attribute-type text-danger">
															This field cannot be empty.
												</span>
													}
												</Card>
											</Col>

										</Row>
									</Container>
								</ModalBody>
								<ModalFooter>
									<Button color={'info'}
										onClick={this.toggleConfiguration.bind(this)}><FontAwesomeIcon
											icon={'save'} /> Save</Button>
								</ModalFooter>
							</Modal>
						</Col>
					</Row>
					<Row>
					<Col md='12'>
						{/* <Card> */}
						<hr />
							<h5>Expert Set</h5>
							{_.isEmpty(this.state.expertSet) &&
								"Please add one or more experts  "
							}
							{
								(this.state['expertSet'].length > 0) &&

								<Pagination aria-label="Page navigation example">

									<PaginationItem disabled={this.state.currentPage <= 0}>

										<PaginationLink
											onClick={e => this.changeExpertSetPage(e, this.state.currentPage - 1)}
											previous
											href="#"
										/>

									</PaginationItem>
									{[...Array(this.state.pagesCount)].map((page, i) =>
										<PaginationItem active={i === this.state.currentPage} key={i}>
											<PaginationLink onClick={e => this.changeExpertSetPage(e, i)} href="#">
												{i + 1}
											</PaginationLink>
										</PaginationItem>
									)}

									<PaginationItem disabled={this.state.currentPage >= this.state.pagesCount - 1}>

										<PaginationLink
											onClick={e => this.changeExpertSetPage(e, this.state.currentPage + 1)}
											next
											href="#"
										/>

									</PaginationItem>

								</Pagination>
							}
							<ul>
								{
									this.state['expertSet'].slice(
										this.state.currentPage * this._pageSize,
										(this.state.currentPage + 1) * this._pageSize
									).map((expert, idx) => {
										const validIcon = (expert['valid'])
											? <FontAwesomeIcon icon="check" color="green" title="This expert exists in our dataset." />
											: <FontAwesomeIcon icon="times" color="red" title="This expert cannot be found in our dataset." />;

										const index = this.state.currentPage * this._pageSize + idx;

										const removeLink = <Link to={'#'} style={{ color: 'grey' }} onClick={this.removeExpert.bind(this, index)}>remove</Link>
										return <li key={idx}>{expert['name']} {validIcon} {removeLink}</li>;
									})
								}
							</ul>
						{/* </Card> */}
					</Col>
				</Row>
				<Row>
                    <Col md='12' style={{ paddingTop: '20px' }}>
                        <Row>
                            <Col md={{ size: 2, offset: 5 }}>
                                <Button block color="success"
                                        disabled={this.props.loading || _.isEmpty(this.state.expertSet) }
                                        onClick={this.execute.bind(this)}>
                                    <FontAwesomeIcon icon="play" /> Execute
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
				<Row>
                    <Col md='12'>
                        <Container>
                            {this.props.uuid &&
                            <div className={'my-4 pt-0'}>
                                <Row className={'justify-content-end'}>
                                    <h6 className={'p-2'}><strong className={'text-muted'}>Analysis
                                        id: <Link to={`/jobs/${this.props.uuid}`}
                                                  target="_blank">{this.props.uuid}</Link></strong></h6>
                                </Row>
                                {this.props.error &&
                                <Row>
                                    <Col xs={'12'} className={'text-danger'}>{this.props.error}</Col>
                                </Row>
                                }
                                {
                                    (this.props.loading) && <Progress animated color="info"
                                                                      value={this.props.progress}>{this.props.progressMsg}</Progress>
                                }
								{

								(!_.isEmpty(this.props.results)) && 
									<div>
										<ResultsPanel
											uuid={this.props.uuid}
											results={this.props.results}
											loadMore={this.loadMoreResults.bind(this)}
										/>
									</div>
								}
                            </div>
                            }

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
    results: storeState.analysis.results,
    uuid: storeState.analysis.uuid,
});

const mapDispatchToProps = {
	analysisRun,
    getStatus,
    getResults,
    getMoreResults,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);



