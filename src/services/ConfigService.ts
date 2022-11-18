const yaml = require('js-yaml');
const fs = require('fs');
const os = require('os');

export enum OsName {
    LINUX = 'linux',
    MACOS = 'macos'
}

export enum FileSystem {
    LINUX_DEFAULT = 'linux_default',
    MACOS_DEFAULT = 'macos_default',
    MACOS_MUTAGEN = 'macos_mutagen'
}

export enum DockerMode {
    ROOT_LESS = 'root_less',
    ROOT = 'root'
}

export interface ProjectDTO {
    name: string,
    src: string
}

export interface ConfigDTO {
    pathToDockerConfig: string,
    pathToGatewayProject: string,
    osName: OsName,
    fileSystem: FileSystem,
    dockerMode: DockerMode,
    servicesRestartPolicy: string,
    projects: ProjectDTO[],
    enabledServices: string[]
}

export class ConfigService {
    public build(): ConfigDTO {
        let config = {
            os_name: null,
            file_system: null,
            docker_mode: DockerMode.ROOT,
            services_restart_policy: 'always',
            projects: [],
            enabled_services: []
        };

        if (fs.existsSync('./config.local.yml')) {
            config = { ...config, ...yaml.load(fs.readFileSync('./config.yml', 'utf8')) };
        }
        if (fs.existsSync('./config.local.yml')) {
            config = { ...config, ...yaml.load(fs.readFileSync('./config.local.yml', 'utf8')) };
        }

        const osName = config['os_name'] || this.getDefaultOsName();
        const fileSystem = config['file_system'] || this.getDefaultFileSystem(osName);

        return {
            pathToGatewayProject: './projects/gateway/',
            pathToDockerConfig: './docker-compose.yml',
            osName: osName,
            fileSystem: fileSystem,
            dockerMode: config['docker_mode'],
            servicesRestartPolicy: config['services_restart_policy'],
            projects: config['projects'],
            enabledServices: config['enabled_services']
        };
    }

    private getDefaultOsName(): OsName {
        if (os.platform() === 'linux') {
            return OsName.LINUX;
        } else {
            return OsName.MACOS;
        }
    }

    private getDefaultFileSystem(osName: OsName): FileSystem {
        if (osName === OsName.LINUX) {
            return FileSystem.LINUX_DEFAULT;
        } else {
            return FileSystem.MACOS_DEFAULT;
        }
    }
}