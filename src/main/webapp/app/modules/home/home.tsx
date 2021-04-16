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
	Card
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import  _  from 'lodash';
import { __metadata, __importDefault } from 'tslib';
import { Link } from 'react-router-dom';
import AutocompleteInput from '../datasets/autocomplete-input';
import { CONNREFUSED } from 'dns';
import axios from 'axios';
import { AsyncHook } from 'async_hooks';

export interface IUploadProps extends StateProps, DispatchProps {};

export class Home extends React.Component<IUploadProps> {
	readonly state: any = { 
		expertSet: [],
		expertSetFile: '',
		currentPage: 0,
		pagesCount: 1,
	};
	_authorsInput: any;
	_pageSize = 20;

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
			}).then( (response) => {
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
	render() {
		
		return (
			<Container fluid>
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
						<br/>
						<h5>or</h5>
						<br/>
						<Form>
                            <FormGroup>
                                <h5>Upload experts file</h5>
                                <Input type="file" name="expertSetFile" id="expertSetFile" required={true} onChange={this.onExpertFileChange.bind(this)} />
                                <FormText color="muted">
                                Please refer [here] for the format of the data files.
                                </FormText>
                            </FormGroup>

                            <Button disabled={this.props.loading} onClick={this.expertFileUpload.bind(this)}>
								<FontAwesomeIcon icon="upload" /> Upload
							</Button>
                        </Form>
					</Col>
					<Col>
						<Card>	
							<h5>Expert Set</h5>
							{ _.isEmpty(this.state.expertSet) &&
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
								  ).map( (expert, idx) => {
									const validIcon = (expert['valid']) 
										? <FontAwesomeIcon icon="check" color="green" title="This expert exists in our dataset."/> 
										: <FontAwesomeIcon icon="times" color="red" title="This expert cannot be found in our dataset."/>;
									
										const index = this.state.currentPage * this._pageSize + idx;

									const removeLink = <Link to={'#'} style={{ color: 'grey' }}  onClick={this.removeExpert.bind(this, index)}>remove</Link>
									return <li key={idx}>{expert['name']} {validIcon} {removeLink}</li>;
								})
							}
							</ul>
						</Card>
					</Col>
                </Row>
			</Container>
		);
	}
};

const mapStateToProps = (storeState: IRootState) => ({  
	loading: storeState.datasets.loading,
	error: storeState.datasets.error,
	success: storeState.datasets.success,
});

const mapDispatchToProps = { 
	// uploadExpertSet, 
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);



