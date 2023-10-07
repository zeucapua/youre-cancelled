import { Client } from "@upstash/qstash";
import { Resend } from "resend";

import { prisma } from "$lib/server/prisma";
import { QSTASH_TOKEN, RESEND_API_KEY } from "$env/static/private";

const q_client = new Client({
  token: QSTASH_TOKEN
});

const resend = new Resend(RESEND_API_KEY);

export async function POST({ url }) {
  const params = url.searchParams;

  console.log({ params });
}
