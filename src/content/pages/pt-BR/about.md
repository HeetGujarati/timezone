---
title: "Sobre o Meridiem"
description: "Por que este site existe, como ele calcula o que mostra e o que decide deliberadamente não fazer."
order: 1
updatedAt: '2026-01-15'
---

O Meridiem é um conjunto de ferramentas de fuso horário construído sobre um princípio: nunca afirmar um dado de horário que não tenha sido calculado a partir do banco de dados IANA no momento em que foi necessário.

## Por que existe

Quase toda ferramenta de fuso horário se apoia numa tabela de diferenças guardada. Essa tabela está certa até um governo mudar de ideia — o que acontece várias vezes por ano — e a partir daí fica errada em silêncio, de um jeito que parece erro humano de agenda e não falha de software.

Cada diferença, cada data de mudança e cada conversão deste site vêm da cópia do banco IANA que o ambiente de execução carrega, pela interface `Intl`. Não existe nenhuma tabela de diferenças neste código. Quando o banco é atualizado, uma nova compilação incorpora a mudança e o site volta a estar certo sem alterar uma linha.

## Como é construído

- Todas as páginas são geradas de antemão. Não há servidor, banco de dados nem API.
- Os horários atuais absolutos são calculados no seu navegador, nunca na página. Uma página gerada de antemão não pode afirmar honestamente que sabe que horas são agora, então nem tenta.
- Os fatos duráveis — diferenças, datas de mudança, janelas de sobreposição — são calculados na compilação e apresentados como válidos naquela data.
- O site é reconstruído todo mês e também em 1º de março, 1º de abril, 1º de outubro e 1º de novembro, para que as atualizações cheguem antes das datas que afetam.

## O que há aqui

Dez ferramentas, 80 páginas de cidades, 1.448 conversões entre pares de cidades, 240 conversões de siglas e doze guias. Cada página gerada traz dados calculados para aquele par específico: a tabela de horas, as datas de horário de verão das duas cidades e as horas que os dois lugares realmente compartilham.

## O que ele decide não fazer

- **Nenhum rastreamento.** Sem análise de uso, sem cookies, sem scripts de terceiros.
- **Nenhuma conta.** Contagens regressivas e planos de reunião vivem no endereço, então compartilhar um link é a funcionalidade inteira.
- **Nenhum dado inventado.** Onde um fuso não tem sigla nos dados da IANA, mostra-se a diferença, e não um palpite de aparência plausível. Onde não há avaliações, nenhuma nota é alegada.
- **Nenhuma chamada de rede em tempo de execução.** O nascer e o pôr do sol são calculados a partir da latitude e da longitude com o algoritmo solar da NOAA, não buscados em outro lugar.

## Correções

Se algo aqui estiver errado, isso importa: todo o valor de uma obra de consulta está em ela estar certa. Os dados de contato estão na [página de contato](/pt-br/contact/).
