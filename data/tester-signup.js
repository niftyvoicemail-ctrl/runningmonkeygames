const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(process.cwd(), "data", "testers.json");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body);

    const entry = {
      email: payload.email,
      futureTester: !!payload.future,
      deleteAfter: !!payload.delete,
      submittedAt: new Date().toISOString()
    };

    let existing = [];
    if (fs.existsSync(DATA_FILE)) {
      existing = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }

    existing.push(entry);

    fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};