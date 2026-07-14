import type { APIRoute } from "astro";

import { getWriteClient } from "@/sanity/lib/writeClient";

// SSR route: runs as a Vercel serverless function. Holds secret tokens, so it
// must never be prerendered.
export const prerender = false;

const FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "message",
] as const;
type Field = (typeof FIELDS)[number];
type Body = Record<Field, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public Forminit form endpoint — form id is not secret, public mode needs no key.
const FORMINIT_FORM_ENDPOINT =
  process.env.FORMINIT_FORM_ENDPOINT ?? "https://forminit.com/f/atpznoyidmj";

// Normalize a phone number to E.164 (Forminit requires it, e.g. +66800000000).
// Defaults to Thailand (+66) for local-format numbers written with a leading 0.
function toE164(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return "+" + trimmed.slice(1).replace(/\D/g, "");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.startsWith("00")) return "+" + digits.slice(2);
  if (digits.startsWith("0")) return "+66" + digits.slice(1);
  return "+" + digits;
}

// Shape the flat form state into Forminit's block payload.
// Docs: https://forminit.com/docs/submit-form-api/
function toForminitPayload(data: Body) {
  return {
    blocks: [
      {
        type: "sender",
        properties: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: toE164(data.phone),
          company: data.company,
        },
      },
      { type: "text", name: "message", value: data.message },
    ],
  };
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let raw: Partial<Body>;
  try {
    raw = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  // Trim + validate every field server-side; never trust the client.
  const data = {} as Body;
  for (const key of FIELDS) {
    const value = String(raw?.[key] ?? "").trim();
    if (!value) return json(400, { error: `Missing field: ${key}` });
    data[key] = value;
  }
  if (!EMAIL_RE.test(data.email)) {
    return json(400, { error: "Invalid email address" });
  }

  const submittedAt = new Date().toISOString();

  // 1) ClickUp task — the lead must land here, so failure fails the request.
  // const listId = process.env.CLICKUP_LIST_ID;
  // const token = process.env.CLICKUP_API_TOKEN;
  // let clickupTaskId: string | undefined;
  // try {
  //   if (!listId || !token) {
  //     throw new Error("CLICKUP_LIST_ID or CLICKUP_API_TOKEN not configured");
  //   }
  //   const res = await fetch(
  //     `https://api.clickup.com/api/v2/list/${listId}/task`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: `${data.company} — ${data.firstName} ${data.lastName}`,
  //         markdown_description: [
  //           `**Name:** ${data.firstName} ${data.lastName}`,
  //           `**Email:** ${data.email}`,
  //           `**Phone:** ${data.phone}`,
  //           `**Company:** ${data.company}`,
  //           "",
  //           "**Message:**",
  //           data.message,
  //         ].join("\n"),
  //       }),
  //     },
  //   );
  //   if (!res.ok) {
  //     throw new Error(`ClickUp ${res.status}: ${await res.text()}`);
  //   }
  //   const task = (await res.json()) as { id?: string };
  //   clickupTaskId = task.id;
  // } catch (err) {
  //   console.error("[contact] ClickUp task creation failed:", err);
  //   return json(502, { error: "Could not submit your message. Try again." });
  // }

  // 2) Forminit (public mode) — best-effort; never block the response on it.
  try {
    const res = await fetch(FORMINIT_FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toForminitPayload(data)),
    });
    if (!res.ok) {
      throw new Error(`Forminit ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.error("[contact] Forminit submission failed:", err);
  }

  // 3) Sanity record — best-effort backup; never block the response on it.
  try {
    await getWriteClient().create({
      _type: "contactSubmission",
      ...data,
      submittedAt,
      // clickupTaskId,
    });
  } catch (err) {
    console.error("[contact] Sanity write failed:", err);
  }

  return json(200, { ok: true });
};
