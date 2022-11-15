import { ExecException, exec } from "child_process";

export class SystemService {
    exec(command: string): void {
        exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                console.log(error.message);
                return;
            }
            if (stderr) {
                console.log(stderr);
                return;
            }
            console.log(stdout);
        });
    }
}