import './ranking-results.scss';

import React from 'react';
import { 
	Row,
	Col,
	Table,
	Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IRankingResultsProps {
	docs: any,
	headers: any,
	hasMore: boolean,
	communityCounts: any,

	loadMore: any,

}

export class RankingResultsPanel extends React.Component<IRankingResultsProps> {

	constructor(props) {
		super(props);
		this.loadMore = this.loadMore.bind(this)
	}

	loadMore() {
		this.props.loadMore();
	}
	render() {
		let prevCommunity = null;
		const rows = this.props.docs.map( (row, index) => {
			return <tr key={index}>
			{
				this.props.headers.map( (fieldName, index2) => {
					const fieldValue = row[fieldName];
					let communityDetails = null;
					if (fieldName === "Community" && prevCommunity !== fieldValue) {
						prevCommunity = fieldValue;
						communityDetails = <span className="small-grey">{`(${this.props.communityCounts[fieldValue]} members)`}</span>;
					}
					return <td key={index2}>{fieldValue} {(communityDetails) && communityDetails}</td>; 
				})
			}
		  </tr>
		});

		return (
			<div>
				<Table size="sm">
					<thead>
						<tr>
							{
								this.props.headers.map( (fieldName, index) => {
									return <th key={index}>{fieldName}</th>;
								})
							}
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</Table>
				{
					(this.props.hasMore) && 
						<Row  className="">
								<Button style={{float: 'none', margin: 'auto' }} color="info" outline size="sm" title="Load more results" onClick={this.loadMore} >
									<FontAwesomeIcon icon="angle-double-down" /> Load More
								</Button>
						</Row>

				}
			</div>
			
		);
	}
};

export default RankingResultsPanel;



