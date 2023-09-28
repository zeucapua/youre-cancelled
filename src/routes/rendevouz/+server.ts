import { json } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { Receiver } from "@upstash/qstash";
import { QSTASH_CURRENT_SIGNING_KEY, QSTASH_NEXT_SIGNING_KEY } from "$env/static/private";

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
  console.log({ plan_id });

  const plan = await prisma.plan.findUnique({
    where: { id: plan_id }
  });

  console.log({ plan });

  // email reminder with resend here
  
  await prisma.plan.delete({
    where: { id: plan_id }
  });

  return json({ body });
}
