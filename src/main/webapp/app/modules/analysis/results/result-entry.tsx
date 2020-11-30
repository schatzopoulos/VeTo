import React, { useState } from 'react';

const ResultEntry = (props) => {
    const resultFields = props.values.map((value, index) => {
        return <td key={props.rowIndex + '-' + index}>{value}</td>;
    });
    console.log('ResultEntry.props.showRank: '+props.showRank);
    return (
        <tr key={props.rowIndex} className={props.checked ? 'table-info' : ''}>
            <td>
                <div className={'form-check form-check-inline'}>
                    <input
                        type={'checkbox'}
                        id={`result-checkbox-${props.rowIndex}`}
                        checked={props.checked}
                        className={'form-check-input'}
                        onChange={() => {
                            console.log('ResultEntry: Toggling for index ' + props.rowIndex);
                            props.handleResultSelection([props.rowIndex]);
                        }} />
                    <label className={'form-check-label'} htmlFor={`result-checkbox-${props.rowIndex}`}>{props.showRank?props.rank:''}</label>
                </div>
            </td>
            {resultFields}
        </tr>
    );
};

export default ResultEntry;
