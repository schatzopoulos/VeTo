import React, { useState } from 'react';

const ResultEntry = (props) => {
    const resultFields = props.values.map((value, index) => {
        return <td key={props.rowIndex + '-' + index}>{value}</td>;
    });

    return (
        <tr key={props.rowIndex} className={props.checked ? 'table-info' : ''}>
            <td>
                <input
                    type={'checkbox'}
                    id={'some-id'}
                    checked={props.checked}
                    onChange={()=>{
                        console.log('ResultEntry: Toggling for index '+props.rowIndex);
                        props.handleResultSelection([props.rowIndex]);
                    }}/>
            </td>
            {resultFields}
        </tr>
    );
};

export default ResultEntry;
