import {TemplateService} from "../services/TemplateService";
import {SystemService} from "../services/SystemService";

export class InitCommand {
    constructor(private templateService: TemplateService, private systemService: SystemService) {
    }

    invoke(): void {
        this.templateService.generateExampleMakefile();
        this.templateService.generateExampleConfig();
        this.templateService.generateExampleGitignore();
        this.systemService.execShellCommandSync('npm install locanika')
        this.systemService.execShellCommandSync('make services-init')
        this.systemService.execShellCommandSync('make services-deploy')
    }
}