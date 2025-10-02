import { NextResponse } from "next/server"

// 임시로 서버에 rawKey 하드코딩 (실제 환경에서는 DB의 key_hash 사용)
const DUMMY_RAW_KEY = "95e48310119726a7d8c7019526dc14738bc1bad129d17cc5e8a9c3309c829833"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawKey = authHeader.replace("Bearer ", "").trim()

  if (rawKey !== DUMMY_RAW_KEY) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 403 })
  }

  return NextResponse.json({
    ok: true,
    message: "✅ Dummy API 인증 성공",
    received: rawKey,
  })
}
