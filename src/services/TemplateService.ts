import nunjucks from "nunjucks";
import {ConfigDTO} from "./ConfigService";
import {FileSystemService} from "./FileSystemService";

export class TemplateService {
    constructor(private config: ConfigDTO, private fileSystemService: FileSystemService) {
    }

    removeServicesFolder(): void {
        this.fileSystemService.removeDirectorySync('./services');
        this.fileSystemService.createDirectorySync('./services');
    }

    processServiceTemplates(): void {
        for (const templatePath of this.fileSystemService.walkDirectorySync('./templates/services')) {
            this.processServiceTemplate(templatePath);
        }
    }

    private processServiceTemplate(templatePath: string): void {
        // Skip macos specific files
        if (templatePath.includes('DS_Store')) {
            return;
        }

        const servicePath = templatePath.replace("templates/", "./");
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