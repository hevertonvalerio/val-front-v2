# Debug do Streaming

## Como Debugar

1. Abra o console do navegador (F12)
2. Envie uma mensagem no chat
3. Observe os logs:

### Logs Esperados

```
Evento parseado: { event: "...", data: {...} }
Chunk recebido: { event: "...", data: {...} }
Mensagens extraídas: [...]
Última mensagem: { role: "...", content: "..." }
Conteúdo extraído: "texto da resposta"
```

## Possíveis Estruturas de Dados

### Formato 1: LangGraph Standard
```json
{
  "event": "values",
  "data": {
    "messages": [
      {
        "role": "ai",
        "content": "Resposta do agent"
      }
    ]
  }
}
```

### Formato 2: Com Output
```json
{
  "event": "data",
  "data": {
    "output": {
      "messages": [
        {
          "type": "ai",
          "message": "Resposta do agent"
        }
      ]
    }
  }
}
```

### Formato 3: Direto
```json
{
  "event": "message",
  "data": {
    "content": "Resposta do agent"
  }
}
```

## Checklist de Debug

- [ ] Logs aparecem no console?
- [ ] Eventos estão sendo parseados?
- [ ] Mensagens estão sendo extraídas?
- [ ] Conteúdo está sendo encontrado?
- [ ] UI está sendo atualizada?

## Solução Rápida

Se os logs mostram que os dados estão chegando mas não aparecem na UI, o problema pode ser:

1. **Estrutura diferente**: Ajustar extração no ChatContainer.jsx
2. **Tipo de evento diferente**: Adicionar mais condições no if
3. **Campo de conteúdo diferente**: Tentar outros campos (text, message, content)

## Próximos Passos

1. Copie os logs do console
2. Identifique a estrutura exata dos dados
3. Ajuste o código conforme necessário
