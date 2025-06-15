import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

const MedicalCertificate = () => {
  const [form, setForm] = useState({
    salutation: "Mr.",
    name: "",
    age: "",
    sex: "Male",
    condition: "",
    consultationDate: "",
    treatmentDate: "",
    fitDate: "",
    inProgress: false,
    sameConsultationDate: false
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "sameConsultationDate") {
      setForm((prev) => ({
        ...prev,
        sameConsultationDate: checked,
        consultationDate: checked ? prev.treatmentDate : ""
      }));
    } else if (name === "treatmentDate" && form.sameConsultationDate) {
      setForm((prev) => ({
        ...prev,
        treatmentDate: value,
        consultationDate: value
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
            ? "rd"
            : "th";

    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day}${suffix} ${month}, ${year}`;
  };

  const generatePDF = async () => {
    const existingPdfBytes = await fetch(process.env.PUBLIC_URL + "/template.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const page = pages[0];

    const TimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const TimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontSize = 22;
    const color = rgb(0, 0, 0);

    const isWas = form.inProgress ? "is" : "was";
    const heShe = form.sex === "Male" ? "He" : "She";
    const himHer = form.sex === "Male" ? "him" : "her";

    const treatmentLine = form.inProgress
      ? `and is currently under my treatment from ${formatDate(form.treatmentDate) || "_________"}.`
      : `and was under my treatment on ${formatDate(form.treatmentDate) || "_________"}.`;

    const titleText = "TO WHOM SO EVER IT MAY CONCERN:";

    // Certificate content
    page.drawText(titleText, {
      x: 30,
      y: 540,
      size: fontSize,
      font: TimesRomanBold,
      color,
    });

    // Calculate center
    const textWidth = TimesRomanBold.widthOfTextAtSize(titleText, fontSize);
    const centerX = (595.28 - textWidth) / 2;
    const titleY = 570;
    page.drawLine({
      start: { x: 30, y: 538 },
      end: { x: 30 + textWidth, y: 538 },
      thickness: 0.7,
      color,
    });

    page.drawText("This is to certify that", { x: 30, y: 480, size: fontSize, font: TimesRoman, color });
    page.drawText(`${form.salutation} ${form.name || "___________________________"}`, {
      x: 30,
      y: 452,
      size: fontSize,
      font: TimesRoman,
      color,
    });
    page.drawText(`${isWas} suffering from ${form.condition || "_____________________"}`, {
      x: 30,
      y: 424,
      size: fontSize,
      font: TimesRoman,
      color,
    });
    page.drawText(treatmentLine, {
      x: 30,
      y: 396,
      size: fontSize,
      font: TimesRoman,
      color,
    });
    page.drawText(`I have had advised rest for ${himHer}.`, {
      x: 30,
      y: 368,
      size: fontSize,
      font: TimesRoman,
      color,
    });
    page.drawText(`${heShe} is fit to resume the normal duties`, {
      x: 30,
      y: 320,
      size: fontSize,
      font: TimesRoman,
      color,
    });
    page.drawText(`from ${formatDate(form.fitDate) || "_________"}.`, {
      x: 30,
      y: 290,
      size: fontSize,
      font: TimesRoman,
      color,
    });

    // Rx Line
    page.drawText(form.name, { x: 440, y: 645, size: fontSize - 6, font: TimesRoman, color });
    page.drawText(form.age, { x: 360, y: 622, size: fontSize - 6, font: TimesRoman, color });
    page.drawText(form.sex, { x: 440, y: 622, size: fontSize - 6, font: TimesRoman, color });
    page.drawText(formatDate(form.consultationDate), { x: 465, y: 598, size: fontSize - 6, font: TimesRoman, color });

    // Consultation Date
    // page.drawText(`Consultation Date: ${form.consultationDate}`, {
    //   x: 50,
    //   y: 445,
    //   size: fontSize,
    //   font: TimesRoman,
    //   color,
    // });

    // Save as blob for preview
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    setPreviewUrl(blobUrl);
  };


  const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);


  return (
    <div style={{ padding: 20 }}>

      {/* Salutation */}
      <label>Salutation: </label>
      <select name="salutation" value={form.salutation} onChange={handleChange}>
        <option>Mr.</option>
        <option>Mrs.</option>
        <option>Ms.</option>
        <option>Mst.</option>
      </select>

      {/* Name */}
      <div style={{ margin: "10px 0" }}>
        <label>Patient Name: </label>
        <input name="name" value={form.name} onChange={handleChange} style={{ width: 300 }} />
      </div>

      {/* Age and Sex */}
      <div style={{ margin: "10px 0" }}>
        <label>Age: </label>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          style={{ width: 100 }}
        />
        <label style={{ marginLeft: 20 }}>Sex: </label>
        <label>
          <input
            type="radio"
            name="sex"
            value="Male"
            checked={form.sex === "Male"}
            onChange={handleChange}
          />
          Male
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            name="sex"
            value="Female"
            checked={form.sex === "Female"}
            onChange={handleChange}
          />
          Female
        </label>
      </div>

      {/* Condition */}
      <div style={{ margin: "10px 0" }}>
        <label>Condition: </label>
        <input
          name="condition"
          value={form.condition}
          onChange={handleChange}
          style={{ width: 300 }}
        />
      </div>
      {/* Treatment in Progress */}
      <div style={{ margin: "10px 0" }}>
        <label>
          <input
            type="checkbox"
            name="inProgress"
            checked={form.inProgress}
            onChange={handleChange}
          />
          Treatment is in progress
        </label>
      </div>

      {/* Dates */}
      <div style={{ margin: "10px 0" }}>
        <label>Treatment Date: </label>
        <input type="date" name="treatmentDate" value={form.treatmentDate} onChange={handleChange} />
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>Fit-to-resume Date: </label>
        <input type="date" name="fitDate" value={form.fitDate} onChange={handleChange} />
      </div>
      <div style={{ margin: "10px 0" }}>
        <label>Consultation Date: </label>
        <input
          type="date"
          name="consultationDate"
          value={form.consultationDate}
          onChange={handleChange}
          disabled={form.sameConsultationDate}
        />
        <label style={{ marginLeft: 10 }}>
          <input
            type="checkbox"
            name="sameConsultationDate"
            checked={form.sameConsultationDate}
            onChange={handleChange}
          />
          Same as Treatment Date
        </label>
      </div>


      {/* Generate Button */}
      <button onClick={generatePDF} style={{ padding: "10px 20px", marginTop: 20 }}>
        Generate Preview
      </button>

      {previewUrl && <button
        onClick={() => {
          const link = document.createElement("a");
          link.href = previewUrl;
          link.download = `${form.name || "Patient"}_Medical_Certificate.pdf`;
          link.click();
        }}
        style={{ marginTop: 20, padding: "10px 20px" }}
      >
        Download PDF
      </button>}

      {previewUrl && (
        <div style={{ marginTop: 30 }}>
          <h3>PDF Preview:</h3>
          {isMobile ? (
            <button onClick={() => window.open(previewUrl, "_blank")}>
              View PDF in New Tab
            </button>
          ) : (
            <iframe
              title="PDF Preview"
              src={previewUrl}
              width="100%"
              height="600px"
              style={{ border: "1px solid #ccc" }}
            />
          )}
        </div>
      )}

    </div>
  );
};

export default MedicalCertificate;
