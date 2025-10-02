"use client"

import { useState } from "react"

export default function Home() {
  const [result, setResult] = useState<string>("")

  const callTrafficApi = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api-management/test-juice`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_MY_API_KEY}`,
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (err: any) {
      setResult("❌ 호출 실패: " + err.message)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dummy Client Site</h1>
      <p className="mb-4">이 사이트는 우리 서비스의 API를 호출하는 샘플입니다.</p>

      <button
        onClick={callTrafficApi}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        트래픽 API 호출
      </button>

      {result && (
        <pre className="mt-6 p-4 bg-gray-100 rounded-md text-sm">{result}</pre>
      )}
    </main>
  )
}
