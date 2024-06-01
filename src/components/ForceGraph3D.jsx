import React, { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';

const generateGraphData = (numNodes) => {
    const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: `Node ${i}`, group: Math.floor(Math.random() * 10) }));
    const links = Array.from({ length: numNodes }, () => ({
        source: `Node ${Math.floor(Math.random() * numNodes)}`,
        target: `Node ${Math.floor(Math.random() * numNodes)}`,
        distance: Math.floor(Math.random() * 200) + 50,
    }));

    return { nodes, links };
};

const ForceGraph3DComponent = () => {
    const fgRef = useRef();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });

    useEffect(() => {
        setGraphData(generateGraphData(500)); // Change 500 to the desired number of nodes
    }, []);

    useEffect(() => {
        const fg = fgRef.current;
        if (fg) {
            fg.d3Force('link').distance(link => link.distance);
        }
    }, [graphData]);

    return (
        <ForceGraph3D
            ref={fgRef}
            graphData={graphData}
            nodeLabel="id"
            nodeAutoColorBy="group"
            backgroundColor="#ffffff" // Set background color to white
            linkColor={() => '#000000'} // Set link color to black
        />
    );
};

export default ForceGraph3DComponent;
