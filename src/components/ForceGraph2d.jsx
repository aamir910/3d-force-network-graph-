import React, { useRef, useEffect, useState } from "react";
import { ForceGraph3D } from "react-force-graph";
import Papa from "papaparse";
import * as THREE from "three";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./NavBar/NavBar";
const predefinedColors = ["white", "lightblue", "orange", "cyan", "lime", "black"];

import { useLocation } from 'react-router-dom';
const customerImage = "customer.png"; // Replace with the actual path to the customer image

const ForceGraph2DComponent = () => {

  const location = useLocation();
  

  // Check if location.state exists before accessing its properties
  const checkedEntityNames = location.state?.checkedEntityNames || [];
  const checkedLinkNames = location.state?.checkedLinkNames || [];
  
  const checkedDropdownItems = location.state?.checkedDropdownItems || [];
// console.log(checkedEntityNames ,checkedLinkNames    , checkedDropdownItems  , '3d force graph' )

  const fgRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
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
  const [nodeColors, setNodeColors] = useState({
    N_CUSTOMER: "white",
    N_PARTNUMBER: "lightblue",
    N_PURCHORDER: "orange",
    N_SELLORDER: "cyan",
    N_SUPPLIER: "lime",
  });
  const [linkColors, setLinkColors] = useState({
    E_BOM: "white",
    E_ORDERCUST: "lightblue",
    E_ORDERSUPP: "orange",
    E_PNSELLORD: "cyan",
    E_PNSUPPORD: "lime",
  });

  const [selectedLinkType, setSelectedLinkType] = useState("");
  const [excludedTypes, setExcludedTypes] = useState([]);
  const processCSV = (data) => {
    const nodesMap = {};
    
    console.log("excludedTypes" ,excludedTypes)
    const links = data.slice(0, 5000).map((row) => {
      
    // const links = data.map((row) => {
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

    console.log(links, "here is the links");
  };



  
  useEffect(() => {
    Papa.parse("/Edeges_And_Nodes_with_Entity_2.csv", {
      download: true,
      header: true,
      complete: (result) => {
        
        
        console.log(result.data ,excludedTypes ,  'result.data')

        const filteredData = result.data.filter(
          (row) =>
           checkedEntityNames.includes(row.Entity_Type_1) &&
              checkedEntityNames.includes(row.Entity_Type_1)  &&
              checkedEntityNames.includes(row.Edge_Type)
        );
        console.log(  "filteredData 222 " ,checkedEntityNames ,filteredData ) ; 

        

        // Arrays to store main keys and sub-keys


// Iterate through the main keys



let keyValuesArray = [];

// Iterate through the main keys
for (let mainKey in checkedDropdownItems) {
    // Iterate through the sub-keys and add them to the array
    for (let subKey in checkedDropdownItems[mainKey]) {
        keyValuesArray.push({ key: subKey, values: checkedDropdownItems[mainKey][subKey] });
    }
}

console.log("Key-Value Pairs Array:", keyValuesArray);

const nCustomer = checkedDropdownItems["N_CUSTOMER"] || {};
const nPartNumber = checkedDropdownItems["N_PARTNUMBER"] || {};
const nPurchOrder = checkedDropdownItems["N_PURCHORDER"] || {};
const nSellOrder = checkedDropdownItems["N_SELLORDER"] || {};
const nSupplier = checkedDropdownItems["N_SUPPLIER"] || {};


let Remove_nodes = [];
function filterByNCustomer(data) {

  const filteredData = data.filter(item => {
    const matchesCountry = !item.COUNTRY || nCustomer.COUNTRY === undefined || nCustomer.COUNTRY.includes(item.COUNTRY) || item.COUNTRY === "";
    const matchesMarket = !item.MARKET || nCustomer.MARKET === undefined || nCustomer.MARKET.includes(item.MARKET) || item.MARKET === "";
    const matchesArea = !item.AREA || nCustomer.AREA === undefined || nCustomer.AREA.includes(item.AREA) || item.AREA === "";
    const matchesZone = !item.ZONE || nCustomer.ZONE === undefined || nCustomer.ZONE.includes(item.ZONE) || item.ZONE === "";

    if (!matchesCountry && item.COUNTRY !== "") Remove_nodes.push(item.Entity_1);
    if (!matchesMarket && item.MARKET !== "") Remove_nodes.push(item.Entity_1);
    if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_1);
    if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_1);

    if (!matchesCountry && item.COUNTRY !== "") Remove_nodes.push(item.Entity_2);
    if (!matchesMarket && item.MARKET !== "") Remove_nodes.push(item.Entity_2);
    if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_2);
    if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_2);

    return matchesCountry && matchesMarket && matchesArea && matchesZone;
  });

  // Adding unique entities to the new array in item.entity
  // Remove_nodes = [...new Set(Remove_nodes)]; // Remove duplicates


  return filteredData;
}


function filterByN_PARTNUMBER(data) {
  const filteredData = data.filter(item => {
    const matchesClass = !item.CLASS || nPartNumber.CLASS === undefined || nPartNumber.CLASS.includes(item.CLASS) || item.CLASS === "";
    const matchesMOB = !item.MOB || nPartNumber.MOB === undefined || nPartNumber.MOB.includes(item.MOB) || item.MOB === "";
    const matchesUM = !item.UM || nPartNumber.UM === undefined || nPartNumber.UM.includes(item.UM) || item.UM === "";
    const matchesDept = !item.DEPT || nPartNumber.DEPT === undefined || nPartNumber.DEPT.includes(item.DEPT) || item.DEPT === "";
    const matchesWOCE = !item.WOCE || nPartNumber.WOCE === undefined || nPartNumber.WOCE.includes(item.WOCE) || item.WOCE === "";
    const matchesBOMLEV = !item.BOMLEV || nPartNumber.BOMLEV === undefined || nPartNumber.BOMLEV.includes(item.BOMLEV) || item.BOMLEV === "";

    if (!matchesClass && item.CLASS !== "") Remove_nodes.push(item.Entity_1, item.Entity_2);
    if (!matchesMOB && item.MOB !== "") Remove_nodes.push(item.Entity_1, item.Entity_2);
    if (!matchesUM && item.UM !== "") Remove_nodes.push(item.Entity_1, item.Entity_2);
    if (!matchesDept && item.DEPT !== "") Remove_nodes.push(item.Entity_1, item.Entity_2);
    if (!matchesWOCE && item.WOCE !== "") Remove_nodes.push(item.Entity_1, item.Entity_2);
    if (!matchesBOMLEV && item.BOMLEV !== "") Remove_nodes.push(item.Entity_1, item.Entity_2);

    return matchesClass && matchesMOB && matchesUM && matchesDept && matchesWOCE && matchesBOMLEV;
  });

  // Optionally, remove duplicates from Remove_nodes
  // Remove_nodes = [...new Set(Remove_nodes)];

  return filteredData;
}

function filterByN_PurchOrder(data) {
  const filteredData = data.filter(item => {
    const matchesPurchOrderType = !item.PURCH_ORDER_TYPE || nPurchOrder.PURCH_ORDER_TYPE === undefined || nPurchOrder.PURCH_ORDER_TYPE.includes(item.PURCH_ORDER_TYPE) || item.PURCH_ORDER_TYPE === "";

    // Add entities to Remove_nodes if they don't match criteria
    if (!matchesPurchOrderType && item.PURCH_ORDER_TYPE !== "") {
      Remove_nodes.push(item.Entity_1, item.Entity_2);
    }

    return matchesPurchOrderType;
  });

  return filteredData;
}

function filterByN_Sellorder(data) {
  const filteredData = data.filter(item => {
    const matchesSellOrderType = !item.SELL_ORDER_TYPE || nSellOrder.SELL_ORDER_TYPE === undefined || nSellOrder.SELL_ORDER_TYPE.includes(item.SELL_ORDER_TYPE) || item.SELL_ORDER_TYPE === "";

    // Add entities to Remove_nodes if they don't match criteria
    if (!matchesSellOrderType && item.SELL_ORDER_TYPE !== "") {
      Remove_nodes.push(item.Entity_1, item.Entity_2);
    }

    return matchesSellOrderType;
  });

  return filteredData;
}

function filterByN_SUPPLIER(data) {
  const filteredData = data.filter(item => {
    const matchesSupplierCountry = !item.COUNTRY_SUPPLIER || nSupplier.COUNTRY === undefined || nSupplier.COUNTRY.includes(item.COUNTRY_SUPPLIER) || item.COUNTRY_SUPPLIER === "";

    // Add entities to Remove_nodes if they don't match criteria
    if (!matchesSupplierCountry && item.COUNTRY_SUPPLIER !== "") {
      Remove_nodes.push(item.Entity_1, item.Entity_2);
    }

    return matchesSupplierCountry;
  });

  return filteredData;
}


let nCustomer_file_filters = filterByNCustomer(filteredData);

let removeNodes3 =[] ;
function filterAndUpdateNodes(data, removeNodes) {
  let removeNodes2 = [];
  const filteredRows = data.filter(row => {
    const { Entity_1, Entity_2 } = row;
    
    if (removeNodes.includes(Entity_1) || removeNodes.includes(Entity_2)) {
      removeNodes2.push(Entity_1, Entity_2);
      removeNodes3.push(Entity_1, Entity_2);
     
      return false; // Exclude this row
    }
    
    return true; // Include this row
  });

  return { filteredRows, removeNodes2 , removeNodes3 };
}

// Initial filter and update nodes
let filterFunctionResult = filterAndUpdateNodes(nCustomer_file_filters, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

let finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after initial filter:", finalFilteredRows, filterFunctionResult );

// Apply additional filters and update nodes in sequence

// Filter by N_PARTNUMBER
Remove_nodes = [] ;
let N_PARTNUMBER_filter = filterByN_PARTNUMBER(finalFilteredRows);


console.log('N_PARTNUMBER_filter' , N_PARTNUMBER_filter)

filterFunctionResult = filterAndUpdateNodes(N_PARTNUMBER_filter, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_PARTNUMBER:", finalFilteredRows ,finalFilteredRows );

// Filter by N_PurchOrder
Remove_nodes = [] ;
let filteredData_PurchOrder = filterByN_PurchOrder(finalFilteredRows);
filterFunctionResult = filterAndUpdateNodes(filteredData_PurchOrder, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_PurchOrder:", finalFilteredRows);

// Filter by N_Sellorder
Remove_nodes = [] ;
let nSellOrder_file_filter = filterByN_Sellorder(finalFilteredRows);
filterFunctionResult = filterAndUpdateNodes(nSellOrder_file_filter, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_Sellorder:", finalFilteredRows);

// Filter by N_SUPPLIER
Remove_nodes = [] ;
let manSupplier_file_filter = filterByN_SUPPLIER(finalFilteredRows);
filterFunctionResult = filterAndUpdateNodes(manSupplier_file_filter, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}
finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_SUPPLIER:", finalFilteredRows);

  processCSV(finalFilteredRows);

      },
      error: (error) => {
        console.error("Error reading CSV file:", error);
      },
    });
  }, []);


  useEffect(() => {
    const fg = fgRef.current;
    if (fg) {
      fg.d3Force("link").distance((link) => 100); // You can customize the distance
    }
  }, [graphData]);

  const getNodeColor = (node) => nodeColors[node.group] || nodeColors.default;

  const getLinkColor = (link) => linkColors[link.type] || linkColors.default;

  const getNodeShape = (node) => {
    const color = getNodeColor(node);

    switch (node.group) {
      case "N_CUSTOMER":
        return new THREE.Mesh(
          new THREE.SphereGeometry(5),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_PARTNUMBER":
        return new THREE.Mesh(
          new THREE.ConeGeometry(5, 20, 3),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_PURCHORDER":
        return new THREE.Mesh(
          new THREE.BoxGeometry(10, 10, 10),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_SELLORDER":
        return new THREE.Mesh(
          new THREE.BoxGeometry(10, 5, 5),
          new THREE.MeshBasicMaterial({ color })
        );
      case "N_SUPPLIER":
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
    <>
   
   <Navbar image = "edge_white_text.png" color="black"/>
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
        {Object.keys(nodeColors).map((type) => (
  checkedEntityNames.includes(type) && (
    <li key={type}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="checkbox1"
          type="checkbox"
          checked={!excludedTypes.includes(type) && checkedEntityNames.includes(type)}
          onChange={() => handleCheckboxChange(type)}
        />
        <svg
          width="20"
          height="20"
          onClick={(e) => handleLegendClick(type, e.clientX, e.clientY)}
        >
          {getNodeShape({ group: type }).geometry.type === "SphereGeometry" && (
            <circle cx="10" cy="10" r="8" fill={nodeColors[type]} />
          )}
          {getNodeShape({ group: type }).geometry.type === "ConeGeometry" && (
            <polygon points="5,0 15,20 5,20" fill={nodeColors[type]} />
          )}
          {getNodeShape({ group: type }).geometry.type === "BoxGeometry" && (
            <rect x="5" y="5" width="10" height="10" fill={nodeColors[type]} />
          )}
          {getNodeShape({ group: type }).geometry.type === "CylinderGeometry" && (
            <rect x="5" y="5" width="20" height="10" fill={nodeColors[type]} />
          )}
        </svg>
        <span>{type}</span>
      </div>
    </li>
  )
))}
        <h4>Links</h4>
        {Object.keys(linkColors).map((type) => (
  checkedEntityNames.includes(type) && (
    <li key={type}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="checkbox1"
          type="checkbox"
          checked={!excludedTypes.includes(type) && checkedEntityNames.includes(type)}
          onChange={() => handleCheckboxChange(type)}
        />
        <svg
          width="20"
          height="20"
          onClick={(e) => handleLegendClick(type, e.clientX, e.clientY)}
        >
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
))}
      </ul>
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
    Papa.parse("/Edeges_And_Nodes_with_Entity_2.csv", {
      download: true,
      header: true,
      complete: (result) => {


        let filteredData = result.data.filter(
          (row) =>
            checkedEntityNames.includes(row.Entity_Type_1) &&
          checkedEntityNames.includes(row.Entity_Type_1)  &&
          checkedEntityNames.includes(row.Edge_Type)
        );

        


        const filteredData2 = filteredData.filter(
          (row) =>
            !excludedTypes.includes(row.Entity_Type_1) &&
            !excludedTypes.includes(row.Entity_Type_2) &&
            !excludedTypes.includes(row.Edge_Type)
        );
        console.log("filteredData2"    , checkedEntityNames ,filteredData  ,filteredData2 ,excludedTypes)
        // Arrays to store main keys and sub-keys


// Iterate through the main keys



let keyValuesArray = [];

// Iterate through the main keys
for (let mainKey in checkedDropdownItems) {
    // Iterate through the sub-keys and add them to the array
    for (let subKey in checkedDropdownItems[mainKey]) {
        keyValuesArray.push({ key: subKey, values: checkedDropdownItems[mainKey][subKey] });
    }
}

console.log("Key-Value Pairs Array:", keyValuesArray);

const nCustomer = checkedDropdownItems["N_CUSTOMER"] || {};
const nPartNumber = checkedDropdownItems["N_PARTNUMBER"] || {};
const nPurchOrder = checkedDropdownItems["N_PURCHORDER"] || {};
const nSellOrder = checkedDropdownItems["N_SELLORDER"] || {};
const nSupplier = checkedDropdownItems["N_SUPPLIER"] || {};


let Remove_nodes = [];
function filterByNCustomer(data) {

  const filteredData = data.filter(item => {
    const matchesCountry = !item.COUNTRY || nCustomer.COUNTRY === undefined || nCustomer.COUNTRY.includes(item.COUNTRY) || item.COUNTRY === "";
    const matchesMarket = !item.MARKET || nCustomer.MARKET === undefined || nCustomer.MARKET.includes(item.MARKET) || item.MARKET === "";
    const matchesArea = !item.AREA || nCustomer.AREA === undefined || nCustomer.AREA.includes(item.AREA) || item.AREA === "";
    const matchesZone = !item.ZONE || nCustomer.ZONE === undefined || nCustomer.ZONE.includes(item.ZONE) || item.ZONE === "";

    if (!matchesCountry && item.COUNTRY !== "") Remove_nodes.push(item.Entity_1);
    if (!matchesMarket && item.MARKET !== "") Remove_nodes.push(item.Entity_1);
    if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_1);
    if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_1);

    if (!matchesCountry && item.COUNTRY !== "") Remove_nodes.push(item.Entity_2);
    if (!matchesMarket && item.MARKET !== "") Remove_nodes.push(item.Entity_2);
    if (!matchesArea && item.AREA !== "") Remove_nodes.push(item.Entity_2);
    if (!matchesZone && item.ZONE !== "") Remove_nodes.push(item.Entity_2);

    return matchesCountry && matchesMarket && matchesArea && matchesZone;
  });

  // Adding unique entities to the new array in item.entity
  // Remove_nodes = [...new Set(Remove_nodes)]; // Remove duplicates


  return filteredData;
}


function filterByN_PARTNUMBER(data) {
  return data.filter(item => (
      (!nPartNumber.CLASS ||  nPartNumber.CLASS.length === 0 || nPartNumber.CLASS.includes(item.CLASS) || item.CLASS === ""  ) &&
      (!nPartNumber.MOB ||    nPartNumber.MOB.length === 0 || nPartNumber.MOB.includes(item.MOB) || item.MOB === "" ) &&
      (!nPartNumber.UM ||     nPartNumber.UM.length === 0 || nPartNumber.UM.includes(item.UM)|| item.UM === "" ) &&
      (!nPartNumber.DEPT ||   nPartNumber.DEPT.length === 0 || nPartNumber.DEPT.includes(item.DEPT)|| item.DEPT === "" ) &&
      (!nPartNumber.WOCE ||   nPartNumber.WOCE.length === 0 || nPartNumber.WOCE.includes(item.WOCE)|| item.WOCE === "" ) &&
      (!nPartNumber.BOMLEV || nPartNumber.BOMLEV.length === 0 || nPartNumber.BOMLEV.includes(item.BOMLEV)|| item.BOMLEV === "" )
  ));
}

function filterByN_PurchOrder(data) {
  return data.filter(item => (
      (!nPurchOrder.PURCH_ORDER_TYPE || nPurchOrder.PURCH_ORDER_TYPE.length === 0 || nPurchOrder.PURCH_ORDER_TYPE.includes(item.PURCH_ORDER_TYPE) ||  item.PURCH_ORDER_TYPE ==="" )
  ));
}

function filterByN_Sellorder(data) {
  return data.filter(item => (
      (!nSellOrder.SELL_ORDER_TYPE || nSellOrder.SELL_ORDER_TYPE.length === 0 || nSellOrder.SELL_ORDER_TYPE.includes(item.PURCH_ORDER_TYPE) || item.PURCH_ORDER_TYPE ==="" )
  ));
}
function filterByN_SUPPLIER(data) {
  return data.filter(item => (
    (!nSupplier.COUNTRY || nSupplier.COUNTRY.length === 0 || nSupplier.COUNTRY.includes(item.COUNTRY_SUPPLIER) || item.COUNTRY_SUPPLIER ==="")
  ));
}

let nCustomer_file_filters = filterByNCustomer(filteredData2);

let removeNodes3 =[] ;
function filterAndUpdateNodes(data, removeNodes) {
  let removeNodes2 = [];
  const filteredRows = data.filter(row => {
    const { Entity_1, Entity_2 } = row;
    
    if (removeNodes.includes(Entity_1) || removeNodes.includes(Entity_2)) {
      removeNodes2.push(Entity_1, Entity_2);
      removeNodes3.push(Entity_1, Entity_2);
     
      return false; // Exclude this row
    }
    
    return true; // Include this row
  });

  return { filteredRows, removeNodes2 , removeNodes3 };
}

// Initial filter and update nodes
let filterFunctionResult = filterAndUpdateNodes(nCustomer_file_filters, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

let finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after initial filter:", finalFilteredRows, filterFunctionResult );

// Apply additional filters and update nodes in sequence

// Filter by N_PARTNUMBER
let N_PARTNUMBER_filter = filterByN_PARTNUMBER(finalFilteredRows);
filterFunctionResult = filterAndUpdateNodes(N_PARTNUMBER_filter, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_PARTNUMBER:", finalFilteredRows ,finalFilteredRows );

// Filter by N_PurchOrder
let filteredData_PurchOrder = filterByN_PurchOrder(finalFilteredRows);
filterFunctionResult = filterAndUpdateNodes(filteredData_PurchOrder, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_PurchOrder:", finalFilteredRows);

// Filter by N_Sellorder
let nSellOrder_file_filter = filterByN_Sellorder(finalFilteredRows);
filterFunctionResult = filterAndUpdateNodes(nSellOrder_file_filter, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}

finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_Sellorder:", finalFilteredRows);

// Filter by N_SUPPLIER
let manSupplier_file_filter = filterByN_SUPPLIER(finalFilteredRows);
filterFunctionResult = filterAndUpdateNodes(manSupplier_file_filter, Remove_nodes);

while (filterFunctionResult.removeNodes2.length > 0) {
  filterFunctionResult = filterAndUpdateNodes(filterFunctionResult.filteredRows, filterFunctionResult.removeNodes3);
}
finalFilteredRows = filterFunctionResult.filteredRows;
console.log("Final filtered rows after N_SUPPLIER:", finalFilteredRows);

  processCSV(finalFilteredRows);
        // processCSV(filteredData2);
      },
      error: (error) => {
        console.error("Error reading CSV file:", error);
      },
    });
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
    <div className="container1 ">
      <div className="row graph_legend">
      <div className="col-2 legend_main_box" style={{zIndex: 999, marginTop: '55px' , background:'black'}} >
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
    </>
  );
};

export default ForceGraph2DComponent;
