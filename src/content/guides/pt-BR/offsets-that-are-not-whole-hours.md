---
title: 'As diferenças de UTC que não são horas inteiras'
description: 'Índia, Nepal, Terra Nova e as ilhas Chatham andam em meias horas e em quartos de hora. Eis a lista completa e o que quebra no software por causa disso.'
summary: 'Cerca de um quinto do mundo vive numa diferença que não é um número inteiro de horas em relação ao UTC. Software que supõe o contrário não erra um pouquinho com essas pessoas: erra 30 ou 45 minutos, o que é pior.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 5
keywords:
  [
    'fusos horários de meia hora',
    'diferença utc 45 minutos',
    'diferença fuso horário índia',
    'fuso horário do nepal',
  ]
related: ['half-hour-offsets-explained', 'time-zones-in-code', 'how-time-zones-work']
---

O modelo mental de vinte e quatro fusos de uma hora é errado de um jeito caro: produz código que erra com toda a confiança 30 ou 45 minutos para muito mais de um bilhão de pessoas. Um erro de uma hora inteira ao menos parece um erro. Um de 45 minutos parece um deslize de digitação, e vai para produção.

## A lista completa

**Diferenças em :30**

| Diferença | Onde                                                          |
| --------- | ------------------------------------------------------------- |
| UTC-09:30 | Ilhas Marquesas                                               |
| UTC-03:30 | Terra Nova e Labrador                                         |
| UTC+03:30 | Irã                                                           |
| UTC+04:30 | Afeganistão                                                   |
| UTC+05:30 | Índia, Sri Lanka                                              |
| UTC+06:30 | Mianmar, ilhas Cocos                                          |
| UTC+09:30 | Austrália central — Território do Norte, Austrália Meridional |
| UTC+10:30 | Ilha Lord Howe (horário padrão)                               |

**Diferenças em :45**

| Diferença | Onde                                                        |
| --------- | ----------------------------------------------------------- |
| UTC+05:45 | Nepal                                                       |
| UTC+08:45 | Sudeste da Austrália Ocidental (Eucla, de modo não oficial) |
| UTC+12:45 | Ilhas Chatham (horário padrão)                              |

Só a Índia são 1,4 bilhão de pessoas. Some Irã, Afeganistão, Mianmar, Sri Lanka e Nepal e você já passou de um quinto do planeta, antes de contar Austrália ou Canadá.

## O outro tipo de diferença incomum

Diferenças que não são horas inteiras são a esquisitice conhecida. Outras duas pesam tanto quanto.

**A faixa é de 26 horas, não de 24.** Kiritimati, em Kiribati, está em UTC+14; as ilhas Baker e Howland, em UTC-12. São 26 horas, o que significa que há instantes em que três datas de calendário diferentes estão em uso ao mesmo tempo em algum ponto da Terra. Qualquer código que suponha que uma janela de dois dias cobre todos os fusos erra duas vezes por dia.

**Horário de verão nem sempre é uma hora.** A ilha Lord Howe, pequena ilha australiana com população fixa de cerca de 380 pessoas, muda 30 minutos: UTC+10:30 no inverno, UTC+11:00 no verão. É o único lugar da Terra que faz isso, e o melhor caso de teste para uma biblioteca de datas — qualquer implementação que fixe um salto de 60 minutos erra lá e em nenhum outro lugar, ou seja, passará em todos os demais testes que você escrever.

## O que quebra

**Arredondar para a hora mais próxima.** A falha mais comum. Código que calcula uma diferença em horas como número inteiro trunca a Índia para +5 sem avisar, o que dá 30 minutos de erro para todo usuário do país.

**Guardar diferenças como inteiros.** Uma coluna declarada como contagem de horas não consegue representar Catmandu. Isso costuma ser descoberto depois que os dados já estão lá.

**Interfaces de grade construídas sobre colunas horárias.** Qualquer agenda ou planejador que reparta o dia em 24 células iguais e suponha que a hora local de cada fuso caia numa borda de célula vai posicionar mal os fusos de meia hora e de 45 minutos. A faixa do planejador de reuniões deste site usa instantes como colunas em vez de horas locais, de modo que uma linha +05:45 mostra 09:45 na coluna em que uma linha UTC mostra 04:00 — que é a verdade, e não uma mentira mais arrumadinha.

**Aritmética de duração atravessando uma mudança de 30 minutos.** Supor que uma transição de horário de verão são exatamente 3.600.000 milissegundos dá a resposta errada na ilha Lord Howe, e só lá.

## Fazendo certo

O conserto é o mesmo que conserta quase todo defeito de fuso horário: **nunca calcule você mesmo uma diferença.** Pergunte à plataforma.

Todo ambiente de execução moderno traz a base da IANA e informa a diferença de um fuso num dado instante, em minutos e corretamente, inclusive para Catmandu e Lord Howe. Em JavaScript isso é `Intl.DateTimeFormat` com `timeZoneName: 'longOffset'`, ou uma comparação da leitura de relógio do fuso com o UTC — o caminho que o motor deste site segue, porque continua exato mesmo para as diferenças de tempo médio local abaixo do minuto em dados anteriores a 1900.

Depois, atenha-se a três regras:

1. **Diferenças são minutos**, nunca horas. Se uma variável se chama `offsetHours`, já é um defeito.
2. **Teste contra Catmandu e Lord Howe.** Elas quebram as duas suposições que todo o resto deixa você manter.
3. **Nunca arredonde um fuso horário.** Se uma tela precisa ser aproximada, diga isso; não mova em silêncio o relógio de um usuário em 30 minutos para facilitar um leiaute.

## Um exemplo trabalhado: o que 45 minutos fazem com uma grade

Pegue um planejador de reuniões que reparta o dia em 24 colunas, uma por hora, e sombreie o expediente de cada participante. A implementação ingênua calcula cada linha deslocando a linha base pela diferença do fuso em horas.

Para Londres contra Nova York funciona: a linha de Nova York é a de Londres corrida cinco células para a direita. Para Londres contra Catmandu não funciona. Catmandu está 5 horas e 45 minutos à frente, isto é, 5,75 células, e três quartos de célula não existem. A implementação arredonda — em geral para 6 — e agora toda leitura naquela linha está 15 minutos adiantada.

O erro é pequeno o bastante para sobreviver a uma revisão e grande o bastante para importar: uma reunião das 09:00 que a grade anuncia como 09:00 para Catmandu é na verdade 08:45 lá, e quem entra chega quinze minutos atrasado ao próprio dia.

O conserto é parar de tratar colunas como horas. Faça de cada coluna um _instante_ e pergunte à plataforma o que o relógio local marca em cada fuso naquele instante. Uma linha +05:45 mostrará então 09:45 onde uma linha UTC mostra 04:00 — visivelmente desalinhada com a grade, que é a representação honesta. O planejador de reuniões deste site faz exatamente isso, e a borda irregular da linha de Catmandu é uma qualidade.

## As diferenças históricas são ainda mais estranhas

Antes da padronização, as diferenças eram tempo solar médio local, precisas ao segundo. A base da IANA as registra.

Os Países Baixos ficaram em UTC+00:19:32,13 de 1909 a 1937. A Libéria ficou em UTC-00:44:30 até 1972. Pergunte a um ambiente de execução a diferença de `Europe/Amsterdam` numa data de 1920 e ele lhe dará o valor exato, segundos e tudo.

É por isso que a função de diferença sob este site calcula em segundos e só arredonda para minutos na camada de exibição. Um motor que guardasse minutos perderia em silêncio 32 segundos de história neerlandesa — coisa que ninguém notaria, e que continuaria errada.
