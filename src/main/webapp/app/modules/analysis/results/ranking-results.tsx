import './ranking-results.scss';

import React from 'react';
import { Button, Row, Table } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ResultEntry from './result-entry';

export interface IRankingResultsProps {
    docs: any,
    headers: any,
    hasMore: boolean,
    communityCounts: any,

    loadMore: any,
    handleSelectionChange: any
}

export class RankingResultsPanel extends React.Component<IRankingResultsProps> {

    state = {
        allSelected: false,
        selectedIndices: []
    };

    componentDidUpdate(prevProps: Readonly<IRankingResultsProps>, prevState: Readonly<{}>, snapshot?: any) {
        if ((prevProps.docs.length<this.props.docs.length) && (this.state.allSelected)) {
            this.setState({
                allSelected: false
            });
        }
    }

    handleSelection(selectionIndex) {
        const found = this.state.selectedIndices.indexOf(selectionIndex);
        if (found !== -1) {
            const updatedSelectedIndices = [].concat(this.state.selectedIndices.slice(0, found), this.state.selectedIndices.slice(found + 1));
            this.setState({
                selectedIndices: updatedSelectedIndices
            }, this.props.handleSelectionChange(updatedSelectedIndices));
        } else {
            const updatedSelectedIndices = [...this.state.selectedIndices];
            updatedSelectedIndices.push(selectionIndex);
            updatedSelectedIndices.sort((a,b) => a-b);
            this.setState({
                selectedIndices: updatedSelectedIndices
            }, this.props.handleSelectionChange(updatedSelectedIndices))
        }
    }

    handleMasterSelectionChange() {
        if (this.state.allSelected) {
            this.setState({
                allSelected: false,
                selectedIndices:[]
            }, this.props.handleSelectionChange([]));
        } else {
            const allRowIndices = [...this.props.docs.keys()];
            this.setState({
                allSelected: true,
                selectedIndices: allRowIndices
            }, this.props.handleSelectionChange(allRowIndices));
        }
    }

    render() {
        const rows = this.props.docs.map((row, index) => {
            const rowValues = this.props.headers.map((fieldName, index2) => {
                return row[fieldName];
            });
            return (
                <ResultEntry
                    key={'result-' + index}
                    rowIndex={index}
                    values={rowValues}
                    checked={this.state.selectedIndices.includes(index)}
                    handleRowSelect={this.handleSelection.bind(this)}
                />
            );
        });

        return (
            <div>
                <Table size="sm">
                    <thead>
                    <tr>
                        <th>
                            <div>
                                <input type={'checkbox'} onChange={this.handleMasterSelectionChange.bind(this)} checked={this.state.allSelected}/>
                            </div>
                        </th>
                        {
                            this.props.headers.map((fieldName, index) => {
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
                    <Row className="">
                        <Button style={{ float: 'none', margin: 'auto' }} color="info" outline size="sm"
                                title="Load more results" onClick={this.props.loadMore}>
                            <FontAwesomeIcon icon="angle-double-down" /> Load More
                        </Button>
                    </Row>

                }
            </div>

        );
    }
};

export default RankingResultsPanel;



