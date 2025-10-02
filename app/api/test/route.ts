import { NextResponse } from "next/server"
import crypto from "crypto"

const API_KEY_SALT = process.env.API_KEY_SALT || "default_salt"

// 미리 준비한 rawKey (실제 발급 키 흉내)
const RAW_KEY = "95e48310119726a7d8c7019526dc14738bc1bad129d17cc5e8a9c3309c829833"

// 서버가 DB에 저장해뒀다고 가정하는 key_hash
const DUMMY_HASHED_KEY = crypto
  .createHash("sha256")
  .update(RAW_KEY + API_KEY_SALT)
  .digest("hex")

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawKey = authHeader.replace("Bearer ", "").trim()

  // 클라이언트가 보낸 rawKey를 다시 해시
  const hashed = crypto.createHash("sha256").update(rawKey + API_KEY_SALT).digest("hex")

  if (hashed !== DUMMY_HASHED_KEY) {
    return NextResponse.json({ error: "Invalid API Key" }, { status: 403 })
  }

  return NextResponse.json({
    ok: true,
    message: "✅ API Key 검증 성공",
    received: rawKey,
    hashed,
  })
}
