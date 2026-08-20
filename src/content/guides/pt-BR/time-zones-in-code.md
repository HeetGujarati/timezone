---
title: "Fusos horários no código, um guia prático"
description: "Guarde UTC, mantenha o identificador do fuso, converta na exibição, nunca construa uma tabela de diferenças. As regras e o raciocínio de cada uma."
summary: "Quase todo defeito de fuso horário remonta a um de quatro erros. Eis o que fazer em vez disso, em JavaScript, Python, Java, Go e SQL, com o raciocínio e não só a regra."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords: ['fusos horários no código', 'boas práticas de data e hora', 'armazenar carimbos de tempo', 'utc no banco de dados']
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Quase todo defeito de fuso horário em produção remonta a um de quatro erros: guardar uma hora local, guardar uma diferença em vez de um fuso, converter na camada errada, ou construir à mão uma tabela de diferenças. Tudo o que vem a seguir decorre de evitá-los.

## Regra 1: guarde instantes em UTC

Um instante é um ponto na linha do tempo. Uma hora local é uma leitura de relógio, que precisa de um fuso e de uma política de desambiguação antes de significar qualquer coisa.

```sql
-- Bom: um instante
created_at TIMESTAMPTZ NOT NULL

-- Ruim: uma leitura de relógio sem fuso
created_at TIMESTAMP NOT NULL
```

O `TIMESTAMPTZ` do PostgreSQL não guarda um fuso: ele normaliza para UTC na escrita e converte na leitura. É exatamente o que você quer para «quando isso aconteceu».

## Regra 2: guarde o identificador do fuso, não a diferença

Se você precisa saber _onde_ — para um evento recorrente, uma preferência de usuário, o horário de funcionamento de um negócio — guarde `Europe/London`, não `+01:00`.

Uma diferença é um fato sobre um instante. Um fuso é um conjunto de regras que sobrevive a um governo mudando de ideia. A Grã-Bretanha está em `+00:00` em janeiro e em `+01:00` em julho; guardar qualquer um dos dois e chamar de «o fuso do usuário» está errado metade do ano.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- a hora de relógio que escolheram
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- instante resolvido, recalculado se as regras mudarem
```

Para um evento recorrente, a hora local e o fuso são a fonte da verdade; o instante em UTC é um índice derivado. Se a tzdata mudar — e ela muda várias vezes por ano — a coluna derivada é regerada e as 09:00 do usuário continuam sendo 09:00.

## Regra 3: converta na borda

A lógica de negócio trabalha com instantes. A conversão para uma hora local legível acontece no último momento possível, na camada que sabe quem está lendo.

O corolário importa mais: **nunca deixe o fuso do próprio servidor vazar para o comportamento.** Ponha `TZ=UTC` no seu ambiente de implantação e trate como defeito qualquer caminho de código cujo resultado dependa da configuração regional do servidor. É a classe de falha que só aparece quando alguém implanta numa segunda região.

## Regra 4: nunca construa uma tabela de diferenças

Todo ambiente de execução traz a base da IANA. Use-a.

**JavaScript**

```js
// Formatar num fuso
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Obter uma diferença sem biblioteca: comparar o relógio do fuso com o UTC
function offsetMinutes(timeZone, instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUtc - Math.floor(instant / 1000) * 1000) / 60000;
}
```

Defina `hourCycle: 'h23'` de forma explícita. Algumas versões do ICU informam a meia-noite como hora 24 sob `en-US`, o que desloca a data em um dia e é um defeito genuinamente miserável de encontrar.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # biblioteca padrão desde a 3.9

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

Nunca use `datetime.utcnow()`. Ele devolve uma data ingênua que _parece_ UTC mas não carrega fuso, e misturá-la com datas conscientes lança exceção no pior momento. A chamada correta é `datetime.now(timezone.utc)`.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` é bem projetado: `Instant` para pontos na linha do tempo, `LocalDateTime` para leituras de relógio sem fuso, `ZonedDateTime` para os dois juntos. O sistema de tipos impõe a distinção em que este guia insiste.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` lê a tzdata do sistema. Num contêiner vazio não há nenhuma — importe `_ "time/tzdata"` para embuti-la no binário, ou toda consulta de fuso cai em silêncio para UTC.

## Os dois dias do ano

O adiantamento apaga uma hora; o atraso repete uma. Escolha uma política, aplique com constância e diga ao usuário o que você fez:

- **Hora local inexistente** (02:30 na data de primavera dos Estados Unidos): adiantar pelo tamanho do buraco, de modo que 02:30 vire 03:30.
- **Hora local ambígua** (01:30 na data de outono dos Estados Unidos): tomar a primeira ocorrência, a mais cedo.

São as políticas que este site usa, e coincidem com o padrão `disambiguation: 'compatible'` do `Temporal` no ECMAScript — vale a pena coincidir para que o seu comportamento concorde com a plataforma.

O buraco nem sempre é de uma hora. A ilha Lord Howe muda 30 minutos, então leia o tamanho na transição em vez de supor.

## Testes

Quatro casos pegam quase tudo:

1. **Um fuso de meia hora** — `Asia/Kolkata` (+05:30). Pega as suposições de horas inteiras.
2. **Um fuso de 45 minutos** — `Asia/Kathmandu` (+05:45). Pega as suposições de meia hora.
3. **Um fuso do hemisfério sul** — `Australia/Sydney`. Pega o «verão quer dizer junho».
4. **A ilha Lord Howe** — `Australia/Lord_Howe`. Pega a mudança de 60 minutos fixada no código, e nada mais vai pegar.

Acrescente uma data de adiantamento e uma de atraso para cada fuso em que os seus usuários realmente estão, e fixe a versão da tzdata na integração contínua, para que uma atualização da base não derrube uma compilação pelo motivo errado.

## Eventos recorrentes são outro problema

Um evento único é um instante. Um evento recorrente é uma regra, e os dois precisam de armazenamentos diferentes.

«Toda terça às 09:00 em Europe/London» não é «a cada 604800 segundos a partir deste instante». Os dois divergem no momento em que a Grã-Bretanha muda os relógios: a regra mantém a reunião às 09:00 locais, enquanto o intervalo a arrasta para 08:00 ou 10:00.

Guarde a regra — hora local, identificador do fuso, padrão de repetição — e materialize instantes a partir dela. Quando a tzdata mudar, regere os instantes materializados; não os migre. A regra é aquilo com que o usuário concordou.

Os casos desconfortáveis decorrem das duas descontinuidades anuais. Uma reunião às 02:30 todos os dias vai descobrir que num dia de primavera essa hora não existe, e que num dia de outono ela acontece duas vezes. Escolha uma política, aplique com constância, e saiba que sistemas de calendário diferentes escolheram políticas diferentes — razão pela qual o mesmo evento recorrente pode aparecer com uma hora de diferença em duas agendas em exatamente dois dias por ano.

## Uma nota sobre `Temporal`

A interface `Temporal` do ECMAScript substitui `Date` por tipos que distinguem instantes, horas de relógio e datas com fuso, à maneira de `java.time`. `Temporal.ZonedDateTime` carrega um identificador de fuso; `Temporal.Instant` é um ponto na linha do tempo; `Temporal.PlainDateTime` é uma leitura de relógio sem fuso, e o sistema de tipos impede que você os confunda.

A opção `disambiguation` expõe exatamente a política dos dois dias por ano a que este guia sempre volta: `'compatible'` (o padrão — adiantar através dos buracos, tomar a mais cedo de um par ambíguo), `'earlier'`, `'later'` e `'reject'`. A última merece consideração em tudo aquilo em que ficar uma hora errado em silêncio é pior do que um erro.
