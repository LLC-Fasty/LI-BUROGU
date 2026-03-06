import { encodeSafe } from "@/lib/utils";

export async function GET() {
  const res = await fetch("https://1.1.1.1/cdn-cgi/trace");
  const text = await res.text();
  const ip = text.match(/ip=(.*)/)?.[1] || "Unknown";
  let ipstring = JSON.stringify({ ip });
  let ipencde = encodeSafe(ipstring);

  return new Response(JSON.stringify(ipencde), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
