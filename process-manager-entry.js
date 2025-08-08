import { ProcessManager } from "./utils/process-manager.js";

// Create and start the process manager
const manager = new ProcessManager({
  maxRestarts: 10,
  restartDelay: 5000,
  restartCooldown: 30000,
});

manager.start();
