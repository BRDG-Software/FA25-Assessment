// app/api/print/route.ts
import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const { exePath, bmpPath } = await req.json();

    // Optional: Verify both files exist
    if (!existsSync(exePath)) {
      return NextResponse.json(
        { success: false, error: `EXE not found: ${exePath}` },
        { status: 400 }
      );
    }

    if (!existsSync(bmpPath)) {
      return NextResponse.json(
        { success: false, error: `BMP not found: ${bmpPath}` },
        { status: 400 }
      );
    }

    const { stdout, stderr } = await execFileAsync(exePath, [bmpPath]);

    return NextResponse.json({ success: true, stdout, stderr });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
