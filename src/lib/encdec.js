const BASE62_ALPHABET = process.env.NEXT_PUBLIC_B62A;

const REVERSE_MAP = {};
for (let i = 0; i < BASE62_ALPHABET.length; i++) {
  REVERSE_MAP[BASE62_ALPHABET[i]] = i;
}

export function base62Encode(input) {
  if (!input) return "";

  const data =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : new Uint8Array(input);

  let encodedBlocks = [];

  for (let i = 0; i < data.length; i += 8) {
    let chunk = data.subarray(i, i + 8);
    let value = BigInt(0);
    for (let b of chunk) {
      value = (value << 8n) | BigInt(b);
    }

    let block = "";
    while (value > 0n) {
      const rem = Number(value % 62n);
      block = BASE62_ALPHABET[rem] + block;
      value /= 62n;
    }

    encodedBlocks.push(block || "0");
  }

  return encodedBlocks.join("-");
}

export function base62Decode(encoded) {
  if (!encoded) return "";

  let bytes = [];
  const blocks = encoded.split("-").filter(Boolean);

  for (let block of blocks) {
    let value = BigInt(0);
    for (let ch of block) {
      const val = REVERSE_MAP[ch];

      if (val === undefined) throw new Error(`Invalid Base62 char: ${ch}`);
      value = value * 62n + BigInt(val);
    }

    let chunkBytes = [];
    while (value > 0n) {
      chunkBytes.push(Number(value & 0xffn));
      value >>= 8n;
    }

    chunkBytes.reverse();
    bytes.push(...chunkBytes);
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
}

export function base62EncodeBytes(bytes) {
  if (!bytes || bytes.length === 0) return "";
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const out = [];
  for (let i = 0; i < u8.length; i += 8) {
    let v = 0n;
    for (const b of u8.subarray(i, i + 8)) v = (v << 8n) | BigInt(b);
    if (v === 0n) {
      out.push("0");
      continue;
    }
    let block = "";
    while (v > 0n) {
      const rem = Number(v % 62n);
      block = BASE62_ALPHABET[rem] + block;
      v /= 62n;
    }
    out.push(block);
  }
  return out.join("-");
}

export function base62DecodeToBytes(encoded) {
  if (!encoded) return new Uint8Array(0);
  const blocks = encoded.split("-").filter(Boolean);
  const chunks = [];
  for (const block of blocks) {
    let v = 0n;
    for (const ch of block) {
      const idx = REVERSE_MAP[ch];
      if (idx === undefined) throw new Error(`Invalid Base62 char: ${ch}`);
      v = v * 62n + BigInt(idx);
    }
    const buf = [];
    while (v > 0n) {
      buf.push(Number(v & 0xffn));
      v >>= 8n;
    }
    buf.reverse();
    chunks.push(...buf);
  }
  return new Uint8Array(chunks);
}

export function encodeEmojis(input) {
  let out = "";
  for (const c of input) {
    if (c.match(/^[\x00-\x7F]$/)) {
      // ASCII safe
      if (c === "\\" || c === "{" || c === "}") out += "\\" + c;
      else out += c;
    } else {
      out += `\\u{${c.codePointAt(0).toString(16)}}`;
    }
  }
  return out;
}

export function decodeEmojis(input) {
  return input
    .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/\\([{}\\])/g, "$1");
}
