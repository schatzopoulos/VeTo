import React, { useEffect } from 'react';
import cytoscape from 'cytoscape/dist/cytoscape.esm';
import coseBilkent from 'cytoscape-cose-bilkent';

import './hin-graph.css'


const HinGraph = props => {
    // props.data: either array of ranking result objects or object of community->array of results objects
    // props.id: DOM id to override the default (default: 'hin-graph')
    let cy = null;

    cytoscape.use(coseBilkent);
    const data = []
    if (props.data) {
        props.data.nodes.forEach(node=>{
            if (node.parent)
                data.push({group:'nodes',data:{id:node.id,label:node.label,value:node.value,parent:node.parent}})
            else
                data.push({group:'nodes',data:{id:node.id,label:node.label,value:node.value}})
        });
        props.data.edges.forEach( ({ source, target, weight }) =>{
            data.push({group:'edges',data:{source, target, id:`e-${source}-${target}`}})
        });
    }
    useEffect(() => {
        const containerDiv = document.getElementById(props.id || 'hin-graph');
        cy = cytoscape({
            container: containerDiv,
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'background-color': '#17a2b8',
                        'font-size': '5px'
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
                        'width': 1,
                        'line-color': '#48c7ea'
                    }
                }
            ],

            elements: data
        });
        cy.ready(() => {
            cy.nodes().forEach(node=>{
                const n = (node.data('value')*30.0);
                const r = 10+Math.round(n);
                node.css('width',r);
                node.css('height',r);
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
