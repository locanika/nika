"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExampleMakefileTemplate = `
help:
\tnode ./node_modules/locanika/dist/nika.js help

dns:
\tnode ./node_modules/locanika/dist/nika.js dns

hosts:
\tnode ./node_modules/locanika/dist/nika.js hosts

projects-init:
\tnode ./node_modules/locanika/dist/nika.js projects-init

projects-pull:
\tnode ./node_modules/locanika/dist/nika.js projects-pull

services-init:
\tnode ./node_modules/locanika/dist/nika.js services-init

services-ps:
\tnode ./node_modules/locanika/dist/nika.js services-ps

services-build:
\tnode ./node_modules/locanika/dist/nika.js services-build

services-up:
\tnode ./node_modules/locanika/dist/nika.js services-up

services-down:
\tnode ./node_modules/locanika/dist/nika.js services-down

services-deploy: 
\tmake services-down
\tmake services-init
\tmake services-build
\tmake services-up
\tmake hosts

services-clean:
\tdocker image prune -a --force --filter "until=24h"

-include ./services/Makefile
`;
exports.default = ExampleMakefileTemplate;
//# sourceMappingURL=ExampleMakefileTemplate.js.map