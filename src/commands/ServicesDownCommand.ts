import {ConfigDTO, FileSystem} from "../services/ConfigService";
import { SystemService } from "../services/SystemService";

export class ServicesDownCommand {
    constructor(private config: ConfigDTO, private systemService: SystemService) {
    }

    invoke(): void {
        if (this.config.fileSystem === FileSystem.MACOS_MUTAGEN) {
            this.systemService.execShellCommandSync('mutagen-compose down');
        } else {
            this.systemService.execShellCommandSync('docker-compose down');
        }
    }
}

