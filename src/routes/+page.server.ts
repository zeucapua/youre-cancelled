import { Client } from "@upstash/qstash";

import { prisma } from "$lib/server/prisma";
import { QSTASH_TOKEN } from "$env/static/private";
import { fail } from "@sveltejs/kit";

const q_client = new Client({
  token: QSTASH_TOKEN
});

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
      url: "https://pet-manatee-darling.ngrok-free.app/rendevouz", 
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


    // email confirmation with resend

    return { success: true };
  }
}
