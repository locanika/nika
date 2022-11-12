const yaml = require('js-yaml');
const fs = require('fs');

export const OS_NAME_LINUX = 'linux';
export const OS_NAME_MACOS = 'macos';
export const FILE_SYSTEM_LINUX_DEFAULT = 'linux_default';
export const FILE_SYSTEM_MACOS_DEFAULT = 'macos_default';
export const FILE_SYSTEM_MACOS_MUTAGEN = 'macos_mutagen';
export const FILE_SYSTEM_MACOS_NFS = 'macos_nfs';

export interface ConfigDTO {
    pathToDockerConfig: string,
    osName: string,
    fileSystem: string,
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
}