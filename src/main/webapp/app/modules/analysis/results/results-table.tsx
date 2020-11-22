import './ranking-results.scss';

import React from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import ResultEntry from './result-entry';
import CommunityResultsEntry from 'app/modules/analysis/results/community-results-entry';

export interface IResultsTableProps {
    docs: any,
    headers: any,
    communityView: boolean,
    innerTable?:boolean,

    handleSelectionChange: any
}

export class ResultsTable extends React.Component<IResultsTableProps> {

    state = {
        allSelected: false,
        selectedIndices: []
    };

    componentDidUpdate(prevProps: Readonly<IResultsTableProps>, prevState: Readonly<{}>, snapshot?: any) {
        if ((prevProps.docs.length < this.props.docs.length) && (this.state.allSelected)) {
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
                selectedIndices: updatedSelectedIndices,
                allSelected: false
            }, this.props.handleSelectionChange(updatedSelectedIndices));
        } else {
            const updatedSelectedIndices = [...this.state.selectedIndices];
            updatedSelectedIndices.push(selectionIndex);
            updatedSelectedIndices.sort((a, b) => a - b);
            this.setState({
                allSelected: updatedSelectedIndices.length === this.props.docs.length,
                selectedIndices: updatedSelectedIndices
            }, this.props.handleSelectionChange(updatedSelectedIndices));
        }
    }

    handleMasterSelectionChange() {
        if (this.state.allSelected) {
            this.setState({
                allSelected: false,
                selectedIndices: []
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
        let rows;
        if (!this.props.communityView) {
            rows = this.props.docs.map((row, index) => {
                const rowValues = this.props.headers.map(fieldName => {
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
        } else {
            rows=_.map(_.values(_.groupBy(this.props.docs,result=>result.Community)),communityGroup=>
                <CommunityResultsEntry
                    key={communityGroup[0].Community}
                    communityId={communityGroup[0].Community}
                    headers={_.without(this.props.headers,'Community')}
                    values={communityGroup}
                    checked={false}
                    handleRowSelect={this.handleSelection.bind(this)}
                />
            );
        }

        return (
            <Table size="sm" className={this.props.innerTable? 'table-active':''}>
                <thead>
                <tr className={this.state.allSelected ? 'table-primary' : ''}>
                    <th>
                        <div>
                            {!this.props.innerTable &&
                            <input type={'checkbox'} onChange={this.handleMasterSelectionChange.bind(this)}
                                checked={this.state.allSelected} />
                            }
                        </div>
                    </th>
                    {
                        this.props.headers.map((fieldName, index) => {
                            return <th key={`header-${index}-${fieldName}`}>{fieldName}</th>;
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
};

export default ResultsTable;



