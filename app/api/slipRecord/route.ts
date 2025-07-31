import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export default async function slipRecordeHandler(
  req: NextRequest,
  res: NextResponse
) {
  if (req.method === "POST") {
    const body = await req.json();
    const { fileName, content } = body as { fileName: string; content: string };

    if (!fileName || !content) {
      return new Response(
        JSON.stringify({ error: "Filename and content are required." }),
        {
          status: 400,
        }
      );
    }

    try {
      const fileExist = fs.existsSync(fileName);
      if (fileExist) {
        fs.writeFileSync(fileName, content);
      } else {
        const filePath = path.join(process.cwd(), "slipData", fileName);
        fs.writeFile(filePath, content, "utf-8", () => {});
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "File written successfully.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error writing file", error);

      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed tot write file",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    const newHeaders = new Headers(req.headers);

    newHeaders.set("Allow", "POST");

    NextResponse.next({
      request: {
        headers: newHeaders,
      },
    });
    new Response(
      JSON.stringify({
        success: false,
        message: `Method ${req.method} Not Allowed`,
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
