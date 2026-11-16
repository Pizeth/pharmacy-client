import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";

const [command, mode = "browser", requestedPort] = process.argv.slice(2);
if (!["build", "start"].includes(command) || !["browser", "react"].includes(mode)) {
  throw new Error("Usage: node scripts/datatable-profile.mjs <build|start> <browser|react> [port]");
}
const token = randomBytes(32).toString("hex");
const port = requestedPort ?? (mode === "browser" ? "8091" : "8092");
if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) throw new Error("Invalid local port");
const args = command === "build"
  ? ["build", ...(mode === "react" ? ["--profile"] : [])]
  : ["start", "--hostname", "127.0.0.1", "--port", port];
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", ...args], {
  stdio: "inherit",
  env: { ...process.env, DATATABLE_LOCAL_PROFILE: mode, DATATABLE_PROFILE_TOKEN: token },
});
if (command === "start") {
  console.log(`Local profiling: http://127.0.0.1:${port}/dev/datatable/profiling?token=${token}`);
}
child.on("exit", (code) => { process.exitCode = code ?? 1; });
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
