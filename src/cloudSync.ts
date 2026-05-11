import { supabase } from './supabaseClient'

const CLOUD_ROW_ID = 'casa-rossi-main'
const CASA_ROSSI_PREFIX = 'casaRossi'
const LOCAL_UPDATED_KEY = 'casaRossiLocalUpdatedAt'

type CloudData = Record<string, string | null>

let saveTimer: number | undefined
let isApplyingCloudState = false
let suppressCloudSave = false
let lastSnapshot = ''

declare global {
  interface Window {
    __casaRossiCloudSyncInstalled?: boolean
  }
}

function isCasaRossiKey(key: string) {
  return key.startsWith(CASA_ROSSI_PREFIX)
}

function collectLocalState(): CloudData {
  const data: CloudData = {}

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)

    if (key && isCasaRossiKey(key)) {
      data[key] = localStorage.getItem(key)
    }
  }

  return data
}

function hasCasaRossiLocalState() {
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)

    if (key && isCasaRossiKey(key) && key !== LOCAL_UPDATED_KEY) {
      return true
    }
  }

  return false
}

function setLocalUpdatedAt(value: string) {
  suppressCloudSave = true
  localStorage.setItem(LOCAL_UPDATED_KEY, value)
  suppressCloudSave = false
}

function getSnapshot() {
  return JSON.stringify(collectLocalState())
}

function applyCloudState(data: unknown, updatedAt?: string) {
  if (!data || typeof data !== 'object') {
    return
  }

  isApplyingCloudState = true

  const cloudData = data as CloudData

  Object.entries(cloudData).forEach(([key, value]) => {
    if (!isCasaRossiKey(key)) {
      return
    }

    if (typeof value === 'string') {
      localStorage.setItem(key, value)
    }
  })

  if (updatedAt) {
    setLocalUpdatedAt(updatedAt)
  }

  lastSnapshot = getSnapshot()
  isApplyingCloudState = false
}

async function saveCloudStateNow() {
  const now = new Date().toISOString()
  setLocalUpdatedAt(now)

  const data = collectLocalState()

  const { error } = await supabase
    .from('app_state')
    .upsert(
      {
        id: CLOUD_ROW_ID,
        data,
        updated_at: now,
      },
      { onConflict: 'id' },
    )

  if (error) {
    console.warn('Errore salvataggio Supabase:', error.message)
    return
  }

  lastSnapshot = getSnapshot()
  console.info('Casa Rossi salvata su Supabase')
}

function scheduleCloudSave() {
  if (isApplyingCloudState || suppressCloudSave) {
    return
  }

  if (saveTimer) {
    window.clearTimeout(saveTimer)
  }

  saveTimer = window.setTimeout(() => {
    void saveCloudStateNow()
  }, 100)
}

export async function loadCloudStateBeforeApp() {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('data, updated_at')
      .eq('id', CLOUD_ROW_ID)
      .maybeSingle()

    if (error) {
      console.warn('Errore caricamento Supabase:', error.message)
      return
    }

    const hasLocalState = hasCasaRossiLocalState()

    if (!data) {
      if (hasLocalState) {
        await saveCloudStateNow()
      }
      return
    }

    const localUpdatedAt = localStorage.getItem(LOCAL_UPDATED_KEY)
    const cloudUpdatedAt = data.updated_at as string | undefined

    if (hasLocalState && !localUpdatedAt) {
      await saveCloudStateNow()
      return
    }

    if (hasLocalState && localUpdatedAt && cloudUpdatedAt) {
      const localTime = Date.parse(localUpdatedAt)
      const cloudTime = Date.parse(cloudUpdatedAt)

      if (!Number.isNaN(localTime) && !Number.isNaN(cloudTime) && localTime >= cloudTime) {
        await saveCloudStateNow()
        return
      }
    }

    if (data.data) {
      applyCloudState(data.data, cloudUpdatedAt)
    }
  } catch (error) {
    console.warn('Supabase non raggiungibile:', error)
  }
}

export function installCloudSync() {
  if (window.__casaRossiCloudSyncInstalled) {
    return
  }

  window.__casaRossiCloudSyncInstalled = true

  const originalSetItem = Storage.prototype.setItem
  const originalRemoveItem = Storage.prototype.removeItem

  Storage.prototype.setItem = function patchedSetItem(key: string, value: string) {
    originalSetItem.call(this, key, value)

    if (this === window.localStorage && isCasaRossiKey(key) && !suppressCloudSave && !isApplyingCloudState) {
      setLocalUpdatedAt(new Date().toISOString())
      scheduleCloudSave()
    }
  }

  Storage.prototype.removeItem = function patchedRemoveItem(key: string) {
    originalRemoveItem.call(this, key)

    if (this === window.localStorage && isCasaRossiKey(key) && !suppressCloudSave && !isApplyingCloudState) {
      setLocalUpdatedAt(new Date().toISOString())
      scheduleCloudSave()
    }
  }

  lastSnapshot = getSnapshot()

  window.setInterval(() => {
    if (isApplyingCloudState) {
      return
    }

    const currentSnapshot = getSnapshot()

    if (currentSnapshot !== lastSnapshot) {
      setLocalUpdatedAt(new Date().toISOString())
      scheduleCloudSave()
    }
  }, 1000)

  window.addEventListener('pagehide', () => {
    void saveCloudStateNow()
  })

  window.addEventListener('beforeunload', () => {
    void saveCloudStateNow()
  })
}
