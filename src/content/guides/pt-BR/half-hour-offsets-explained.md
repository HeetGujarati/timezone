---
title: 'Por que a Índia anda meia hora fora do UTC'
description: 'Diferenças de meia hora e de 45 minutos não são acidentes geográficos: são acordos, afirmações de independência e uma piada burocrática.'
summary: 'A Índia anda em UTC+05:30 porque rachou a diferença entre dois fusos propostos. O Nepal anda em UTC+05:45 em parte para não ser a Índia. Toda diferença incomum tem uma história, e quase todas são políticas.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 12
keywords:
  [
    'por que índia meia hora',
    'nepal 45 minutos',
    'fuso horário de meia hora',
    'história do horário padrão da índia',
  ]
related: ['offsets-that-are-not-whole-hours', 'how-time-zones-work', 'the-international-date-line']
---

A pergunta óbvia sobre o horário padrão da Índia é por que ele não está a um número inteiro de horas de nada. A resposta é que fusos horários são decididos por governos, e governos não otimizam pela conveniência da sua biblioteca de datas.

## Índia: um país, dois fusos naturais, um acordo

A Índia se estende por cerca de 29 graus de longitude — de Gujarate, a oeste, a Arunachal Pradexe, a leste. Isso dá quase duas horas de tempo solar. Pela lógica comum dos fusos horários, a Índia deveria ter dois.

Sob domínio britânico, na prática ela tinha. A hora de Bombaim e a de Calcutá eram separadas, com cerca de 39 minutos de diferença, e a de Madrasta ficava entre as duas como padrão ferroviário. Quando a Índia padronizou após a independência, em 1947, escolheu um único fuso em UTC+05:30 — 82,5° leste, o meridiano que passa perto de Mirzapur, quase exatamente entre os dois padrões antigos.

O argumento foi a unidade nacional e a simplicidade administrativa, e o preço é real. No verão, o sol nasce em Arunachal Pradexe por volta das 04:00 e se põe por volta das 16:00, enquanto os escritórios cumprem horários fixados para Déli. A indústria do chá do Assão usa há mais de um século uma «hora do bagan» não oficial, uma hora adiantada, justamente porque o relógio nacional não serve. Propostas de um segundo fuso indiano ressurgem de poucos em poucos anos e são rejeitadas sempre pelos mesmos motivos.

## Nepal: quarenta e cinco minutos de soberania

O Nepal está em UTC+05:45. Quinze minutos à frente da Índia, e o único fuso do mundo nessa diferença.

A justificativa geográfica é o Gaurishankar, uma montanha a leste de Catmandu usada como referência meridiana nacional. A justificativa política é que o Nepal não é a Índia, e quinze minutos são um jeito barato e permanente de dizer isso. O Nepal passou de UTC+05:30 para UTC+05:45 em 1986.

As duas histórias são verdadeiras, e os nepaleses lhe contam uma ou outra conforme a pergunta é feita. O que importa na prática é que a diferença é exata e permanente — o Nepal não adota horário de verão — e que muitíssimo software erra ao arredondá-la para +05:30 ou +06:00.

## Ilhas Chatham: 45 minutos e horário de verão

As ilhas Chatham, a cerca de 800 quilômetros a leste da Nova Zelândia, ficam em UTC+12:45 no inverno e UTC+13:45 no verão. Vivem ali cerca de 600 pessoas.

A diferença é aproximadamente solar: as ilhas ficam bastante a leste da Nova Zelândia continental para justificar esses 45 minutos a mais. O horário de verão é herdado da Nova Zelândia, o que faz das ilhas um dos dois únicos lugares da Terra com diferença em quarto de hora e mudança sazonal ao mesmo tempo.

## Ilha Lord Howe: a mudança sazonal de 30 minutos

A ilha Lord Howe, ao largo do leste da Austrália, com cerca de 380 habitantes, fica em UTC+10:30 no inverno e UTC+11:00 no verão. Ela muda **trinta minutos**, e é o único lugar da Terra que faz isso.

