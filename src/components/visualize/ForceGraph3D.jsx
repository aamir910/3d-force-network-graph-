import React, { useEffect, useState , useCallback } from "react";
import Papa from "papaparse";
import "./Visualize_filteration.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Sidebar from "../Buttons/SIdeBar";
import Navbar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import InputNode from "three/examples/jsm/nodes/core/InputNode.js";

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
  const navigate = useNavigate();
  const [checkedDropdownItems, setCheckedDropdownItems] = useState({});
  const [selectedEntity, setSelectedEntity] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputData, setInputData] = useState({});


  const [isAscending, setIsAscending] = useState(false); 
  


  const handleUpArrowClick = () => {
    setIsAscending(true);
  };

  const handleDownArrowClick = () => {
    setIsAscending(false);
  };



  // const [SelectEntityNames, setSelectEntityNames] = useState(false);
  // const [SelectLinkNames, setSelectLinkNames] = useState(false);

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

  const getEntityName = (filePath) => {
    const fileName = filePath.split("/").pop();
    switch (fileName) {
      case "N_CUSTOMER.csv":
        return "N_CUSTOMER";
      case "N_PARTNUMBER.csv":
        return "N_PARTNUMBER";
      case "N_PURCHORDER.csv":
        return "N_PURCHORDER";
      case "N_SELLORDER.csv":
        return "N_SELLORDER";
      case "N_SUPPLIER.csv":
        return "N_SUPPLIER";
      default:
        return fileName ; 
    }
  };

  const getLinkName = (filePath) => {
    const fileName = filePath.split("/").pop();
    switch (fileName) {
      case "E_BOM.csv":
        return "E_BOM";
      case "E_ORDERCUST.csv":
        return "E_ORDERCUST";
      case "E_ORDERSUPP.csv":
        return "E_ORDERSUPP";
      case "E_PNSELLORD.csv":
        return "E_PNSELLORD";
      case "E_PNSUPPORD.csv":
        return "E_PNSUPPORD";
      default:
        return fileName;
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
  const handleEntityData = (filePath, header, item) => {
   
    const entityName = getEntityName(filePath);

    // Get the current state of the dropdown items for the specific entity and header
    const currentItems = checkedDropdownItems[entityName]?.[header] || [];

    // Determine if the item should be added or removed
    const newItems = currentItems.includes(item)
      ? currentItems.filter((i) => i !== item)
      : [...currentItems, item];

    // Create the updated checked items structure, including the customerId
    const newCheckedItems = {
      ...checkedDropdownItems,
      [entityName]: {
        ...checkedDropdownItems[entityName],
        [header]: newItems, // Add or update the customerId
      },
    };

    setCheckedDropdownItems(newCheckedItems);

    if (!checkedEntityNames.includes(entityName)) {
      setCheckedEntityNames([...checkedEntityNames, entityName]);
    }
  };

  const handleEntityData_main = (filePath) => {
    const entityName = getEntityName(filePath);
    if (checkedEntityNames.includes(entityName)) {
      // If entity is already checked, uncheck it
      setCheckedEntityNames(
        checkedEntityNames.filter((name) => name !== entityName)
      );
    } else {
      // If entity is not checked, check it
      setCheckedEntityNames([...checkedEntityNames, entityName]);
    }
  };

  const handleLinkData = (filePath) => {
    const linkName = getLinkName(filePath);

    // Toggle checkedLinkNames
    setCheckedLinkNames((prevNames) => {
      if (prevNames.includes(linkName)) {
        // If the link is already checked, remove it
        return prevNames.filter((name) => name !== linkName);
      } else {
        // If the link is not checked, add it
        return [...prevNames, linkName];
      }
    });

    // Toggle checkedEntityNames
    setCheckedEntityNames((prevNames) => {
      if (prevNames.includes(linkName)) {
        // If the entity is already checked, remove it
        return prevNames.filter((name) => name !== linkName);
      } else {
        // If the entity is not checked, add it
        return [...prevNames, linkName];
      }
    });
  };


  // const handleInputData = () => {
  //   if (selectedEntity) {
  //     const upperCaseInputValue = inputValue.toUpperCase();
  //     setInputData({ [selectedEntity]: upperCaseInputValue }); // Save selectedEntity as key and inputValue as value
  //   }
  // };
  const handleInputData = useCallback(() => {
    const upperCaseInputValue = inputValue.toUpperCase();
    setInputData({ [selectedEntity]: upperCaseInputValue }); // Save selectedEntity as key and inputValue as value
     console.log("inputData" , inputData) ;
  }, [selectedEntity, inputValue]);

  useEffect(() => {
    handleInputData();
  }, [handleInputData]);

  const handleSelectChange = (e) => {
    const entity = e.target.value;
    setSelectedEntity(entity);
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value || "";
    setInputValue(value);
  };
  
  // Using useEffect to handle data updates after state changes
  // useEffect(() => {
  //   handleInputData();
    
  // console.log("inputData" , inputData) ; 
  // }, [selectedEntity, inputValue]);

  
  const [showTable1, setShowTable1] = useState(true);

  const handleToggle = (table) => {
    setShowTable1(table === "table1");
  };

  return (
    <>
      <Navbar image="newedgeintelligence.png" color="white" />
      <div className="flex coloum">
        <div className="main_visualize col-12">
          <div className="row">
            <h1> Filters</h1>
            <div>
              <button className="custom-button"   onClick={() => handleToggle("table1")}>
               Filter by entity 
              </button>
              <button  className="custom-button"  onClick={() => handleToggle("table2")}>
                Filter by id
              </button>
            </div>

            <div className="col-7">
              <div className="table-container">
                <div className="table-section1">
                  <h3 className="entity_class">ENTITY</h3>
                  <div className="table-wrapper"  style={{ height: "80%" }}>
                    {showTable1 ? (
                      <table className="table2">
                        <thead>
                          <tr>
                            <th>NAME</th>
                            <th>TYPE</th>
                          </tr>
                        </thead>
                        <tbody>
  {Object.entries(entityHeaders).map(([filePath, headers], index) =>
    headers.map((header, headerIndex) => {
      if (uniqueData.length !== 0) {
        if (uniqueData[index][header].length < 150) {
          return (
            <tr key={`${index}-${headerIndex}`}>
              <td>
                {headerIndex === 0 ? (
                  <>
                    <input
                      className="inputcheck"
                      type="checkbox"
                      onChange={() => handleEntityData_main(filePath)}
                      checked={checkedEntityNames.includes(
                        getEntityName(filePath)
                      )}
                      value={getEntityName(filePath)}
                    />
                    {getEntityName(filePath)}
                  </>
                ) : (
                  ""
                )}
              </td>
              <td>
                <div className="dropdown">
                  <button className="dropbtn">{header}</button>
                  <div className="dropdown-content">
                    {uniqueData[index][header].map((item, itemIndex) => (
                      <label key={itemIndex}>
                        <input
                          className="inputcheck"
                          type="checkbox"
                          value={item}
                          onChange={() => {
                            handleEntityData(filePath, header, item);
                          }}
                          checked={
                            checkedDropdownItems[getEntityName(filePath)]?.[
                              header
                            ]?.[item]
                          }
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          );
        }
      }
      return null;
    })
  )}
</tbody>

                      </table>
                    ) : (
                      <table className="table2">
                        <thead>
                          <tr>
                            <th>NAME</th>
                            {/* <th>TYPE</th> */}
                          </tr>
                        </thead>
                        <tbody>
                        <tr>
  <td>
    <div className="custom-entity-container">
      <div className="custom-entity-dropdown">
        <select
          onChange={handleSelectChange}
          value={selectedEntity}
        >
          <option value="" disabled>Select an entity</option>
          {Object.entries(entityHeaders).map(([filePath]) => {
            if (uniqueData.length !== 0) {
              return (
                <option key={filePath} value={getEntityName(filePath)}>
                  {getEntityName(filePath)}
                </option>
              );
            }
            return null;
          })}
        </select>
        <input 
          type="text" 
          value={inputValue}    
          onChange={handleInputChange} 
          placeholder="ENTER ID"
        />
      </div>
    
    </div>
  </td>
</tr>

{Object.entries(entityHeaders).map(
  ([filePath, headers], index) => {
    if (uniqueData.length !== 0) {
      const entityName = getEntityName(filePath);
      return (
        <tr key={index}>
        <td>
          <div className="checkbox-label-container">
            <input
              className="inputcheck"
              type="checkbox"
              onChange={() => handleEntityData_main(filePath)}
              checked={checkedEntityNames.includes(entityName)}
              value={entityName}
            />
            <span className="entity-text">
              {entityName}
              {entityName === "N_PARTNUMBER" && (
                <>
                  <button
                    className={`arrow-button ${!isAscending ? 'active' : ''}`}
                    onClick={handleDownArrowClick}
                  >
                    &darr;
                  </button>
                  <button
                    className={`arrow-button ${isAscending ? 'active' : ''}`}
                    onClick={handleUpArrowClick}
                  >
                    &uarr;
                  </button>
                </>
              )}
            </span>
          </div>
        </td>
      </tr>
      );
    }
    return null;
  }
)}

                        </tbody>
                      </table>
                    )}
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
                                  {

                                    // setSelectLinkNames(true);
                                    handleLinkData(filePath)
                                  }
                                  }
                                  checked={checkedLinkNames.includes(
                                    getLinkName(filePath)
                                  )}
                                  value={getLinkName(filePath)}
                                />{" "}
                                {getLinkName(filePath)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                    <button
                    style={{background: "#2a5594" ,color:"white"}}
  onClick={() => {
    if (false ) {

      alert('Please select the file first');
    } 
    else {
        navigate("/3d_graph", {
          state: {
            checkedEntityNames,
            checkedLinkNames,
            checkedDropdownItems,
            inputData,
            isAscending
          },
        });// You can adjust the delay time if necessary
    }
  }}
>
  VISUALIZE

</button>


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
