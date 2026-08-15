#!/usr/bin/env node
/* ==========================================================================
   security/make-password-hash.mjs — RUN ON YOUR OWN MACHINE ONLY.

   Produces the two values that go into Vercel → Environment Variables.
   It prints the HASH, never the password. Nothing is written to disk, so the
   password cannot end up in the repository, in a build log, or in a ZIP.

   Usage (the password is typed at a prompt, never as an argument, so it does
   not land in your shell history):

       node security/make-password-hash.mjs

   This directory is listed in .vercelignore and is never deployed.
   ========================================================================== */

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { hashPassword, PBKDF2_ITERATIONS } from "../gate/gate.js";

const b64u = bytes => Buffer.from(bytes).toString("base64url");

async function askHidden(prompt) {
  const rl = createInterface({ input: stdin, output: stdout, terminal: true });
  const onData = ch => { if (!"\r\n".includes(String(ch))) stdout.write("\u001b[2K\u001b[200D" + prompt + "*".repeat(rl.line.length)); };
  stdin.on("data", onData);
  const answer = await rl.question(prompt);
  stdin.off("data", onData);
  rl.close();
  stdout.write("\n");
  return answer;
}

const pw = await askHidden("كلمة المرور الجديدة: ");
if (pw.length < 16) {
  console.error("\nارفض: كلمة المرور أقصر من 16 محرفًا. البوابة قوية بقدر ما تُدخله فيها.\n");
  process.exit(1);
}
const again = await askHidden("أعد كتابتها للتأكيد: ");
if (pw !== again) { console.error("\nالكلمتان غير متطابقتين.\n"); process.exit(1); }

const hash = await hashPassword(pw, PBKDF2_ITERATIONS);
const secret = b64u(crypto.getRandomValues(new Uint8Array(32)));

console.log(`
انسخ هذين السطرين إلى Vercel → Project → Settings → Environment Variables
(اختر Production و Preview معًا)، ثم أعد النشر. لا تضعهما في GitHub ولا في أي ملف.

FOAAD_ACCESS_PASSWORD_HASH
${hash}

FOAAD_SESSION_SECRET
${secret}

كلمة المرور نفسها لا تظهر هنا ولا تُخزَّن في أي مكان — وزّعها بنفسك لمن تدعوه.
تغيير FOAAD_SESSION_SECRET وحده يُنهي كل الجلسات المفتوحة فورًا.
`);
