import {ConfigDTO, ProjectDTO} from "../services/ConfigService";
import {SystemService} from "../services/SystemService";
import {LoggerService} from "../services/LoggerService";

export class ProjectsPullCommand {
    constructor(private config: ConfigDTO, private systemService: SystemService, private loggerService: LoggerService) {
    }

    invoke(): void {
        this.config.projects.forEach((project: ProjectDTO) => {
            this.loggerService.info(`Git pull ./projects/${project.name}`);
            this.systemService.execShellCommandSync(`cd ./projects/${project.name} && git pull`);
        });
    }
}

