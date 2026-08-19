---
title: "Acessibilidade"
description: "O que este site busca atingir, o que é verificado automaticamente e o que fazer se algo não funcionar para você."
order: 6
updatedAt: '2026-01-15'
---

Este site busca o **nível AA das WCAG 2.2**. As partes que podem ser verificadas automaticamente são verificadas a cada compilação, e a compilação falha se elas regredirem.

## O que a compilação exige

- **Contraste de cor.** Cada combinação de texto é verificada contra a razão 4,5:1 e cada indicador de foco contra 3:1, no tema claro e no escuro. A paleta é lida da folha de estilo em vez de duplicada no teste, então mudar uma cor dispara a verificação.
- **Semântica da marcação.** O linter aplica regras de acessibilidade a cada componente: rótulos ausentes, ARIA inválido e elementos não interativos com manipuladores fazem a compilação falhar.
- **Nenhum transbordamento horizontal**, inclusive no layout da direita para a esquerda do árabe, verificado em um navegador real.

## Decisões de projeto

- **A cor nunca é o único sinal.** O expediente no planejador tem borda além do preenchimento; os avisos de horário de verão são palavras, não apenas um tom âmbar.
- **Os resultados se anunciam sozinhos.** Cada área de resultado é `aria-live="polite"`, de modo que uma conversão é lida em voz alta ao mudar, em vez de exigir uma busca.
- **Todo campo tem um rótulo de verdade.** Em nenhum lugar um texto de exemplo faz as vezes de rótulo.
- **O movimento respeita sua preferência.** Com `prefers-reduced-motion` ligado, animações e rolagem suave são desativadas.
- **Funciona sem JavaScript.** Cada diferença, cada data de mudança, cada tabela de referência e cada explicação estão na página já gerada. Só os relógios ao vivo e as ferramentas interativas precisam de scripts, e os controles que não funcionariam sem eles ficam ocultos em vez de aparecerem inertes.
- **Os horários usam fonte monoespaçada com algarismos tabulares**, para que as colunas fiquem alinhadas e um dígito em movimento nunca desloque o texto ao lado.

## Limitações conhecidas

- A faixa de 24 horas do planejador é uma tabela larga. Ela rola horizontalmente dentro do próprio contêiner em vez de se reorganizar, porque uma faixa reorganizada deixa de ser legível como forma. A mesma informação está em texto no resumo acima dela.
- Os testes automáticos pegam uma minoria dos problemas de acessibilidade. Se algo aqui não funciona para você, isso é um defeito e queremos saber.

## Como nos avisar

Escreva para o endereço na [página de contato](/pt-br/contact/), informando a página e o que deu errado. Relatos sobre tecnologia assistiva são especialmente valiosos, porque são o mais difícil de testar sem ter a tecnologia à frente.
