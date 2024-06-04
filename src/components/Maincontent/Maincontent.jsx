import React from 'react';
import './MainContent.css';

function MainContent() {
    return (
        <div className="main">
            <div className="table-container">
                <div className="table-section">
                    <h3>ENTITY</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>ATTRIBUTE</th>
                                <th>TYPE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>PART_NUMBER</td>
                                <td>DESIGNATION</td>
                                <td>CHR</td>
                            </tr>
                            <tr>
                                <td>PART_NUMBER</td>
                                <td>FAMILY CODE</td>
                                <td>CHR</td>
                            </tr>
                            <tr>
                                <td>PART_NUMBER</td>
                                <td>COMMODITY CLASS</td>
                                <td>CHR</td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
                <div className="table-section">
                    <h3>LINK</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>ATTRIBUTE</th>
                                <th>TYPE</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>BOM</td>
                                <td>VALIDITY DATE FROM</td>
                                <td>DATE</td>
                            </tr>
                            <tr>
                                <td>BOM</td>
                                <td>VALIDITY DATE TO</td>
                                <td>DATE</td>
                            </tr>
                            <tr>
                                <td>BOM</td>
                                <td>QUANTITY</td>
                                <td>REAL</td>
                            </tr>
                            {/* Add more rows as needed */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default MainContent;
