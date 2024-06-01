import React, { useRef, useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import Papa from 'papaparse';

const ForceGraph2DComponent = () => {
    const fgRef = useRef();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());

    useEffect(() => {
        // Function to process CSV data
        const processCSV = (data) => {
            const nodesMap = {};
            const links = data.slice(0, 500).map(row => {
                const { Entity_1, Entity_2, Entity_Type_1, Entity_Type_2, Edge_Type } = row;
                
                if (!nodesMap[Entity_1]) {
                    nodesMap[Entity_1] = { id: Entity_1, group: Entity_Type_1 };
                }
                if (!nodesMap[Entity_2]) {
                    nodesMap[Entity_2] = { id: Entity_2, group: Entity_Type_2 };
                }

                return { source: Entity_1, target: Entity_2, type: Edge_Type };
            });

            const nodes = Object.values(nodesMap);
            setGraphData({ nodes, links });
        };

        // Fetch and parse the CSV file
        Papa.parse('/Edges.csv', {
            download: true,
            header: true,
            complete: (result) => {
                processCSV(result.data);
            },
            error: (error) => {
                console.error("Error reading CSV file:", error);
            }
        });
    }, []);

    useEffect(() => {
        const fg = fgRef.current;
        if (fg) {
            fg.d3Force('link').distance(link => 100); // You can customize the distance
        }
    }, [graphData]);

    const handleNodeHover = node => {
        const nodeId = node ? node.id : null;
        setHighlightNodes(node ? new Set([nodeId]) : new Set());
    };

    const handleLinkHover = link => {
        const linkId = link ? `${link.source}-${link.target}` : null;
        setHighlightLinks(link ? new Set([linkId]) : new Set());
    };

    const getNodeColor = node => highlightNodes.has(node.id) ? 'red' : 'blue';
    const getLinkColor = link => link.type === 'E BOM' ? 'yellow' : highlightLinks.has(`${link.source}-${link.target}`) ? 'red' : 'black';

    return (
        <>
        <style>{`
          .container {
            display: flex;
            flex-direction: row;
            align-items: center; /* Align items horizontally at the center */
          }
      
          .graph-container {
            margin-bottom: 20px; /* Add some margin between the graph and the div */
          }
          .legend{
            border :2px solid black ;
            border-radius: 15px;
            margin: 4px ;
            right:0;
          }
        `}</style>
      
        <div className="container">
          <div className="graph-container">
            <ForceGraph2D 
              ref={fgRef}
              graphData={graphData}
              nodeLabel={node => `${node.id} (${node.group})`}
              nodeAutoColorBy="group"
              backgroundColor="#ffffff"
              linkColor={getLinkColor}
              nodeColor={getNodeColor}
              linkWidth={2}
              onNodeHover={handleNodeHover}
              onLinkHover={handleLinkHover}
              width={900} // Set your desired width here
              height={500} // Set your desired height here
            />
          </div>
      
          <div className='legend'>
            <ul> 
              <li>part number</li>
            </ul>
          </div>
        </div>
      </>
      
    );
};

export default ForceGraph2DComponent;
