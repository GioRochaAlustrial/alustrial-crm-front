import { NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/crm";

async function proxy(req, slugParts) {
    const token = req.cookies.get("token")?.value || "";
    const cookieHeader = req.headers.get("cookie") || "";
    const url = new URL(req.url);
    const tail = slugParts.length ? `/${slugParts.join("/")}` : "";
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/notificaciones${tail}${url.search}`;

    const method = req.method;
    const isBodyMethod = !["GET", "HEAD"].includes(method);
    const body = isBodyMethod ? await req.text() : undefined;

    const contentType = req.headers.get("content-type") || undefined;

    const apiRes = await fetch(apiUrl, {
        method,
        headers: {
            ...(contentType ? { "Content-Type": contentType } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(cookieHeader ? { Cookie: cookieHeader } : {}), // 👈 reenvía TODO
        },
        body,
    });

    const text = await apiRes.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    return typeof data === "string"
        ? new NextResponse(data, { status: apiRes.status })
        : NextResponse.json(data, { status: apiRes.status });
}

export async function GET(req, ctx) { return proxy(req, ctx.params?.slug || []); }
export async function PUT(req, ctx) { return proxy(req, ctx.params?.slug || []); }