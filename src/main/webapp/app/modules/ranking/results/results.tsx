import React from 'react';
import { 
	Row,
	Col,
	Table,
} from 'reactstrap';

export interface IRankingResultsProps {
	docs: any,
}

export class RankingResultsPanel extends React.Component<IRankingResultsProps> {

	render() {

		const rows = this.props.docs.map( (row) => {
			return <tr key={row.id}>
			<th scope="row">{row.id}</th>
			<td>{row.name}</td>
			<td>{row.score}</td>
		  </tr>
		});

		return (
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
		);
	}
};

export default RankingResultsPanel;



