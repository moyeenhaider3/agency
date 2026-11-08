const SPREADSHEET_ID = "1Npd7PThAWeoYK7IiH0W0Pc2YQHKN9tfLXEh9uJZcQVk";
const SHEET_NAME = "Leads";
const NOTIFICATION_EMAIL = "business.moyeen@gmail.com";

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet tab "${SHEET_NAME}" was not found.`);

    const row = [
      new Date(),
      clean(payload.enquiryType),
      clean(payload.name),
      clean(payload.company),
      clean(payload.industry),
      clean(payload.phone),
      clean(payload.whatsapp),
      clean(payload.bottleneck),
      clean(payload.currency),
      clean(payload.selectedIndustry),
      payload.consent === true ? "yes" : "no"
    ];

    sheet.appendRow(row);
    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: `New AgenticeEra ${row[1] || "enquiry"}`,
      body: row.map((value, index) => `${header()[index]}: ${value}`).join("\n")
    });

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Unable to record the enquiry." });
  }
}

function doGet() {
  return json({ ok: true, service: "AgenticeEra lead capture" });
}

function header() {
  return [
    "timestamp",
    "enquiryType",
    "name",
    "company",
    "industry",
    "phone",
    "whatsapp",
    "bottleneck",
    "currency",
    "selectedIndustry",
    "consent"
  ];
}

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

function json(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
