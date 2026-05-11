# React + TypeScript + Vite

# Casa Rossi

**Casa Rossi** è una web app familiare per la gestione dei compiti domestici settimanali della famiglia Rossi.

La app è pensata per essere usata da smartphone, in particolare da iPhone, e permette di organizzare compiti, assegnazioni, reminder personali e storico settimanale.

## Funzioni principali

- Gestione della settimana da **sabato a venerdì**
- Compiti domestici giornalieri
- Compiti specifici per alcuni giorni
- Assegnazione dei compiti a una persona
- Stato del compito: **Da fare** / **Fatto**
- Punteggi conteggiati solo quando il compito è segnato come fatto
- Classifica settimanale
- Reminder personali senza punteggio
- Storico delle settimane concluse
- Bilancio storico crediti/debiti
- Salvataggio locale nel browser tramite `localStorage`
- Layout ottimizzato per iPhone

## Persone

La app è configurata per:

- Francesco
- Laura
- Leonardo
- Alessandro
- Edoardo

## Compiti domestici

I compiti attualmente previsti sono:

- Preparazione pranzo
- Preparazione cena
- Lavastoviglie pranzo
- Lavastoviglie cena
- Apparecchiare pranzo
- Sparecchiare pranzo
- Apparecchiare cena
- Sparecchiare cena
- Pulizia bagni
- Fare la spesa
- Pulizia lettiera di Appa
- Gestione cibo e acqua di Appa

Appa è il gatto della famiglia.

## Punteggi

I punti vengono assegnati solo quando un compito è:

1. assegnato a una persona;
2. segnato come **Fatto**.

I reminder personali non danno punti e non entrano nella classifica.

## Reminder personali

La pagina **Personale** mostra reminder individuali senza punteggio, come:

- Rifare il letto
- Lasciare il bagno pulito
- Riordinare camera
- Riordinare scrivania
- Sistemare vestiti e scarpe
- Portare la biancheria sporca nel cesto
- Controllare scadenze università / impegni personali

## Storico settimane

Quando si usa **Resetta Settimana**, la settimana corrente viene salvata nello storico.

Lo storico conserva:

- intervallo della settimana
- data e ora del salvataggio
- classifica finale
- compiti fatti
- reminder personali fatti

## Salvataggio dati

Attualmente i dati vengono salvati nel browser tramite `localStorage`.

Questo significa che:

- i dati restano sul dispositivo usato;
- se si apre la app da un altro telefono, i dati potrebbero non essere gli stessi;
- cancellando i dati del browser si possono perdere le informazioni salvate.

Per una futura versione condivisa tra più dispositivi si potrà integrare un database online, per esempio Supabase o Firebase.

## Installazione come app su iPhone

La app può essere aggiunta alla schermata Home di iPhone tramite Safari.

### Procedura

1. Apri Safari su iPhone.
2. Vai all’indirizzo della web app Casa Rossi.
3. Tocca il pulsante **Condividi**.
4. Scorri l’elenco delle opzioni.
5. Tocca **Aggiungi alla schermata Home**.
6. Verifica che il nome sia **Casa Rossi**.
7. Tocca **Aggiungi**.

L’icona comparirà nella schermata Home dell’iPhone.

Se disponibile, attiva anche l’opzione **Apri come app web**.

## Uso quotidiano

### Schermata Settimana

Usare questa schermata per:

- vedere i compiti della settimana;
- filtrare compiti da fare, fatti o non assegnati;
- assegnare un compito a una persona;
- segnare un compito come fatto.

Un compito non dovrebbe essere segnato come fatto se non è prima assegnato a una persona.

### Schermata Classifica

Mostra:

- punteggio della settimana corrente;
- bilancio storico, se disponibile.

### Schermata Personale

Mostra per ogni persona:

- compiti assegnati;
- compiti fatti;
- reminder personali da fare;
- reminder personali fatti.

I reminder personali non danno punti.

### Schermata Storico

Mostra le settimane già concluse e salvate.

## Reset settimana

Il pulsante **Resetta Settimana** salva la settimana corrente nello storico e prepara una nuova settimana.

Prima del reset viene richiesta conferma.

## Avvio in sviluppo

Per installare le dipendenze:

```bash
npm install