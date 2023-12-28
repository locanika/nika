"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCommand = void 0;
class StatusCommand {
    constructor(statusService) {
        this.statusService = statusService;
    }
    invoke() {
        this.statusService.displayStatus();
    }
}
exports.StatusCommand = StatusCommand;
//# sourceMappingURL=StatusCommand.js.map