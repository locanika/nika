import { ConfigService, FileSystem } from "../services/ConfigService";
import { SystemService } from "../services/SystemService";

export class ServicesUpCommand {
    constructor(private configService: ConfigService, private systemService: SystemService) {
    }

    invoke(): void {
        if (this.configService.fileSystem() === FileSystem.MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose up -d')
        } else {
            this.systemService.exec('docker-compose up -d')
        }
    }
}
