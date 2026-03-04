import { NextResponse } from "next/server";

// Backend base (Express) donde está montado /crm
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/crm";

function buildApiUrl(req, slugParts = []) {
  const url = new URL(req.url);
  const tail = slugParts.length ? `/${slugParts.join("/")}` : "";
  return `${BASE}/citas${tail}${url.search}`;
}

async function proxy(req, slugParts) {
  const token = req.cookies.get("token")?.value || "";
  const apiUrl = buildApiUrl(req, slugParts);

  const method = req.method;
  const isBodyMethod = !["GET", "HEAD"].includes(method);
  const body = isBodyMethod ? await req.text() : undefined;

  const contentType = req.headers.get("content-type") || undefined;

  const apiRes = await fetch(apiUrl, {
    method,
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      Cookie: `token=${token}`,
    },
    body,
  });

  const text = await apiRes.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (typeof data === "string") {
    return new NextResponse(data, {
      status: apiRes.status,
      headers: { "Content-Type": contentType || "text/plain" },
    });
  }

  return NextResponse.json(data, { status: apiRes.status });
}

export async function GET(req, ctx) { return proxy(req, ctx.params?.slug || []); }
export async function POST(req, ctx) { return proxy(req, ctx.params?.slug || []); }
export async function PUT(req, ctx) { return proxy(req, ctx.params?.slug || []); }
export async function PATCH(req, ctx) { return proxy(req, ctx.params?.slug || []); }
export async function DELETE(req, ctx) { return proxy(req, ctx.params?.slug || []); }