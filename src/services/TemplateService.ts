import nunjucks from "nunjucks";
import {ConfigDTO} from "./ConfigService";
import {FileSystemService} from "./FileSystemService";
import {DockerService, DockerServiceDTO} from "./DockerService";
import MakefileTemplate from "./../templates/MakefileTemplate";
import {LoggerService} from "./LoggerService";

const yaml = require('js-yaml');

export class TemplateService {
    constructor(
        private config: ConfigDTO,
        private fileSystemService: FileSystemService,
        private dockerService: DockerService,
        private loggerService: LoggerService
    ) {
    }

    removeServicesFolder(): void {
        this.loggerService.info('Clear ./services folder')
        this.fileSystemService.removeDirectorySync('./services');
        this.fileSystemService.createDirectorySync('./services');
    }

    processServiceTemplates(): void {
        this.loggerService.info('Full ./services folder from ./templates folder')
        for (const templatePath of this.fileSystemService.walkDirectorySync('./templates')) {
            this.processServiceTemplate(templatePath);
        }
    }

    processMakefileTemplates(): void {
        this.loggerService.info('Generate ./services/Makefile with specific commands for each service')
        let makefile = '';
        this.dockerService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
            makefile += nunjucks.renderString(MakefileTemplate, { project: host.dockerHost });
        });
        this.fileSystemService.writeFileSync('./services/Makefile', makefile);
    }

    processDockerComposeTemplate(): void {
        this.loggerService.info('Generate ./docker-compose.yml')
        let dockerCompose = this.dockerService.rawData();
        dockerCompose.services = {};

        //  TODO: smart check for volumes. If service is disabled probably we should remove volume from list
        this.dockerService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
            dockerCompose.services[host.dockerHost] = host.raw;
        });
        this.fileSystemService.writeFileSync('./docker-compose.yml', yaml.dump(dockerCompose));
    }

    private processServiceTemplate(templatePath: string): void {
        // Skip macos specific files
        if (templatePath.includes('DS_Store')) {
            return;
        }

        const servicePath = templatePath.replace("templates/", "./services/");
        nunjucks.configure('./templates/')
        let template = nunjucks.renderString(
            this.fileSystemService.readFileSync(templatePath), {
                os_name: this.config.osName
            }
        )
        this.fileSystemService.createDirectorySync(this.fileSystemService.getPathDirname(servicePath));
        this.fileSystemService.writeFileSync(servicePath, template);
    }
}