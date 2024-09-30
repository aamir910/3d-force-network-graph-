import React, { useState } from 'react';
import { Upload, Button, Card, Row, Col, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Navbar from '../NavBar/NavBar';

import './FileUploadSection.css'; // Import the CSS file for styling

const { Text } = Typography;

const FileUploadSection = () => {
  const [entityFiles, setEntityFiles] = useState([{ name: 'Enter file', loaded: false }]);
  const [linkFiles, setLinkFiles] = useState([{ name: 'Enter file', loaded: false }]);
  const [iconFiles, setIconFiles] = useState([{ name: 'Enter file', loaded: false }]);

  const handleFileChange = (info, files, setFiles, index) => {
    if (info.file.status !== 'uploading') {
      const fileName = info.file.name;
      const updatedFiles = [...files];
      updatedFiles[index] = { name: fileName, loaded: true }; // Mark file as loaded
      setFiles(updatedFiles);
      message.success(`${fileName} uploaded successfully`);
    }
  };

  const handleLoadClick = (files, setFiles, index) => {
    const updatedFiles = [...files];
    updatedFiles[index].loaded = false; // Set as "unloaded"
    setFiles(updatedFiles);
  };

  const renderFileList = (files, setFiles, acceptType) => (
    <div     style={{ borderRadius: 0, height: 300, overflowY: 'auto' }}>
      {files.map((file, index) => (
        <Row key={index} style={{ marginBottom: '10px' }}>
          <Col span={12}>
            <Text>{file.name}</Text>
          </Col>
          <Col span={8}>
            {!file.loaded ? (
              <Upload
                accept={acceptType}
                onChange={(info) => handleFileChange(info, files, setFiles, index)}
                beforeUpload={() => false} // Disable auto-upload
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
                {renderFileList(entityFiles, setEntityFiles, ".csv")}
                <Button onClick={() => setEntityFiles([...entityFiles, { name: 'Enter file', loaded: false }])} type="dashed" block>
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
                <Button onClick={() => setLinkFiles([...linkFiles, { name: 'Enter file', loaded: false }])} type="dashed" block>
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
                <Button onClick={() => setIconFiles([...iconFiles, { name: 'Enter file', loaded: false }])} type="dashed" block>
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
