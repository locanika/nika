import nunjucks from "nunjucks";
import {ConfigDTO} from "./ConfigService";
import {FileSystemService} from "./FileSystemService";
import {DockerService, DockerServiceDTO} from "./DockerService";
import MakefileTemplate from "./../templates/MakefileTemplate";

export class TemplateService {
    constructor(
        private config: ConfigDTO,
        private fileSystemService: FileSystemService,
        private dockerService: DockerService
    ) {
    }

    removeServicesFolder(): void {
        this.fileSystemService.removeDirectorySync('./services');
        this.fileSystemService.createDirectorySync('./services');
    }

    processServiceTemplates(): void {
        for (const templatePath of this.fileSystemService.walkDirectorySync('./templates')) {
            this.processServiceTemplate(templatePath);
        }
    }

    processMakefileTemplates(): void {
        let makefile = '';
        this.dockerService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
            makefile += nunjucks.renderString(MakefileTemplate, { project: host.dockerHost });
        });
        this.fileSystemService.writeFileSync('./services/Makefile', makefile);
    }

    processDockerComposeTemplate(): void {
        let content = nunjucks.renderString(
            this.fileSystemService.readFileSync('./templates/docker-compose.j2'),
            {
                os_name: this.config.osName,
                file_system: this.config.fileSystem,
                docker_mode: this.config.dockerMode,
                services_restart_policy: this.config.servicesRestartPolicy
            }
        );
        this.fileSystemService.writeFileSync('./docker-compose.yml', content);
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