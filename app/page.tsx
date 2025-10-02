"use client"
import { useState } from "react"

export default function Home() {
  const [result, setResult] = useState("")

  const verifyKey = async () => {
    setResult("⏳ 인증 중...")

    try {
      const res = await fetch("/api/verify-key", {
        headers: {
          Authorization: "Bearer 95e48310119726a7d8c7019526dc14738bc1bad129d17cc5e8a9c3309c829833",
        },
      })
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e: any) {
      setResult("❌ 오류: " + e.message)
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Dummy Verify Test</h1>
      <button
        onClick={verifyKey}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        API 키 검증하기
      </button>
      <pre className="mt-6 p-4 bg-gray-100 rounded text-sm">{result}</pre>
    </main>
  )
}
