import React from 'react';
import {
	Row,
	Col,
	Table,
	Button,
} from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, CardTitle, CardText } from 'reactstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RankingResultsPanel from './ranking-results';
import SimResultsPanel from './sim-results';
import axios from 'axios';
import FileSaver from 'file-saver';
import  _  from 'lodash';

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
        activeAnalysis: "",
        selectedEntries: []
    };

	constructor(props) {
        super(props);
    }
    componentDidUpdate(prevProps) {

        if (this.state.activeAnalysis === "" && !_.isEmpty(this.props.results)) {
            this.setState({
                activeAnalysis: Object.keys(this.props.results)[0]
            });
        }

        // new analysis, reset state
        if (prevProps.uuid !== this.props.uuid) {
            this.setState({
                activeAnalysis: ""
            });
        }
    }

    downloadResults() {
        axios.get('api/datasets/download', {
            params: {
                analysisType: this.state.activeAnalysis,
                id: this.props.analysisId,
            },
            responseType: 'blob',
        }).then( response =>{
            console.log(response.data);
            FileSaver.saveAs(response.data, "results.csv")
        });
    }

    downloadConditions() {
        const results=this.props.results[this.state.activeAnalysis]
        const conditionValues={};
        this.state.selectedEntries.forEach((entry, index)=>{
            const entryValue = entry[results.meta.headers[0]]
            if (!Object.prototype.hasOwnProperty.call(conditionValues,entryValue)) {
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
        const jsonArray = Object.keys(conditionValues).map(key=>conditionValues[key]);
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
	    const selectedEntries = selections.map(selectionIndex=>{
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

            resultPanel = (this.state.activeAnalysis) ? <RankingResultsPanel
                docs={result.docs}
                headers={result.meta.headers}
                hasMore={result.meta.links.hasNext}
                communityCounts={result.meta.community_counts}
                loadMore={this.props.loadMore.bind(this, this.state.activeAnalysis, result.meta.page+1)}
                handleSelectionChange={this.handleSelectionChange.bind(this)}
            /> : '';

            const totalCommunities = (_.get(result, "meta.community_counts")) ? <span>/ {result.meta.community_counts['total']} communities found in total</span> : '';
            return (<div>
                <h2>Results</h2>
                <p>{this.props.description}</p>
                <Nav tabs>
                {
                    _.map(this.props.results, ({docs, meta}, analysis) => {
                        return <NavItem key={analysis}>
                        <NavLink
                           className={classnames({ active: this.state.activeAnalysis === analysis })}
                           onClick={this.toggle.bind(this, analysis)}
                        >
                            { analysis }
                        </NavLink>
                    </NavItem>
                    })
                }

                </Nav>
                <TabContent activeTab={this.state.activeAnalysis}>
                    {
                        _.map(this.props.results, ({docs, meta}, analysis) => {

                            return <TabPane tabId={analysis} key={analysis}>
                            {
                                    (docs.length === 0) ?
                                        <div key={analysis} style={{ textAlign: "center" }}>No results found for the specified query!<br/>
                                        {/* {
                                            (this.props.analysis === 'simjoin' || this.props.analysis === 'simsearch') &&
                                            <span>
                                                Please try again with more loose analysis parameters. <br/>
                                                <Button onClick={this.tryAgain.bind(this)} color='success' size='sm'><FontAwesomeIcon icon="play" />  Try again</Button>
                                            </span>
                                        } */}
                                        </div>

                                : <div>
                                    <br/>

                                    <Row>
                                        <Col md={this.state.selectedEntries.length>0 ? '6':'10'} className="small-grey">
                                            Displaying {docs.length} out of {meta.totalRecords} results { totalCommunities }
                                        </Col>
                                        {(this.state.selectedEntries.length > 0) &&
                                        <Col md={'4'}>
                                            <Button color={'info'} size={'sm'} className={'text-nowrap'} outline onClick={this.downloadConditions.bind(this)} ><FontAwesomeIcon icon="download" /> Download conditions file</Button>
                                        </Col>
                                        }
                                        <Col md='2' style={{textAlign: 'right'}}>
                                            <Button color="info" size='sm' className={'text-nowrap'} outline onClick={this.downloadResults.bind(this)}><FontAwesomeIcon icon="download" /> Download</Button>
                                        </Col>
                                    </Row>
                                    <br/>
                                    { resultPanel }
                                </div>
                            }
                            </TabPane>
                        })
                    }
                </TabContent>
            </div>);
        }
        return '';

	}
};

export default ResultsPanel;



