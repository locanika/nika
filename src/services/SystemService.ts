import { execSync } from "child_process";

export class SystemService {
    execShellCommandSync(command: string): void {
        execSync(command);
    }
}