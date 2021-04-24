import React from 'react';
import {
    Button,
    ButtonGroup,
    Col,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    Progress,
    Table,
} from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faChartBar, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import ResultsTable from './results-table';
import axios from 'axios';
import FileSaver from 'file-saver';
import _ from 'lodash';
import { Bar } from 'react-chartjs-2';
import HinGraph from 'app/modules/analysis/results/hin-graph';

export interface IResultsPanelProps {
    uuid: any,
    results: any,
    loadMore: any,
}

export class ResultsPanel extends React.Component<IResultsPanelProps> {

    constructor(props) {
        super(props);
    }

    downloadResults() {
        axios.get('api/datasets/download', {
            params: {
                id: this.props.uuid
            },
            responseType: 'blob'
        }).then(response => {
            FileSaver.saveAs(response.data, 'results.csv');
        });
     }

    render() {
        // console.warn(this.props.results);
        return (<div>
            <Row>
                <Col md={{ offset: 8, size: 4}} style={{ textAlign: 'right', paddingRight: 0, paddingBottom: '10px'}}>
                    <Button
                        color="info"
                        size='sm'
                        className={'float-right'}
                        // style={{ marginLeft: '15px' }}
                        title={'Download all results in a CSV file'}
                        outline
                        onClick={this.downloadResults.bind(this, false)}
                    >
                        <FontAwesomeIcon icon="download" /> Download all
                    </Button>
                </Col>
            </Row>
            
            <Row>
            <Table size="sm">
                <thead>
                <tr>
                    <th>Expert Name</th>
                    <th>Score</th>
                    <th style={{width: '20%'}}>Topic Contribution</th>
                    <th style={{width: '20%'}}>Venue Contribution</th>

                </tr>
                </thead>
                <tbody>
                    { this.props.results.docs.map((row, index) => {
                        const aptScore = (parseFloat(row['apt']) * 100).toFixed(1);
                        const apvScore = (parseFloat(row['apv']) * 100).toFixed(1);

                        return <tr key={index}>
                            <td>{row['name']}</td>
                            <td>{parseFloat(row['Score']).toFixed(4) }</td>
                            <td ><Progress value={aptScore} color='info'>{aptScore}%</Progress></td>
                            <td><Progress value={apvScore} color='info'>{apvScore}%</Progress></td>
                        </tr>
                    })
                    }
                </tbody>
            </Table>
            {
                (this.props.results._meta.links.hasNext) &&
                <Row className="">
                    <Button style={{ float: 'none', margin: 'auto' }} color="info" outline
                            size="sm"
                            title="Load more results"
                            onClick={this.props.loadMore.bind(this, this.props.results._meta.page + 1)}>
                        <FontAwesomeIcon icon="angle-double-down" /> Load More
                    </Button>
                </Row>

            }
            </Row>
        </div>);
    }
};

export default ResultsPanel;



