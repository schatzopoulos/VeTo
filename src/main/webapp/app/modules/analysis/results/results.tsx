import React from 'react';
import { 
	Row,
	Col,
	Table,
	Button,
} from 'reactstrap';
import RankingResultsPanel from './ranking-results';
import SimResultsPanel from './sim-results';
export interface IResultsPanelProps {
    docs: any,
    meta: any,
	analysis: string,
	loadMore: any,
}

export class ResultsPanel extends React.Component<IResultsPanelProps> {

	constructor(props) {
        super(props);
	}

	render() {
        let resultPanel;

        if (this.props.docs) {

            if (this.props.docs.length === 0) {
                return <div style={{ textAlign: "center" }}>No results found for the specified query</div>;
            }

            if (this.props.analysis === 'ranking') {
                resultPanel = <RankingResultsPanel 
                    docs={this.props.docs} 
                    hasMore={this.props.meta.links.hasNext} 
                    loadMore={this.props.loadMore.bind(this)}
                />;
            } else {
                resultPanel = <SimResultsPanel 
                    docs={this.props.docs} 
                    hasMore={this.props.meta.links.hasNext} 
                    loadMore={this.props.loadMore.bind(this)}
                />;
            }
            return (<div>
                <h2>Results</h2>
                <div className="small-grey">
                    Displaying {this.props.docs.length} out of {this.props.meta.totalRecords} results
                </div>
                <br/>
                { resultPanel }
            </div>);

        } 
        return '';
		
	}
};

export default ResultsPanel;



