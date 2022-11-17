"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesInitCommand = void 0;
class ServicesInitCommand {
    constructor(templateService) {
        this.templateService = templateService;
    }
    invoke() {
        this.templateService.removeServicesFolder();
        this.templateService.processServiceTemplates();
        this.templateService.processMakefileTemplates();
    }
}
exports.ServicesInitCommand = ServicesInitCommand;
//# sourceMappingURL=ServicesInitCommand.js.map