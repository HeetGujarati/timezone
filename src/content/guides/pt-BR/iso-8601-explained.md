---
title: "ISO 8601, e como escrever uma data sem ambiguidade"
description: "03/04/2026 significa duas datas diferentes conforme quem lê. O ISO 8601 resolve isso, e vale conhecer suas regras com exatidão."
summary: "O ISO 8601 existe porque 03/04/2026 é março nos Estados Unidos e abril no resto do mundo. Escrever 2026-04-03 elimina a ambiguidade, ordena certo como texto e é o que toda interface deveria aceitar."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'formato de data padrão', 'formato de marca de tempo', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026` é 3 de abril na maior parte do mundo e 4 de março nos Estados Unidos. Não há como saber, só pela cadeia de caracteres, qual foi a intenção — e as duas leituras são perfeitamente razoáveis. Todo ano essa ambiguidade produz prazos perdidos, reservas duplicadas e pelo menos uma queda memorável.

O ISO 8601 é a norma internacional que a elimina.

## O formato central

```
2026-04-03T14:30:00Z
```

Lendo da esquerda para a direita, da maior unidade para a menor:

- `2026-04-03` — ano, mês, dia, cada um com zero à esquerda, sempre nessa ordem
- `T` — o separador entre data e hora, obrigatório na forma estrita
- `14:30:00` — horas, minutos, segundos em relógio de 24 horas
- `Z` — o designador de fuso. `Z` significa UTC exatamente

A ordem é o ponto. Como os componentes vão do mais significativo ao menos, **uma cadeia ISO 8601 ordena corretamente como texto puro**. `2026-04-03` vem antes de `2026-04-10` numa comparação simples de cadeias, o que nenhum outro formato comum consegue. Só essa propriedade já justifica a norma.

## Designadores de fuso

Três formas são válidas, e significam coisas diferentes:

| Forma                       | Significado                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `2026-04-03T14:30:00Z`      | 14:30 UTC. Sem ambiguidade                                                   |
| `2026-04-03T14:30:00+05:45` | 14:30 no horário local de um fuso 5h45 à frente do UTC. Sem ambiguidade      |
| `2026-04-03T14:30:00`       | 14:30 num fuso não especificado. **Não é marca de tempo**                    |

A terceira forma é a que dá problema. Ela é uma _data-hora local_: uma leitura de relógio sem meio algum de posicioná-la numa linha do tempo. Passá-la por uma fronteira de sistema torcendo para que o outro lado suponha o mesmo fuso que você é um defeito esperando por uma implantação em outra região.

Repare também no que uma diferença não é: `+05:45` informa a diferença do Nepal, não que a marca de tempo seja do Nepal. Diferenças não são fusos — vários fusos compartilham a mesma diferença, e a diferença de um fuso muda. Carregue o identificador ao lado se precisar saber onde.

## RFC 3339, o perfil que você provavelmente quer

O ISO 8601 é grande. Permite datas de semana (`2026-W14-5`), datas ordinais (`2026-093`), unidades fracionárias e uma forma truncada que omite o século. Quase nada disso é o que você quer numa interface.

O RFC 3339 é um perfil apertado para protocolos da internet. Exige a data completa, exige um designador de fuso e permite como separador `T` ou um espaço. Quando alguém diz “formato ISO” falando de uma API, quase sempre quer dizer RFC 3339.

**Uma regra útil:** aceite tudo o que um bom analisador engolir; emita apenas RFC 3339 estrito com `Z`.

## Durações e intervalos

Menos usados, e bons de conhecer quando aparecem.

As **durações** começam com `P` de período, e `T` separa a parte de data da parte de hora:

- `P3Y6M4D` — três anos, seis meses, quatro dias
- `PT1H30M` — uma hora e trinta minutos
- `P1DT12H` — um dia e doze horas

O `T` não é opcional: `P1M` é um mês, `PT1M` é um minuto. Esse é o defeito clássico das durações ISO 8601.

Os **intervalos** unem dois pontos com uma barra: `2026-04-03T14:00Z/2026-04-03T16:00Z`, ou um ponto e uma duração: `2026-04-03T14:00Z/PT2H`.

Os dados estruturados `HowTo` deste site usam a sintaxe de duração — `PT2M` para uma tarefa de dois minutos — porque o schema.org especifica durações ISO 8601.

## Datas de semana, e a armadilha dentro delas

`2026-W14-5` é a sexta-feira da décima quarta semana ISO de 2026. Semanas ISO começam na segunda, e a semana 1 é a que contém a primeira quinta-feira de janeiro.

A consequência em que as pessoas tropeçam: **o ano de semana ISO nem sempre é o ano do calendário.** 1º de janeiro de 2027 cai na semana ISO 53 de 2026. Código de formatação que junta um número de semana ISO com um ano de calendário produz uma data errada por alguns dias todo ano — e na maioria das linguagens os especificadores de formato são quase iguais (`YYYY` contra `GGGG`, ou `%Y` contra `%G`).

## Regras práticas

1. **Guarde em UTC, emita com `Z`.** `2026-04-03T14:30:00Z` tem exatamente um significado em todo lugar.
2. **Nunca emita uma data-hora local nua por uma fronteira.** Se você não consegue anexar um fuso, você não tem marca de tempo.
3. **Preencha tudo com zero.** `2026-4-3` não é ISO 8601 válido, ainda que a maioria dos analisadores aceite.
4. **Use os separadores `-` e `:`.** A forma compacta (`20260403T143000Z`) é legal, porém hostil, e alguns analisadores a rejeitam.
5. **Mantenha o identificador de fuso à parte** quando precisar saber _onde_, e não só _qual diferença_. `Europe/London` sobrevive a uma mudança de regra; `+01:00` não.

## Armadilhas na análise

Mesmo com uma norma, é na análise que as coisas dão errado.

**O construtor `Date` do JavaScript é incoerente com entradas não ISO.** `new Date('2026-04-03')` é lido como meia-noite UTC. `new Date('2026-04-03T00:00:00')` — sem designador de fuso — é lido como meia-noite _local_. Os dois diferem pela sua diferença de fuso, o que significa que o mesmo código produz dias distintos conforme onde roda. Inclua sempre um designador de fuso.

**Anos de dois dígitos são ambíguos e deveriam ser rejeitados.** O ISO 8601 permite uma forma truncada; quase nada deveria aceitá-la. `26-04-03` pode ser 1926 ou 2026, e a janela deslizante que resolve isso é uma decisão de política escondida dentro de um analisador.

**Frações de segundo variam em precisão.** `14:30:00.5`, `14:30:00.500` e `14:30:00.500000` são todos válidos e todos o mesmo instante. Um analisador que compara cadeias em vez de instantes vai discordar.

**A vírgula é legal.** O ISO 8601 permite `14:30:00,5` — vírgula decimal — e até a prefere. Quase todos os analisadores a rejeitam. Se você consome dados de um sistema europeu, esteja preparado.

**A meia-noite tem duas grafias.** `24:00:00` de um dia é o mesmo instante que `00:00:00` do seguinte, e as duas são ISO 8601 válido. Emita a segunda forma; aceite as duas.

## Uma nota sobre ordenação

A ordenabilidade do ISO 8601 só vale para cadeias com a mesma representação de fuso. `2026-04-03T14:00:00Z` e `2026-04-03T10:00:00-05:00` são o mesmo instante, mas como cadeias a segunda ordena antes.

Se você ordena marcas de tempo como texto — num arquivo de log, num nome de arquivo, numa coluna de banco tipada como texto — normalize todas para UTC com `Z` primeiro. Do contrário, a ordem é uma propriedade da formatação, e não do tempo.
