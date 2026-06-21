import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escape user input before dropping it into the HTML email. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Clean, branded HTML email for a new contact-form inquiry. */
function inquiryEmail(name: string, email: string, project: string) {
  const row = (label: string, value: string, top: boolean) => `
    <tr><td style="padding:${top ? "18px 0 0" : "0"};${
      top ? "border-top:1px solid #eceef1;" : ""
    }">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#9097a0;font-weight:700;">${label}</div>
      ${value}
    </td></tr>`;
  return `
<div style="margin:0;padding:0;background:#f3f4f6;">
  <div style="max-width:600px;margin:0 auto;padding:28px 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="background:#ffffff;border:1px solid #ececec;border-radius:16px;overflow:hidden;">
      <div style="background:#3c82ff;background:linear-gradient(135deg,#3c82ff 0%,#5ad1ff 100%);padding:26px 30px;">
        <div style="font-size:24px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">UIM</div>
        <div style="margin-top:4px;font-size:13px;color:rgba(255,255,255,0.9);">New project inquiry</div>
      </div>
      <div style="padding:28px 30px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 0;">
          ${row("Name", `<div style="margin-top:4px;font-size:16px;color:#15171b;font-weight:600;">${esc(name)}</div>`, false)}
          <tr><td style="height:18px;"></td></tr>
          ${row("Email", `<div style="margin-top:4px;font-size:16px;"><a href="mailto:${esc(email)}" style="color:#3c82ff;text-decoration:none;font-weight:600;">${esc(email)}</a></div>`, true)}
          <tr><td style="height:18px;"></td></tr>
          ${row("Project details", `<div style="margin-top:8px;font-size:15px;line-height:1.6;color:#3a3d44;white-space:pre-wrap;">${esc(project)}</div>`, true)}
        </table>
        <a href="mailto:${esc(email)}" style="display:inline-block;margin-top:26px;background:#3c82ff;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 26px;border-radius:10px;">Reply to ${esc(name)}</a>
      </div>
    </div>
  </div>
</div>`;
}

export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = (data ?? {}) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const project = String(body.project ?? "").trim();

  // Server-side validation (never trust the client).
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (project.length < 10)
    errors.project = "Please tell us a little more about your project.";
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "Email isn't configured yet. Add RESEND_API_KEY to .env.local to enable sending.",
      },
      { status: 503 }
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || "alihamza.devflow@gmail.com";
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: "UIM Contact <onboarding@resend.dev>",
      to: [to],
      replyTo: email,
      subject: `New project inquiry from ${name}`,
      text: `New project inquiry via the UIM website\n\nName: ${name}\nEmail: ${email}\n\nProject details:\n${project}`,
      html: inquiryEmail(name, email, project),
    });

    if (error) {
      // Surface the real Resend error (logged + returned) so misconfig is obvious.
      console.error("[contact] Resend error:", error);
      return Response.json(
        { error: error.message || "We couldn't send your message. Please try again." },
        { status: 502 }
      );
    }

    console.log("[contact] sent:", data?.id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] threw:", err);
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "We couldn't send your message. Please try again.",
      },
      { status: 502 }
    );
  }
}
