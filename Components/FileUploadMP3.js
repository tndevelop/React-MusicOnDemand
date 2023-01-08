import React, { Fragment, useState } from 'react';
import { Container, Row, Col } from "react-bootstrap"
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import { propTypes } from 'react-bootstrap/esm/Image';


function FileUploadMP3(props) {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
  
    const onChange = e => {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    };
  
    const onSubmit = async e => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const res = await axios.post('/uploadMP3', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
          }
        });
        
        // Clear percentage
        setTimeout(() => setUploadPercentage(0), 10000);
  
        const { fileName, filePath } = res.data;
  
        setUploadedFile({ fileName, filePath });
        props.setUploadPressed(true);
  
        setMessage('File Uploaded');
        props.setAudioName(fileName);
      } catch (err) {
        if (err.response.status === 500) {
          setMessage('There was a problem with the server');
        } else {
          setMessage(err.response.data.msg);
        }
        setUploadPercentage(0)
      }
    };
  
    return (
        <Col>
       <Row/> 
      <Fragment>
        {message ? <Message msg={message} /> : null}
        <form onSubmit={onSubmit}>
          <b>Please select a file to upload: </b>
          <div className='custom-file mb-2 mt-4'>
            <input
              type='file'
              className='custom-file-input'
              id='customFile'
              onChange={onChange}
            />
            {/*<label className='custom-file-label' htmlFor='customFile'>
              {filename}
    </label>*/}
          </div>
  
          <input
            type='submit'
            value='Upload'
            className='btn btn-primary btn-block mt-2 mb-2'
          />
  
          <Progress percentage={uploadPercentage} />

        </form>
        {uploadedFile ? (
          <div className='row mt-4'>
            <div className='m-auto'>
              <b>File Uploaded: </b>
              <>{uploadedFile.fileName}</>
              <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
            </div>
          </div>
        ) : null}
      </Fragment>
      </Col>
    );
  };

  export default FileUploadMP3;