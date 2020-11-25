import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import { Button, Collapse, Card } from 'reactstrap';
import ResultsTable from 'app/modules/analysis/results/results-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import './community-results-entry.css';

const CommunityResultsEntry = props => {
    const MAX_COMMUNITY_DESCRIPTION_LENGTH = 64;
    const communityMembersIndices = _.map(props.docs, doc=>doc.resultIndex);
    const wholeCommunitySelected = props.selectedCommunityMembers.length === props.docs.length;
    const [communityCollapsed, toggleCommunity] = useState(true);
    const [focusedSpoilerControl, focusSpoilerControl] = useState(false);
    const communityCheckboxRef=useRef();
    console.log('Selecting community members with indices: '+props.selectedCommunityMembers.join(', '));
    const communityDescription = _.chain(props.docs)
        .map(result => result.Entity)
        .join(', ')
        .truncate({
            length: MAX_COMMUNITY_DESCRIPTION_LENGTH,
            separator: /, +/
        }).value();
    useEffect(()=>{
        if (communityCheckboxRef.current) {
            communityCheckboxRef.current.indeterminate = (!wholeCommunitySelected && props.selectedCommunityMembers.length > 0)
        }
    })
    return (
        <>
            <tr key={props.communityId} className={wholeCommunitySelected? 'table-info' : ''}>
                <td>
                    <input
                        type={'checkbox'}
                        checked={wholeCommunitySelected}
                        ref={communityCheckboxRef}
                        onChange={() => {
                            props.handleToggledCommunityMembers(wholeCommunitySelected?props.selectedCommunityMembers:_.difference(communityMembersIndices,props.selectedCommunityMembers));
                        }} />
                </td>
                <td>{props.communityId}</td>
                <td>
                    <span>{communityDescription}</span>
                </td>
                <td>
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
                    <Collapse isOpen={!communityCollapsed}>
                        <ResultsTable
                            docs={props.docs}
                            headers={props.headers}
                            communityView={false}
                            innerTable={true}
                            selections={props.selectedCommunityMembers}
                            handleSelectionChange={toggledCommunityMembers => {
                                console.log('CommunityResultsEntry: Got currently selected community member indices: '+toggledCommunityMembers.join(', '))
                                props.handleToggledCommunityMembers(_.difference(_.union(toggledCommunityMembers,props.selectedCommunityMembers),_.intersection(toggledCommunityMembers,props.selectedCommunityMembers)));
                            }}
                        />
                    </Collapse>
                </td>
            </tr>
        </>
    );
};

export default CommunityResultsEntry;