O motivo foi a moderação. A ilha queria um horário de verão alinhado com o continente de Nova Gales do Sul, mas achou uma hora inteira excessiva para um lugar tão pequeno, e em 1981 rachou a diferença. O resultado é o melhor caso de teste do mundo para código que lida com datas: qualquer biblioteca que fixe uma mudança sazonal de 60 minutos erra na ilha Lord Howe e acerta em todos os outros lugares, o que significa que passará em todo teste que você escrever, menos nesse.

## Os que já se foram

**Países Baixos: UTC+00:19:32,13.** De 1909 a 1937, os Países Baixos usaram o tempo médio local de Amsterdã, especificado ao segundo. Foi arredondado para +00:20 em 1937 e abandonado em favor do horário da Europa Central em 1940. A base da IANA ainda o carrega, e é por isso que as diferenças no motor deste site são calculadas em segundos e não em minutos: um ambiente de execução consultado sobre uma data neerlandesa de 1920 responderá com esse valor, e arredondá-lo seria uma pequena mentira.

**Libéria: UTC-00:44:30.** Até 1972, a Libéria ficava 44 minutos e 30 segundos atrás de Greenwich, o último país da Terra com uma diferença que não era um número inteiro de minutos.

**Singapura: cinco mudanças.** Singapura já esteve em +06:55:25, +07:00, +07:20, +07:30, +09:00 e agora +08:00. Fica a oeste do meridiano que justificaria +08:00, e ali permanece para se alinhar com a Malásia, que mudou em 1982.

## O padrão

Nenhuma dessas diferenças tem a ver com o sol. A Índia rachou uma diferença política. O Nepal afirmou independência. Singapura seguiu um parceiro comercial. Lord Howe fez um acordo consigo mesma.

O que é justamente o argumento a favor da decisão de projeto sob cada página deste site: **nunca calcule uma diferença a partir da longitude, e nunca guarde uma em tabela que você mesmo mantenha**. Pergunte à base da IANA, que registra o que cada governo de fato decidiu, inclusive as decisões que não fazem sentido astronômico algum — porque são exatamente essas que os seus usuários vivem.

## A declaração de trinta minutos da Coreia do Norte

Em agosto de 2015, a Coreia do Norte atrasou seus relógios em 30 minutos, de UTC+09:00 para UTC+08:30, e chamou o resultado de horário de Pyongyang. A razão declarada era desfazer uma mudança imposta durante a ocupação japonesa, que havia alinhado a Coreia com Tóquio.

O efeito prático foi que a Coreia do Norte e a Coreia do Sul, que dividiam o mesmo relógio desde 1961, passaram a estar 30 minutos afastadas.

Em maio de 2018, após a cúpula intercoreana em Panmunjom, a Coreia do Norte voltou a UTC+09:00. O anúncio descreveu isso como um primeiro passo prático rumo à reunificação, e durante as conversas os relógios da Casa da Paz haviam mostrado os dois horários lado a lado.

Duas publicações de tzdata com três anos de intervalo, para uma mudança que nada tinha a ver com o sol e tudo a ver com política. Esse é o caso normal, não a exceção.

## A meia hora da Venezuela, e a volta atrás

Em dezembro de 2007, a Venezuela passou de UTC-04:00 para UTC-04:30, um deslocamento de meia hora que o governo apresentou como forma de dar às crianças mais luz do dia no caminho da escola. Em maio de 2016 voltou atrás, dessa vez apresentado como medida de economia de energia durante uma grave crise elétrica.

Nove anos numa diferença incomum, e de volta. Todo sistema que tivesse gravado a diferença da Venezuela como constante precisou ser alterado duas vezes.

## A lição para quem guarda tempo

Não são casos extremos no sentido de serem raros. Somados, este guia descreveu mudanças de diferença no Nepal, em Samoa, Tokelau, Coreia do Norte, Venezuela, Turquia, Rússia, Irã, México, Brasil e Egito — todas dentro da memória de quem está vivo, a maioria nas últimas duas décadas.

A base da IANA absorve cada uma delas numa publicação. Uma tabela fixada no código não absorve nenhuma, falha em silêncio, e a falha parece um erro de agendamento de uma pessoa em vez de um defeito do programa.
