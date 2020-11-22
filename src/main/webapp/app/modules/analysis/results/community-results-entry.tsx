import React, { useState } from 'react';
import _ from 'lodash';
import { Button, Collapse, Card } from 'reactstrap';
import ResultsTable from 'app/modules/analysis/results/results-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import './community-results-entry.css';

const CommunityResultsEntry = props => {
    const MAX_COMMUNITY_DESCRIPTION_LENGTH = 64;
    const [communityCollapsed, toggleCommunity] = useState(true);
    const [focusedSpoilerControl, focusSpoilerControl] = useState(false);
    const communityDescription = _.chain(props.values)
        .map(result => result.Entity)
        .join(', ')
        .truncate({
            length: MAX_COMMUNITY_DESCRIPTION_LENGTH,
            separator: /, +/
        }).value();
    const collapseButtonId = `collapse-control-${props.communityId}`;
    console.log(props.headers);

    return (
        <>
            <tr key={props.communityId} className={props.checked ? 'table-info' : ''}>
                <td>
                    <input
                        type={'checkbox'}
                        checked={props.checked}
                        onChange={() => {
                            props.handleRowSelect(props.rowIndex);
                        }} />
                </td>
                <td>{props.communityId}</td>
                <td>
                    <span>{communityDescription}</span>
                </td>
                <td>
                    {/*<Button size={'sm'} color={'dark'} outline
                            onClick={() => toggleCommunity(!communityCollapsed)}>Expand</Button>*/}
                    <div
                        onClick={() => toggleCommunity(!communityCollapsed)}
                        onMouseEnter={() => focusSpoilerControl(true)}
                        onMouseLeave={() => focusSpoilerControl(false)}
                        className={'spoiler-control' + (communityCollapsed ? '' : ' expanded') + (focusedSpoilerControl ? ' text-info' : '')}
                    ><span><FontAwesomeIcon icon={faCaretDown} /></span>
                    </div>
                </td>
            </tr>
            <tr className={communityCollapsed ? 'hidden-table-row' : 'hidden-table-row expanded'}>
                <td colSpan={4}>
                    {/*<div className={communityCollapsed?'spoiler-container': 'spoiler-container expanded'}>*/}
                    <Collapse isOpen={!communityCollapsed}>
                        <ResultsTable
                            docs={props.values}
                            headers={props.headers}
                            communityView={false}
                            innerTable={true}
                            handleSelectionChange={() => {
                            }}
                        />
                        {/*</div>*/}
                    </Collapse>
                </td>
            </tr>
        </>
    );
};

export default CommunityResultsEntry;
