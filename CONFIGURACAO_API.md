# Configuração da API LangGraph

## ✅ Correções Implementadas

Baseado na requisição de exemplo fornecida, o serviço foi atualizado para usar a API correta:

### URL Correta
- ❌ **Antes**: `https://api.langsmith.com`
- ✅ **Agora**: `https://langgraph-val.inovai.app`

### Estrutura da API
A API usa o padrão LangGraph com:
- **Graph ID**: `valcapelli`
- **Assistants**: Criados automaticamente antes de criar threads
- **Threads**: Conversas com contexto persistente
- **Runs**: Execuções de mensagens com streaming

## 📝 Configuração do .env

Crie um arquivo `.env` na raiz do projeto com:

```env
# API Key (mesma usada no Langflow)
VITE_API_KEY=sua_api_key_aqui

# LangGraph API
VITE_LANGSMITH_API_URL=https://langgraph-val.inovai.app
VITE_LANGSMITH_API_KEY=sua_api_key_aqui
VITE_GRAPH_ID=valcapelli
```

**Nota**: Se `VITE_LANGSMITH_API_KEY` não for especificada, o sistema usará `VITE_API_KEY` automaticamente.

## 🔄 Fluxo de Funcionamento

### 1. Primeira Mensagem
```
Usuário envia mensagem
    ↓
Sistema cria Assistant automaticamente
    ↓
Sistema cria Thread
    ↓
Mensagem é enviada via streaming
    ↓
Resposta aparece em tempo real
```

### 2. Mensagens Subsequentes
```
Usuário envia mensagem
    ↓
Usa Assistant e Thread existentes
    ↓
Mensagem é enviada via streaming
    ↓
Resposta aparece em tempo real
```

## 🧪 Como Testar

### 1. Configure o .env
```bash
# Copie o exemplo
cp .env.example .env

# Edite com suas credenciais
# Adicione sua API Key
```

### 2. Reinicie o servidor
```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### 3. Teste no navegador
1. Abra `http://localhost:5173`
2. Digite uma mensagem no chat
3. Observe os logs no console do navegador

### 4. Verifique os logs
No console do navegador, você verá:
- ✅ Criação do Assistant
- ✅ Criação da Thread
- ✅ Envio da mensagem
- ✅ Streaming da resposta

## 🔍 Exemplo de Requisição

### Criar Assistant
```bash
curl https://langgraph-val.inovai.app/assistants \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Accept: */*' \
  --header 'x-api-key: SUA_API_KEY' \
  --data '{
    "assistant_id": "",
    "graph_id": "valcapelli",
    "config": {},
    "context": {},
    "metadata": {},
    "if_exists": "do_nothing",
    "name": "",
    "description": null
  }'
```

### Resposta Esperada
```json
{
  "assistant_id": "705660fa-a161-4257-8473-b4d636256fa0",
  "graph_id": "valcapelli",
  "version": 1,
  "created_at": "2026-01-21T23:03:38.990793+00:00",
  "updated_at": "2026-01-21T23:03:38.990793+00:00",
  "config": {},
  "context": {},
  "metadata": {},
  "name": "Untitled",
  "description": null
}
```

## 🐛 Resolução de Problemas

### Erro: ERR_NAME_NOT_RESOLVED
✅ **Resolvido**: URL atualizada para `https://langgraph-val.inovai.app`

### Erro: 401 Unauthorized
- Verifique se a API Key está correta no `.env`
- Confirme que a variável começa com `VITE_`

### Erro: 404 Not Found
- Verifique se o `VITE_GRAPH_ID` está correto (`valcapelli`)
- Confirme que o graph existe no deployment

### Erro: CORS
- A API deve estar configurada para aceitar requisições do localhost
- Em produção, configure o domínio correto

## 📊 Estrutura de Dados

### Assistant
```javascript
{
  assistant_id: "uuid",
  graph_id: "valcapelli",
  version: 1,
  config: {},
  metadata: {}
}
```

### Thread
```javascript
{
  thread_id: "uuid",
  created_at: "timestamp",
  metadata: {
    assistant_id: "uuid"
  }
}
```

### Mensagem (Input)
```javascript
{
  assistant_id: "uuid",
  input: {
    messages: [
      {
        role: "user",
        content: "Texto da mensagem"
      }
    ]
  },
  stream_mode: ["values"]
}
```

### Resposta (Stream)
```javascript
{
  event: "values",
  data: {
    messages: [
      {
        role: "assistant",
        content: "Resposta do agent",
        type: "ai"
      }
    ]
  }
}
```

## ✨ Recursos Implementados

- ✅ Criação automática de Assistant
- ✅ Criação automática de Thread
- ✅ Envio de mensagens com streaming
- ✅ Atualização em tempo real da UI
- ✅ Tratamento de erros robusto
- ✅ Headers corretos conforme API
- ✅ Persistência de contexto na sessão

## 📚 Próximos Passos

1. Configure suas credenciais no `.env`
2. Teste o envio de mensagens
3. Verifique o streaming funcionando
4. Ajuste conforme necessário

Para mais detalhes, consulte:
- `LANGSMITH_INTEGRATION.md` - Documentação completa
- `TROUBLESHOOTING.md` - Resolução de problemas
- `QUICK_START.md` - Guia rápido
