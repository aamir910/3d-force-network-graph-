import React, { useRef, useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import { Spin } from "antd";
import Papa from "papaparse";
import * as THREE from "three";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./NavBar/NavBar";

import { Link } from "react-router-dom";
const predefinedColors = [
  "white",
  "lightblue",
  "orange",
  "cyan",
  "lime",
  "black",
];

import { useLocation } from "react-router-dom";
const customerImage = "customer.png"; // Replace with the actual path to the customer image

const ForceGraph2DComponent = () => {

  const location = useLocation();

  // Check if location.state exists before accessing its properties
  const checkedEntityNames = location.state?.checkedEntityNames || [];
  const checkedLinkNames = location.state?.checkedLinkNames || [];

  const checkedDropdownItems = location.state?.checkedDropdownItems || [];

  const arrays = location.state?.arrays || [];
  const SingleCheckCustomer = location.state?.inputData || [];

  const isAscending = location.state?.isAscending || false;
  console.log(arrays, "arrays arrays arrays");

  console.log(SingleCheckCustomer, "SingleCheckCustomer SingleCheckCustomer");

  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const [loading, setLoading] = useState(false);

  const getRepeatingNodes = (nodes) => {
    const seenIds = new Set();
    const repeatingNodes = [];

    nodes.forEach((node) => {
      if (seenIds.has(node.id)) {
        repeatingNodes.push(node);
      } else {
        seenIds.add(node.id);
      }
    });

    return repeatingNodes;
  };
  const repeatingNodes = getRepeatingNodes(graphData.nodes);

  if (repeatingNodes.length > 0) {
    console.log("Repeating nodes:", repeatingNodes);
  } else {
    console.log("All nodes are unique.");
  }

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });
  const [colorPicker, setColorPicker] = useState({
    visible: false,
    x: 0,
    y: 0,
    type: "",
  });

  // const [nodeColors, setNodeColors] = useState({
  //   N_CUSTOMER1: "white",
  //   N_PARTNUMBER1: "lightblue",
  //   N_PURCHORDER1: "orange",
  //   N_SELLORDER1: "cyan",
  //   N_SUPPLIER1: "lime",
  // });

  // const [linkColors, setLinkColors] = useState({
  //   E_BOM1: "white",
  //   E_ORDERCUST1: "lightblue",
  //   E_ORDERSUPP1: "orange",
  //   E_PNSELLORD1: "cyan",
  //   E_PNSUPPORD1: "lime",
  // });

  const assignColors = (keys, colors) => {
    return keys.reduce((acc, key, index) => {
      acc[key] = colors[index % colors.length]; // Cycle through colors if keys exceed the array length
      return acc;
    }, {});
  };

  // Set initial colors for node and link keys
  const [nodeColors, setNodeColors] = useState({});
  const [linkColors, setLinkColors] = useState({});

  useEffect(() => {
    // Assign colors to node keys
    console.log(checkedEntityNames, "checkedEntityNames");
    const newNodeColors = assignColors(checkedEntityNames, predefinedColors);
    setNodeColors(newNodeColors);

    // Assign colors to link keys
    const newLinkColors = assignColors(checkedLinkNames, predefinedColors);
    setLinkColors(newLinkColors);
  }, [checkedEntityNames, checkedLinkNames]);

  console.log("Node Colors:", nodeColors);
  console.log("Link Colors:", linkColors);

  const [selectedLinkType, setSelectedLinkType] = useState("");
  const [excludedTypes, setExcludedTypes] = useState([]);

  let keyValuesArray = [];

  // Iterate through the main keys
  for (let mainKey in checkedDropdownItems) {
    // Iterate through the sub-keys and add them to the array
    for (let subKey in checkedDropdownItems[mainKey]) {
      keyValuesArray.push({
        key: subKey,
        values: checkedDropdownItems[mainKey][subKey],
      });
    }
  }
  console.log(checkedDropdownItems, "checkedDropdownItems");
  const nCustomer = checkedDropdownItems["N_CUSTOMER1"] || {};
  const nPartNumber = checkedDropdownItems["N_PARTNUMBER1"] || {};
  const nPurchOrder = checkedDropdownItems["N_PURCHORDER1"] || {};
  const nSellOrder = checkedDropdownItems["N_SELLORDER1"] || {};
  const nSupplier = checkedDropdownItems["N_SUPPLIER1"] || {};

  const processCSV = (data) => {
    const nodesMap = {};

    // const links = data.slice(0, 50).map((row) => {

    const links = data.map((row) => {
      const { Entity_1, Entity_2, Entity_Type_1, Entity_Type_2, Edge_Type } =
        row;

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
  function filterByNCustomer(data) {
    const filteredData = data.filter((item) => {
      const matchesCustomer =
        SingleCheckCustomer.N_CUSTOMER === undefined ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_1 ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_2 ||
        SingleCheckCustomer.N_CUSTOMER === "";
      const matchesCountry =
        !item.COUNTRY ||
        nCustomer.COUNTRY === undefined ||
        nCustomer.COUNTRY.includes(item.COUNTRY) ||
        item.COUNTRY === "";
      const matchesMarket =
        !item.MARKET ||
        nCustomer.MARKET === undefined ||
        nCustomer.MARKET.includes(item.MARKET) ||
        item.MARKET === "";
      const matchesArea =
        !item.AREA ||
        nCustomer.AREA === undefined ||
        nCustomer.AREA.includes(item.AREA) ||
        item.AREA === "";
      const matchesZone =
        !item.ZONE ||
        nCustomer.ZONE === undefined ||
        nCustomer.ZONE.includes(item.ZONE) ||
        item.ZONE === "";

      if (!matchesCountry && item.COUNTRY !== "")
        Remove_nodes.push(item.Entity_1);
      if (!matchesMarket && item.MARKET !== "")
        Remove_nodes.push(item.Entity_1);
      if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_1);
      if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_1);

      if (!matchesCountry && item.COUNTRY !== "")
        Remove_nodes.push(item.Entity_2);
      if (!matchesMarket && item.MARKET !== "")
        Remove_nodes.push(item.Entity_2);
      if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_2);
      if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_2);

      return (
        matchesCustomer &&
        matchesCountry &&
        matchesMarket &&
        matchesArea &&
        matchesZone
      );
    });

    // Adding unique entities to the new array in item.entity
    // Remove_nodes = [...new Set(Remove_nodes)]; // Remove duplicates

    return filteredData;
  }

  function filterByN_PARTNUMBER(data) {
    const filteredData = data.filter((item) => {
      const matchesCustomer =
        SingleCheckCustomer.N_CUSTOMER === undefined ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_1 ||
        SingleCheckCustomer.N_CUSTOMER === item.Entity_2 ||
        SingleCheckCustomer.N_CUSTOMER === "";

      const matchesClass =
        !item.CLASS ||
        nPartNumber.CLASS === undefined ||
        nPartNumber.CLASS.includes(item.CLASS) ||
        item.CLASS === "";
      const matchesMOB =
        !item.MOB ||
        nPartNumber.MOB === undefined ||
        nPartNumber.MOB.includes(item.MOB) ||
        item.MOB === "";
      const matchesUM =
        !item.UM ||
        nPartNumber.UM === undefined ||
        nPartNumber.UM.includes(item.UM) ||
        item.UM === "";
      const matchesDept =
        !item.DEPT ||
        nPartNumber.DEPT === undefined ||
        nPartNumber.DEPT.includes(item.DEPT) ||
        item.DEPT === "";
      const matchesWOCE =
        !item.WOCE ||
        nPartNumber.WOCE === undefined ||
        nPartNumber.WOCE.includes(item.WOCE) ||
        item.WOCE === "";
      const matchesBOMLEV =
        !item.BOMLEV ||
        nPartNumber.BOMLEV === undefined ||
        nPartNumber.BOMLEV.includes(item.BOMLEV) ||
        item.BOMLEV === "";
      const matchesFAMILY =
        !item.FAMILY ||
        nPartNumber.FAMILY === undefined ||
        nPartNumber.FAMILY.includes(item.FAMILY) ||
        item.FAMILY === "";

      if (!matchesClass && item.CLASS !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesMOB && item.MOB !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesUM && item.UM !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesDept && item.DEPT !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesWOCE && item.WOCE !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesBOMLEV && item.BOMLEV !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      if (!matchesFAMILY && item.FAMILY !== "")
        Remove_nodes.push(item.Entity_1, item.Entity_2);

      return (
        matchesCustomer &&
        matchesClass &&
        matchesMOB &&
        matchesUM &&
        matchesDept &&
        matchesWOCE &&
        matchesBOMLEV &&
        matchesFAMILY
      );
    });

    // Optionally, remove duplicates from Remove_nodes
    // Remove_nodes = [...new Set(Remove_nodes)];

    return filteredData;
  }

  function filterByN_PurchOrder(data) {
    const filteredData = data.filter((item) => {
      const matchesPurchOrderType =
        !item.PURCH_ORDER_TYPE ||
        nPurchOrder.PURCH_ORDER_TYPE === undefined ||
        nPurchOrder.PURCH_ORDER_TYPE.includes(item.PURCH_ORDER_TYPE) ||
        item.PURCH_ORDER_TYPE === "";

      // Add entities to Remove_nodes if they don't match criteria
      if (!matchesPurchOrderType && item.PURCH_ORDER_TYPE !== "") {
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      }

      return matchesPurchOrderType;
    });

    return filteredData;
  }

  let Remove_nodes = [];
  function filterByN_Sellorder(data) {
    const filteredData = data.filter((item) => {
      const matchesSellOrderType =
        !item.SELL_ORDER_TYPE ||
        nSellOrder.SELL_ORDER_TYPE === undefined ||
        nSellOrder.SELL_ORDER_TYPE.includes(item.SELL_ORDER_TYPE) ||
        item.SELL_ORDER_TYPE === "";

      // Add entities to Remove_nodes if they don't match criteria
      if (!matchesSellOrderType && item.SELL_ORDER_TYPE !== "") {
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      }

      return matchesSellOrderType;
    });

    return filteredData;
  }

  function filterByN_SUPPLIER(data) {
    const filteredData = data.filter((item) => {
      const matchesSupplierCountry =
        !item.COUNTRY_SUPPLIER ||
        nSupplier.COUNTRY === undefined ||
        nSupplier.COUNTRY.includes(item.COUNTRY_SUPPLIER) ||
        item.COUNTRY_SUPPLIER === "";

      // Add entities to Remove_nodes if they don't match criteria
      if (!matchesSupplierCountry && item.COUNTRY_SUPPLIER !== "") {
        Remove_nodes.push(item.Entity_1, item.Entity_2);
      }

      return matchesSupplierCountry;
    });

    return filteredData;
  }

  let removeNodes3 = [];

  function filterAndUpdateNodes(data, removeNodes) {
    let removeNodes2 = [];
    const filteredRows = data.filter((row) => {
      const { Entity_1, Entity_2 } = row;

      if (removeNodes.includes(Entity_1) || removeNodes.includes(Entity_2)) {
        removeNodes2.push(Entity_1, Entity_2);
        removeNodes3.push(Entity_1, Entity_2);

        return false; // Exclude this row
      }

      return true; // Include this row
    });

    return { filteredRows, removeNodes2, removeNodes3 };
  }

  let allnodes = [];

  function filterAndUpdateNodes_input(data, addnodestemp) {
    let addnodes2 = [];

    const filteredRows = data.filter((row, key) => {
      const { Entity_1, Entity_2 } = row;

      if (addnodestemp.includes(Entity_2)) {
        // if (
        //   row.Entity_Type_1 === "N_PARTNUMBER" &&
        //   row.Entity_Type_2 === "N_PARTNUMBER"
        // ) {

        if (
          row.Entity_Type_1 === row.Entity_Type_2
          // false
        ) {
          // if (addnodestemp.includes(Entity_1)) {
          //   if (Entity_1 > Entity_2) {
          //     addnodes2.push(Entity_1);
          //     return true; // Include this row
          //   } else {
          //     return false;
          //   }
          // }

          if (isAscending) {
            if (addnodestemp.includes(Entity_2)) {
              if (Entity_1 < Entity_2) {
                addnodes2.push(Entity_1);
                return true; // Include this row
              } else {
                return false;
              }
            }
          } else {
            if (addnodestemp.includes(Entity_1)) {
              if (Entity_1 > Entity_2) {
                addnodes2.push(Entity_1);
                return true; // Include this row
              } else {
                return false;
              }
            }
          }
        } else {
          addnodes2.push(Entity_1);
          return true; // Include this row
        }
      }

      // change will be there
      if (addnodestemp.includes(Entity_1)) {
        if (Object.keys(SingleCheckCustomer)[0] !== "N_SUPPLIER") {
          if (
            row.Entity_Type_1 === "N_PURCHORDER" &&
            row.Entity_Type_2 === "N_PARTNUMBER"
          ) {
            return false;
          }
          if (
            row.Entity_Type_1 === "N_SUPPLIER" &&
            row.Entity_Type_2 === "N_PURCHORDER"
          ) {
            return false;
          }
        }

        if (
          row.Entity_Type_1 === row.Entity_Type_2
          // row.Entity_Type_1 === "N_PARTNUMBER" &&
          // row.Entity_Type_2 === "N_PARTNUMBER"
        ) {
          if (isAscending) {
            // downward
            if (Entity_1 > Entity_2) {
              addnodes2.push(Entity_2);
              return true; // Include this row
            } else {
              return false;
            }
          } else {
            // upword

            if (Entity_1 < Entity_2) {
              if (
                row.Entity_Type_1 === "N_SELLORDER" &&
                row.Entity_Type_2 !== "N_PARTNUMBER"
              ) {
                return false;
              }

              // console.log("check " ,Entity_2 )
              addnodes2.push(Entity_2);
              return true; // Include this row
            } else {
              return false;
            }
          }
        } else {
          addnodes2.push(Entity_2);
          return true; // Include this row
        }
      }

      return false; // Exclude this row
    });
    console.log(filteredRows, "filteredRows");

    allnodes = allnodes.concat(filteredRows);

    return { filteredRows, addnodes2 };
  }

  // here is the code to add the nodes there
  let add_nodes = [];
  function filterByProperty(data, property) {
    const filteredData = data.filter((item) => {
      const matchesProperty =
        SingleCheckCustomer[property] === item.Entity_1 ||
        SingleCheckCustomer[property] === item.Entity_2 ||
        SingleCheckCustomer[property] === undefined;

      if (SingleCheckCustomer[property] === item.Entity_1)
        add_nodes.push(item.Entity_2);
      if (SingleCheckCustomer[property] === item.Entity_2)
        add_nodes.push(item.Entity_1);

      return matchesProperty;
    });

    return filteredData;
  }

  useEffect(() => {
   // Set loading to true at the start of data parsing
   setLoading(true);
s
    Papa.parse(
      "https://213.21.189.116//EDGE_INTELLIGENCE/Get_merge_file.php",
      {
        download: true,
        header: true,
        complete: (result) => {
          console.log(result.data, excludedTypes, "result.data");

          // here is the filteration of the dropdowns there

          // let filteredData = result.data.filter((row) => {
          //   return (
          //     checkedEntityNames.includes(row.Edge_Type) &&
          //     checkedEntityNames.includes(row.Entity_Type_1) &&
          //     checkedEntityNames.includes(row.Entity_Type_2) &&
          //     Object.keys(checkedDropdownItems).every((key) => {
          //       console.log(key ,"here is the key ")
          //       // Only apply the filter if the field exists in additionalFilters
          //       return (
          //         row[key] === "" || // check if row[key] is empty
          //         checkedDropdownItems[key].includes(row[key]) // or it includes row[key]
          //       );
          //     })
          //   );
          // });

          // Arrays to store main keys and sub-keys

          // Iterate through the main keys

          // filter by dropdowns

          if (Object.keys(SingleCheckCustomer)[0] === "") {
         
            let filteredData = result.data.filter((row) => {
              return (
                checkedLinkNames.includes(row.Edge_Type) &&
                checkedEntityNames.includes(row.Entity_Type_1) &&
                checkedEntityNames.includes(row.Entity_Type_2) &&
                Object.keys(checkedDropdownItems).every((key) => {
                  console.log(key, "here is the key ");
                  // Only apply the filter if the field exists in additionalFilters
                  return (
                    row[key] === "" || // check if row[key] is empty
                    checkedDropdownItems[key].includes(row[key]) // or it includes row[key]
                  );
                })
              );
            });

            processCSV(filteredData);
          }
          // filter by id
          else {
            let filteredData = result.data.filter((row) => {
              return (
                checkedLinkNames.includes(row.Edge_Type) &&
                checkedEntityNames.includes(row.Entity_Type_1) &&
                checkedEntityNames.includes(row.Entity_Type_2)
              );
            });

            const key = Object.keys(SingleCheckCustomer)[0]; // Dynamically get the key
            if (key && SingleCheckCustomer[key] !== undefined) {
              console.log(key, "key here is the key there ");
              let file_filters = filterByProperty(filteredData, key);
            }

            if (Object.keys(SingleCheckCustomer)[0] === "N_PARTNUMBER") {
              add_nodes = [Object.values(SingleCheckCustomer)[0]];
            }

            let filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              add_nodes
            );
            // 1
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 2
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 3
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 4
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 5
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 6
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );

            console.log("final fiter data is ", filterFunctionResult, allnodes);
         
            let finalFilteredRows = filterFunctionResult.filteredRows;
            console.log("allnodes", allnodes);
            processCSV(allnodes);
              // Set loading to false after processing is complete
        
          }
          setLoading(false);
        },
        error: (error) => {
          console.error("Error reading CSV file:", error);
            // Set loading to false after processing is complete
        setLoading(false);
        },
      }
    );
  }, []);
