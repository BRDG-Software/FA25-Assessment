import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest, res: NextResponse) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let existingData: any = [];
      const filePath = path.join(process.cwd(), "slipData", fileName);

      const fileExist = fs.existsSync(filePath);

      if (fileExist) {
        const prevContent = fs.readFileSync(filePath, "utf-8");

        existingData = [prevContent];

        existingData.push(content);
        fs.writeFileSync(fileName, JSON.stringify(existingData, null, 2));
      } else {
        const filePath = path.join(process.cwd(), "slipData", fileName);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fileContent: any = [content];

        fs.writeFile(
          filePath,
          JSON.stringify(fileContent, null, 2),
          "utf-8",
          (data) => {
            console.log(data, "data");
          }
        );
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
