#!/bin/sh
set -e

# Gerar config.js com variáveis de ambiente em runtime
cat > /usr/share/nginx/html/config.js <<EOF
window.ENV = {
  API_KEY: '${API_KEY:-}',
  FLOW_ID: '${FLOW_ID:-61a17804-9284-446d-8e60-3801aef9bb60}',
  HOST_URL: '${HOST_URL:-https://langflow.inovai.app}'
};
EOF

echo "Configuração gerada:"
cat /usr/share/nginx/html/config.js

# Executar comando passado como argumento
exec "$@"