const shapePool = [
  { shapeType: "sphere", geometry: new THREE.SphereGeometry(5) },
  { shapeType: "cone", geometry: new THREE.ConeGeometry(5, 20, 3) },
  { shapeType: "box", geometry: new THREE.BoxGeometry(10, 7, 15) },
  { shapeType: "rectangle", geometry: new THREE.BoxGeometry(10, 5, 5) },
  { shapeType: "cylinder", geometry: new THREE.CylinderGeometry(5, 5, 5, 40) },
  { shapeType: "torus", geometry: new THREE.TorusGeometry(5, 2, 16, 100) },
  { shapeType: "dodecahedron", geometry: new THREE.DodecahedronGeometry(5) },
  { shapeType: "icosahedron", geometry: new THREE.IcosahedronGeometry(5) },
  { shapeType: "tetrahedron", geometry: new THREE.TetrahedronGeometry(5) },
  { shapeType: "octahedron", geometry: new THREE.OctahedronGeometry(5) }
];
  useEffect(() => {
    const fg = fgRef.current;
    if (fg) {
      fg.d3Force("link").distance((link) => 100); // You can customize the distance
    }
    console.log(graphData, " graphData graphData");
  }, [graphData]);

  const getNodeColor = (node) => nodeColors[node.group] || nodeColors.default;

  const getLinkColor = (link) => linkColors[link.type] || linkColors.default;


 // Map to store dynamically assigned shapes for each unique group
