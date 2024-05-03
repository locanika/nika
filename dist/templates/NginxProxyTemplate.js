"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NginxProxyTemplate = `    
server {
    listen 80;

    server_name {{ host }};

    client_max_body_size 100M;

    location / {
        {% if cors_enabled %}
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' "$http_origin" always;
                add_header 'Access-Control-Allow-Credentials' 'true' always;
                add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
                add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With,X-PARAMETERS-CHECKSUM,X-CURRENT-USER-CHECKSUM,X-CALLER,X-AUTH-TOKEN' always;
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain; charset=utf-8';
                add_header 'Content-Length' 0;
                return 204;
            }

            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With,X-PARAMETERS-CHECKSUM,X-CURRENT-USER-CHECKSUM,X-CALLER,X-AUTH-TOKEN' always;
        {% endif %}

        proxy_set_header Host $http_host;
        proxy_pass http://{{ proxy_path }};
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}`;
exports.default = NginxProxyTemplate;
//# sourceMappingURL=NginxProxyTemplate.js.map