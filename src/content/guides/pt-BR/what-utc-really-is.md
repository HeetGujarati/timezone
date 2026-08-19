---
title: "O que o UTC realmente é, e como difere do GMT"
description: "UTC é um padrão de tempo mantido por relógios atômicos. GMT é um fuso mantido pela Terra. Costumam coincidir, e a diferença importa mesmo assim."
summary: "UTC não é um fuso horário. É o padrão de referência contra o qual todo fuso é definido, mantido por cerca de 450 relógios atômicos, e ele nunca muda por causa do horário de verão — exatamente por isso os sistemas o usam."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['o que é utc', 'utc e gmt', 'tempo universal coordenado', 'utc explicado']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

As pessoas usam “UTC” e “GMT” como se fossem a mesma coisa. Na maior parte do tempo nada dá errado, porque na maior parte do tempo os dois mostram a mesma hora. Mas são objetos de naturezas diferentes, e essa diferença explica por que um deles é o certo para guardar no seu banco de dados e o outro não.

## UTC é um padrão, não um lugar

O tempo universal coordenado é mantido pelo Escritório Internacional de Pesos e Medidas a partir de uma média ponderada de cerca de 450 relógios atômicos em aproximadamente 85 instituições pelo mundo. Esses relógios medem a frequência de ressonância de átomos de césio-133, estável em torno de um segundo a cada 100 milhões de anos.

A hora local de ninguém é UTC por lei. Até o Reino Unido, que fica sobre o meridiano de origem, está em UTC+1 durante sete meses do ano. UTC é o ponto fixo a partir do qual toda hora local é descrita — o zero da régua, não uma marca no mapa.

A propriedade mais importante para quem constrói software: **UTC nunca se desloca por horário de verão.** Não tem variação sazonal, não tem história política e não tem exceções. É toda a razão de a aviação, a navegação, a liquidação financeira e todo sistema distribuído existente usarem esse padrão.

## GMT é um fuso horário com histórico profissional

A hora média de Greenwich é o tempo solar médio no Observatório Real de Greenwich. Ela é definida pela rotação da Terra, que não é um instrumento de precisão: o planeta oscila, desacelera de forma irregular e de vez em quando acelera.

De 1884 até 1972, o GMT foi o padrão de tempo do mundo. Foi substituído pelo UTC justamente porque relógios atômicos se mostraram uma referência melhor do que um planeta. O GMT sobrevive como nome de um fuso — aquele que o Reino Unido usa no inverno e aquele que vários países da África Ocidental usam o ano inteiro.

Então: **UTC nunca adota horário de verão. GMT, como o Reino Unido o usa, adota** — a Grã-Bretanha sai dele todo mês de março para o British Summer Time e volta todo mês de outubro. Se um colega britânico disser “15h GMT” em julho, quase certamente quer dizer 15h BST, que são 14h UTC. É um engano frequente o bastante para valer a pena perguntar em vez de supor.

## Por que a sigla é UTC

Nem o acrônimo inglês nem o francês venceram. Os falantes de inglês propunham CUT, de “coordinated universal time”. Os de francês propunham TUC, de “temps universel coordonné”. A União Internacional de Telecomunicações fechou em UTC, que não combina com nenhuma das duas línguas e por isso ofende as duas igualmente. À sua maneira, um desfecho diplomático perfeito.

## Segundos bissextos e sua abolição a caminho

A Terra não gira em ritmo constante. Para impedir que o UTC se afaste do tempo solar, segundos extras foram inseridos de tempos em tempos: 27 entre 1972 e 2016. Durante um segundo bissexto, um relógio UTC marca 23:59:60 — uma hora real que quase nenhum software consegue representar.

Segundos bissextos já causaram quedas de verdade. Em 2012, um deles derrubou o Reddit, os serviços da Mozilla e vários sistemas de reserva de companhias aéreas, todos pelo mesmo defeito do núcleo do Linux. Em 2017, o DNS da Cloudflare quebrou porque um cálculo de duração virou negativo ao atravessar a inserção.

Em novembro de 2022, a Conferência Geral de Pesos e Medidas votou por parar de acrescentar segundos bissextos até 2035. O UTC passará então a poder se afastar do tempo solar, e o problema será revisitado quando a diferença ficar incômoda — provavelmente daqui a um século.

Seu navegador não expõe segundos bissextos. O relógio do JavaScript finge que eles nunca aconteceram, o que significa que um intervalo que atravessa um deles é reportado um segundo mais curto. Para quase todo propósito essa é a troca certa; se você trabalha com navegação por satélite, já sabia disso.

## O que fazer de fato

**Guarde marcas de tempo em UTC.** Não no fuso do usuário, nem no do servidor, nem naquele onde a empresa por acaso tem sede. Um instante em UTC é inequívoco, ordenável e imune a um governo mudar de ideia.

**Converta para hora local no momento de exibir**, usando o fuso de quem lê e a cópia do banco IANA do ambiente.

**Diga UTC quando quiser dizer UTC.** Escrever “GMT” numa especificação convida alguém a interpretar como hora local britânica, e no verão isso está uma hora fora. “12:00 UTC” tem exatamente um significado em todos os dias do ano.

**Use o sufixo Z do ISO 8601.** `2026-03-08T14:30:00Z` é UTC e não pode ser lido de outro jeito. `2026-03-08T14:30:00` é uma hora local num fuso não especificado, ou seja, não é marca de tempo nenhuma.

## A família de escalas de tempo

O UTC é uma de várias escalas aparentadas, e as diferenças importam de vez em quando.

**TAI** — Tempo Atômico Internacional. A escala atômica bruta, sem segundos bissextos. O TAI está hoje 37 segundos à frente do UTC, e a diferença cresce a cada inserção. Satélites GPS operam numa escala deslocada em relação ao TAI.

**UT1** — a rotação real da Terra, medida contra quasares distantes. É o que os segundos bissextos do UTC vinham perseguindo. O UTC é mantido dentro de 0,9 segundo do UT1 — ou era, até a decisão de 2035.

**Tempo GPS** — começou alinhado ao UTC em janeiro de 1980 e desde então ignora segundos bissextos. Hoje está 18 segundos à frente do UTC. Receptores corrigem isso; sistemas que leem o tempo GPS bruto, às vezes não.

**Tempo Unix** — a contagem de segundos desde 1970, que finge que segundos bissextos não existem repetindo um segundo em vez de contá-lo. Isso faz dele algo que não é bem uma contagem de segundos decorridos, sutileza que já mordeu quem media durações atravessando uma inserção.

Para quase todo software, UTC é a resposta certa e o resto é curiosidade. Para qualquer coisa que envolva satélites, marcas de tempo de negociação de alta frequência ou instrumentação científica, essas distinções sustentam peso.

## Por que “hora UTC” é redundante, e por que escrevemos assim mesmo

O T é de “time”, então “hora UTC” fica “hora tempo universal coordenado”. Os puristas reclamam.

As páginas deste site dizem “hora UTC” assim mesmo, em títulos e cabeçalhos, porque é o que as pessoas buscam e o que digitam. Existe uma versão de correção que custa o leitor, e o preciosismo com uma sigla está bem no meio dela. No corpo do texto, onde quem lê já chegou, é só UTC.
