const yaml = require('js-yaml');
const fs = require('fs');

export enum OsName {
    LINUX = 'linux',
    MACOS = 'macos'
}

export enum FileSystem {
    LINUX_DEFAULT = 'linux_default',
    MACOS_DEFAULT = 'macos_default',
    MACOS_MUTAGEN = 'macos_mutagen',
    MACOS_NFS = 'macos_nfs'
}

export interface ConfigDTO {
    pathToDockerConfig: string,
    pathToGatewayProject: string,
    osName: OsName,
    fileSystem: FileSystem,
    servicesRestartPolicy: string,
    enabledServices: string[]
}

export class ConfigService {
    constructor(private config: ConfigDTO) {
    }

    fileSystem(): string {
        return this.config.fileSystem;
    }

    dockerServices(): any {
        return yaml.load(fs.readFileSync(this.config.pathToDockerConfig, 'utf8'))['services'];
    }

    pathToGatewayProject(): string {
        return this.config.pathToGatewayProject;
    }
}