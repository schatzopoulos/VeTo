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

    downloadResults(onlySelected) {
        // if (!onlySelected) {
            axios.get('api/datasets/download', {
                params: {
                    id: this.props.uuid
                },
                responseType: 'blob'
            }).then(response => {
                FileSaver.saveAs(response.data, 'results.csv');
            });
        // } else {
        //     const results = this.props.results[this.state.activeAnalysis];
        //     const headers = results.meta.headers.filter(header => header !== 'resultIndex');
        //     const tsvRows = [headers];
        //     this.state.selectedEntries.forEach(entry => {
        //         const docObject = results.docs.find(doc => doc.resultIndex === entry);
        //         const docRow = headers.map(header => docObject[header]);
        //         tsvRows.push(docRow);
        //     });
        //     const tsvContent = tsvRows.map(e => e.join('\t')).join('\n');
        //     const conditionsBlob = new Blob([tsvContent]);
        //     FileSaver.saveAs(conditionsBlob, 'results.csv');
        // }
    }

    render() {
        // console.warn(this.props.results);
        return (<div>
            <Table size="sm">
                <thead>
                <tr>
                    <th>Expert Name</th>
                    <th>Score</th>
                    <th>Topic Contribution</th>
                    <th>Venue Contribution</th>

                </tr>
                </thead>
                <tbody>
                    { this.props.results.docs.map((row, index) => {
                        const aptScore = (parseFloat(row['apt']) * 100).toFixed(1);
                        const apvScore = (parseFloat(row['apv']) * 100).toFixed(1);

                        return <tr key={index}>
                            <td>{row['name']}</td>
                            <td>{parseFloat(row['Score']).toFixed(4) }</td>
                            <td><Progress value={aptScore} color='info'>{aptScore}%</Progress></td>
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
        </div>);
    }
};

export default ResultsPanel;



