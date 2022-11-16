import fs from "fs";
import {SystemService} from "./SystemService";
const path = require('path');

export class FileSystemService {
    constructor(private systemService: SystemService) {
    }

    // TODO: move into FileSystemService
    * walkDirectorySync(dir: string): Generator<string> {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                for (const subFile of this.walkDirectorySync(path.join(dir, file.name))) {
                    yield subFile;
                }
            } else {
                yield path.join(dir, file.name);
            }
        }
    }

    removeDirectorySync(dir: string): void {
        this.systemService.execShellCommandSync(`rm -rf ${dir}`);
    }

    createDirectorySync(dir: string): void {
        fs.mkdirSync(dir, { recursive: true });
    }

    existsSync(dir: string): boolean {
        return fs.existsSync(dir);
    }

    readFileSync(path: string): string {
        return fs.readFileSync(path, 'utf8');
    }

    writeFileSync(path: string, content: string): void {
        return fs.writeFileSync(path, content);
    }

    getPathDirname(p: string): string {
        return path.dirname(p);
    }
}