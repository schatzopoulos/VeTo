import React from 'react';
import { Button, ButtonGroup, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ResultsTable from './results-table';
import axios from 'axios';
import FileSaver from 'file-saver';
import _ from 'lodash';

export interface IResultsPanelProps {
    uuid: any,
    description: string,
    results: any,
    analysis: string,
    analysisId: string,
    loadMore: any,
    rerun: any,
}

export class ResultsPanel extends React.Component<IResultsPanelProps> {
    readonly state: any = {
        activeAnalysis: '',
        selectedEntries: []
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {

        if (this.state.activeAnalysis === '' && !_.isEmpty(this.props.results)) {
            this.setState({
                activeAnalysis: Object.keys(this.props.results)[0]
            });
        }

        // new analysis, reset state
        if (prevProps.uuid !== this.props.uuid) {
            this.setState({
                activeAnalysis: ''
            });
        }
    }

    downloadResults() {
        axios.get('api/datasets/download', {
            params: {
                analysisType: this.state.activeAnalysis,
                id: this.props.analysisId
            },
            responseType: 'blob'
        }).then(response => {
            console.log(response.data);
            FileSaver.saveAs(response.data, 'results.csv');
        });
    }

    downloadConditions() {
        const results = this.props.results[this.state.activeAnalysis];
        const conditionValues = {};
        this.state.selectedEntries.forEach((entry, index) => {
            const entryValue = entry[results.meta.headers[0]];
            if (!Object.prototype.hasOwnProperty.call(conditionValues, entryValue)) {
                if (index > 0) {
                    conditionValues[entryValue] = {
                        logicOp: 'or',
                        operation: '=',
                        value: entryValue
                    };
                } else {
                    conditionValues[entryValue] = {
                        operation: '=',
                        value: entryValue
                    };
                }
            }
        });
        const jsonArray = Object.keys(conditionValues).map(key => conditionValues[key]);
        const jsonArrayString = JSON.stringify(jsonArray, null, 4);
        const conditionsBlob = new Blob([jsonArrayString]);
        FileSaver.saveAs(conditionsBlob, 'conditions.json');
    }

    tryAgain() {
        this.props.rerun(null, this.props.analysis);
    }

    toggle(analysis) {
        if (this.state.activeAnalysis !== analysis) {
            this.setState({
                activeAnalysis: analysis
            });
        }
    }

    handleSelectionChange(selections) {
        const result = this.props.results[this.state.activeAnalysis];
        const selectedEntries = selections.map(selectionIndex => {
            return result.docs[selectionIndex];
        });
        this.setState({
            selectedEntries
        });
    }

    render() {
        let resultPanel;

        if (!_.isEmpty(this.props.results)) {

            const result = this.props.results[this.state.activeAnalysis];
            console.log(result);
            if (this.state.activeAnalysis) {
                if (this.state.activeAnalysis === 'Ranking') {
                    resultPanel = <ResultsTable
                        docs={result.docs}
                        headers={result.meta.headers}
                        communityView={false}
                        handleSelectionChange={this.handleSelectionChange.bind(this)}
                    />;
                } else if (this.state.activeAnalysis === 'Community Detection' || this.state.activeAnalysis === 'Community Detection - Ranking') {
                    resultPanel = <ResultsTable
                        docs={result.docs}
                        headers={result.meta.headers}
                        communityView={true}
                        handleSelectionChange={this.handleSelectionChange.bind(this)}
                    />;
                } else {
                    resultPanel = '';
                }
            } else {
                resultPanel = '';
            }

            const totalCommunities = (_.get(result, 'meta.community_counts')) ?
                <span> / {result.meta.community_counts['total']} communities found in total</span> : '';
            console.log(result);
            return (<div>
                <h2>Results</h2>
                <p>{this.props.description}</p>
                <Nav tabs>
                    {
                        _.map(this.props.results, ({ docs, meta }, analysis) => {
                            return <NavItem key={analysis}>
                                <NavLink
                                    className={classnames({ active: this.state.activeAnalysis === analysis })}
                                    onClick={this.toggle.bind(this, analysis)}
                                >
                                    {analysis}
                                </NavLink>
                            </NavItem>;
                        })
                    }

                </Nav>
                <TabContent activeTab={this.state.activeAnalysis}>
                    {
                        _.map(this.props.results, ({ docs, meta }, analysis) => {

                            return <TabPane tabId={analysis} key={analysis}>
                                {
                                    (docs.length === 0) ?
                                        <div key={analysis} style={{ textAlign: 'center' }}>No results found for the
                                            specified query!<br />
                                            {/* {
                                            (this.props.analysis === 'simjoin' || this.props.analysis === 'simsearch') &&
                                            <span>
                                                Please try again with more loose analysis parameters. <br/>
                                                <Button onClick={this.tryAgain.bind(this)} color='success' size='sm'><FontAwesomeIcon icon="play" />  Try again</Button>
                                            </span>
                                        } */}
                                        </div>

                                        : <div>
                                            <br />

                                            <Row>
                                                <Col xs={'12'} lg={'6'}
                                                     className="small-grey">
                                                    Displaying {docs.length} out
                                                    of {meta.totalRecords} results{totalCommunities}{this.state.selectedEntries.length>0?`. (${this.state.selectedEntries.length} selected)`:''}
                                                </Col>
                                                <Col xs={'12'} lg={'6'} className={'text-lg-right'}>
                                                    {(this.state.selectedEntries.length > 0) &&
                                                    <ButtonGroup>
                                                        <Button
                                                            size={'sm'}
                                                            className={'text-nowrap'}
                                                            title={'Create a conditions JSON file from selected entities'}
                                                            outline
                                                            onClick={this.downloadConditions.bind(this)}
                                                        >Create conditions file</Button>
                                                        <Button
                                                            size={'sm'}
                                                            className={'text-nowrap'}
                                                            title={'Download a CSV file containing the results for the selected entities'}
                                                            outline
                                                        >Download selected</Button>
                                                    </ButtonGroup>
                                                    }
                                                    <Button
                                                        color="info"
                                                        size='sm'
                                                        className={'text-nowrap'}
                                                        style={{marginLeft:'15px'}}
                                                        title={'Download all results in a CSV file'}
                                                        outline
                                                        onClick={this.downloadResults.bind(this)}
                                                    ><FontAwesomeIcon icon="download" /> Download all</Button>
                                                </Col>
                                            </Row>
                                            <br />
                                            {resultPanel}
                                            {
                                                (result && result.meta.links.hasNext) &&
                                                <Row className="">
                                                    <Button style={{ float: 'none', margin: 'auto' }} color="info" outline
                                                            size="sm"
                                                            title="Load more results"
                                                            onClick={this.props.loadMore.bind(this, this.state.activeAnalysis, result.meta.page + 1)}>
                                                        <FontAwesomeIcon icon="angle-double-down" /> Load More
                                                    </Button>
                                                </Row>

                                            }
                                        </div>
                                }
                            </TabPane>;
                        })
                    }
                </TabContent>
            </div>);
        }
        return '';

    }
};

export default ResultsPanel;



