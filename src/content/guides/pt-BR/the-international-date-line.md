---
title: 'A linha internacional de data e por que ela se entorta'
description: 'A linha de data não é um meridiano. Ela ziguezagueia em volta de países que preferem não ser partidos ao meio, e já mudou de lugar.'
summary: 'A linha internacional de data segue o meridiano 180° apenas de longe: contorna Kiribati, a Rússia e as Aleutas, e alguns países se deslocaram para o outro lado dela por razões comerciais.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 11
keywords:
  [
    'linha internacional de data',
    'linha de data explicada',
    'fuso horário de kiribati',
    'dia antes dia depois',
  ]
related: ['how-time-zones-work', 'offsets-that-are-not-whole-hours', 'what-utc-really-is']
---

Se você navegar para oeste a partir de Los Angeles por tempo suficiente, ganha uma hora a cada quinze graus de longitude, mais ou menos, e depois de vinte e quatro ganhos desses estaria um dia inteiro fora de compasso com quem ficou para trás. A linha internacional de data é onde esse dia é devolvido.

Só que ela não é uma linha. É uma fronteira negociada que se curva em volta dos países que de outro modo cortaria ao meio.

## Por onde ela passa de fato

No Pacífico, a linha segue de modo aproximado o meridiano 180°, escolhido em 1884 por ser o mais exatamente oposto a Greenwich e por atravessar pouquíssima terra. Depois faz quatro desvios importantes:

**Ao norte, contornando as Aleutas.** Ela desvia para leste para que todo o Alasca fique na mesma data, em vez de partir a cadeia de ilhas.

**Em volta da Rússia.** Uma curva para oeste mantém a Chukotka do lado asiático.

**A leste, contornando Kiribati.** O maior desvio e o mais interessante. Kiribati fica dos dois lados do meridiano 180° e, até 1995, o país estava repartido entre duas datas: suas ilhas ocidentais iam um dia à frente das orientais. Os escritórios do governo em Tarawa compartilhavam apenas quatro dias úteis por semana com os das ilhas da Linha. Em 1995 Kiribati deslocou a linha para leste, pôs o país inteiro na mesma data e empurrou a fronteira até 150° oeste — uma protuberância de cerca de 2.000 quilômetros. Com isso Kiribati passou a ter também o fuso mais adiantado da Terra, UTC+14, e com ele o primeiro nascer do sol do ano 2000, que o governo divulgou com entusiasmo.

**Ao sul, contornando Samoa e Tonga.** O próprio salto de Samoa em 2011 é o melhor exemplo moderno de uma linha que é instrumento econômico, não geográfico.

## O dia que faltou em Samoa

Até 2011, Samoa ficava do lado americano da linha, três horas atrás de Sydney, mas um dia atrás também. Seus principais parceiros comerciais haviam migrado dos Estados Unidos para a Austrália e a Nova Zelândia, e estar um dia fora significava só quatro dias úteis em comum por semana: a sexta-feira samoana era o sábado australiano, e o domingo samoano era a segunda-feira australiana.

À meia-noite de 29 de dezembro de 2011, Samoa saltou direto para 31 de dezembro. **O dia 30 de dezembro de 2011 não existiu em Samoa.** Ninguém fez aniversário, nenhum contrato venceu, e o país passou de UTC-11 para UTC+13.

Tokelau, administrado pela Nova Zelândia, deu o mesmo salto na mesma noite.

Samoa fizera o inverso em 1892, passando do lado asiático para o americano a pedido de comerciantes estadunidenses — e repetindo o 4 de julho duas vezes para consegui-lo, o que foi apresentado como uma gentileza para com a comunidade americana.

## A faixa de 26 horas

Por causa desses desvios, as diferenças horárias do mundo abrangem mais de vinte e quatro horas:

- **UTC+14** — Kiritimati (ilha Christmas), Kiribati. O relógio mais adiantado da Terra
- **UTC+13** — Samoa, Tonga e as ilhas Fênix de Kiribati
- **UTC-11** — Samoa Americana, Niue
- **UTC-12** — as ilhas Baker e Howland, territórios desabitados dos Estados Unidos

São 26 horas de amplitude, e daí decorre algo que vale internalizar: **há instantes em que três datas de calendário diferentes estão em uso ao mesmo tempo em algum ponto da Terra**. Por cerca de duas horas por dia, Kiritimati está numa data, quase o mundo todo na seguinte e a ilha Baker na anterior.

Qualquer código que suponha que uma janela de dois dias cobre todos os fusos erra durante esses intervalos. Qualquer pergunta do tipo «que dia é hoje no mundo» não tem resposta.

Kiritimati e a ilha Baker distam cerca de 2.100 quilômetros e 26 horas de relógio. Em princípio, dá para ver o mesmo pôr do sol duas vezes.

## O que isso significa na prática

**Converter atravessando a linha muda a data, não só a hora.** Tóquio na segunda-feira à noite é Los Angeles na segunda-feira de manhã; Auckland na segunda de manhã é Honolulu no domingo à tarde. Toda página de conversão deste site marca a mudança de dia de forma explícita exatamente por isso: uma hora certa no dia errado é um tipo especial de erro.

**«Amanhã» não é um conceito global.** Um prazo de «fim do dia na sexta» designa instantes diferentes para pessoas diferentes e, para um público de fato mundial, a distância entre a primeira sexta que termina e a última passa de um dia. Diga «sexta-feira, 23:59 UTC» se quiser dizer um único momento.

**A linha se move.** Não com frequência, mas é uma fronteira política e mudou dentro da memória de quem está vivo — duas vezes neste século. Todo sistema com o traçado fixado no código acabará errando. A base da IANA acompanha essas mudanças; é para isso que ela serve.

## Atravessá-la na prática

Voos sobre o Pacífico produzem horários de chegada que parecem erros e não são.

Um voo que sai de Tóquio às 17:00 de segunda e leva nove horas pousa em Los Angeles às 10:00 de **segunda** — sete horas antes de partir, pelo relógio. No sentido inverso, um voo que sai de Los Angeles na tarde de segunda chega a Tóquio na manhã de quarta, tendo pulado a terça-feira quase inteira.

Nenhum dos dois é paradoxo. O voo levou nove horas nos dois sentidos; só os rótulos mudaram. É exatamente por isso que a calculadora de duração deste site resolve as duas pontas em instantes antes de subtrair: a diferença entre duas leituras de relógio dos dois lados da linha não significa nada, ao passo que a diferença entre dois instantes é sempre o tempo realmente decorrido.

A consequência prática para quem constrói software de reservas ou de logística: **nunca calcule uma duração subtraindo horários locais**. Acerta quase sempre, e é isso que torna a prática perigosa.

## Qual lado está «à frente»

A convenção confunde porque inverte a intuição do mapa. Os países logo a _oeste_ da linha — Nova Zelândia, Fiji, Kiribati — são os primeiros a ver cada dia novo. Os que ficam logo a _leste_ — Havaí, Samoa Americana — são os últimos.

Assim, Auckland está quase um dia inteiro à frente de Honolulu apesar de estarem a cerca de 7.000 quilômetros uma da outra, e as duas ficam em datas diferentes durante a maior parte de cada ciclo de vinte e quatro horas.

A regra que ajuda: a linha é onde o dia _começa_, e o dia então varre o globo para oeste, voltando à linha vinte e quatro horas depois, quando o próximo se inicia. Kiritimati, em UTC+14, é o primeiro lugar habitado a alcançar qualquer data. A ilha Baker, em UTC-12, é o último.
