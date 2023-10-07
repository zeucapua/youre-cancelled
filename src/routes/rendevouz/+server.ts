import { json } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { Receiver } from "@upstash/qstash";
import { Resend } from "resend";
import { QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY, RESEND_API_KEY } from "$env/static/private";

const resend = new Resend(RESEND_API_KEY);

const receiver = new Receiver({
  currentSigningKey: QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: QSTASH_NEXT_SIGNING_KEY
})

export async function POST({ request }) {
  const body = await request.text();
  const isValid = await receiver.verify({
    signature: request.headers.get("Upstash-Signature") ?? "",
    body
  });

  if (isValid) {
    console.log("validated", Date.now());
  }

  const { plan_id } = JSON.parse(body);

  const plan = await prisma.plan.findUnique({
    where: { id: plan_id },
    include: {
      recipients: true
    }
  });

  let receivers : string[] = [];
  plan?.recipients.map(r => receivers = [...receivers, r.email]);

  // email reminder with resend here
  await resend.emails.send({
    from: "You're Cancelled <youre-cancelled.zeu.dev>",
    to: receivers,
    subject: `Reminder for ${plan?.description}`,
    html: `
      <p>A reminder that ${plan?.description} is HERE! LIKE RIGHT NOW</p>
      <p>Talk to your friends: ${plan?.recipients.map(r => {return r.email})}</p>
    `
  });
  
  
  await prisma.plan.delete({
    where: { id: plan_id }
  });

  return json({ body });
}
