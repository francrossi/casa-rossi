import { useState, useEffect } from 'react'
import './App.css'

type Compito = {
  nome: string
  punti: number
  giorni: string[]
}

type StatoCompito = {
  assegnato: string | null
  fatto: boolean
}

type StatoSettimana = {
  [giorno: string]: {
    [compito: string]: StatoCompito
  }
}

type Reminder = {
  id: string
  nome: string
  persona: string
  giorni: string[]
  fatto: boolean
}

type ActiveWeek = {
  start: string
  end: string
  label: string
}

type StoricoSettimanale = {
  id: string
  savedAt: string
  weekStart: string
  weekEnd: string
  weekLabel: string
  punteggi: { [persona: string]: number }
  compitiAssegnati: { [persona: string]: number }
  compitiFatti: { [persona: string]: number }
  reminderFatti: { [persona: string]: number }
  riepilogoPersonale: {
    [persona: string]: {
      compitiDaFare: number
      compitiFatti: number
      reminderDaFare: number
      reminderFatti: number
    }
  }
}

const persone = ['Francesco', 'Laura', 'Leonardo', 'Alessandro', 'Edoardo']

const giorni = ['Sabato', 'Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì']

const compiti: Compito[] = [
  { nome: 'Gestione cibo e acqua di Appa', punti: 1, giorni: giorni },
  { nome: 'Pulizia lettiera di Appa', punti: 1, giorni: giorni },
  { nome: 'Riempire bottiglie acqua mattina', punti: 1, giorni: giorni },

  { nome: 'Lavatrice carico e scarico', punti: 1, giorni: giorni },
  { nome: 'Panni da stendere e ritirare', punti: 1, giorni: giorni },
  { nome: 'Asciugatrice carico e scarico', punti: 1, giorni: giorni },

  { nome: 'Preparazione pranzo', punti: 2, giorni: giorni },
  { nome: 'Apparecchiare pranzo', punti: 1, giorni: giorni },
  { nome: 'Sparecchiare pranzo', punti: 1, giorni: giorni },
  { nome: 'Lavastoviglie pranzo', punti: 1, giorni: giorni },

  { nome: 'Fare la spesa', punti: 3, giorni: ['Lunedì'] },
  { nome: 'Annaffiare piante', punti: 1, giorni: ['Lunedì', 'Mercoledì', 'Venerdì'] },
  { nome: 'Pulizia bagni', punti: 3, giorni: ['Sabato', 'Martedì'] },

  { nome: 'Riempire bottiglie acqua sera', punti: 1, giorni: giorni },
  { nome: 'Preparazione cena', punti: 2, giorni: giorni },
  { nome: 'Apparecchiare cena', punti: 1, giorni: giorni },
  { nome: 'Sparecchiare cena', punti: 1, giorni: giorni },
  { nome: 'Lavastoviglie cena', punti: 1, giorni: giorni }
]

const reminderIniziali: Reminder[] = [
  { id: 'rem-1', nome: 'Rifare il letto', persona: 'Leonardo', giorni, fatto: false },
  { id: 'rem-2', nome: 'Lasciare il bagno pulito', persona: 'Leonardo', giorni, fatto: false },
  { id: 'rem-3', nome: 'Riordinare camera', persona: 'Leonardo', giorni, fatto: false },
  { id: 'rem-4', nome: 'Riordinare scrivania', persona: 'Leonardo', giorni, fatto: false },
  { id: 'rem-5', nome: 'Sistemare vestiti e scarpe', persona: 'Leonardo', giorni, fatto: false },
  { id: 'rem-6', nome: 'Portare la biancheria sporca nel cesto', persona: 'Leonardo', giorni, fatto: false },
  { id: 'rem-7', nome: 'Controllare scadenze università / impegni personali', persona: 'Leonardo', giorni, fatto: false },
  { id: 'rem-8', nome: 'Rifare il letto', persona: 'Alessandro', giorni, fatto: false },
  { id: 'rem-9', nome: 'Lasciare il bagno pulito', persona: 'Alessandro', giorni, fatto: false },
  { id: 'rem-10', nome: 'Riordinare camera', persona: 'Alessandro', giorni, fatto: false },
  { id: 'rem-11', nome: 'Riordinare scrivania', persona: 'Alessandro', giorni, fatto: false },
  { id: 'rem-12', nome: 'Sistemare vestiti e scarpe', persona: 'Alessandro', giorni, fatto: false },
  { id: 'rem-13', nome: 'Portare la biancheria sporca nel cesto', persona: 'Alessandro', giorni, fatto: false },
  { id: 'rem-14', nome: 'Controllare scadenze università / impegni personali', persona: 'Alessandro', giorni, fatto: false },
  { id: 'rem-15', nome: 'Rifare il letto', persona: 'Edoardo', giorni, fatto: false },
  { id: 'rem-16', nome: 'Lasciare il bagno pulito', persona: 'Edoardo', giorni, fatto: false },
  { id: 'rem-17', nome: 'Riordinare camera', persona: 'Edoardo', giorni, fatto: false },
  { id: 'rem-18', nome: 'Riordinare scrivania', persona: 'Edoardo', giorni, fatto: false },
  { id: 'rem-19', nome: 'Sistemare vestiti e scarpe', persona: 'Edoardo', giorni, fatto: false },
  { id: 'rem-20', nome: 'Portare la biancheria sporca nel cesto', persona: 'Edoardo', giorni, fatto: false },
  { id: 'rem-21', nome: 'Controllare scadenze università / impegni personali', persona: 'Edoardo', giorni, fatto: false },
  { id: 'rem-22', nome: 'Controllare agenda familiare', persona: 'Francesco', giorni, fatto: false },
  { id: 'rem-23', nome: 'Controllare agenda familiare', persona: 'Laura', giorni, fatto: false }
]

