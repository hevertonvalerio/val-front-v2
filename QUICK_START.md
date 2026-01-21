# Guia Rápido - Integração LangSmith

## Configuração em 3 Passos

### 1. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_LANGSMITH_API_URL=https://api.langsmith.com
VITE_LANGSMITH_API_KEY=sua_chave_api_aqui
VITE_ASSISTANT_ID=seu_assistant_id_aqui
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Execute o Projeto

```bash
npm run dev
```

## Como Funciona

### Fluxo Automático

1. **Usuário envia mensagem** → O sistema cria automaticamente uma thread (se não existir)
2. **Mensagem é enviada para a API LangSmith** → Via streaming
3. **Resposta do agent é exibida em tempo real** → Atualização progressiva na interface

### Estrutura de Arquivos

```
src/
├── services/
│   └── langsmithApi.js          # Serviço de comunicação com API
├── components/
│   └── ChatContainer.jsx        # Interface do chat (atualizada)
```

## Recursos Implementados

✅ **Criação automática de threads**
- Thread criada na primeira mensagem
- Mantém contexto durante toda a sessão

✅ **Streaming de respostas**
- Respostas aparecem em tempo real
- Atualização progressiva do texto

✅ **Gerenciamento de estado**
- Thread ID persistente durante a sessão
- Histórico de mensagens mantido

✅ **Tratamento de erros**
- Mensagens amigáveis para o usuário
- Logs detalhados no console

## Testando a Integração

1. Abra o navegador em `http://localhost:5173`
2. Digite uma mensagem no chat
3. A resposta do agent aparecerá em tempo real

## Próximos Passos

- Configure suas credenciais no arquivo `.env`
- Teste o envio de mensagens
- Personalize as mensagens de erro se necessário
- Ajuste o comportamento do streaming conforme sua necessidade

## Suporte

Para mais detalhes, consulte `LANGSMITH_INTEGRATION.md`