const groupShapeMap = new Map();
let shapeIndex = 0; // Index to track the next available shape in shapePool

const getNodeShape = (node) => {
  // If the group doesn't have a shape assigned yet, assign the next available one
  if (!groupShapeMap.has(node.group)) {
    if (shapeIndex < shapePool.length) {
      groupShapeMap.set(node.group, shapePool[shapeIndex]);
      shapeIndex++;
    } else {
      console.warn(`Maximum unique shape limit reached. Reusing shapes for new groups.`);
      groupShapeMap.set(node.group, shapePool[shapeIndex % shapePool.length]);
      shapeIndex++;
    }
  }

  // Retrieve assigned shape for the group
  const { geometry } = groupShapeMap.get(node.group);
  const color = getNodeColor(node); // Assuming getNodeColor is defined elsewhere
  const material = new THREE.MeshBasicMaterial({ color });

  // Return the mesh for the node
  return new THREE.Mesh(geometry, material);
};

  const renderLegend = () => (
    <>
      <div className="legend">
        <ul>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <h4>Nodes</h4>
              </div>
              <div class="col-6 text-end">
                <button class="btn btn-primary" onClick={applyFilters}>
                  Filter
                </button>
              </div>
            </div>
          </div>
          {Object.keys(nodeColors).map(
            (type) =>
              checkedEntityNames.includes(type) && (
                <li key={type}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="checkbox1"
                      type="checkbox"
                      checked={
                        !excludedTypes.includes(type) &&
                        checkedEntityNames.includes(type)
                      }
                      onChange={() => handleCheckboxChange(type)}
                    />
                    <svg
                      width="20"
                      height="20"
                      onClick={(e) =>
                        handleLegendClick(type, e.clientX, e.clientY)
                      }>
                      {getNodeShape({ group: type }).geometry.type ===
                        "SphereGeometry" && (
                        <circle cx="10" cy="10" r="8" fill={nodeColors[type]} />
                      )}
                      {getNodeShape({ group: type }).geometry.type ===
                        "ConeGeometry" && (
                        <polygon
                          points="5,0 15,20 5,20"
                          fill={nodeColors[type]}
                        />
                      )}
                      {getNodeShape({ group: type }).geometry.type ===
                        "BoxGeometry" && (
                        <rect
                          x="5"
                          y="5"
                          width="10"
                          height="10"
                          fill={nodeColors[type]}
                        />
                      )}
                      {getNodeShape({ group: type }).geometry.type ===
                        "CylinderGeometry" && (
                        <rect
                          x="5"
                          y="5"
                          width="20"
                          height="10"
                          fill={nodeColors[type]}
                        />
                      )}
                    </svg>
                    <span>{type}</span>
                  </div>
                </li>
              )
          )}
          <h4>Links</h4>
          {Object.keys(linkColors).map(
            (type) =>
              checkedLinkNames.includes(type) && (
                <li key={type}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      className="checkbox1"
                      type="checkbox"
                      checked={
                        !excludedTypes.includes(type) &&
                        checkedLinkNames.includes(type)
                      }
                      onChange={() => handleCheckboxChange(type)}
                    />
                    <svg
                      width="20"
                      height="20"
                      onClick={(e) =>
                        handleLegendClick(type, e.clientX, e.clientY)
                      }>
                      <line
                        x1="0"
                        y1="10"
                        x2="20"
                        y2="10"
                        stroke={linkColors[type]}
                        strokeWidth="6"
                      />
                    </svg>
                    <span>{type}</span>
                  </div>
                </li>
              )
          )}
        </ul>
        <button className="btn btn-primary" style={{ color: 'white', marginTop: '1rem', marginLeft:"5rem",marginBottom:"1rem", padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
  <Link to="/visualize" style={{ color: 'white', textDecoration: 'none' }}>
    Back
  </Link>
</button> 
      </div>
    </>
  );
  const handleCheckboxChange = (type) => {
    setExcludedTypes((prevExcludedTypes) =>
      prevExcludedTypes.includes(type)
        ? prevExcludedTypes.filter((excludedType) => excludedType !== type)
        : [...prevExcludedTypes, type]
    );
  };

  const applyFilters = () => {
    Papa.parse(
      "https://213.21.189.116//EDGE_INTELLIGENCE/Get_merge_file.php",
      {
        download: true,
        header: true,
        complete: (result) => {
      

          const filteredData2 = filteredData.filter(
            (row) =>
              !excludedTypes.includes(row.Entity_Type_1) &&
              !excludedTypes.includes(row.Entity_Type_2) &&
              !excludedTypes.includes(row.Edge_Type)
          );

          if (Object.keys(SingleCheckCustomer)[0] === "") {
         
            let filteredData = result.data.filter((row) => {
              return (
                checkedLinkNames.includes(row.Edge_Type) &&
                checkedEntityNames.includes(row.Entity_Type_1) &&
                checkedEntityNames.includes(row.Entity_Type_2) &&
                !excludedTypes.includes(row.Entity_Type_1) &&
                !excludedTypes.includes(row.Entity_Type_2) &&
                !excludedTypes.includes(row.Edge_Type) &&
                Object.keys(checkedDropdownItems).every((key) => {
                  console.log(key, "here is the key ");
                  // Only apply the filter if the field exists in additionalFilters
                  return (
                    row[key] === "" || // check if row[key] is empty
                    checkedDropdownItems[key].includes(row[key]) // or it includes row[key]
                  );
                })
              );
            });

            processCSV(filteredData);
          }
          // filter by id
          else {
            let filteredData = result.data.filter((row) => {
              return (
                checkedLinkNames.includes(row.Edge_Type) &&
                checkedEntityNames.includes(row.Entity_Type_1) &&
                checkedEntityNames.includes(row.Entity_Type_2) &&  
                !excludedTypes.includes(row.Entity_Type_1) &&
                !excludedTypes.includes(row.Entity_Type_2) &&
                !excludedTypes.includes(row.Edge_Type) 
              );
            });

            const key = Object.keys(SingleCheckCustomer)[0]; // Dynamically get the key
            if (key && SingleCheckCustomer[key] !== undefined) {
              console.log(key, "key here is the key there ");
              let file_filters = filterByProperty(filteredData, key);
            }

            if (Object.keys(SingleCheckCustomer)[0] === "N_PARTNUMBER") {
              add_nodes = [Object.values(SingleCheckCustomer)[0]];
            }

            let filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              add_nodes
            );
            // 1
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 2
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 3
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 4
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 5
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );
            // 6
            filterFunctionResult = filterAndUpdateNodes_input(
              filteredData,
              filterFunctionResult.addnodes2
            );

            console.log("final fiter data is ", filterFunctionResult, allnodes);

            let finalFilteredRows = filterFunctionResult.filteredRows;
            console.log("allnodes", allnodes);
            processCSV(allnodes);
          }
        },
        error: (error) => {
          console.error("Error reading CSV file:", error);
        },
      }
    );
  };

  const handleLegendClick = (type, x, y) => {
    setSelectedLinkType(type);
    setColorPicker({ visible: true, x, y, type });
  };

  const handleColorSelect = (color) => {
    if (selectedLinkType in linkColors) {
      setLinkColors({
        ...linkColors,
        [selectedLinkType]: color,
      });
    } else {
      setNodeColors({
        ...nodeColors,
        [colorPicker.type]: color,
      });
    }
    setColorPicker({ visible: false, x: 0, y: 0, type: "" });
    setSelectedLinkType(""); // Reset selected link type
  };

  const handleNodeHover = (node) => {
    if (node) {
      const { x, y, z } = node;
      const canvas = fgRef.current.renderer().domElement;
      const vector = new THREE.Vector3(x, y, z).project(fgRef.current.camera());
      const tooltipX = (vector.x * 0.5 + 0.5) * canvas.width;
      const tooltipY = (-(vector.y * 0.5) + 0.5) * canvas.height;

      setTooltip({
        visible: true,
        x: tooltipX,
        y: tooltipY,
        content: `${node.id} (${node.group})`,
      });
    } else {
      setTooltip({ visible: false, x: 0, y: 0, content: "" });
    }
  };

  return (
    <>
    
    <Navbar image="newedgeintelligence.png" color="white" />
    {loading ? 
     <div
     style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'center',
       backgroundColor: 'white',
       width: '100vw',
       height: '100vh',
     }}
   >

     <Spin spinning={loading} tip="Loading...">
            <div>    LOADING    
                       </div>
     </Spin>
   </div> :
   <div className="container1 ">
   <div className="row graph_legend">
     <div
       className="col-2 legend_main_box"
       style={{ zIndex: 999, marginTop: "55px", background: "black" }}>
       {renderLegend()}
       {colorPicker.visible && (
         <div
           style={{
             position: "absolute",
             top: colorPicker.y,
             left: colorPicker.x,
             backgroundColor: "black",
             border: "1px solid white",
             padding: "10px",
             zIndex: 1000,
           }}>
           {predefinedColors.map((color) => (
             <div
               key={color}
               style={{
                 backgroundColor: color,
                 width: "20px",
                 height: "20px",
                 margin: "5px",
                 cursor: "pointer",
               }}
               onClick={() => handleColorSelect(color)}
             />
           ))}
         </div>
       )}
       {tooltip.visible && (
         <div
           className="tooltip1"
           style={{
             position: "absolute",
             top: tooltip.y,
             left: tooltip.x,
             backgroundColor: "white",
             border: "1px solid black",
             padding: "5px",
             pointerEvents: "none",
             zIndex: 1000,
           }}>
           {tooltip.content}
         </div>
       )}
     </div>

     <div className="col-8">
       <div className="graph-container">
         <ForceGraph3D
           ref={fgRef}
           nodeRelSize={8}
           graphData={graphData}
           nodeLabel={(node) => `${node.id}`}
           nodeAutoColorBy="group"
           backgroundColor="black"
           linkColor={getLinkColor}
           nodeColor={getNodeColor}
           linkWidth={3}
           enableZoomInteraction={true}
           nodeThreeObject={getNodeShape}
           onNodeHover={handleNodeHover}
         />
       </div>
     </div>
   </div>
 </div>
   }
       

    </>
  );
};

export default ForceGraph2DComponent;
