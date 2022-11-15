import {ConfigDTO, FileSystem} from "../services/ConfigService";
import { SystemService } from "../services/SystemService";

export class ServicesUpCommand {
    constructor(private config: ConfigDTO, private systemService: SystemService) {
    }

    invoke(): void {
        if (this.config.fileSystem === FileSystem.MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose up -d')
        } else {
            this.systemService.exec('docker-compose up -d')
        }
    }
}
