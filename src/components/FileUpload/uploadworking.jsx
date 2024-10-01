

import React, { useState } from 'react';
import { Upload, Button, Card, Row, Col, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios'; // Import Axios for HTTP requests

import Navbar from "../NavBar/NavBar";
import './FileUploadSection.css'; 

const { Text } = Typography;

const FileUploadSection = () => {
  const [entityFiles, setEntityFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [linkFiles, setLinkFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  const [iconFiles, setIconFiles] = useState([{ file: null, name: 'Enter file', loaded: false }]);
  
  console.log(entityFiles , linkFiles , "linkFiles linkFiles " )
  const beforeUpload = (file, files, setFiles, index) => {
    console.log("initialfiledata" , file )
    const fileName = file.name;
    const updatedFiles = [...files];
    updatedFiles[index] = { file: file , name: fileName, loaded: true };
    setFiles(updatedFiles);
  
    message.success(`${fileName} uploaded successfully`);
    return false; // Prevent automatic upload
  };
  
  const handleLoadClick = (files, setFiles, index) => {
    const updatedFiles = [...files];
    updatedFiles[index].loaded = false;
    setFiles(updatedFiles);
  };

  const renderFileList = (files, setFiles, acceptType) => (
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
                beforeUpload={(file) => beforeUpload(file, files, setFiles, index)}
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

  const handleSubmit = async () => {
    const formData = new FormData();
  
    // Append entity files
    entityFiles.forEach((file, index) => {
      console.log(file ,"here is the file ")
      if (file.file) {
        formData.append(`entityFiles_${index}`, file.file);
      }
    });
  
    // Append link files
    linkFiles.forEach((file, index) => {
      if (file.file) {
        formData.append(`linkFiles_${index}`, file.file);
      }
    });
  
    // Append icon files
    iconFiles.forEach((file, index) => {
      if (file.file) {
        formData.append(`iconFiles_${index}`, file.file);
      }
    });
  
    // Log the formData
    try {
      const response = await axios.post('http://localhost/React_php/edge.php', formData, {
        headers: {  
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success("Files uploaded successfully!");
      console.log("Backend Response:", response.data);
      
    } catch (error) {
      console.error("Error uploading files:", error);
      message.error("Error uploading files");
    }
  };

  return (
    <>
      <Navbar image="newedgeintelligence.png" color="#f0f0f0" />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Card
          title="File Upload Sections"
          bordered={true}
          style={{ width: '80%', padding: '10px', textAlign: 'center', background: "#f2f2f2" }}
        >
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              {/* Entity Section */}
              <Card
                title={<div style={{ backgroundColor: 'orange', padding: '1px', borderRadius: '4px' }}>ENTITY</div>}
              >
                {renderFileList(entityFiles, setEntityFiles, ".csv")}
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
                {renderFileList(linkFiles, setLinkFiles, ".csv")}
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
                {renderFileList(iconFiles, setIconFiles, ".png,.jpg,.jpeg")}
                <Button onClick={() => setIconFiles([...iconFiles, { file: null, name: 'Enter file', loaded: false }])} type="dashed" block>
                  Add More File
                </Button>
              </Card>
            </Col>
          </Row>
          <Button type="primary" onClick={handleSubmit} style={{ marginTop: '20px' }}>
            Submit
          </Button>
        </Card>
      </div>
    </>
  );
};

export default FileUploadSection;
