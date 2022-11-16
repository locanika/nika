import {ConfigDTO} from "../services/ConfigService";
import { SystemService } from "../services/SystemService";

import fs from "fs";
const path = require('path');
const nunjucks = require('nunjucks')

export class ServicesInitCommand {
    constructor(private config: ConfigDTO, private systemService: SystemService) {
    }

    // TODO: move into FileSystemService
    * walkSync(dir: string): Generator<string> {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                for (const subFile of this.walkSync(path.join(dir, file.name))) {
                    yield subFile;
                }
            } else {
                yield path.join(dir, file.name);
            }
        }
    }

    invoke(): void {
        this.systemService.execShellCommandSync('rm -rf ./services');
        fs.mkdirSync('./services');

        for (const templatePath of this.walkSync('./templates/services')) {
            this.processServiceTemplates(templatePath);
        }
    }

    private processServiceTemplates(templatePath: string): void {
        // Skip macos specific files
        if (templatePath.includes('DS_Store')) {
            return;
        }

        let servicePath = templatePath.replace("templates/", "./");
        nunjucks.configure('./templates/')
        let template = nunjucks.renderString(
            fs.readFileSync(templatePath, 'utf8'), {
                os_name: this.config.osName
            }
        )
        fs.mkdirSync(path.dirname(servicePath), { recursive: true });
        fs.writeFileSync(servicePath, template);
    }
}