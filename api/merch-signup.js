import crypto from "node:crypto";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signJwt(payload, privateKey) {
  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const unsigned = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(privateKey, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${unsigned}.${signature}`;
}

async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY.");
  }

  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt(
    {
      iss: clientEmail,
      scope: GOOGLE_SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now,
    },
    privateKey,
  );

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function appendSignupRow({ email, source, ip, userAgent }) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME || "emails";

  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID.");
  }

  const accessToken = await getGoogleAccessToken();
  const range = encodeURIComponent(`${sheetName}!A:D`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const values = [[new Date().toISOString(), email, source || "site", `${ip || ""} | ${userAgent || ""}`]];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      majorDimension: "ROWS",
      values,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Sheets append failed: ${response.status} ${text}`);
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function parseBody(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  return {};
}

export async function POST(request) {
  try {
    const body = await parseBody(request);
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "merch-drop").trim();

    if (!email || !isValidEmail(email)) {
      return json({ ok: false, error: "Valid email required." }, { status: 400 });
    }

    await appendSignupRow({
      email,
      source,
      ip: request.headers.get("x-forwarded-for") || "",
      userAgent: request.headers.get("user-agent") || "",
    });

    return json({ ok: true });
  } catch (error) {
    console.error(error);
    return json({ ok: false, error: "Signup failed." }, { status: 500 });
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      allow: "POST, OPTIONS",
    },
  });
}
