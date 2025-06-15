import React, { useState } from 'react'
import MedicalCertificate from './components/MedicalCertificate'
import MedicalPrescription from './components/MedicinePrecription'

const App = () => {
  const [tab, setTab] = useState("prescription");

  return (
    <div style={{ padding: 20 }}>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setTab("prescription")}
          style={{
            padding: "10px 20px",
            backgroundColor: tab === "prescription" ? "#4caf50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            marginRight: 10,
          }}
        >
          Prescription
        </button>
        <button
          onClick={() => setTab("certificate")}
          style={{
            padding: "10px 20px",
            backgroundColor: tab === "certificate" ? "#4caf50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 5,
          }}
        >
          Medical Certificate
        </button>
      </div>

      {tab === "certificate" ? <MedicalCertificate /> : <MedicalPrescription />}
    </div>
  );
};

export default App;
