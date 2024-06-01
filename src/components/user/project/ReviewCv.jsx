import React, { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Drawer, message } from "antd";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReviewCvFile = ({ url, setOpen, open }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const onClose = () => {
    setOpen(false);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const targetUrl = url;
  const fileUrl = proxyUrl + targetUrl;
  const onDocumentLoadError = (error) => {
    message.error("Không thể tải tệp PDF: " + error.message);
    console.error("Error loading PDF document:", error);
  };
  const options = useMemo(() => {
    return {
      cMapUrl: "/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "/standard_fonts/",
    };
  }, []);

  return (
    <div>
      <Drawer
        title="Xem hồ sơ chủ nhiệm"
        placement="right"
        width={700}
        onClose={onClose}
        open={open}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          options={options}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        {/* {numPages && (
          <p>
            Trang {pageNumber} của {numPages}
          </p>
        )} */}
      </Drawer>
    </div>
  );
};

export default ReviewCvFile;
