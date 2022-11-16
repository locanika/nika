import {ConfigDTO, FileSystem} from "../services/ConfigService";
import { SystemService } from "../services/SystemService";

export class ServicesBuildCommand {
    constructor(private config: ConfigDTO, private systemService: SystemService) {
    }

    invoke(): void {
        if (this.config.fileSystem === FileSystem.MACOS_MUTAGEN) {
            this.systemService.execShellCommandSync('mutagen-compose pull');
            this.systemService.execShellCommandSync('mutagen-compose build');
        } else {
            this.systemService.execShellCommandSync('docker-compose pull');
            this.systemService.execShellCommandSync('docker-compose build');
        }
    }
}
