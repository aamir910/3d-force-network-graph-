import React, { useRef, useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import Papa from 'papaparse';
import './styles.css'
const ForceGraph2DComponent = () => {
    const fgRef = useRef();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());

    useEffect(() => {
        // Function to process CSV data
        const processCSV = (data) => {
            const nodesMap = {};
            const links = data.slice(0, 5000).map(row => {
                const { Entity_1, Entity_2, Entity_Type_1, Entity_Type_2, Edge_Type } = row;
                
                if (!nodesMap[Entity_1]) {
                    nodesMap[Entity_1] = { id: Entity_1, group: Entity_Type_1 };
                }
                if (!nodesMap[Entity_2]) {
                    nodesMap[Entity_2] = { id: Entity_2, group: Entity_Type_2 };
                }

                return { source: Entity_1, target: Entity_2, type: Edge_Type };
            });
            const uniqueLinkTypes = [...new Set(links.map(link => link.type))];
            console.log('Unique link types:', uniqueLinkTypes);
            const nodes = Object.values(nodesMap);
            setGraphData({ nodes, links });
        };

        // Fetch and parse the CSV file
        Papa.parse('/Edges_orderd_data.csv', {
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
    const getLinkColor = link => {
        switch (link.type) {
            case 'E BOM':
                return 'brown';
            case 'E Order customer':
                return highlightLinks.has(`${link.source}-${link.target}`) ? 'purple' : 'brown';
            case 'E part number supply order':
                return 'lightyellow';
            case 'E part number sell order':
                return 'lightpurple';
            case 'E order supply':
                return 'yellow';
            default:
                return highlightLinks.has(`${link.source}-${link.target}`) ? 'red' : 'black';
        }
    };
    
    return (
        <>
       
      
        <div className="container">
          <div className="graph-container">
            <ForceGraph2D 
              ref={fgRef}
              nodeRelSize={15} 
              graphData={graphData}
              nodeLabel={node => `${node.id} (${node.group})`}
              nodeAutoColorBy="group"
              backgroundColor="black"
              linkColor={getLinkColor}
              nodeColor={getNodeColor}
              linkWidth={2}
              
              onNodeHover={handleNodeHover}
            //   onLinkHover={handleLinkHover}
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
