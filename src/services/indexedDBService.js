const DB_NAME = 'ChatAppDB'
const DB_VERSION = 1
const SESSIONS_STORE = 'sessions'

class IndexedDBService {
  constructor() {
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
          const objectStore = db.createObjectStore(SESSIONS_STORE, { keyPath: 'id' })
          objectStore.createIndex('createdAt', 'createdAt', { unique: false })
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false })
        }
      }
    })
  }

  async ensureDB() {
    if (!this.db) {
      await this.init()
    }
  }

  async getAllSessions() {
    await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readonly')
      const objectStore = transaction.objectStore(SESSIONS_STORE)
      const request = objectStore.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getSession(id) {
    await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readonly')
      const objectStore = transaction.objectStore(SESSIONS_STORE)
      const request = objectStore.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveSession(session) {
    await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readwrite')
      const objectStore = transaction.objectStore(SESSIONS_STORE)
      const request = objectStore.put(session)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteSession(id) {
    await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readwrite')
      const objectStore = transaction.objectStore(SESSIONS_STORE)
      const request = objectStore.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clearExpiredSessions(expiryDays = 7) {
    await this.ensureDB()
    const sessions = await this.getAllSessions()
    const now = Date.now()
    const expiryTime = expiryDays * 24 * 60 * 60 * 1000

    const expiredIds = sessions
      .filter(session => (now - session.createdAt) > expiryTime)
      .map(session => session.id)

    for (const id of expiredIds) {
      await this.deleteSession(id)
    }

    return expiredIds.length
  }

  async clearAllSessions() {
    await this.ensureDB()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([SESSIONS_STORE], 'readwrite')
      const objectStore = transaction.objectStore(SESSIONS_STORE)
      const request = objectStore.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export default new IndexedDBService()
