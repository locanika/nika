"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MakefileTemplate = `
{{ project }}-ssh:
\tdocker-compose exec {{ project }} /bin/bash

{{ project }}-stop:
\tdocker-compose stop {{ project }}

{{ project }}-restart:
\tdocker-compose stop {{ project }}
\tdocker-compose up -d {{ project }}

{{ project }}-logs:
\tdocker-compose logs --follow {{ project }}

{{ project }}-build:
\tdocker-compose build {{ project }}
`;
exports.default = MakefileTemplate;
//# sourceMappingURL=MakefileTemplate.js.map