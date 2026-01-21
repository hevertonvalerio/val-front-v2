# Troubleshooting - Integração LangSmith

## Erro: ERR_NAME_NOT_RESOLVED

### Problema
```
POST https://api.langsmith.com/threads net::ERR_NAME_NOT_RESOLVED
```

### Causa
A URL padrão `https://api.langsmith.com` não é a URL correta para o seu deployment do LangSmith.

### Solução

**Opção 1: Usar a mesma URL do Langflow (Recomendado)**

No seu arquivo `.env`, configure:

```env
VITE_LANGSMITH_API_URL=https://langflow.inovai.app
VITE_LANGSMITH_API_KEY=sua_api_key_aqui
VITE_ASSISTANT_ID=seu_assistant_id_aqui
```

**Opção 2: Deixar em branco (usa automaticamente VITE_HOST_URL)**

Se você não especificar `VITE_LANGSMITH_API_URL`, o sistema usará automaticamente o valor de `VITE_HOST_URL`:

```env
# Não precisa especificar VITE_LANGSMITH_API_URL
VITE_HOST_URL=https://langflow.inovai.app
VITE_LANGSMITH_API_KEY=sua_api_key_aqui
VITE_ASSISTANT_ID=seu_assistant_id_aqui
```

### Como Descobrir a URL Correta

1. **Verifique onde seu deployment está hospedado**
   - Se você está usando Langflow, provavelmente é a mesma URL
   - Exemplo: `https://langflow.inovai.app`

2. **Teste a URL no navegador**
   - Acesse `https://sua-url/threads` 
   - Se retornar um erro de autenticação (401), a URL está correta
   - Se retornar erro de DNS, a URL está incorreta

3. **Consulte a documentação do seu provider**
   - Cada deployment pode ter uma URL diferente
   - Verifique o painel de controle do seu deployment

## Erro: 401 Unauthorized

### Problema
```
POST https://langflow.inovai.app/threads 401 (Unauthorized)
```

### Solução
Verifique se a API Key está correta no arquivo `.env`:

```env
VITE_LANGSMITH_API_KEY=sua_chave_api_correta
```

## Erro: 404 Not Found

### Problema
```
POST https://langflow.inovai.app/threads 404 (Not Found)
```

### Possíveis Causas

1. **Endpoint incorreto**
   - Verifique se a API suporta o endpoint `/threads`
   - Alguns deployments podem usar caminhos diferentes

2. **Assistant ID inválido**
   - Confirme que o Assistant ID existe no seu deployment

### Solução
Verifique os endpoints disponíveis na sua API consultando o arquivo `api-1.json`.

## Erro: CORS

### Problema
```
Access to fetch at 'https://langflow.inovai.app/threads' from origin 'http://localhost:5173' has been blocked by CORS policy
```

### Solução
Configure CORS no seu deployment ou use um proxy. Para desenvolvimento local, você pode adicionar um proxy no `vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://langflow.inovai.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

E atualize a URL no `.env`:

```env
VITE_LANGSMITH_API_URL=/api
```

## Verificação Rápida

Execute este checklist:

- [ ] Arquivo `.env` criado na raiz do projeto
- [ ] `VITE_LANGSMITH_API_URL` configurada com a URL correta
- [ ] `VITE_LANGSMITH_API_KEY` configurada com a chave de API válida
- [ ] `VITE_ASSISTANT_ID` configurado com o ID do assistente
- [ ] Servidor de desenvolvimento reiniciado após alterar `.env`
- [ ] URL testada no navegador ou Postman

## Logs Úteis

Para debug, adicione logs no serviço:

```javascript
// Em langsmithApi.js, no método createThread
console.log('URL:', this.baseURL)
console.log('API Key:', this.apiKey ? 'Configurada' : 'Não configurada')
console.log('Assistant ID:', this.assistantId)
```

## Suporte

Se o problema persistir:

1. Verifique os logs do console do navegador
2. Teste a API com Postman ou curl
3. Consulte a documentação do seu deployment
4. Verifique se o deployment está online e acessível
