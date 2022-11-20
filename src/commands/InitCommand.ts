import {TemplateService} from "../services/TemplateService";
import {SystemService} from "../services/SystemService";
import {FileSystemService} from "../services/FileSystemService";

const readline = require('readline');

export class InitCommand {
    constructor(
        private templateService: TemplateService,
        private systemService: SystemService,
        private fileSystemService: FileSystemService) {
    }

    invoke(): void {
        let self = this;
        const rl = readline.createInterface({
            input: process.stdin, //or fileStream
            output: process.stdout
        });
        rl.question("Please specify path to new locanika project:\n", function (projectPath: string) {
            rl.close();

            // self.fileSystemService.createDirectorySync(`make services-init`);
            // self.fileSystemService.createDirectorySync(`make projects-init`);
        });

    }
}