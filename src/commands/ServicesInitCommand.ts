import {TemplateService} from "../services/TemplateService";

export class ServicesInitCommand {
    constructor(private templateService: TemplateService) {
    }

    invoke(): void {
        this.templateService.removeServicesFolder();
        this.templateService.processServiceTemplates();
    }
}