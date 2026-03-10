import { google } from "googleapis";

export async function getGoogleSheetsData(range: string) {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("GOOGLE_PRIVATE_KEY environment variable is missing");
  }

  // const auth = new google.auth.GoogleAuth({
  //   credentials: {
  //     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  //     private_key: privateKey.replace(/\\n/g, "\n"),
  //   },
  //   scopes: ["https://www.googleapis.com/auth/spreadsheets.readOnly"],
  // });
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Ensure the key is trimmed and correctly handles literal newlines
      private_key:
        process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join("\n") ?? "",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  // console.info(auth);
  // Explicitly get the authenticated client
  const authClient = await auth.getClient();
  // const sheets = google.sheets({ version: "v4", auth: authClient as any });
  const sheets = google.sheets({ version: "v4", auth });
  // console.error(sheets);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range,
  });

  return response.data.values;
}

export async function appendToSheet(
  data: string[],
  spreadsheetId = process.env.GOOGLE_SHEET_ID,
  range = "Sheet1!A:K",
) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Ensure the key is trimmed and correctly handles literal newlines
        private_key:
          process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join("\n") ??
          "",
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range, // Adjust range as needed
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [data],
      },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function runSample(
  sheetId: number,
  startIndex: number,
  endIndex: number,
  spreadsheetId = process.env.GOOGLE_SHEET_ID,
) {
  // Obtain user credentials to use for the request
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      // Ensure the key is trimmed and correctly handles literal newlines
      private_key:
        process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join("\n") ?? "",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  // const client = await auth.getClient();
  // google.options({ auth: client });
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.batchUpdate(
    {
      spreadsheetId,
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId,
                dimension: "COLUMNS",
                startIndex,
                endIndex,
              },
              inheritFromBefore: false,
            },
          },
        ],
      },
    },
    {
      params: {},
    },
  );
  // console.info(res);
  return res.data;
}
