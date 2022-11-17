"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const nunjucks_1 = __importDefault(require("nunjucks"));
const fs_1 = __importDefault(require("fs"));
class TemplateService {
    constructor(config, fileSystemService, dockerService) {
        this.config = config;
        this.fileSystemService = fileSystemService;
        this.dockerService = dockerService;
    }
    removeServicesFolder() {
        this.fileSystemService.removeDirectorySync('./services');
        this.fileSystemService.createDirectorySync('./services');
    }
    processServiceTemplates() {
        for (const templatePath of this.fileSystemService.walkDirectorySync('./templates/services')) {
            this.processServiceTemplate(templatePath);
        }
    }
    processMakefileTemplates() {
        let makefile = '';
        this.dockerService.listingAll().filter(x => x.enabled).forEach((host) => {
            makefile += nunjucks_1.default.renderString(fs_1.default.readFileSync('./templates/Makefile.j2', 'utf8'), {
                project: host.dockerHost
            });
        });
        this.fileSystemService.writeFileSync('./services/Makefile', makefile);
    }
    processServiceTemplate(templatePath) {
        // Skip macos specific files
        if (templatePath.includes('DS_Store')) {
            return;
        }
        const servicePath = templatePath.replace("templates/", "./");
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