import React, { useRef, useEffect, useState } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import Papa from 'papaparse';
import * as THREE from 'three';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const predefinedColors = ['red', 'purple', 'orange', 'cyan', 'lime', 'black'];

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

    const getLinkColor = link => {
        switch (link.type) {
            case 'E BOM':
                return 'darkbrown';
            case 'E Order customer':
                return 'darkpurple';
            case 'E part number supply order':
                return 'darkgoldenrod';
            case 'E part number sell order':
                return 'darkmagenta';
            case 'E order supply':
                return 'darkyellow';
            default:
                return 'black';
        }
    };

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
                <li onClick={() => handleLegendClick('Customer')}>
                    <svg width="16" height="16">
                        <circle cx="8" cy="8" r="8" fill={nodeColors['Customer']} />
                    </svg>Customer
                </li>
                <li onClick={() => handleLegendClick('Part number')}>
                    <svg width="16" height="16">
                        <polygon points="8,0 0,16 16,16" fill={nodeColors['Part number']} />
                    </svg> Part number
                </li>
                <li onClick={() => handleLegendClick('Purchase order')}>
                    <svg width="16" height="16">
                        <rect width="16" height="16" fill={nodeColors['Purchase order']} />
                    </svg> Purchase order
                </li>
                <li onClick={() => handleLegendClick('Sell order')}>
                    <svg width="16" height="8">
                        <rect width="16" height="8" fill={nodeColors['Sell order']} />
                    </svg> Sell order
                </li>
                <li onClick={() => handleLegendClick('Supply')}>
                    <svg width="16" height="16">
                        <ellipse cx="8" cy="8" rx="8" ry="5" fill={nodeColors['Supply']} />
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

    const handleLegendClick = (type) => {
        setColorPicker({ visible: true, x: 100, y: 100, type });
    };

    const handleColorSelect = (color) => {
            setNodeColors({
                ...nodeColors,
                [colorPicker.type]: color
            });
        setColorPicker({ visible: false, x: 0, y: 0, type: '' });
    };

    const handleNodeHover = node => {
        if (node) {
            const { x, y, z } = node;
            const canvas = fgRef.current.renderer().domElement;
            const vector = new THREE.Vector3(x, y, z).project(fgRef.current.camera());
            const tooltipX = (vector.x * 0.5 + 0.5) * canvas.width;
            const tooltipY = (-(vector.y * 0.5) + 0.5) * canvas.height;
            setTooltip({ visible: true, x: tooltipX, y: tooltipY, content: `${node.id}(${node.group}) ` });
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
                <div className="col-2" style={{zIndex: 999, marginTop: '45px'}}>
                    {renderLegend()}
                </div>
            </div>
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
            {colorPicker.visible && (
                <div
                    style={{
                        position: 'absolute',
                        top: colorPicker.y,
                        left: colorPicker.x,
                        backgroundColor: 'white',
                        padding: '10px',
                        border: '1px solid black',
                        borderRadius: '3px',
                        zIndex: 1000
                    }}
                >
                    {predefinedColors.map(color => (
                        <div
                            key={color}
                            style={{
                                backgroundColor: color,
                                width: '30px',
                                height: '30px',
                                margin: '5px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleColorSelect(color)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ForceGraph2DComponent;
