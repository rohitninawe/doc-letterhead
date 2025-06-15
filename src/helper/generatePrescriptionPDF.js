import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

const toDataURL = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
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

export const generatePrescriptionDocDefinition = async (data) => {
  const {
    complaint,
    dosageDuration,
    powderDose,
    liquidDose,
    bottleLarge,
    bottleMedium,
    bottleSmall,
    advice,
    followupDate,
    fontSize = 12,
    lineSpacing = 1.2,
    patientName,
    patientAge,
    patientSex,
    consultationDate,
  } = data;

  const backgroundImage = await toDataURL(`${process.env.PUBLIC_URL}/letterhead.png`);

  const positionedFields = [
    {
      text: patientName,
      fontSize: 14,
      bold: true,
      absolutePosition: { x: 435, y: 192 }, // absolutePosition: { x: 440, y: 645 }, gap: 23, 215, 169
    },
    {
      text: patientAge,
      fontSize: 14,
      bold: true,
      absolutePosition: { x: 355, y: 215 },
    },
    {
      text: patientSex,
      fontSize: 14,
      bold: true,
      absolutePosition: { x: 435, y: 215 },
    },
    {
      text: formatDate(consultationDate),
      fontSize: 14,
      bold: true,
      absolutePosition: { x: 462, y: 238 },
    },
  ].filter((f) => f.text); // skip if no value

  const content = [
    // { text: "Medical Prescription", style: "header" },
  ];

  const addLine = (label, value) => {
    if (value) {
      content.push({
        text: `${label}: ${value}`,
        fontSize,
        lineHeight: lineSpacing,
        margin: [0, 5],
      });
    }
  };

  addLine("C/o", complaint);
  addLine("Dosage Duration", dosageDuration);
  addLine("Powder Dose", powderDose);
  addLine("Liquid Dose", liquidDose);
  addLine("Large Bottle", bottleLarge);
  addLine("Medium Bottle", bottleMedium);
  addLine("Small Bottle", bottleSmall);
  addLine("Advice", advice);
  addLine("Next Follow-up", formatDate(followupDate));

  return {
    background: [{ image: backgroundImage, width: 595, height: 842 }],
    content: [...positionedFields, ...content],
    pageSize: "A4",
    pageMargins: [40, 280, 40, 60],
    styles: {
      header: {
        fontSize: fontSize + 2,
        bold: true,
        alignment: "center",
        margin: [0, 10],
      },
    },
  };
};
