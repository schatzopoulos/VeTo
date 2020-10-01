import React from 'react';
import { Button } from 'reactstrap';

import './entity-box.css';

const EntityBox = (props) => {
    return (
        <div className="position-relative entity-box">
            <div>
                <Button color="dark" size="lg" disabled>{props.label}</Button>
            </div>
        </div>
    );
}

export default EntityBox;
{/* <div class="position-relative">
    <div>
        <button type="button" class="btn btn-dark">Topic</button>
    </div>
    <div class="position-absolute">
        <button type="button" class="btn btn-warning btn-sm btn-circle">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-funnel-fill text-white"
                fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
            </svg>
        </button>
        <button type="button" class="btn btn-info btn-sm btn-circle">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-key-fill" fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                    d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
        </button>
    </div>
</div> */}