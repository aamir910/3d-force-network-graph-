import React, { useState } from 'react';
import { Upload, Button, Card, Row, Col, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Papa from 'papaparse'; // Import PapaParse for parsing CSV files

import Navbar from "../NavBar/NavBar";
import './FileUploadSection.css'; // Import the CSS file for styling

const { Text } = Typography;

const FileUploadSection = () => {
  const [entityFiles, setEntityFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [linkFiles, setLinkFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [iconFiles, setIconFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [entityData, setEntityData] = useState([]); // State to hold parsed entity data
  const [linkData, setLinkData] = useState([]); // State to hold parsed link data
  const [iconData, setIconData] = useState([]); // State to hold uploaded icon file data

  const beforeUpload = (file, files, setFiles, setData, index) => {
    // Here we directly access the file and parse it if necessary
    const fileName = file.name;
    const updatedFiles = [...files];
    updatedFiles[index] = { file: file.originFileObj, name: fileName, loaded: true }; // Store file object and name
    setFiles(updatedFiles);

    // Handle parsing for CSV files
    if (file.type.includes('csv')) {
      Papa.parse(file, {
        header: true, // Change to false if you don't want headers
        complete: (results) => {
          setData(results.data); // Store parsed data

        console.log("Parsed CSV Data:", results.data);
          message.success(`${fileName} uploaded and parsed successfully`);
        },
        error: (error) => {
          message.error(`Error parsing ${fileName}: ${error.message}`);
        },
      });
    } else {
      message.success(`${fileName} uploaded successfully`);
      setIconData(prev => [...prev, { file: file, name: fileName }]); // Store uploaded icon file data
    }

    return false; // Prevent automatic upload
  };

  const handleLoadClick = (files, setFiles, index) => {
    const updatedFiles = [...files];
    updatedFiles[index].loaded = false; // Set as "unloaded"
    setFiles(updatedFiles);
  };

  const renderFileList = (files, setFiles, setData, acceptType) => (
    <div style={{ borderRadius: 0, height: 300, overflowY: 'auto' }}>
      {files.map((file, index) => (
        <Row key={index} style={{ marginBottom: '10px' }}>
          <Col span={12}>
            <Text>{file.name}</Text>
          </Col>
          <Col span={8}>
            {!file.loaded ? (
              <Upload
                accept={acceptType}
                beforeUpload={(file) => beforeUpload(file, files, setFiles, setData, index)} // Use beforeUpload
                fileList={[]}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            ) : (
              <Button type="primary" onClick={() => handleLoadClick(files, setFiles, index)}>
                Edit
              </Button>
            )}
          </Col>
        </Row>
      ))}
    </div>
  );

  return (
    <>
      <Navbar image="newedgeintelligence.png" color="#f0f0f0" />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card
          title="File Upload Sections"
          bordered={true}
          style={{ width: '80%', padding: '20px', textAlign: 'center', background: "#f2f2f2" }}
        >
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              {/* Entity Section */}
              <Card
                title={<div style={{ backgroundColor: 'orange', padding: '1px', borderRadius: '4px' }}>ENTITY</div>}
              >
                {renderFileList(entityFiles, setEntityFiles, setEntityData, ".csv")}
                <Button onClick={() => setEntityFiles([...entityFiles, { file: null, name: 'Enter file', loaded: false }])} type="dashed" block>
                  Add More File
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              {/* Link Section */}
              <Card
                title={<div style={{ backgroundColor: 'yellow', padding: '1px', borderRadius: '4px' }}>LINK</div>}
              >
                {renderFileList(linkFiles, setLinkFiles, setLinkData, ".csv")}
                <Button onClick={() => setLinkFiles([...linkFiles, { file: null, name: 'Enter file', loaded: false }])} type="dashed" block>
                  Add More File
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              {/* Icon Section */}
              <Card
                title={<div style={{ backgroundColor: '#3cb9eb', padding: '1px', borderRadius: '4px' }}>ICON</div>}
              >
                {renderFileList(iconFiles, setIconFiles, setIconData, ".png,.jpg,.jpeg")}
                <Button onClick={() => setIconFiles([...iconFiles, { file: null, name: 'Enter file', loaded: false }])} type="dashed" block>
                  Add More File
                </Button>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};

export default FileUploadSection;
