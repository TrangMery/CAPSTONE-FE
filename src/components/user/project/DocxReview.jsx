import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';

const DocxPreview = ({ fileUrl }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const fetchAndConvertDocx = async () => {
      try {
        // Fetch the DOCX file as a Blob
        const response = await axios.get(fileUrl, { responseType: 'blob' });
        const blob = response.data;
        
        // Convert the Blob to an ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer();
        
        // Convert the DOCX file to HTML
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setHtmlContent(result.value);
      } catch (error) {
        console.error('Error fetching or converting DOCX file:', error);
      }
    };

    fetchAndConvertDocx();
  }, [fileUrl]);
  const googleDocsUrl = `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
  return (
    <div>
      <iframe src={googleDocsUrl} style={{ width: '100%', height: '500px' }} frameBorder="0" />
    </div>
  );
};

export default DocxPreview;
