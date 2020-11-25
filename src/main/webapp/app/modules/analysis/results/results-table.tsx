import './ranking-results.scss';

import React, { useRef } from 'react';
import _ from 'lodash';
import { Table } from 'reactstrap';
import ResultEntry from './result-entry';
import CommunityResultsEntry from 'app/modules/analysis/results/community-results-entry';

export interface IResultsTableProps {
    docs: any,
    headers: any,
    communityView: boolean,
    selections: any,
    innerTable?: boolean,

    handleSelectionChange: any
}

export class ResultsTable extends React.Component<IResultsTableProps> {

    tableCheckboxRef=null;
    state = {
        allSelected: false,
        selectedIndices: []
    };

    constructor(props) {
        super(props);
        this.tableCheckboxRef=React.createRef();
    }

    componentDidUpdate(prevProps: Readonly<IResultsTableProps>, prevState: Readonly<{}>, snapshot?: any) {
        if ((prevProps.docs.length < this.props.docs.length) && (this.state.allSelected)) {
            this.setState({
                allSelected: false
            });
        }


        if (this.tableCheckboxRef.current) {
            this.tableCheckboxRef.current.indeterminate=(!(this.props.selections.length===this.props.docs.length) && this.props.selections.length>0);
        }
    }

    toggleSelected(selections) {
        console.log('ResultsTable' + (this.props.communityView ? '(Community)' : '') + ': Got triggered selections: ' + selections.join(', '));
        this.props.handleSelectionChange(_.difference(_.union(selections, this.props.selections), _.intersection(selections, this.props.selections)));
    }

    handleMasterSelectionChange() {
        if (this.props.selections.length === this.props.docs.length) {
            this.props.handleSelectionChange([]);
        } else {
            this.props.handleSelectionChange(_.map(this.props.docs, doc => doc.resultIndex));
        }
    }

    render() {
        let rows;
        const tableHeaders=this.props.communityView?['Community','Members']:this.props.headers;
        console.log('Table headers: '+this.props.headers.join(', '));
        console.log('Selecting results with index: ' + this.props.selections.join(', '));
        if (!this.props.communityView) {
            rows = this.props.docs.map((row, index) => {
                const rowValues = this.props.headers.map(fieldName => {
                    return row[fieldName];
                });
                return (
                    <ResultEntry
                        key={'result-' + row.resultIndex}
                        rowIndex={row.resultIndex}
                        values={rowValues}
                        checked={this.props.selections.includes(row.resultIndex)}
                        handleResultSelection={this.toggleSelected.bind(this)}
                    />
                );
            });
        } else {
            rows = _.map(_.values(_.groupBy(this.props.docs, result => result.Community)), communityGroup => {
                const communityIndices = _.map(communityGroup, member => member.resultIndex);
                return (
                    <CommunityResultsEntry
                        key={communityGroup[0].Community}
                        communityId={communityGroup[0].Community}
                        headers={_.without(this.props.headers, 'Community')}
                        docs={communityGroup}
                        selectedCommunityMembers={_.intersection(this.props.selections,communityIndices)}
                        handleToggledCommunityMembers={this.toggleSelected.bind(this)}
                    />
                );
            });
        }

        return (
            <Table size="sm">
                <thead>
                <tr className={(!this.props.innerTable && (this.props.selections.length === this.props.docs.length))? 'bg-info' : ''}>
                    <th>
                        <div>
                            {!this.props.innerTable &&
                            <input
                                type={'checkbox'}
                                onChange={this.handleMasterSelectionChange.bind(this)}
                                checked={this.props.selections.length === this.props.docs.length}
                                ref={this.tableCheckboxRef}/>
                            }
                        </div>
                    </th>
                    {
                        tableHeaders.map((fieldName, index) => {
                            return <th key={`header-${index}-${fieldName}`}>{fieldName}</th>;
                        })
                    }
                    {
                        this.props.communityView &&
                        <th></th>
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



