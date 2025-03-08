import { Glob, $ } from "bun";

await $`rm -rf dist`;
const files = new Glob("./src/**/*.{ts,tsx}").scan();
for await (const file of files) {
  await Bun.build({
    format: "esm",
    outdir: "dist/esm",
    external: ["*"],
    root: "src",
    entrypoints: [file],
  });
}
await Bun.build({
  format: "esm",
  outdir: "dist/esm",
  root: "src",
  entrypoints: ["./src/index.ts"],
});
await $`tsc --outDir dist/types --declaration --emitDeclarationOnly --declarationMap`;
