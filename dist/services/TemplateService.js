"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const nunjucks_1 = __importDefault(require("nunjucks"));
const MakefileTemplate_1 = __importDefault(require("./../templates/MakefileTemplate"));
const yaml = require('js-yaml');
class TemplateService {
    constructor(config, fileSystemService, dockerService, loggerService) {
        this.config = config;
        this.fileSystemService = fileSystemService;
        this.dockerService = dockerService;
        this.loggerService = loggerService;
    }
    removeServicesFolder() {
        this.loggerService.info('Clear ./services folder');
        this.fileSystemService.removeDirectorySync('./services');
        this.fileSystemService.createDirectorySync('./services');
    }
    processServiceTemplates() {
        this.loggerService.info('Full ./services folder from ./templates folder');
        for (const templatePath of this.fileSystemService.walkDirectorySync('./templates')) {
            this.processServiceTemplate(templatePath);
        }
    }
    processMakefileTemplates() {
        this.loggerService.info('Generate ./services/Makefile with specific commands for each service');
        let makefile = '';
        this.dockerService.listingAll().filter(x => x.enabled).forEach((host) => {
            makefile += nunjucks_1.default.renderString(MakefileTemplate_1.default, { project: host.dockerHost });
        });
        this.fileSystemService.writeFileSync('./services/Makefile', makefile);
    }
    processDockerComposeTemplate() {
        this.loggerService.info('Generate ./docker-compose.yml');
        let dockerCompose = this.dockerService.rawData();
        dockerCompose.services = {};
        //  TODO: smart check for volumes. If service is disabled probably we should remove volume from list
        this.dockerService.listingAll().filter(x => x.enabled).forEach((host) => {
            dockerCompose.services[host.dockerHost] = host.raw;
        });
        this.fileSystemService.writeFileSync('./docker-compose.yml', yaml.dump(dockerCompose));
    }
    processServiceTemplate(templatePath) {
        // Skip macos specific files and reserverd for docker-compose
        if (templatePath.includes('DS_Store') || templatePath.includes('docker-compose.j2')) {
            return;
        }
        const servicePath = templatePath.replace("templates/", "./services/");
        nunjucks_1.default.configure('./templates/');
        let template = nunjucks_1.default.renderString(this.fileSystemService.readFileSync(templatePath), {
            os_name: this.config.osName
        });
        this.fileSystemService.createDirectorySync(this.fileSystemService.getPathDirname(servicePath));
        this.fileSystemService.writeFileSync(servicePath, template);
    }
}
exports.TemplateService = TemplateService;
//# sourceMappingURL=TemplateService.js.map