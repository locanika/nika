"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesInitCommand = void 0;
const fs_1 = __importDefault(require("fs"));
const path = require('path');
const nunjucks = require('nunjucks');
class ServicesInitCommand {
    constructor(config, systemService) {
        this.config = config;
        this.systemService = systemService;
    }
    *walkSync(dir) {
        const files = fs_1.default.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                for (const subFile of this.walkSync(path.join(dir, file.name))) {
                    yield subFile;
                }
            }
            else {
                yield path.join(dir, file.name);
            }
        }
    }
    invoke() {
        this.systemService.execShellCommandSync('rm -rf ./services');
        fs_1.default.mkdirSync('./services');
        for (const templatePath of this.walkSync('./templates/services')) {
            this.processServiceTemplates(templatePath);
        }
        // for root, dirs, files in os.walk("./templates/services"):
        //     for name in dirs:
        //         this.process_service_templates(os.path.join(root, name))
        //
        // self.io_service.save_file_content('./docker-compose.yml', yaml.safe_dump(self.docker_service.list_raw_only_enabled(global_config)))
        // self.generate_service_makefiles(global_config)
    }
    processServiceTemplates(templatePath) {
        // Skip macos specific files
        if (templatePath.includes('DS_Store')) {
            return;
        }
        let servicePath = templatePath.replace("templates/", "./");
        nunjucks.configure('./templates/');
        let template = nunjucks.renderString(fs_1.default.readFileSync(templatePath, 'utf8'), {
            os_name: this.config.osName
        });
        fs_1.default.mkdirSync(path.dirname(servicePath), { recursive: true });
        fs_1.default.writeFileSync(servicePath, template);
    }
}
exports.ServicesInitCommand = ServicesInitCommand;
//# sourceMappingURL=ServicesInitCommand.js.map