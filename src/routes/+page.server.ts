import { Client } from "@upstash/qstash";
import { Resend } from "resend";

import { prisma } from "$lib/server/prisma";
import { QSTASH_TOKEN, RESEND_API_KEY } from "$env/static/private";
import { fail } from "@sveltejs/kit";

const q_client = new Client({
  token: QSTASH_TOKEN
});

const resend = new Resend(RESEND_API_KEY);

export const actions = {
  schedulePlan: async ({ request }) => {
    const form_data = await request.formData();
    const description = form_data.get("description") as string;
    const time = form_data.get("time") as string;

    let num_of_friends = form_data.get("num_of_friends");

    if (num_of_friends < 2) {
      return fail(400, { description, time, missing: true });
    }

    let emails : {email : string}[] = [];
    while (!(num_of_friends === 0)) {
      emails = [...emails, { email: form_data.get(`friend_${num_of_friends - 1}`) }];
      num_of_friends -= 1;
    }
    
    
    const plan_data = await prisma.plan.create({
      data: {
        description,
        time: new Date(time),
        recipients: {
          createMany: {
            data: emails
          }
        }
      }
    });

    const qstash_response = await q_client.publishJSON({
      url: "https://youre-cancelled.zeu.dev/rendevouz", 
      body: {
        plan_id: plan_data.id
      },
      notBefore: Date.parse(time) / 1000
    });

    await prisma.plan.update({
      where: { id: plan_data.id },
      data: {
        message_id: qstash_response.messageId
      }
    });

    let receivers : string[] = [];
    emails.map(e => receivers = [...receivers, e.email]);

    // email confirmation with resend
    await resend.emails.send({
      from: "You're Cancelled <youre-cancelled.zeu.dev>",
      to: receivers,
      subject: `Reminder for ${description}`,
      html: `
        <p>A reminder that ${description} is coming!</p>
        <p>Scheduled data is set for ${Intl.DateTimeFormat('en-US').format(new Date(time))}
        <a href="https://youre-cancelled.zeu.dev/${plan_data.id}" ping="https://youre-cancelled.zeu.dev/${plan_data.id}">
          Cancel
        </a>
      `
    });

    return { success: true };
  }
}
