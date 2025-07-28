import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Slip from "../organisms/Slip";
// import PrintableContent from "./PrintableContent";

const GeneratePDF = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("report.pdf");
    }
  };

  return (
    <div>
      <button onClick={handleDownloadPDF}>Download PDF</button>

      {/* Hidden container for printable content */}
      <div
        ref={printRef}
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      >
        {/* <Slip
          progressChartReading={{ Pegasus: 2, Structure: 20, Vomero: 100 }}
          shoeName="Pegasus"
        /> */}
      </div>
    </div>
  );
};

export default GeneratePDF;
