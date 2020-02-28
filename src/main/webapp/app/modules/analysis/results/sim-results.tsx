import React from 'react';
import { 
	Row,
	Col,
	Table,
    Button,
    Progress
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface ISimResultsProps {
	docs: any,
	hasMore: boolean,

	loadMore: any,

}

export class SimResultsPanel extends React.Component<ISimResultsProps> {

	constructor(props) {
		super(props);
		this.loadMore = this.loadMore.bind(this)
	}

	loadMore() {
		this.props.loadMore();
	}
	render() {

        const rows = this.props.docs.map( (row) => {
            return <tr key={`${row.src.id}_${row.dest.id}`}>
			<td>{row.src.name}</td>
			<td>{row.dest.name}</td>
			<td><Progress color='info' value={row.score * 100}>{row.score}</Progress></td>
		  </tr>
		});

		return (
			<div>
				<Table size="sm">
					<thead>
						<tr>
							<th>Entity 1</th>
							<th>Entity 2</th>
                            <th>Similarity</th>
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

export default SimResultsPanel;



