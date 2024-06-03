import React, { useRef, useEffect, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import Papa from 'papaparse';
import * as THREE from 'three';
import './styles.css';

const ForceGraph2DComponent = () => {
    const fgRef = useRef();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());

    useEffect(() => {
        // Function to process CSV data
        const processCSV = (data) => {
            const nodesMap = {};
            const links = data.slice(0, 200).map(row => {
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
    // edit

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

    const getNodeColor = node => {
        switch (node.group) {
            case 'Customer':
                return highlightNodes.has(node.id) ? 'red' : 'blue'; // You can customize colors here
            case 'Part number':
                return highlightNodes.has(node.id) ? 'orange' : 'green'; // Example colors
            case 'Purchase order':
                return highlightNodes.has(node.id) ? 'purple' : 'yellow'; // Example colors
            case 'Sell order':
                return highlightNodes.has(node.id) ? 'cyan' : 'pink'; // Example colors
            case 'Supply':
                return highlightNodes.has(node.id) ? 'brown' : 'teal'; // Example colors
            default:
                return 'gray'; // Default color
        }
    };
    
    const getLinkColor = link => {
        switch (link.type) {
            case 'E BOM':
                return 'darkbrown';
            case 'E Order customer':
                return highlightLinks.has(`${link.source}-${link.target}`) ? 'darkpurple' : 'darkbrown';
            case 'E part number supply order':
                return 'darkgoldenrod';
            case 'E part number sell order':
                return 'darkmagenta';
            case 'E order supply':
                return 'darkyellow';
            default:
                return highlightLinks.has(`${link.source}-${link.target}`) ? 'darkred' : 'black';
        }
    };

    const getNodeShape = node => {
        switch (node.group) {
            case 'Customer':
                return new THREE.Mesh(
                    new THREE.SphereGeometry(5), 
                    new THREE.MeshBasicMaterial({ color: getNodeColor(node) })
                );
            case 'Part number':
                return new THREE.Mesh(
                    new THREE.ConeGeometry(5, 20, 3),
                    new THREE.MeshBasicMaterial({ color: getNodeColor(node) })
                );
            case 'Purchase order':
                return new THREE.Mesh(
                    new THREE.BoxGeometry(10, 10, 10),
                    new THREE.MeshBasicMaterial({ color: getNodeColor(node) })
                );
            case 'Sell order':
                return new THREE.Mesh(
                    new THREE.BoxGeometry(10, 5, 5),
                    new THREE.MeshBasicMaterial({ color: getNodeColor(node) })
                );
            case 'Supply':
                return new THREE.Mesh(
                    new THREE.CylinderGeometry(5, 5, 5, 40), // Changed to cylinder to represent oval
                    new THREE.MeshBasicMaterial({ color: getNodeColor(node) })
                );
            default:
                return new THREE.Mesh(
                    new THREE.SphereGeometry(5),
                    new THREE.MeshBasicMaterial({ color: getNodeColor(node) })
                );
        }
    };

 const renderLegend = () => (
    <div className="legend">
        <ul>
            <h4>Nodes</h4>
            <li>
                <svg width="16" height="16">
                    <circle cx="8" cy="8" r="8" fill="blue" />
                </svg> Customer
            </li>
            <li>
                <svg width="16" height="16">
                    <polygon points="8,0 0,16 16,16" fill="green" />
                </svg> Part number
            </li>
            <li>
                <svg width="16" height="16">
                    <rect width="16" height="16" fill="yellow" />
                </svg> Purchase order
            </li>
            <li>
                <svg width="16" height="16">
                    <rect width="16" height="8" fill="pink" />
                </svg> Sell order
            </li>
            <li>
                <svg width="16" height="16">
                    <ellipse cx="8" cy="8" rx="8" ry="5" fill="teal" />
                </svg> Supply
            </li>
        </ul>
        <h4>Links</h4>
        <ul>
            <li style={{ color: 'darkbrown' }}>E BOM</li>
            <li style={{ color: 'darkpurple' }}>E Order customer</li>
            <li style={{ color: 'darkgoldenrod' }}>E part number supply order</li>
            <li style={{ color: 'darkmagenta' }}>E part number sell order</li>
            <li style={{ color: 'darkyellow' }}>E order supply</li>
            <li style={{ color: 'darkred' }}>Other</li>
        </ul>
    </div>
);

    return (
        <div className="container">
            <div className="graph-container">
                <ForceGraph3D 
                    ref={fgRef}
                    nodeRelSize={8} 
                    graphData={graphData}
                    nodeLabel={node => `${node.id} (${node.group})`}
                    nodeAutoColorBy="group"
                    backgroundColor="WHITE"
                    linkColor={getLinkColor}
                    nodeColor={getNodeColor}
                    linkWidth={3}
                    onNodeHover={handleNodeHover}
                    // onLinkHover={handleLinkHover}
                    width={1350} // Set your desired width here
                    height={600} // Set your desired height here
                    enableZoomInteraction={true} // Enable zoom on wheel scroll
                    nodeThreeObject={getNodeShape}
                />
            </div>
      
            {renderLegend()}
        </div>
    );
};

export default ForceGraph2DComponent;
