import { execSync } from "child_process";
import os from "os";

export class SystemService {
    execShellCommandSync(command: string): void {
        execSync(command, { stdio: 'inherit' });
    }

    getPlatform(): NodeJS.Platform {
        return os.platform();
    }
}