import {TemplateService} from "../services/TemplateService";
import {SystemService} from "../services/SystemService";

const readline = require('readline');

export class InitCommand {
    constructor(
        private templateService: TemplateService,
        private systemService: SystemService
    ) {
    }

    invoke(): void {
        let self = this;
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        rl.question("Please specify path to new locanika project:\n", function (projectPath: string) {
            rl.close();

            self.systemService.execShellCommandSync(`git clone git@github.com:locanika/demo.git ${projectPath}`);
            self.systemService.execShellCommandSync(`npm i`);
            self.systemService.execShellCommandSync(`make services-init`);
            self.systemService.execShellCommandSync(`make projects-init`);
            self.systemService.execShellCommandSync(`make services-deploy`);
        });
    }
}