import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

export async function readFile(filePath: string) {
  const f = await Deno.open(filePath);

  const decoder = new TextDecoder();
  const lines = [];
  for await (const uIntLine of readline(f)) {
    lines.push(decoder.decode(uIntLine));
  }

  f.close();
  return lines;
}
