import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

const f = await Deno.open("./calibration.txt");

let sum = 0;
const decoder = new TextDecoder();
for await (const uIntLine of readline(f)) {
  const lineChars = [...decoder.decode(uIntLine)];
  const first = lineChars.find((c) => /[0-9]/.test(c));
  const last = lineChars.findLast((c) => /[0-9]/.test(c));

  const num = parseInt(`${first}${last}`, 10);
  sum += num;
}

console.log(sum);
f.close();
