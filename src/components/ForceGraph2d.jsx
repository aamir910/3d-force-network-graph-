import React, { useRef, useEffect, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import Papa from 'papaparse';
import * as THREE from 'three';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const predefinedColors = ['red', 'purple', 'orange', 'cyan', 'lime', 'black'];

const customerImage = 'customer.png'; // Replace with the actual path to the customer image

const ForceGraph2DComponent = () => {
    const fgRef = useRef();
    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
    const [colorPicker, setColorPicker] = useState({ visible: false, x: 0, y: 0, type: '' });
    const [nodeColors, setNodeColors] = useState({
        'Customer': 'red',
        'Part number': 'purple',
        'Purchase order': 'orange',
        'Sell order': 'cyan',
        'Supply': 'lime',
        'default': 'black'
    });
    const [linkColors, setLinkColors] = useState({
        "E BOM": 'red',
        "E Order customer": 'purple',
        "E part number supply order": 'orange',
        "E part number sell order": 'cyan',
        "E order supply": 'lime',
        'default': 'black'
    });
    const [selectedLinkType, setSelectedLinkType] = useState('');

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

            const nodes = Object.values(nodesMap);
            setGraphData({ nodes, links });
            
            console.log(links , 'here is the links');
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

    const getNodeColor = node => nodeColors[node.group] || nodeColors.default;

    const getLinkColor = link => linkColors[link.type] || linkColors.default;

    const getNodeShape = node => {
        const color = getNodeColor(node);
       
            switch (node.group) {
                case 'Customer':
                    return new THREE.Mesh(
                        new THREE.SphereGeometry(5),
                        new THREE.MeshBasicMaterial({ color })
                    );
                case 'Part number':
                    return new THREE.Mesh(
                        new THREE.ConeGeometry(5, 20, 3),
                        new THREE.MeshBasicMaterial({ color })
                    );
                case 'Purchase order':
                    return new THREE.Mesh(
                        new THREE.BoxGeometry(10, 10, 10),
                        new THREE.MeshBasicMaterial({ color })
                    );
                case 'Sell order':
                    return new THREE.Mesh(
                        new THREE.BoxGeometry(10, 5, 5),
                        new THREE.MeshBasicMaterial({ color })
                    );
                case 'Supply':
                    return new THREE.Mesh(
                        new THREE.CylinderGeometry(5, 5, 5, 40),
                        new THREE.MeshBasicMaterial({ color })
                    );
                default:
                    return new THREE.Mesh(
                        new THREE.SphereGeometry(5),
                        new THREE.MeshBasicMaterial({ color })
                    );
            }
        
    };

    const renderLegend = () => (
        <div className="legend">
            <ul>
                <h4>Nodes</h4>
                <li onClick={(e) => handleLegendClick('Customer', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <circle cx="8" cy="8" r="8" fill={nodeColors['Customer']} />
                        </svg>
                        <span>Customer</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('Part number', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <polygon points="8,0 0,16 16,16" fill={nodeColors['Part number']} />
                        </svg>
                        <span>Part number</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('Purchase order', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <rect width="16" height="16" fill={nodeColors['Purchase order']} />
                        </svg>
                        <span>Purchase order</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('Sell order', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="8">
                            <rect width="16" height="8" fill={nodeColors['Sell order']} />
                        </svg>
                        <span>Sell order</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('Supply', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <ellipse cx="8" cy="8" rx="8" ry="5" fill={nodeColors['Supply']} />
                        </svg>
                        <span>Supply</span>
                    </div>
                </li>
            </ul>
            <h4>Links</h4>
            <ul>
                <li onClick={(e) => handleLegendClick('E BOM', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <line x1="0" y1="8" x2="16" y2="8" stroke={linkColors['E BOM']} strokeWidth="6" />
                        </svg>
                        <span>E BOM</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('E Order customer', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <line x1="0" y1="8" x2="16" y2="8" stroke={linkColors['E Order customer']} strokeWidth="6" />
                        </svg>
                        <span>E Order customer</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('E part number supply order', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <line x1="0" y1="8" x2="16" y2="8" stroke={linkColors['E part number supply order']} strokeWidth="6" />
                        </svg>
                        <span>E part number supply order</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('E part number sell order', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <line x1="0" y1="8" x2="16" y2="8" stroke={linkColors['E part number sell order']} strokeWidth="6" />
                        </svg>
                        <span>E part number sell order</span>
                    </div>
                </li>
                <li onClick={(e) => handleLegendClick('E order supply', e.clientX, e.clientY)}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <svg width="16" height="16">
                            <line x1="0" y1="8" x2="16" y2="8" stroke={linkColors['E order supply']} strokeWidth="6" />
                        </svg>
                        <span>E order supply</span>
                    </div>
                </li>
            </ul>
        </div>
    );
    

    const handleLegendClick = (type, x, y) => {
        setSelectedLinkType(type);
        setColorPicker({ visible: true, x, y, type });
    };

    const handleColorSelect = (color) => {
        if (selectedLinkType in linkColors) {
            setLinkColors({
                ...linkColors,
                [selectedLinkType]: color
            });
        } else {
            setNodeColors({
                ...nodeColors,
                [colorPicker.type]: color
            });
        }
        setColorPicker({ visible: false, x: 0, y: 0, type: '' });
        setSelectedLinkType(''); // Reset selected link type
    };

    const handleNodeHover = node => {
        if (node) {
            const { x, y, z } = node;
            const canvas = fgRef.current.renderer().domElement;
            const vector = new THREE.Vector3(x, y, z).project(fgRef.current.camera());
            const tooltipX = (vector.x * 0.5 + 0.5) * canvas.width;
            const tooltipY = (-(vector.y * 0.5) + 0.5) * canvas.height;
            if (node.group === 'Customer') {
                // Handle customer node hover differently
                setTooltip({ visible: true, x: tooltipX, y: tooltipY, content: `${node.id} (Customer)` });
            } else {
                setTooltip({ visible: true, x: tooltipX, y: tooltipY, content: `${node.id} (${node.group})` });
            }
        } else {
            setTooltip({ visible: false, x: 0, y: 0, content: '' });
        }
    };
    

    return (
        <div className="container1 ">
            <div className="row graph_legend">
                <div className="col-8">
                    <div className="graph-container">
                        <ForceGraph3D 
                            ref={fgRef}
                            nodeRelSize={8}
                            graphData={graphData}
                            nodeLabel={node => `${node.id}`}
                            nodeAutoColorBy="group"
                            backgroundColor="white"
                            linkColor={getLinkColor}
                            nodeColor={getNodeColor}
                            linkWidth={3}
                            enableZoomInteraction={true}
                            nodeThreeObject={getNodeShape}
                            onNodeHover={handleNodeHover}
                        />
                    </div>
                </div>
                <div className="col-2" style={{ zIndex: 999, marginTop: '45px' }}>
                    {renderLegend()}
                    {colorPicker.visible && (
                        <div
                            style={{
                                position: 'absolute',
                                top: colorPicker.y ,
                                left: colorPicker.x ,
                                backgroundColor: 'white',
                                padding: '5px',
                                border: '1px solid black',
                                borderRadius: '3px',
                                zIndex: 1000,
                                display: 'flex',
                                flexWrap: 'wrap'
                            }}
                        >
                            {predefinedColors.map(color => (
                                <div
                                    key={color}
                                    style={{
                                        backgroundColor: color,
                                        width: '20px',
                                        height: '20px',
                                        margin: '2px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleColorSelect(color)}
                                />
                            ))}
                        </div>
                    )}
                    {tooltip.visible && (
                        <div
                            className="tooltip2"
                            style={{
                                position: 'absolute',
                                top: tooltip.y,
                                left: tooltip.x,
                                backgroundColor: 'black',
                                padding: '5px',
                                border: '1px solid black',
                                borderRadius: '3px',
                                pointerEvents: 'none',
                                color: 'white',
                            }}
                        >
                            {tooltip.content}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForceGraph2DComponent;
