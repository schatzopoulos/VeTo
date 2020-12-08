import React, { useEffect } from 'react';
import cytoscape from 'cytoscape/dist/cytoscape.esm';
import coseBilkent from 'cytoscape-cose-bilkent';

import './hin-graph.css'


const HinGraph = props => {
    // props.data: either array of ranking result objects or object of community->array of results objects
    // props.id: DOM id to override the default (default: 'hin-graph')
    let cy = null;

    cytoscape.use(coseBilkent);

    useEffect(() => {
        const containerDiv = document.getElementById(props.id || 'hin-graph');
        cy = cytoscape({
            container: containerDiv,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(id)',
                        'background-color': '#17a2b8'
                    }
                },

                {
                    selector: ':parent',
                    style: {
                        'background-opacity': 0.333
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#17a2b8'
                    }
                }
            ],

            elements: [
                { group: 'nodes', data: { id: 'node0', parent: 'supernode0' } },
                { group: 'nodes', data: { id: 'node1', parent: 'supernode1' } },
                { group: 'nodes', data: { id: 'node2', parent: 'supernode1' } },
                { group: 'nodes', data: { id: 'supernode0' } },
                { group: 'nodes', data: { id: 'node3' } },
                { group: 'nodes', data: { id: 'node4' } },
                { group: 'nodes', data: { id: 'node5', parent: 'supernode0' } },
                { group: 'nodes', data: { id: 'supernode1' } },
                { group: 'nodes', data: { id: 'node6', parent: 'supernode0' } },
                { group: 'nodes', data: { id: 'node7', parent: 'supernode1', label: 'nikos' } },
                { group: 'edges', data: { id: 'e0', source: 'node0', target: 'node3' } },
                { group: 'edges', data: { id: 'e1', source: 'node1', target: 'node2' } },
                { group: 'edges', data: { id: 'e2', source: 'node5', target: 'node7' } },
                { group: 'edges', data: { id: 'e3', source: 'node5', target: 'node6' } },
                { group: 'edges', data: { id: 'e4', source: 'node0', target: 'node3' } },
                { group: 'edges', data: { id: 'e5', source: 'node4', target: 'node3' } }
            ]
        });
        cy.ready(() => {
            cy.nodes().forEach(node=>{
                node.css('width',50);
                node.css('height',50);
            });
            cy.layout({name: 'cose-bilkent', animationDuration: 1000}).run();
        });
        return ()=>{
            cy.unmount();
        }
    },[]);

    return (
        <div className={'hin-graph'} id={props.id || 'hin-graph'}/>
    );
};

export default HinGraph;
