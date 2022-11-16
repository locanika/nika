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
    }
}
exports.ServicesInitCommand = ServicesInitCommand;
//# sourceMappingURL=ServicesInitCommand.js.map