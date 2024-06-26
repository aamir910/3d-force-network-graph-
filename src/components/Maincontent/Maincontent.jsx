import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./MainContent.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Sidebar from "../Buttons/SIdeBar";
import Navbar from "../NavBar/NavBar";

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

const MainContent = () => {
  const [entityHeaders, setEntityHeaders] = useState({});
  const [linkHeaders, setLinkHeaders] = useState({});

  useEffect(() => {
    const loadCSV = (filePath) => {
      return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
          download: true,
          header: true,
          complete: (results) => {
            const headers = results.meta.fields;
            const data = results.data;
            resolve({ headers, data });
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
            console.log(entityHeaderPromises , 'entityHeaderPromises')
        const entityHeadersArray = await Promise.all(entityHeaderPromises);
        const linkHeadersArray = await Promise.all(linkHeaderPromises);

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
      } catch (error) {
        console.error("Error loading CSV files:", error);
      }
    };

    loadAllCSVs();
  }, []);

  let rowCount = 1;
  let linkcount = 1;
  const getEntityName = (filePath) => {
  rowCount++ ;

    const fileName = filePath.split("/").pop();
    switch (fileName) {
      case "N_CUSTOMER.csv":
        return "CUSTOMER";
      case "N_PARTNUMBER.csv":
        return "PARTNUMBER";
      case "N_PURCHORDER.csv":
        return "PURCHORDER";
      case "N_SELLORDER.csv":
        return "SELLORDER";
      case "N_SUPPLIER.csv":
        return "SUPPLIER";
      default:
        return "";
    }
  };

  const getLinkName = (filePath) => {
    linkcount++
    const fileName = filePath.split("/").pop();
    switch (fileName) {
      case "E_BOM.csv":
        return "BOM";
      case "E_ORDERCUST.csv":
        return "ORDERCUST";
      case "E_ORDERSUPP.csv":
        return "ORDERSUPP";
      case "E_PNSELLORD.csv":
        return "PNSELLORD";
      case "E_PNSUPPORD.csv":
        return "PNSUPPORD";
      default:
        return "";
    }
  };
 

  const determineType = (attribute) => {
    const integerAttributes = [
      "BOMLEV",
      "PURCH_ORD",
      "SELL_ORD",
      "PURCH_ITEM",
    ];
  
    const realAttributes = [
      "SELL_QTY",
      "PURCH_ORD_QTY",
    ];
  
    const dateAttributes = [
      "SELL_DELIV_DATE",
    ];
  
    if (integerAttributes.includes(attribute)) {
      return "INTEGER";
    } else if (realAttributes.includes(attribute)) {
      return "REAL";
    } else if (dateAttributes.includes(attribute)) {
      return "DATE";
    } else {
      return "CHR";
    }
  };
  
  return (
    <>                        
    <Navbar image = "newedgeintelligence.png" color= "#f0f0f0"/>
    <div className="flex coloum">
<div className="col-2">

      <Sidebar />
</div>
    <div className="main col-10">
      <div className="row">
        <div className="col-6">
          <div className="table-container">
            <div className="table-section1">
              <h3>ENTITY</h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>NAME</th>
                      <th>ATTRIBUTE</th>
                      <th>TYPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(entityHeaders).map(
                       
                      ([filePath, headers], index) =>
                        headers.map((header, headerIndex) => (
                          <tr key={`${index}-${headerIndex}`}>
                            <td>
                              <input type="checkbox" />
                            </td>
                            <td>{rowCount}</td>
                            <td>{getEntityName(filePath)}</td>
                            <td>{header}</td>
                            
                            <td>
                               <input
                                    type="text"
                                    value={determineType(header)}
                                   
                                  />
                                  </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="table-container">
            <div className="table-section1">
              <h3 className="link_color">LINK</h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>NAME</th>
                      <th>ATTRIBUTE</th>
                      <th>TYPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(linkHeaders).map(
                      ([filePath, headers], index) =>
                        headers.map((header, headerIndex) => (
                          <tr key={`${index}-${headerIndex}`}>
                            <td>
                              <input type="checkbox" />
                            </td>
                            <td>{linkcount}</td>
                            <td>{getLinkName(filePath)}</td>
                          
                            <td>{header}</td>

                            <td> <input
                                    type="text"
                                    value={determineType(header)}
                                   
                                  /></td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
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

export default MainContent;
