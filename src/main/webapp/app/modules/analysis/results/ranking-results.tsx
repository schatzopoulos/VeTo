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
	hasMore: boolean,

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

		const rows = this.props.docs.map( (row) => {
			return <tr key={row.id}>
			<th scope="row">{row.id}</th>
			<td>{row.name}</td>
			<td>{row.score}</td>
		  </tr>
		});

		return (
			<div>
				<Table size="sm">
					<thead>
						<tr>
							<th>#</th>
							<th>Name</th>
							<th>Score</th>
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



