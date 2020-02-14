import './upload.scss';

import React from 'react';
import { connect } from 'react-redux';
import { 
	Row, 
	Col, 
	FormGroup, 
	FormText, 
	Input, 
	Button, 
	Label,
	Form,
	Container,
	Alert,
	Spinner,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';
import  _  from 'lodash';
import { 
	uploadDataset
} from './datasets.reducer';
import { __metadata } from 'tslib';
import { Link } from 'react-router-dom';

export interface IUploadProps extends StateProps, DispatchProps {};

export class Upload extends React.Component<IUploadProps> {
	readonly state: any = { 
		datasetName: '',
		datasetDataFile: '',
	};

	submit(e) {
		e.preventDefault();
		if (!this.state['datasetDataFile']) {
			alert("Please select a zip file to upload")
			return;
		}
		this.props.uploadDataset(this.state['datasetDataFile']);        
    }
	onChange(e) {
        const newState = {};
        newState[e.target.name] = e.target.files[0];
        this.setState(newState);
    }
	render() {

		return (
			<Container fluid>
			    <Row>
				    <Col md="12">
				    	<h4>Upload Dataset</h4>
                        <Form>
                            {/* <FormGroup>
                                <Label for="exampleEmail">Name</Label>
                                <Input name="datasetName" id="datasetName" placeholder="Dataset Name" required={true} onChange={this.onChange.bind(this)} />
                            </FormGroup> */}
                            <FormGroup>
                                <Label for="data">Data Files (.zip)</Label>
                                <Input type="file" name="datasetDataFile" id="datasetDataFile" accept="zip,application/zip" required={true} onChange={this.onChange.bind(this)} />
                                <FormText color="muted">
                                Please refer [here] for the format of the data files.
                                </FormText>
                            </FormGroup>

                            <Button disabled={this.props.loading} onClick={this.submit.bind(this)}>
								<FontAwesomeIcon icon="upload" /> Upload
							</Button>
                        </Form>
					</Col>
                </Row>
				<br/>
				{
					(this.props.loading) &&       
					<Row>
						<Col>	
							<Spinner type="grow" color="info" />
							<Spinner type="grow" color="info" />
							<Spinner type="grow" color="info" />
							<Spinner type="grow" color="info" />
							<Spinner type="grow" color="info" />
						</Col>
					</Row>
				}
				{
					(this.props.success) && 
					<Row>
						<Col>
							<Alert color="success">
								Your dataset was successfully uploaded!
								Please navigate to <Link to="/" className="alert-link">homepage</Link> to resume your analysis.
							</Alert>
						</Col>
					</Row>
				}
				{
					(this.props.error) && 
					<Row>
						<Col>
							<Alert color="danger">
								{this.props.error}
							</Alert>
						</Col>
					</Row>
						

				}
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
	uploadDataset, 
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Upload);



