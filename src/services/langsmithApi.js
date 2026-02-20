const API_BASE_URL = import.meta.env.VITE_LANGSMITH_API_URL || 'https://langgraph-val.iaautomation-dev.com.br'
const API_KEY = import.meta.env.VITE_LANGSMITH_API_KEY || import.meta.env.VITE_API_KEY || ''
const GRAPH_ID = import.meta.env.VITE_GRAPH_ID || 'valcapelli'

class LangSmithAPI {
  constructor() {
    this.baseURL = API_BASE_URL
    this.apiKey = API_KEY
    this.graphId = GRAPH_ID
    this.assistantId = null
    this.threadId = null
  }

  async createAssistant() {
    try {
      const response = await fetch(`${this.baseURL}/assistants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          assistant_id: '',
          graph_id: this.graphId,
          config: {},
          context: {},
          metadata: {},
          if_exists: 'do_nothing',
          name: '',
          description: null
        })
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar assistant: ${response.status}`)
      }

      const data = await response.json()
      this.assistantId = data.assistant_id
      return data
    } catch (error) {
      console.error('Erro ao criar assistant:', error)
      throw error
    }
  }

  async createThread(metadata = {}) {
    try {
      if (!this.assistantId) {
        await this.createAssistant()
      }

      const response = await fetch(`${this.baseURL}/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          metadata: {
            assistant_id: this.assistantId,
            ...metadata
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Erro ao criar thread: ${response.status}`)
      }

      const data = await response.json()
      this.threadId = data.thread_id
      return data
    } catch (error) {
      console.error('Erro ao criar thread:', error)
      throw error
    }
  }

  async getThread(threadId) {
    try {
      const response = await fetch(`${this.baseURL}/threads/${threadId}`, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'x-api-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new Error(`Erro ao buscar thread: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar thread:', error)
      throw error
    }
  }

  async sendMessage(message, threadId = null) {
    const targetThreadId = threadId || this.threadId

    if (!targetThreadId) {
      const thread = await this.createThread()
      this.threadId = thread.thread_id
    }

    if (!this.assistantId) {
      const threadData = await this.getThread(this.threadId)
      this.assistantId = threadData.metadata?.assistant_id
      
      if (!this.assistantId) {
        await this.createAssistant()
      }
    }

    try {
      const response = await fetch(
        `${this.baseURL}/threads/${this.threadId}/runs/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'x-api-key': this.apiKey
          },
          body: JSON.stringify({
            assistant_id: this.assistantId,
            input: {
              messages: [
                {
                  role: 'user',
                  content: message
                }
              ]
            },
            stream_mode: ['values'],
            multitask_strategy: 'reject'
          })
        }
      )

      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.status}`)
      }

      return response.body
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw error
    }
  }

  async *streamResponse(stream) {
    const reader = stream.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let currentEventType = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          
          if (!trimmedLine) continue
          
          if (trimmedLine.startsWith('event: ')) {
            currentEventType = trimmedLine.slice(7).trim()
          } else if (trimmedLine.startsWith('data: ')) {
            const data = trimmedLine.slice(6).trim()
            
            if (data === '[DONE]') {
              return
            }

            try {
              const parsed = JSON.parse(data)
              parsed._eventType = currentEventType
              yield parsed
            } catch (e) {
              console.warn('Erro ao parsear linha:', data, e)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async getThreadHistory(threadId = null, limit = 10) {
    const targetThreadId = threadId || this.threadId

    if (!targetThreadId) {
      throw new Error('Nenhuma thread ativa')
    }

    try {
      const response = await fetch(
        `${this.baseURL}/threads/${targetThreadId}/history?limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'x-api-key': this.apiKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      throw error
    }
  }

  async getThreadState(threadId = null) {
    const targetThreadId = threadId || this.threadId

    if (!targetThreadId) {
      throw new Error('Nenhuma thread ativa')
    }

    try {
      const response = await fetch(
        `${this.baseURL}/threads/${targetThreadId}/state`,
        {
          method: 'GET',
          headers: {
            'Accept': '*/*',
            'x-api-key': this.apiKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Erro ao buscar estado: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar estado:', error)
      throw error
    }
  }

  setThreadId(threadId) {
    this.threadId = threadId
  }

  getThreadId() {
    return this.threadId
  }

  clearThread() {
    this.threadId = null
    this.assistantId = null
  }
}

export default new LangSmithAPI()
