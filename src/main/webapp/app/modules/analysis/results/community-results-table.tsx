import React from 'react';
import { Button, UncontrolledCollapse } from 'reactstrap';

class CommunityResultsTable extends React.Component<any, any> {
    state={
        expanded: false
    }

    handleCollapser(e) {
        console.log(e);
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
        const buttonId=`community-${this.props.communityId}-toggle`;
        return (
            <tr key={this.props.communityId} className={this.props.checked ? 'table-info' : ''}>
                <td>
                    <input type="checkbox" />
                </td>
                <td>
                    <Button color={'info'} size={'sm'} id={buttonId} block outline>Community {this.props.communityId}</Button>
                    <UncontrolledCollapse toggler={`#${buttonId}`}>
                        {/*<Table size="sm">*/}
                        {/*    <tbody>*/}
                        {/*    {rows}*/}
                        {/*    </tbody>*/}
                        {/*</Table>*/}
                    </UncontrolledCollapse>
                </td>
            </tr>
        );
    }
}

export default CommunityResultsTable;
