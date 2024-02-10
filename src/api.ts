// prettier-ignore
export const fetchAsync = async <S, F = S> (input: RequestInfo | URL, init?: RequestInit): Promise <{ ok: true; data: S } | { ok: false; data: F }> => {
	const res = await fetch(input, init)
  if (res.ok) {
    const json = await res.json()
    return { ok: true, data: json }
  }
  const str = await res.text()
  const json = JSON.parse(str)
  return { ok: false, data: json }
}
