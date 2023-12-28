import {StatusService} from "../services/StatusService";

export class StatusCommand {
    constructor(private statusService: StatusService) {
    }

    invoke(): void {
        this.statusService.displayStatus();
    }
}