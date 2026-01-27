#!/bin/sh
set -e

# Script de entrypoint para configurar variáveis de ambiente em runtime
# Substitui placeholders no código JavaScript com valores reais das variáveis de ambiente

# Arquivo de configuração que será injetado
CONFIG_FILE="/usr/share/nginx/html/config.js"

# Criar arquivo de configuração com variáveis de ambiente
cat > $CONFIG_FILE << EOF
window.ENV = {
  API_KEY: "${VITE_API_KEY:-}",
  LANGSMITH_API_URL: "${VITE_LANGSMITH_API_URL:-https://langgraph-val.inovai.app}",
  GRAPH_ID: "${VITE_GRAPH_ID:-valcapelli}"
};
EOF

echo "Configuração de runtime criada:"
cat $CONFIG_FILE

# Executar comando original do nginx
exec "$@"
