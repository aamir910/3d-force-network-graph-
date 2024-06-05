import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './MainContent.css';

const csvFiles = [
    '/EDGES/E_BOM.csv',
    '/EDGES/E_ORDERCUST.csv',
    '/EDGES/E_ORDERSUPP.csv',
    '/EDGES/E_PNSELLORD.csv',
    '/EDGES/E_PNSUPPORD.csv'
];
const csvFiles2 = [
    '/NODES/N_CUSTOMER.csv',
    '/NODES/N_PARTNUMBER.csv',
    '/NODES/N_PURCHORDER.csv',
    '/NODES/N_SELLORDER.csv',
    '/NODES/N_SUPPLIER.csv'
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
                        resolve(results.meta.fields);
                    },
                    error: (error) => {
                        reject(error);
                    }
                });
            });
        };

        const loadAllCSVs = async () => {
            try {
                const entityHeaderPromises = csvFiles2.map(file => loadCSV(file));
                const linkHeaderPromises = csvFiles.map(file => loadCSV(file));
                
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
                console.error('Error loading CSV files:', error);
            }
        };

        loadAllCSVs();
    }, []);

    const getEntityName = (filePath) => {
        const fileName = filePath.split('/').pop();
        switch (fileName) {
            case 'N_CUSTOMER.csv':
                return 'CUSTOMER';
            case 'N_PARTNUMBER.csv':
                return 'PARTNUMBER';
            case 'N_PURCHORDER.csv':
                return 'PURCHORDER';
            case 'N_SELLORDER.csv':
                return 'SELLORDER';
            case 'N_SUPPLIER.csv':
                return 'SUPPLIER';
            default:
                return '';
        }
    };

    const getLinkName = (filePath) => {
        const fileName = filePath.split('/').pop();
        switch (fileName) {
            case 'E_BOM.csv':
                return 'BOM';
            case 'E_ORDERCUST.csv':
                return 'ORDERCUST';
            case 'E_ORDERSUPP.csv':
                return 'ORDERSUPP';
            case 'E_PNSELLORD.csv':
                return 'PNSELLORD';
            case 'E_PNSUPPORD.csv':
                return 'PNSUPPORD';
            default:
                return '';
        }
    };

    return (
        <div className="main">
            <div className="table-container">
                <div className="table-section">
                    <h3>ENTITY</h3>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>ATTRIBUTE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(entityHeaders).map(([filePath, headers], index) => (
                                    headers.map((header, headerIndex) => (
                                        <tr key={`${index}-${headerIndex}`}>
                                         
                                                <td>{getEntityName(filePath)}</td>
                                          
                                            <td>{header}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="table-section">
                    <h3>LINK</h3>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>ATTRIBUTE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(linkHeaders).map(([filePath, headers], index) => (
                                    headers.map((header, headerIndex) => (
                                        <tr key={`${index}-${headerIndex}`}>
                                           
                                                <td >{getLinkName(filePath)}</td>
                                           
                                            <td>{header}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;
