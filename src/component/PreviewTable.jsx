import React from "react";

const PreviewTable = ({ previewData }) => {
  return (
    <table border="1">
      <thead>
        <tr>
          {Object.keys(previewData[0] || {}).map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {previewData.map((row, index) => (
          <tr key={index} style={{ backgroundColor: row.isMismatched ? "red" : "white" }}>
            {Object.values(row).map((value, idx) => (
              <td key={idx}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PreviewTable;
