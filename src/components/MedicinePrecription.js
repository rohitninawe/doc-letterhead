import React, { useState } from "react";
import { generatePrescriptionDocDefinition } from "../helper/generatePrescriptionPDF"; // Refactored to return docDefinition
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

const PrescriptionForm = () => {
    const [form, setForm] = useState({
        complaint: "",
        dosageDuration: "",
        powderDose: "",
        liquidDose: "",
        bottleLarge: "",
        bottleMedium: "",
        bottleSmall: "",
        advice: "",
        followupDate: "",
        fontSize: 12,
        patientName: "",
        patientAge: "",
        patientSex: "",
        consultationDate: "",
        lineSpacing: 1.2,
    });

    const [pdfUrl, setPdfUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePreview = async () => {
        const docDefinition = await generatePrescriptionDocDefinition(form);
        pdfMake.createPdf(docDefinition).getBlob((blob) => {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        });
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "prescription.pdf";
        link.click();
    };

    const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);

    return (
        <div>

            <div style={{ marginBottom: 10 }}>
                <label>Patient Name: </label>
                <input
                    type="text"
                    name="patientName"
                    value={form.patientName}
                    onChange={handleChange}
                    style={{ width: 300 }}
                />
            </div>

            <div style={{ marginBottom: 10 }}>
                <label>Patient Age: </label>
                <input
                    type="number"
                    name="patientAge"
                    value={form.patientAge}
                    onChange={handleChange}
                    style={{ width: 100 }}
                />
            </div>

            <div style={{ marginBottom: 10 }}>
                <label>Patient Sex: </label>
                <select
                    name="patientSex"
                    value={form.patientSex}
                    onChange={handleChange}
                    style={{ width: 120 }}
                >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div style={{ marginBottom: 10 }}>
                <label>Consultation Date: </label>
                <input
                    type="date"
                    name="consultationDate"
                    value={form.consultationDate}
                    onChange={handleChange}
                />
            </div>

            {["diagnosis", "dosageDuration", "powderDose", "liquidDose", "bottleLarge", "bottleMedium", "bottleSmall", "advice"].map((field) => (
                <div key={field} style={{ marginBottom: 10 }}>
                    <label>{field.replace(/([A-Z])/g, " $1")}: </label>
                    <textarea
                        rows={field === "dosageDuration" ? 1 : 3}
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                    />
                </div>
            ))}

            <div style={{ marginBottom: 10 }}>
                <label>Follow-up Date: </label>
                <input
                    type="date"
                    name="followupDate"
                    value={form.followupDate}
                    onChange={handleChange}
                />
            </div>

            <div style={{ marginBottom: 20 }}>
                <label>Font Size: </label>
                <input
                    type="number"
                    name="fontSize"
                    min={8}
                    max={18}
                    value={form.fontSize}
                    onChange={handleChange}
                />
            </div>

            <div style={{ marginBottom: 20 }}>
                <label>Line Spacing: </label>
                <input
                    type="number"
                    name="lineSpacing"
                    step="0.1"
                    min="1"
                    max="2"
                    value={form.lineSpacing}
                    onChange={handleChange}
                    style={{ width: 80 }}
                />
            </div>

            <button onClick={handlePreview} style={{ padding: "10px 20px" }}>
                Generate Preview
            </button>

            {pdfUrl && <button
                onClick={handleDownload}
                style={{ marginTop: 20, padding: "10px 20px" }}
            >
                Download PDF
            </button>}

            {pdfUrl && (
                <>
                    <div style={{ marginTop: 30 }}>
                        <h3>PDF Preview:</h3>
                        {isMobile ? (
                            <button onClick={() => window.open(pdfUrl, "_blank")}>
                                View PDF in New Tab
                            </button>
                        ) : (
                            <iframe
                                title="PDF Preview"
                                src={pdfUrl}
                                width="100%"
                                height="600px"
                                style={{ border: "1px solid #ccc" }}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PrescriptionForm;
