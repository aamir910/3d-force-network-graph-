import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./Visualize_filteration.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Sidebar from "../Buttons/SIdeBar";
import Navbar from "../NavBar/NavBar";

import { Link } from 'react-router-dom';
const csvFiles = [
  "/EDGES/E_BOM.csv",
  "/EDGES/E_ORDERCUST.csv",
  "/EDGES/E_ORDERSUPP.csv",
  "/EDGES/E_PNSELLORD.csv",
  "/EDGES/E_PNSUPPORD.csv",
];
const csvFiles2 = [
  "/NODES/N_CUSTOMER.csv",
  "/NODES/N_PARTNUMBER.csv",
  "/NODES/N_PURCHORDER.csv",
  "/NODES/N_SELLORDER.csv",
  "/NODES/N_SUPPLIER.csv",
];

const Visualize_filteration = () => {
  const [entityHeaders, setEntityHeaders] = useState({});
  const [linkHeaders, setLinkHeaders] = useState({});
  const [entityData, setEnitityData] = useState({});
  const [checkedEntities, setCheckedEntities] = useState({});
  const [checkedLinks, setCheckedLinks] = useState({});

  const [checkedEntityNames, setCheckedEntityNames] = useState([]);
  const [checkedLinkNames, setCheckedLinkNames] = useState([]);
  useEffect(() => {
    const loadCSV = (filePath) => {
      return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
          download: true,
          header: true,
          complete: (results) => {
            const data = results.data;
            const header = results.meta.fields;
            resolve({ data, header });
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    };

    const loadAllCSVs = async () => {
      try {
        const entityHeaderPromises = csvFiles2.map((file) => loadCSV(file));
        const linkHeaderPromises = csvFiles.map((file) => loadCSV(file));

        const entityResults = await Promise.all(entityHeaderPromises);
        const linkResults = await Promise.all(linkHeaderPromises);

        const entityHeadersArray = entityResults.map((result) => result.header);
        const linkHeadersArray = linkResults.map((result) => result.header);
        const entityDataArray = entityResults.map((result) => result.data);

        const newEntityHeaders = {};
        csvFiles2.forEach((file, index) => {
          newEntityHeaders[file] = entityHeadersArray[index];
        });

        const newLinkHeaders = {};
        csvFiles.forEach((file, index) => {
          newLinkHeaders[file] = linkHeadersArray[index];
        });

        setEntityHeaders(newEntityHeaders);
        setLinkHeaders(newLinkHeaders);
        setEnitityData(entityDataArray);
      } catch (error) {
        console.error("Error loading CSV files:", error);
      }
    };

    loadAllCSVs();
  }, []);
  console.log(entityHeaders , 'entityHeaders')
  const [uniqueData, setUniqueData] = useState([]);

  useEffect(() => {
    // Function to extract unique values from an array of objects for all keys
    const getUniqueValues = (array) => {
      const uniqueValues = {};

      array.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (!uniqueValues[key]) {
            uniqueValues[key] = new Set();
          }
          if (item[key]) {
            uniqueValues[key].add(item[key]);
          }
        });
      });

      // Convert sets to arrays
      Object.keys(uniqueValues).forEach((key) => {
        uniqueValues[key] = Array.from(uniqueValues[key]);
      });

      return uniqueValues;
    };

    if (entityData.length > 0) {
      // Loop through each array in entityData
      const result = entityData.map((subArray) => getUniqueValues(subArray));
      setUniqueData(result);
    }
  }, [entityData]);
  console.log(uniqueData, "uniqueData");

  console.log(entityData, "entityData");
  const getEntityName = (filePath) => {
    const fileName = filePath.split("/").pop();
    switch (fileName) {
      case "N_CUSTOMER.csv":
        return "Customer";
      case "N_PARTNUMBER.csv":
        return "Part number";
      case "N_PURCHORDER.csv":
        return "Purchase order";
      case "N_SELLORDER.csv":
        return "Sell order";
      case "N_SUPPLIER.csv":
        return "Supply";
      default:
        return "";
    }
  };

  const getLinkName = (filePath) => {
    const fileName = filePath.split("/").pop();
    switch (fileName) {
      case "E_BOM.csv":
        return "E BOM";
      case "E_ORDERCUST.csv":
        return "E Order customer";
      case "E_ORDERSUPP.csv":
        return "E order supply";
      case "E_PNSELLORD.csv":
        return "E part number sell order";
      case "E_PNSUPPORD.csv":
        return "E part number supply order";
      default:
        return "";
    }
  };

  const handleEntityCheckboxChange = (filePath, headerIndex) => {
    setCheckedEntities((prevState) => ({
      ...prevState,
      [filePath]: headerIndex,
    }));
  };

  const handleLinkCheckboxChange = (filePath) => {
    setCheckedLinks((prevState) => ({
      ...prevState,
      [filePath]: !prevState[filePath],
      }));
    
  };
  const handleEntityData = (filePath) => {
    // Assuming filePath is a single entity name string
    const newEntityName = filePath.trim();

    // Check if the entity name is already in checkedEntityNames
    if (!checkedEntityNames.includes(newEntityName)) {
      setCheckedEntityNames(prevNames => [...prevNames, newEntityName]);
    }
  };

  const handleLinkData = (filePath) => {
    // Assuming filePath is a single entity name string
    const newEntityName = filePath.trim();

    // Check if the entity name is already in checkedEntityNames
    if (!checkedLinkNames.includes(newEntityName)) {
      setCheckedLinkNames(prevNames => [...prevNames, newEntityName]);
    }
  };

