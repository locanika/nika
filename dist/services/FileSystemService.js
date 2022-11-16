"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemService = void 0;
const fs_1 = __importDefault(require("fs"));
const path = require('path');
class FileSystemService {
    constructor(systemService) {
        this.systemService = systemService;
    }
    // TODO: move into FileSystemService
    *walkDirectorySync(dir) {
        const files = fs_1.default.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory()) {
                for (const subFile of this.walkDirectorySync(path.join(dir, file.name))) {
                    yield subFile;
                }
            }
            else {
                yield path.join(dir, file.name);
            }
        }
    }
    removeDirectorySync(dir) {
        this.systemService.execShellCommandSync(`rm -rf ${dir}`);
    }
    createDirectorySync(dir) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    existsSync(dir) {
        return fs_1.default.existsSync(dir);
    }
    readFileSync(path) {
        return fs_1.default.readFileSync(path, 'utf8');
    }
    writeFileSync(path, content) {
        return fs_1.default.writeFileSync(path, content);
    }
    getPathDirname(p) {
        return path.dirname(p);
    }
}
exports.FileSystemService = FileSystemService;
//# sourceMappingURL=FileSystemService.js.map