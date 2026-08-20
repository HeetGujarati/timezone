---
title: 'O problema de 2038, explicado direito'
description: 'Às 03:14:07 UTC de 19 de janeiro de 2038, o tempo Unix de 32 bits com sinal transborda. Eis o que realmente quebra e o que já foi corrigido.'
summary: 'Sistemas que guardam o tempo como contagem de segundos em 32 bits com sinal ficam sem espaço em janeiro de 2038 e voltam para dezembro de 1901. Quase toda plataforma moderna corrigiu isso anos atrás; a exposição hoje está em embarcados, sistemas legados e dados serializados.'
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['problema de 2038', 'bug do ano 2038', 'estouro de timestamp unix', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

Às 03:14:07 UTC de 19 de janeiro de 2038, o número de segundos desde 1º de janeiro de 1970 chega a 2.147.483.647. Esse é o maior valor que um inteiro de 32 bits com sinal consegue guardar. Um segundo depois ele vira −2.147.483.648, que esses sistemas leem como 13 de dezembro de 1901.

É um problema real com data certa, o que o torna incomum entre os problemas de software.

## Por que 32 bits

O tempo Unix foi projetado no início dos anos 1970, quando um inteiro de 32 bits era o tamanho natural de palavra e 68 anos de folga pareciam generosos. O tipo `time_t` naqueles sistemas era um inteiro de 32 bits com sinal, e essa escolha se propagou para o C, para toda linguagem que envolveu o C, para formatos de arquivo, para protocolos de rede e para esquemas de banco de dados.

É o sinal que dá ao estouro seu sintoma característico. Uma contagem de 32 bits sem sinal duraria até 2106; uma com sinal divide sua faixa em torno de 1970, então o transbordo cai em 1901 em vez de em zero.

## O que já aconteceu

O problema de 2038 vem falhando em produção há anos, porque software calcula datas futuras o tempo todo.

- Cálculos de financiamentos de trinta anos começaram a cruzar a fronteira em 2008.
- Datas de validade de certificados, TTLs de cache e tarefas agendadas esbarraram nisso repetidas vezes.
- Em 2006, um defeito no tempo limite padrão de banco do AOLserver — definido como um bilhão de segundos, o que funcionou até deixar de funcionar — derrubou o software quando a validade calculada transbordou.

O padrão é que a falha chega muito antes da data, em qualquer trecho de código que olhe mais longe.

## O que já está corrigido

A situação é bem melhor do que o pânico sugere.

- **Sistemas de 64 bits**: `time_t` tem 64 bits em praticamente toda plataforma de 64 bits. Isso se esgota em cerca de 292 bilhões de anos.
- **Linux em 32 bits**: o kernel 5.6 (março de 2020) trouxe `time_t` de 64 bits em arquiteturas de 32 bits, e as grandes distribuições publicaram o espaço de usuário correspondente.
- **JavaScript**: usa ponto flutuante de dupla precisão para milissegundos, válido por cerca de 275.000 anos para cada lado de 1970. Nunca teve esse problema.
- **Java**: `Instant` usa uma contagem de segundos de 64 bits mais nanossegundos.
- **Python**: inteiros têm precisão arbitrária; a restrição é a biblioteca C da plataforma.
- **PostgreSQL, MySQL 8.0.28+, SQL Server**: armazenamento de carimbo de tempo em 64 bits.

## Onde a exposição continua

**Sistemas embarcados.** Controladores industriais, equipamentos médicos, eletrônica veicular, medidores e sensores, muitos projetados para vinte ou trinta anos de serviço, muitos sem caminho de atualização, muitos já instalados. É aqui que está o grosso do risco real, e não há registro centralizado.

**O tipo `TIMESTAMP` do MySQL antes da 8.0.28.** É uma contagem de segundos de 32 bits e o máximo documentado é 2038-01-19 03:14:07. `DATETIME` nunca foi afetado. Uma quantidade enorme de dados de produção mora no tipo de coluna vulnerável.

**Dados serializados e formatos de arquivo.** Tudo que gravou um campo de tempo de 32 bits continua sendo um campo de tempo de 32 bits, por mais novo que seja quem lê. Formatos antigos de arquivamento, protocolos binários e estruturas em disco carregam a restrição adiante.

**Builds de 32 bits ainda em serviço.** Alguns roteadores, decodificadores e equipamentos de vida longa rodam espaço de usuário de 32 bits sobre um kernel sem correção.

## O que fazer a respeito

**Auditar os tipos de armazenamento.** Procure colunas `int(11)` guardando carimbos de tempo, `TIMESTAMP` do MySQL em versões antigas e qualquer formato binário com campo de tempo de 32 bits. É aí que os dados sobrevivem ao código.

**Testar com datas além de 2038.** Ajuste uma fixture de teste para 2040 e rode a suíte. Quase todo bug de 2038 se reproduz trivialmente assim que alguém tenta.

**Preferir inteiros de 64 bits ou strings ISO 8601.** Um `BIGINT` de milissegundos ou uma coluna `TIMESTAMPTZ` não tem horizonte que mereça preocupação. Uma string ISO 8601 não tem nenhum, ao custo de tamanho e velocidade de comparação.

**Nunca mais guarde datas em nada de 32 bits.** A economia de espaço é irrelevante em hardware moderno e o horizonte agora cabe dentro da vida útil de um software comum.

## Os outros horizontes de data

2038 é o mais próximo, não o único.

- **2036**: o campo de era de 32 bits do NTP vira em 7 de fevereiro. O NTPv4 lida com isso, mas as instalações variam.
- **2106**: contagens de segundos em 32 bits sem sinal transbordam.
- **2262**: contagens de _nanossegundos_ em 64 bits estouram — que é o `time.Time` do Go na representação em nanossegundos, e o datetime64[ns] padrão do pandas.

Esse último está mais perto do que parece para quem escreve código de processamento de dados, e é o mesmo erro em outra escala: uma unidade fina o bastante para ser útil, numa largura que parecia generosa na época.

## Como verificar os seus próprios sistemas

Quatro verificações, em ordem crescente de esforço.

**Confira os tipos das colunas do banco.** No PostgreSQL, `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'` mostra o que você tem; `timestamp with time zone` é de 64 bits e é seguro. No MySQL, procure colunas `TIMESTAMP` em servidores anteriores à 8.0.28 — são essas as expostas, e `DATETIME` nunca foi.

**Adiante o relógio.** Num contêiner descartável, ajuste a data do sistema para 2040 e rode a suíte de testes. É um método bruto e encontra uma quantidade surpreendente de coisas, porque quase nenhum bug de 2038 é sutil depois de passada a fronteira.

**Procure tipos de tempo de 32 bits.** Em C e C++, qualquer `int` ou `long` explícito guardando um valor de tempo num alvo de 32 bits. Em esquemas de serialização, qualquer campo de tempo de 4 bytes. No código da aplicação, todo ponto em que um carimbo de tempo é convertido para inteiro de 32 bits para armazenar ou transmitir.

**Teste o futuro distante nas fixtures, não só o próximo.** Um teste que usa «agora mais um dia» passa até 2038 e então falha numa terça-feira. Um teste que usa uma data explícita em 2040 falha hoje, enquanto há alguém disponível para corrigir.

## O que não fazer

Não «resolva» isso trocando para inteiros de 32 bits sem sinal. Compra 68 anos, perde a capacidade de representar qualquer data anterior a 1970 e empurra a mesma conversa para quem mantiver o sistema em 2106. A diferença entre 4 e 8 bytes não vale uma segunda migração.

Não presuma que uma linguagem moderna protege você. O código da aplicação pode estar perfeitamente seguro enquanto os dados que ele lê foram escritos por algo que não estava — formatos de arquivo e protocolos de transmissão carregam a restrição através de toda reescrita.