let aammir =['asdasdasd' ,'asdjasd']
console.log(checkedEntityNames , checkedLinkNames,  'newEntityNames')
  return (
    <>
      <Navbar image="newedgeintelligence.png" color="#f0f0f0" />
      <div className="flex coloum">
        <div className="main_visualize col-12">
          <div className="row">
            <h1> Filters</h1>
            <div className="col-8">
              <div className="table-container">
                <div className="table-section1">
                  <h3 className="entity_class">ENTITY</h3>
                  <div className="table-wrapper">
                    <table className="table2">
                      <thead>
                        <tr>
                          <th>NAME</th>
                          <th>TYPE</th>
                          <th>SUB TYPE</th>
                        </tr>
                      </thead>

                      <tbody>
  {Object.entries(entityHeaders).map(([filePath, headers], index) =>
    headers.map((header, headerIndex) => {
      if (uniqueData.length !== 0) {
        if (uniqueData[index][header].length < 100) {
          return (
            <tr key={`${index}-${headerIndex}`}>
              <td>
                {headerIndex === 0 ? (
                  <><input type="checkbox" name="" id="" value={getEntityName(filePath)} 
                  onChange={() => handleEntityData(getEntityName(filePath))}


                  /> {getEntityName(filePath)}</>
                ) : (
                  ""
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  name=""
                  id=""
                  checked={checkedEntities[filePath] === headerIndex}
                  onChange={() =>
                    handleEntityCheckboxChange(filePath, headerIndex)
                  }
                />{" "}
                {header}
              </td>
              <td>
                <div className="dropdown">
                  <button className="dropbtn">Dropdown</button>
                  <div className="dropdown-content">
                    {uniqueData[index][header].map((item, itemIndex) => (
                      <label key={itemIndex}>
                        <input
                          type="checkbox"
                          value={item}
                          // Handle checkbox change logic here
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          );
        } else {
          return null; // Return null if condition is not met (row won't be rendered)
        }
      }
    })
  )}
</tbody>

                   </table>
                  </div>
                </div>
              </div>
            </div> 
            <div className="col-4">
              <div className="table-container">
                <div className="table-section2">
                  <h3 className="entity_class">LINK</h3>
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>NAME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(linkHeaders).map(
                          ([filePath, headers], index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  name=""
                                  id=""
                                  onChange={() =>
                                    handleLinkData(getLinkName(filePath))
                                  }
                                  value={getLinkName(filePath)}
                                />{" "}
                                {getLinkName(filePath)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                    
          <button> <Link to={{
      pathname: "/3d_graph",
      state: {
        aammir :aammir
      }
    }}>VISUALIZE</Link></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Visualize_filteration;
