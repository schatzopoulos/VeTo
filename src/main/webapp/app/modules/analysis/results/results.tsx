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
    results: any,
    analysis: string,
    analysisId: string,
    loadMore: any,
    rerun: any,
}

export class ResultsPanel extends React.Component<IResultsPanelProps> {
	readonly state: any = { 
        activeAnalysis: "",
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
    }
    downloadResults() {
        axios.get('api/datasets/download', {
            params: {
                analysisType: this.state.activeAnalysis,
                id: this.props.analysisId,
            },
            responseType: 'blob',
        }).then( response => FileSaver.saveAs(response.data, "results.csv"));
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
	render() {
        let resultPanel;

        if (!_.isEmpty(this.props.results)) {
            
            const result = this.props.results[this.state.activeAnalysis];

            resultPanel = (this.state.activeAnalysis) ? <RankingResultsPanel 
                docs={result.docs} 
                headers={result.meta.headers}
                hasMore={result.meta.links.hasNext} 
                loadMore={this.props.loadMore.bind(this, this.state.activeAnalysis, result.meta.page+1)}
            /> : '';

            return (<div>
                <h2>Results</h2>

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
                            if (docs.length === 0) {
                                return <div style={{ textAlign: "center" }}>No results found for the specified query!<br/> 
                                {/* {
                                    (this.props.analysis === 'simjoin' || this.props.analysis === 'simsearch') &&
                                    <span>
                                        Please try again with more loose analysis parameters. <br/>
                                        <Button onClick={this.tryAgain.bind(this)} color='success' size='sm'><FontAwesomeIcon icon="play" />  Try again</Button>
                                    </span>
                                } */}
                                </div>;

                            }
                            return <TabPane tabId={analysis} key={analysis}>
                                <br/>

                                <Row>
                                    <Col md='10' className="small-grey">
                                        Displaying {docs.length} out of {meta.totalRecords} results
                                    </Col>
                                    <Col md='2' style={{textAlign: 'right'}}>
                                        <Button color="info" size='sm' outline onClick={this.downloadResults.bind(this)}><FontAwesomeIcon icon="download" /> Download</Button>
                                    </Col>
                                </Row>
                                <br/>
                                { resultPanel }
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



