import {ConfigDTO, FileSystem} from "../services/ConfigService";
import {SystemService} from "../services/SystemService";

export class ServicesPsCommand {
    constructor(private config: ConfigDTO, private systemService: SystemService) {
    }

    invoke(): void {
        if (this.config.fileSystem === FileSystem.MACOS_MUTAGEN) {
            this.systemService.execShellCommandSync('mutagen-compose ps')
        } else {
            this.systemService.execShellCommandSync('docker-compose ps')
        }
    }
}