const reminderKey = 'casaRossiReminderPersonali'
const storicoKey = 'casaRossiStoricoSettimane'
const activeWeekKey = 'casaRossiSettimanaAttiva'

type FasciaGiornata = 'tutti' | 'mattina' | 'pranzo' | 'pomeriggio' | 'sera'

const fasceGiornata: { id: FasciaGiornata; label: string; emoji: string }[] = [
  { id: 'tutti', label: 'Tutti', emoji: '✨' },
  { id: 'mattina', label: 'Mattina', emoji: '🌅' },
  { id: 'pranzo', label: 'Pranzo', emoji: '🍽️' },
  { id: 'pomeriggio', label: 'Pomeriggio', emoji: '🌿' },
  { id: 'sera', label: 'Sera', emoji: '🌙' },
]



function App() {
  const [schermata, setSchermata] = useState<'settimana' | 'classifica' | 'personale' | 'storico'>('settimana')
  const [statoSettimana, setStatoSettimana] = useState<StatoSettimana>({})
  const [reminderPersonali, setReminderPersonali] = useState<Reminder[]>([])
  const [storico, setStorico] = useState<StoricoSettimanale[]>([])
  const [activeWeek, setActiveWeek] = useState<ActiveWeek | null>(null)
  const [settimanaInizialeInput, setSettimanaInizialeInput] = useState('')
  const [filtro, setFiltro] = useState<'tutti' | 'daFare' | 'fatti' | 'nonAssegnati'>('tutti')
  const [fasciaGiornata, setFasciaGiornata] = useState<FasciaGiornata>('tutti')
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({})

  const createInitialState = (): StatoSettimana => {
    const init: StatoSettimana = {}
    giorni.forEach(giorno => {
      init[giorno] = {}
      compiti.forEach(compito => {
        if (compito.giorni.includes(giorno)) {
          init[giorno][compito.nome] = { assegnato: null, fatto: false }
        }
      })
    })
    return init
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const addDays = (date: Date, days: number) => {
    const next = new Date(date)
    next.setDate(next.getDate() + days)
    next.setHours(0, 0, 0, 0)
    return next
  }

  const getCurrentWeekSaturday = (date: Date) => {
    const weekday = date.getDay()
    const daysToSubtract = (weekday + 1) % 7
    const saturday = new Date(date)
    saturday.setDate(saturday.getDate() - daysToSubtract)
    saturday.setHours(0, 0, 0, 0)
    return saturday
  }

  const createActiveWeek = (reference: Date): ActiveWeek => {
    const startDate = getCurrentWeekSaturday(reference)
    const endDate = addDays(startDate, 6)
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      label: `${formatDate(startDate)} – ${formatDate(endDate)}`
    }
  }

  const createNextActiveWeek = (current: ActiveWeek): ActiveWeek => {
    const startDate = addDays(new Date(current.start), 7)
    const endDate = addDays(startDate, 6)
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      label: `${formatDate(startDate)} – ${formatDate(endDate)}`
    }
  }

  const normalizeActiveWeek = (raw: unknown): ActiveWeek => {
    if (!raw || typeof raw !== 'object') {
      return createActiveWeek(new Date())
    }
    const parsed = raw as Partial<ActiveWeek>
    if (!parsed.start || !parsed.end) {
      return createActiveWeek(new Date())
    }
    const startDate = new Date(parsed.start)
    const endDate = new Date(parsed.end)
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return createActiveWeek(new Date())
    }
    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      label: `${formatDate(startDate)} – ${formatDate(endDate)}`
    }
  }

  const normalizeStatoSettimana = (raw: unknown): StatoSettimana => {
    if (!raw || typeof raw !== 'object') {
      return createInitialState()
    }

    const normalized: StatoSettimana = {}
    const rawState = raw as { [giorno: string]: unknown }

    giorni.forEach(giorno => {
      normalized[giorno] = {}
      const rawDay = rawState[giorno]
      const rawDayObject = rawDay && typeof rawDay === 'object' ? rawDay as { [compito: string]: unknown } : {}

      compiti.forEach(compito => {
        if (!compito.giorni.includes(giorno)) {
          return
        }
        const rawCompito = rawDayObject[compito.nome]
        const compitoObject = rawCompito && typeof rawCompito === 'object' ? rawCompito as { [key: string]: unknown } : {}
        const assegnato = typeof compitoObject.assegnato === 'string' && persone.includes(compitoObject.assegnato) ? compitoObject.assegnato : null
        const fatto = typeof compitoObject.fatto === 'boolean' ? compitoObject.fatto : false
        normalized[giorno][compito.nome] = { assegnato, fatto }
      })
    })

    return normalized
  }

  const mergeReminderIniziali = (saved: unknown): Reminder[] => {
    if (!Array.isArray(saved)) {
      return reminderIniziali
    }

    const validKeys = new Set(reminderIniziali.map(rem => `${rem.persona}::${rem.nome}`))
    const savedMap = new Map<string, Reminder>()

    const normalized: Reminder[] = saved
      .filter(item => item && typeof item === 'object')
      .map((item, index) => {
        const parsed = item as Partial<Reminder>
        return {
          id: typeof parsed.id === 'string' ? parsed.id : `old-${index}`,
          nome: typeof parsed.nome === 'string' ? parsed.nome : '',
          persona: typeof parsed.persona === 'string' ? parsed.persona : '',
          giorni: Array.isArray(parsed.giorni) ? parsed.giorni.map(String) : giorni,
          fatto: Boolean(parsed.fatto)
        }
      })
      .filter(reminder => reminder.nome && reminder.persona)

    normalized.forEach(reminder => {
      const key = `${reminder.persona}::${reminder.nome}`
      if (validKeys.has(key)) {
        if (!savedMap.has(key)) {
          savedMap.set(key, reminder)
        }
      }
    })

    return reminderIniziali.map(reminder => {
      const key = `${reminder.persona}::${reminder.nome}`
      return savedMap.get(key) ?? reminder
    })
  }

  const [caricamentoCompletato, setCaricamentoCompletato] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('casaRossiStato')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setStatoSettimana(normalizeStatoSettimana(parsed))
      } catch {
        setStatoSettimana(createInitialState())
      }
    } else {
      setStatoSettimana(createInitialState())
    }

    const savedReminder = localStorage.getItem(reminderKey)
    if (savedReminder) {
      try {
        setReminderPersonali(mergeReminderIniziali(JSON.parse(savedReminder)))
      } catch {
        setReminderPersonali(reminderIniziali)
      }
    } else {
      setReminderPersonali(reminderIniziali)
    }

    const savedStorico = localStorage.getItem(storicoKey)
    if (savedStorico) {
      try {
        const parsed = JSON.parse(savedStorico)
        if (Array.isArray(parsed)) {
          setStorico(parsed)
        }
      } catch {
        setStorico([])
      }
    }

    const savedActiveWeek = localStorage.getItem(activeWeekKey)
    if (savedActiveWeek) {
      try {
        setActiveWeek(normalizeActiveWeek(JSON.parse(savedActiveWeek)))
      } catch {
        setActiveWeek(createActiveWeek(new Date()))
      }
    } else {
      setActiveWeek(createActiveWeek(new Date()))
    }
    setCaricamentoCompletato(true)
  }, [])

  useEffect(() => {
    if (activeWeek) {
      setExpandedDays({})
    }
  }, [activeWeek])

  useEffect(() => {
    if (!caricamentoCompletato) return
    localStorage.setItem('casaRossiStato', JSON.stringify(statoSettimana))
  }, [statoSettimana, caricamentoCompletato])

  useEffect(() => {
    if (!caricamentoCompletato) return
    localStorage.setItem(reminderKey, JSON.stringify(reminderPersonali))
  }, [reminderPersonali, caricamentoCompletato])

  useEffect(() => {
    if (!caricamentoCompletato) return
    localStorage.setItem(storicoKey, JSON.stringify(storico))
  }, [storico, caricamentoCompletato])

  useEffect(() => {
    if (!caricamentoCompletato) return
    if (activeWeek) {
      localStorage.setItem(activeWeekKey, JSON.stringify(activeWeek))
    }
  }, [activeWeek, caricamentoCompletato])

  const assegnaCompito = (giorno: string, compito: string, persona: string | null) => {
    setStatoSettimana(prev => {
      const giornoState = prev[giorno] ?? {}
      const compitoState = giornoState[compito] ?? { assegnato: null, fatto: false }
      if (compitoState.fatto) {
        return prev
      }
      const assegnato = persona && persone.includes(persona) ? persona : null
      return {
        ...prev,
        [giorno]: {
          ...giornoState,
          [compito]: { ...compitoState, assegnato }
        }
      }
    })
  }

  const segnaFatto = (giorno: string, compito: string) => {
    setStatoSettimana(prev => {
      const giornoState = prev[giorno] ?? {}
      const compitoState = giornoState[compito] ?? { assegnato: null, fatto: false }
      if (!compitoState.fatto && !compitoState.assegnato) {
        window.alert('Prima assegna il compito a una persona.')
        return prev
      }
      return {
        ...prev,
        [giorno]: {
          ...giornoState,
          [compito]: { ...compitoState, fatto: !compitoState.fatto }
        }
      }
    })
  }

  const toggleReminder = (id: string) => {
    setReminderPersonali(prev => prev.map(reminder => reminder.id === id ? { ...reminder, fatto: !reminder.fatto } : reminder))
  }

  const countPunteggi = (state: StatoSettimana) => {
    const punteggi: { [persona: string]: number } = {}
    persone.forEach(p => punteggi[p] = 0)
    giorni.forEach(giorno => {
      compiti.forEach(compito => {
        const stato = state[giorno]?.[compito.nome]
        if (compito.giorni.includes(giorno) && stato?.fatto && stato.assegnato) {
          punteggi[stato.assegnato] += compito.punti
        }
      })
    })
    return punteggi
  }

  const countCompitiAssegnati = (state: StatoSettimana) => {
    const counts: { [persona: string]: number } = {}
    persone.forEach(p => counts[p] = 0)
    giorni.forEach(giorno => {
      compiti.forEach(compito => {
        const stato = state[giorno]?.[compito.nome]
        if (compito.giorni.includes(giorno) && stato?.assegnato) {
          counts[stato.assegnato] += 1
        }
      })
    })
    return counts
  }

  const countCompitiFatti = (state: StatoSettimana) => {
    const counts: { [persona: string]: number } = {}
    persone.forEach(p => counts[p] = 0)
    giorni.forEach(giorno => {
      compiti.forEach(compito => {
        const stato = state[giorno]?.[compito.nome]
        if (compito.giorni.includes(giorno) && stato?.fatto && stato.assegnato) {
          counts[stato.assegnato] += 1
        }
      })
    })
    return counts
  }

  const countReminderFatti = (reminders: Reminder[]) => {
    const counts: { [persona: string]: number } = {}
    persone.forEach(p => counts[p] = 0)
    reminders.forEach(reminder => {
      if (reminder.fatto) {
        counts[reminder.persona] = (counts[reminder.persona] || 0) + 1
      }
    })
    return counts
  }

  const getDayStats = (giorno: string) => {
    const tasks = compiti.filter(c => c.giorni.includes(giorno))
    const fatti = tasks.filter(compito => statoSettimana[giorno]?.[compito.nome]?.fatto).length
    return { total: tasks.length, fatti }
  }

  const getWeekSummary = () => {
  let total = 0
  let fatti = 0
  let nonAssegnati = 0

  giorni.forEach(giorno => {
    compiti.forEach(compito => {
      if (compito.giorni.includes(giorno)) {
        total += 1

        const stato = statoSettimana[giorno]?.[compito.nome] || {
          assegnato: null,
          fatto: false
        }

        if (stato.fatto) {
          fatti += 1
        }

        if (!stato.assegnato) {
          nonAssegnati += 1
        }
      }
    })
  })

  return {
    total,
    fatti,
    daFare: total - fatti,
    nonAssegnati
  }
}

  const filterCompiti = (compito: Compito, giorno: string) => {
    const stato = statoSettimana[giorno]?.[compito.nome] || { assegnato: null, fatto: false }
    if (filtro === 'daFare' && stato.fatto) {
      return false
    }
    if (filtro === 'fatti' && !stato.fatto) {
      return false
    }
    if (filtro === 'nonAssegnati' && stato.assegnato) {
      return false
    }
    return true
  }
  const getFasciaCompito = (nome: string): FasciaGiornata => {
    const n = nome.toLowerCase()

    if (n.includes('sera') || n.includes('cena')) return 'sera'
    if (n.includes('pranzo')) return 'pranzo'
    if (n.includes('piante') || n.includes('spesa')) return 'pomeriggio'

    if (
      n.includes('mattina') ||
      n.includes('appa') ||
      n.includes('lettiera') ||
      n.includes('lavatrice') ||
      n.includes('asciugatrice') ||
      n.includes('panni') ||
      n.includes('bagni')
    ) {
      return 'mattina'
    }

    return 'pomeriggio'
  }

  const filterFasciaCompito = (compito: Compito) => {
    return fasciaGiornata === 'tutti' || getFasciaCompito(compito.nome) === fasciaGiornata
  }

  const toggleDay = (giorno: string) => {
    const wasOpen = Boolean(expandedDays[giorno])
    setFasciaGiornata('tutti')
    setExpandedDays(wasOpen ? {} : { [giorno]: true })
  }

  const getStoricoBalance = () => {
    const totals: { [persona: string]: number } = {}
    const tasksFatti: { [persona: string]: number } = {}
    const remindersFatti: { [persona: string]: number } = {}
    persone.forEach(p => {
      totals[p] = 0
      tasksFatti[p] = 0
      remindersFatti[p] = 0
    })
    storico.forEach(entry => {
      for (const persona of persone) {
        totals[persona] += entry.punteggi[persona] ?? 0
        tasksFatti[persona] += entry.compitiFatti[persona] ?? 0
        remindersFatti[persona] += entry.reminderFatti[persona] ?? 0
      }
    })
    const totalPoints = Object.values(totals).reduce((sum, value) => sum + value, 0)
    const weeks = storico.length || 1
    const averagePerWeek = totalPoints / weeks
    const quota = totalPoints / persone.length
    const balance: { [persona: string]: number } = {}
    persone.forEach(persona => {
      balance[persona] = Math.round((totals[persona] - quota) * 100) / 100
    })
    return { totals, tasksFatti, remindersFatti, totalPoints, weeks, averagePerWeek, quota, balance }
  }

  const createRiepilogoPersonale = (state: StatoSettimana, reminders: Reminder[]) => {
    const riepilogo: StoricoSettimanale['riepilogoPersonale'] = {}
    persone.forEach(persona => {
      riepilogo[persona] = { compitiDaFare: 0, compitiFatti: 0, reminderDaFare: 0, reminderFatti: 0 }
    })

    giorni.forEach(giorno => {
      compiti.forEach(compito => {
        const stato = state[giorno]?.[compito.nome]
        if (stato?.assegnato) {
          if (stato.fatto) {
            riepilogo[stato.assegnato].compitiFatti += 1
          } else {
            riepilogo[stato.assegnato].compitiDaFare += 1
          }
        }
      })
    })

    reminders.forEach(reminder => {
      if (reminder.fatto) {
        riepilogo[reminder.persona].reminderFatti += 1
      } else {
        riepilogo[reminder.persona].reminderDaFare += 1
      }
    })

    return riepilogo
  }

  const createHistoryEntry = (state: StatoSettimana, reminders: Reminder[], week: ActiveWeek): StoricoSettimanale => ({
    id: `${Date.now()}`,
    savedAt: new Date().toISOString(),
    weekStart: week.start,
    weekEnd: week.end,
    weekLabel: week.label,
    punteggi: countPunteggi(state),
    compitiAssegnati: countCompitiAssegnati(state),
    compitiFatti: countCompitiFatti(state),
    reminderFatti: countReminderFatti(reminders),
    riepilogoPersonale: createRiepilogoPersonale(state, reminders)
  })

  const salvaStoricoSettimanale = (state: StatoSettimana, reminders: Reminder[]) => {
    const week = activeWeek ?? createActiveWeek(new Date())
    const entry = createHistoryEntry(state, reminders, week)
    setStorico(prev => [entry, ...prev])
  }

  const clearStorico = () => {
    if (!window.confirm('Sei sicuro di voler cancellare tutto lo storico? Questa operazione non può essere annullata.')) {
      return
    }
    setStorico([])
  }

  const impostaSettimanaIniziale = () => {
    if (!settimanaInizialeInput) {
      window.alert('Seleziona prima una data di inizio settimana.')
      return
    }

    const nuovaData = new Date(`${settimanaInizialeInput}T12:00:00`)

    if (Number.isNaN(nuovaData.getTime())) {
      window.alert('Data non valida.')
      return
    }

    if (!window.confirm('Vuoi impostare questa come settimana iniziale? I compiti della settimana corrente verranno azzerati.')) {
      return
    }

    setActiveWeek(createActiveWeek(nuovaData))
    setStatoSettimana(createInitialState())
    setReminderPersonali(prev => prev.map(reminder => ({ ...reminder, fatto: false })))
    setFiltro('tutti')
    setExpandedDays({})
    setSchermata('settimana')
  }

  const azzeraSettimanaCorrente = () => {
    if (!window.confirm('Vuoi azzerare la settimana corrente? Tutti i compiti torneranno da fare e non assegnati.')) {
      return
    }

    setStatoSettimana(createInitialState())
    setReminderPersonali(prev => prev.map(reminder => ({ ...reminder, fatto: false })))
    setFiltro('tutti')
    setExpandedDays({})
    setSchermata('settimana')
  }

  const resetSettimana = () => {
    if (!window.confirm('Vuoi salvare questa settimana nello storico e iniziare una nuova settimana?')) {
      return
    }
    const week = activeWeek ?? createActiveWeek(new Date())
    salvaStoricoSettimanale(statoSettimana, reminderPersonali)
    setActiveWeek(createNextActiveWeek(week))
    setStatoSettimana(createInitialState())
    setReminderPersonali(prev => prev.map(reminder => ({ ...reminder, fatto: false })))
  }

  const calcolaClassifica = () => {
    const punteggi: { [persona: string]: number } = {}
    persone.forEach(p => punteggi[p] = 0)
    giorni.forEach(giorno => {
      compiti.forEach(compito => {
        if (compito.giorni.includes(giorno)) {
          const stato = statoSettimana[giorno]?.[compito.nome]
          if (stato?.fatto && stato.assegnato) {
            punteggi[stato.assegnato] += compito.punti
          }
        }
      })
    })
    return Object.entries(punteggi).sort((a, b) => b[1] - a[1])
  }

  const compitiPersonali = (persona: string) => {
    const daFare: string[] = []
    const fatti: string[] = []
    giorni.forEach(giorno => {
      compiti.forEach(compito => {
        if (compito.giorni.includes(giorno)) {
          const stato = statoSettimana[giorno]?.[compito.nome]
          if (stato?.assegnato === persona) {
            const label = `${giorno}: ${compito.nome}`
            if (stato.fatto) {
              fatti.push(label)
            } else {
              daFare.push(label)
            }
          }
        }
      })
    })
    return { daFare, fatti }
  }

  const reminderPersonale = (persona: string) => {
    const daFare = reminderPersonali.filter(reminder => reminder.persona === persona && !reminder.fatto)
    const fatti = reminderPersonali.filter(reminder => reminder.persona === persona && reminder.fatto)
    return { daFare, fatti }
  }

  const filterCounts = (() => {
    let total = 0
    let fatti = 0
    let nonAssegnati = 0

    giorni.forEach(giorno => {
      compiti.forEach(compito => {
        if (!compito.giorni.includes(giorno)) return

        total += 1
        const stato = statoSettimana[giorno]?.[compito.nome] || { assegnato: null, fatto: false }

        if (stato.fatto) fatti += 1
        if (!stato.assegnato) nonAssegnati += 1
      })
    })

    return {
      total,
      fatti,
      daFare: total - fatti,
      nonAssegnati,
    }
  })()

  const weeklyProgress = filterCounts.total > 0
    ? Math.round((filterCounts.fatti / filterCounts.total) * 100)
    : 0

  return (
    <div className="app">
      <header>
        <h1>Casa Rossi</h1>
        <p>Gestione compiti domestici</p>
        <p className="week-label">{activeWeek ? `Settimana ${activeWeek.label}` : 'Settimana in caricamento...'}</p>
        <nav>
          <button onClick={() => setSchermata('settimana')} className={schermata === 'settimana' ? 'active' : ''}>Settimana</button>
          <button onClick={() => setSchermata('classifica')} className={schermata === 'classifica' ? 'active' : ''}>Classifica</button>
          <button onClick={() => setSchermata('personale')} className={schermata === 'personale' ? 'active' : ''}>Personale</button>
          <button onClick={() => setSchermata('storico')} className={schermata === 'storico' ? 'active' : ''}>Storico</button>
        </nav>
      </header>
      <main>
        {schermata === 'settimana' && (
          <div className="settimana">
            <div className="week-summary">
              <div>
                <strong>Compiti totali</strong>
                <div>{getWeekSummary().total}</div>
              </div>
              <div>
                <strong>Compiti fatti</strong>
                <div>{getWeekSummary().fatti}</div>
              </div>
              <div>
                <strong>Compiti da fare</strong>
                <div>{getWeekSummary().daFare}</div>
              </div>
              <div>
                <strong>Non assegnati</strong>
                <div>{getWeekSummary().nonAssegnati}</div>
              </div>
            </div>
            <div className="mission-console">
              <div className="mission-head">
                <div>
                  <span className="mission-eyebrow">Console settimana</span>
                  <strong>Missione famiglia</strong>
                </div>
                <div className="mission-percent">{weeklyProgress}%</div>
              </div>

              <div className="mission-track" aria-label={`Progresso settimana ${weeklyProgress}%`}>
                <span style={{ width: `${weeklyProgress}%` }} />
              </div>

              <div className="mission-grid">
                <div className="mission-chip">
                  <span className="mission-led led-green" />
                  <b>{filterCounts.fatti}</b>
                  <small>fatti</small>
                </div>
                <div className="mission-chip">
                  <span className="mission-led led-amber" />
                  <b>{filterCounts.daFare}</b>
                  <small>da fare</small>
                </div>
                <div className="mission-chip">
                  <span className="mission-led led-red" />
                  <b>{filterCounts.nonAssegnati}</b>
                  <small>non assegnati</small>
                </div>
              </div>
            </div>

            <div className="filter-buttons">
              <button className={filtro === 'tutti' ? 'active' : ''} onClick={() => { setFiltro('tutti'); setExpandedDays({}) }}>
                <span className="filter-label">Tutti</span>
                <span className="filter-count">{filterCounts.total}</span>
              </button>
              <button className={filtro === 'daFare' ? 'active' : ''} onClick={() => { setFiltro('daFare'); setExpandedDays({}) }}>
                <span className="filter-label">Da fare</span>
                <span className="filter-count">{filterCounts.daFare}</span>
              </button>
              <button className={filtro === 'fatti' ? 'active' : ''} onClick={() => { setFiltro('fatti'); setExpandedDays({}) }}>
                <span className="filter-label">Fatti</span>
                <span className="filter-count">{filterCounts.fatti}</span>
              </button>
              <button className={filtro === 'nonAssegnati' ? 'active' : ''} onClick={() => { setFiltro('nonAssegnati'); setExpandedDays({}) }}>
                <span className="filter-label">Non assegnati</span>
                <span className="filter-count">{filterCounts.nonAssegnati}</span>
              </button>
            </div>

            {filterCounts.nonAssegnati > 0 && (
              <div className="unassigned-alert" role="status">
                <div className="unassigned-alert-icon">⚠️</div>
                <div>
                  <strong>{filterCounts.nonAssegnati} compiti non assegnati</strong>
                  <p>Assegnali ai membri della famiglia per attivare classifica e progressi personali.</p>
                </div>
              </div>
            )}

            {giorni.map(giorno => {
              const { total, fatti } = getDayStats(giorno)
              const expanded = expandedDays[giorno]
              const tasks = compiti.filter(c => c.giorni.includes(giorno) && filterCompiti(c, giorno) && filterFasciaCompito(c))
              const dayPercent = total > 0 ? Math.round((fatti / total) * 100) : 0
              const dayMood = total > 0 && fatti === total ? 'done' : fatti > 0 ? 'progress' : 'todo'
              const dayStatus = dayMood === 'done' ? 'Completato' : dayMood === 'progress' ? 'In corso' : 'Da iniziare'
              return (
                <div key={giorno} className={`giorno ${expanded ? 'expanded' : 'collapsed'} ${dayMood}`}>
                  <button type="button" className="day-toggle" onClick={() => toggleDay(giorno)}>
                    <div className="day-main">
                      <div className="day-title-row">
                        <span className="day-name">{giorno}</span>
                        <span className={`day-state ${dayMood}`}>{dayStatus}</span>
                      </div>
                      <span className="day-subtitle">{fatti}/{total} fatti</span>
                    </div>

                    <div className="day-score">
                      <strong>{dayPercent}%</strong>
                      <span className="day-open-indicator">{expanded ? '−' : '+'}</span>
                    </div>
                  </button>

                  <div className="day-progress" aria-hidden="true">
                    <span style={{ width: `${dayPercent}%` }} />
                  </div>
                  {expanded && (
                    <div className="compiti">
                  <div className="time-filter" role="tablist" aria-label="Filtro fascia giornata">
                    {fasceGiornata.map(fascia => (
                      <button
                        key={fascia.id}
                        type="button"
                        className={fasciaGiornata === fascia.id ? 'active' : ''}
                        onClick={() => setFasciaGiornata(fascia.id)}
                      >
                        <span>{fascia.emoji}</span>
                        <span>{fascia.label}</span>
                      </button>
                    ))}
                  </div>

                      {tasks.length > 0 ? tasks.map(compito => {
                        const stato = statoSettimana[giorno]?.[compito.nome] || { assegnato: null, fatto: false }
                        return (
                          <div key={compito.nome} className={`compito ${stato.fatto ? 'fatto' : stato.assegnato ? 'assigned' : 'unassigned'}`}>
                            <div className="compito-top">
                              <span className="compito-name">{compito.nome}</span>
                              <span className="compito-punti">{compito.punti} pt</span>
                            </div>
                            <div className="compito-meta">
                              <span className="compito-assegnato">{stato.assegnato || 'Non assegnato'}</span>
                              <span className="compito-stato">{stato.fatto ? 'Fatto' : 'Da fare'}</span>
                            </div>
                            <div className="compito-actions">
                              <div className="assign-panel" aria-label={`Assegna ${compito.nome}`}>
                                <button
                                  type="button"
                                  className={!stato.assegnato ? 'active' : ''}
                                  disabled={stato.fatto}
                                  onClick={() => assegnaCompito(giorno, compito.nome, null)}
                                >
                                  Nessuno
                                </button>
                                {persone.map(persona => (
                                  <button
                                    key={persona}
                                    type="button"
                                    className={stato.assegnato === persona ? 'active' : ''}
                                    disabled={stato.fatto}
                                    onClick={() => assegnaCompito(giorno, compito.nome, persona)}
                                  >
                                    {persona}
                                  </button>
                                ))}
                              </div>
                              <button onClick={() => segnaFatto(giorno, compito.nome)}>
                                {stato.fatto ? 'Annulla' : 'Fatto'}
                              </button>
                            </div>
                          </div>
                        )
                      }) : <div className="empty-day">Nessun compito da mostrare</div>}
                    </div>
                  )}
                </div>
              )
            })}
            <div className="week-controls">
              <button className="reset" onClick={azzeraSettimanaCorrente}>
                Azzera settimana corrente
              </button>

              <button className="reset" onClick={resetSettimana}>
                Chiudi settimana e vai alla successiva
              </button>

              <div className="week-start-control">
                <label htmlFor="settimana-iniziale">Imposta settimana iniziale</label>
                <input
                  id="settimana-iniziale"
                  type="date"
                  value={settimanaInizialeInput}
                  onChange={e => setSettimanaInizialeInput(e.target.value)}
                />
                <button onClick={impostaSettimanaIniziale}>Imposta</button>
              </div>
            </div>
          </div>
        )}
        {schermata === 'classifica' && (
          <div className="classifica">
            <h2>Classifica settimana corrente</h2>
            <ul>
              {calcolaClassifica().map(([persona, punti]) => (
                <li key={persona}>{persona}: {punti} punti</li>
              ))}
            </ul>
            <div className="historic-balance">
              <h2>Bilancio storico</h2>
              {storico.length === 0 ? (
                <p>Nessuno storico disponibile. Il bilancio si formerà dopo il primo reset settimana.</p>
              ) : (
                <div className="balances-grid">
                  {(() => {
                    const { totals, tasksFatti, remindersFatti, quota, balance } = getStoricoBalance()
                    return (
                      <>
                        <div>
                          <strong>Punti totali storici</strong>
                          <ul>
                            {Object.entries(totals).map(([persona, punti]) => (
                              <li key={persona}>{persona}: {punti}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Compiti fatti storici</strong>
                          <ul>
                            {Object.entries(tasksFatti).map(([persona, count]) => (
                              <li key={persona}>{persona}: {count}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Reminder fatti storici</strong>
                          <ul>
                            {Object.entries(remindersFatti).map(([persona, count]) => (
                              <li key={persona}>{persona}: {count}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong>Quota equa</strong>
                          <div>{Math.round(quota * 100) / 100} punti</div>
                        </div>
                        <div>
                          <strong>Credito / Debito</strong>
                          <ul>
                            {Object.entries(balance).map(([persona, diff]) => (
                              <li key={persona}>{persona}: {diff >= 0 ? `Credito +${diff}` : `Debito ${diff}`}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
        {schermata === 'personale' && (
          <div className="personale">
            <h2>Riepilogo Personale</h2>
            {persone.map(persona => {
              const compiti = compitiPersonali(persona)
              const reminder = reminderPersonale(persona)
              return (
                <div key={persona} className="persona-riepilogo">
                  <h3>{persona}</h3>
                  <div className="persona-section">
                    <div>
                      <strong>Compiti da fare</strong>
                      <ul>
                        {compiti.daFare.length > 0 ? compiti.daFare.map(item => <li key={item}>{item}</li>) : <li>Nessun compito da fare</li>}
                      </ul>
                    </div>
                    <div>
                      <strong>Compiti fatti</strong>
                      <ul>
                        {compiti.fatti.length > 0 ? compiti.fatti.map(item => <li key={item}>{item}</li>) : <li>Nessun compito fatto</li>}
                      </ul>
                    </div>
                  </div>
                  <div className="persona-section">
                    <div>
                      <strong>Reminder da fare</strong>
                      <ul>
                        {reminder.daFare.length > 0 ? reminder.daFare.map(item => (
                          <li key={item.id} className="reminder-item">
                            <span>{item.nome}</span>
                            <button onClick={() => toggleReminder(item.id)}>Fatto</button>
                          </li>
                        )) : <li>Nessun reminder da fare</li>}
                      </ul>
                    </div>
                    <div>
                      <strong>Reminder fatti</strong>
                      <ul>
                        {reminder.fatti.length > 0 ? reminder.fatti.map(item => (
                          <li key={item.id} className="reminder-item">
                            <span>{item.nome}</span>
                            <button onClick={() => toggleReminder(item.id)}>Annulla</button>
                          </li>
                        )) : <li>Nessun reminder fatto</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {schermata === 'storico' && (
          <div className="storico">
            <h2>Storico Settimane</h2>
            {storico.length === 0 ? (
              <p>Nessuna settimana salvata.</p>
            ) : (
              <div className="storico-list">
                {storico.map(entry => (
                  <div key={entry.id} className="storico-entry">
                    <div className="storico-header">
                      <h3>Settimana {entry.weekLabel}</h3>
                      <div className="storico-meta">Salvata il {new Date(entry.savedAt).toLocaleString()}</div>
                    </div>
                    <div className="storico-grid">
                      <div>
                        <strong>Classifica finale</strong>
                        <ul>
                          {Object.entries(entry.punteggi).sort((a, b) => b[1] - a[1]).map(([persona, punti]) => (
                            <li key={persona}>{persona}: {punti} punti</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Compiti fatti</strong>
                        <ul>
                          {Object.entries(entry.compitiFatti).map(([persona, count]) => (
                            <li key={persona}>{persona}: {count}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Reminder fatti</strong>
                        <ul>
                          {Object.entries(entry.reminderFatti).map(([persona, count]) => (
                            <li key={persona}>{persona}: {count}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {storico.length > 0 && (
              <button onClick={clearStorico} className="reset storico-reset">Cancella storico</button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
