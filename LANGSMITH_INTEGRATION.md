# Integração com LangSmith API

Este documento explica como integrar o chatbot com a API LangSmith para enviar e receber mensagens do agent.

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as seguintes variáveis:

```env
# API LangSmith
VITE_LANGSMITH_API_URL=https://api.langsmith.com
VITE_LANGSMITH_API_KEY=sua_langsmith_api_key_aqui
VITE_ASSISTANT_ID=seu_assistant_id_aqui
```

### 2. Obter Credenciais

- **API Key**: Obtenha sua chave de API no painel do LangSmith
- **Assistant ID**: ID do assistente/agent que você criou no LangSmith

## Como Funciona

### Arquitetura

A integração utiliza a seguinte estrutura:

1. **Serviço API** (`src/services/langsmithApi.js`): Gerencia toda a comunicação com a API LangSmith
2. **ChatContainer** (`src/components/ChatContainer.jsx`): Interface do usuário que utiliza o serviço

### Fluxo de Mensagens

1. **Criação de Thread**: Na primeira mensagem, uma thread é criada automaticamente
2. **Envio de Mensagem**: A mensagem do usuário é enviada para a thread
3. **Streaming de Resposta**: A resposta do agent é recebida em tempo real via streaming
4. **Atualização da UI**: A interface é atualizada conforme a resposta chega

### Endpoints Utilizados

- `POST /threads` - Criar nova thread
- `POST /threads/{thread_id}/runs/stream` - Enviar mensagem e receber resposta em streaming
- `GET /threads/{thread_id}/state` - Obter estado atual da thread
- `GET /threads/{thread_id}/history` - Obter histórico de mensagens

## Uso do Serviço

### Exemplo Básico

```javascript
import langsmithApi from './services/langsmithApi'

// Enviar mensagem
const stream = await langsmithApi.sendMessage('Olá!')

// Processar resposta em streaming
for await (const chunk of langsmithApi.streamResponse(stream)) {
  if (chunk.event === 'values' && chunk.data?.messages) {
    const messages = chunk.data.messages
    const lastMessage = messages[messages.length - 1]
    console.log(lastMessage.content)
  }
}
```

### Métodos Disponíveis

#### `createThread(metadata)`
Cria uma nova thread de conversa.

```javascript
const thread = await langsmithApi.createThread({
  user_id: 'user123',
  session_name: 'Consulta Cromoterapia'
})
```

#### `sendMessage(message, threadId)`
Envia uma mensagem para a thread e retorna um stream de resposta.

```javascript
const stream = await langsmithApi.sendMessage('Como funciona a cromoterapia?')
```

#### `streamResponse(stream)`
Generator assíncrono que processa o stream de resposta.

```javascript
for await (const chunk of langsmithApi.streamResponse(stream)) {
  // Processar chunk
}
```

#### `getThreadHistory(threadId, limit)`
Obtém o histórico de mensagens da thread.

```javascript
const history = await langsmithApi.getThreadHistory(null, 20)
```

#### `getThreadState(threadId)`
Obtém o estado atual da thread.

```javascript
const state = await langsmithApi.getThreadState()
```

## Estrutura de Dados

### Mensagem do Usuário

```json
{
  "role": "user",
  "content": "Texto da mensagem"
}
```

### Resposta do Agent (Chunk)

```json
{
  "event": "values",
  "data": {
    "messages": [
      {
        "role": "assistant",
        "content": "Resposta do agent",
        "type": "ai"
      }
    ]
  }
}
```

## Tratamento de Erros

O serviço inclui tratamento de erros para:

- Falha na criação de thread
- Erro ao enviar mensagem
- Problemas de conexão
- Timeout de resposta

Todos os erros são logados no console e uma mensagem amigável é exibida ao usuário.

## Persistência de Thread

A thread ID é mantida durante toda a sessão do usuário. Para iniciar uma nova conversa:

```javascript
langsmithApi.clearThread()
```

## Desenvolvimento

### Testar Localmente

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

## Troubleshooting

### Erro: "Nenhuma thread ativa"
- Certifique-se de que a thread foi criada antes de enviar mensagens
- O serviço cria automaticamente uma thread na primeira mensagem

### Erro: "Erro ao enviar mensagem: 401"
- Verifique se a API Key está correta no arquivo `.env`
- Confirme que a API Key tem as permissões necessárias

### Erro: "Erro ao enviar mensagem: 404"
- Verifique se o Assistant ID está correto
- Confirme que o assistente existe no LangSmith

### Resposta vazia
- Verifique se o assistente está configurado corretamente no LangSmith
- Confirme que o assistente tem um modelo de linguagem configurado

## Recursos Adicionais

- [Documentação LangSmith API](https://docs.smith.langchain.com/)
- [OpenAPI Spec](./api-1.json)
