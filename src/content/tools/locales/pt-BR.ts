import type { PageCopy } from '../types.ts';

/**
 * Textos em português do Brasil. O inglês é o contrato: a checagem de tipos falha se faltar um campo.
 */
export const copy: PageCopy = {
  tools: {
    converter: {
      title: 'Conversor de fuso horário',
      metaTitle: 'Conversor de fuso horário para qualquer data',
      description:
        'Calcular fuso horário entre cidades como São Paulo, Lisboa ou Nova York. Considera horário de verão, meias horas e fusos de 45 minutos.',
      summary:
        'Escolha dois fusos e uma data: a conversão sai exata. Use para calcular fuso horário entre cidades como São Paulo, Nova York ou Lisboa — inclusive nos dois dias do ano em que a mudança de horário torna um horário local impossível ou ambíguo.',
      faqs: [
        {
          question: 'Este conversor considera o horário de verão?',
          answer:
            'Sim, e também os dois dias complicados. As diferenças vêm do banco de dados IANA pelo navegador, então uma conversão na data da mudança usa a diferença que valia de fato naquele momento, não a de hoje. Se você digitar um horário local que nunca existiu, ou um que aconteceu duas vezes, o conversor avisa em vez de escolher um em silêncio.',
        },
        {
          question: 'Por que a diferença de horário entre duas cidades muda ao longo do ano?',
          answer:
            'Porque os dois lugares raramente mudam o relógio na mesma data, e alguns não mudam nunca. Nova York fica 5 horas atrás de Londres na maior parte do ano, mas 4 durante duas semanas de março, porque os Estados Unidos adiantam os relógios duas ou três semanas antes da Europa. Converta sempre contra uma data específica, nunca contra uma diferença lembrada de cabeça.',
        },
        {
          question: 'Entre quais fusos horários posso converter?',
          answer:
            'Entre todos os do banco IANA — mais de 400 — incluindo as diferenças de meia hora e de 45 minutos em que quase todo conversor tropeça. A Índia em UTC+05:30, o Nepal em UTC+05:45 e as ilhas Chatham em UTC+12:45 são tratados com exatidão, sem arredondar para a hora mais próxima.',
        },
        {
          question: 'Preciso de JavaScript?',
          answer:
            'Para o conversor ao vivo, sim. Todo o resto — diferenças, datas de mudança de horário, tabelas de referência hora a hora e todas as explicações — faz parte da página já gerada e funciona com o JavaScript desativado.',
        },
        {
          question: 'O que eu digito aqui é enviado para algum lugar?',
          answer:
            'Não. Todo cálculo acontece no seu navegador. Não há servidor, nem análise de uso, nem cookies, nem script de terceiros. Os fusos escolhidos aparecem no endereço para que você possa compartilhar ou salvar uma conversão, e é o único lugar aonde eles vão.',
        },
      ],
      sections: [
        {
          heading: 'Por que a conversão de fuso horário dá errado',
          paragraphs: [
            'Quase todo erro de agendamento nasce de uma entre quatro causas, e todas as quatro são tratadas aqui em vez de arredondadas.',
            'A diferença não é constante. “Nova York está cinco horas atrás de Londres” vale por uns dez meses do ano. Durante cerca de três semanas na primavera do norte e uma no outono, são quatro horas, porque as duas regiões mudam o relógio em datas diferentes. Um conversor que guarda uma diferença fixa por cidade erra justamente nesses dias — e são exatamente os dias em que se marca a reunião da qual a gente se arrepende.',
            'Nem toda diferença é de horas inteiras. A Índia está 5 horas e 30 minutos à frente do UTC. O Nepal, 5 horas e 45 minutos. As ilhas Chatham, 12 horas e 45 minutos, e a ilha Lord Howe se desloca apenas 30 minutos quando entra no horário de verão. Cerca de um quinto do mundo vive com uma diferença que não é um número inteiro de horas.',
            'Alguns horários locais não existem. Quando os relógios adiantam, uma hora desaparece. Em Nova York, no dia da mudança, depois de 01:59:59 vem imediatamente 03:00:00 — 02:30 nunca acontece. Peça a quase qualquer ferramenta que converta 02:30 e ela responderá assim mesmo, com toda a confiança. Esta aqui conta o que fez.',
            'Alguns horários locais acontecem duas vezes. Quando os relógios atrasam, uma hora se repete. 01:30 ocorre uma vez no horário de verão e de novo, uma hora depois, no horário padrão. Este conversor pega a primeira ocorrência, diz isso, e mostra a segunda.',
          ],
        },
        {
          heading: 'Calcular fuso horário entre cidades populares',
          paragraphs: [
            'O fuso horário São Paulo (America/Sao_Paulo) fica em UTC\u201103:00 o ano todo desde que o Brasil aboliu o horário de verão em 2019. Se você quer saber que horas são quando marca uma reunião com alguém em Nova York ou Lisboa, esta é a ferramenta certa: ela desconta a mudança automática de cada lado.',
            'O fuso horário Portugal (Europe/Lisbon) segue WET no inverno (UTC+00:00) e WEST no verão (UTC+01:00). Para quem está no Brasil, a diferença para Portugal oscila entre 3 e 4 horas dependendo da época do ano — e esse conversor mostra exatamente qual diferença vale na data que você escolher.',
          ],
        },
      ],
    },

    meetingPlanner: {
      title: 'Planejador de reuniões',
      metaTitle: 'Planejador de reuniões entre fusos horários',
      description:
        'Adicione de dois a dez fusos e veja uma faixa de 24 horas com o expediente sombreado. Encontre as horas em comum, ou descubra que não há nenhuma.',
      summary:
        'Adicione os fusos em que sua equipe trabalha: a faixa abaixo mostra o dia inteiro de uma vez, com o expediente sombreado — a sobreposição vira uma forma que se enxerga, não uma conta que se faz.',
      faqs: [
        {
          question: 'Quantos fusos horários posso adicionar?',
          answer:
            'De dois a dez. Passando de dez, a faixa deixa de ser legível de relance, que é a razão inteira de usar uma faixa em vez de uma lista de números — o limite é uma decisão de projeto, não uma limitação técnica.',
        },
        {
          question: 'O que conta como expediente?',
          answer:
            'O que você definir. O padrão é das 09:00 às 18:00 no horário local de cada fuso, e as duas pontas são ajustáveis. A hora anterior e a posterior ficam sombreadas mais claras: são alcançáveis, mas você está pedindo um favor.',
        },
        {
          question: 'Por que algumas linhas mostram horários terminados em :30 ou :45?',
          answer:
            'Porque esses fusos estão mesmo deslocados em meia hora ou em três quartos de hora. A Índia é UTC+05:30, o Nepal é UTC+05:45, as ilhas Chatham são UTC+12:45. Cada coluna da faixa é o mesmo instante, então essas linhas mostram a leitura local real, não uma arredondada.',
        },
        {
          question: 'E se não houver sobreposição nenhuma?',
          answer:
            'O planejador diz isso com todas as letras, em vez de sugerir um meio-termo com que ninguém concordou. Los Angeles e Mumbai não compartilham um minuto sequer de um dia das 09:00 às 18:00, e nenhum sombreado muda isso — alguém precisa se mexer. Ampliar o expediente ou dividir a reunião em duas são as opções honestas.',
        },
        {
          question: 'O plano sobrevive a um recarregamento da página?',
          answer:
            'Sim. Seus fusos, a data e o expediente ficam no endereço, então você pode salvar um plano nos favoritos ou mandar para alguém, e essa pessoa vê exatamente o que você vê. A lista de fusos também fica guardada no seu navegador, para o planejador lembrar da sua equipe na próxima vez.',
        },
        {
          question: 'Ele considera o horário de verão?',
          answer:
            'Sim, na data que você escolher. Escolha uma data de março ou de outubro e verá linhas se deslocando umas em relação às outras, porque é o que acontece de verdade: os fusos mudam o relógio em dias diferentes.',
        },
      ],
      sections: [
        {
          heading: 'Como ler a faixa',
          paragraphs: [
            'Cada coluna é um instante. Lendo uma coluna de cima para baixo, você vê o que o relógio marca em cada lugar naquele mesmo momento — que é justamente o que uma lista de diferenças obriga a calcular de cabeça, e justamente o que as pessoas erram.',
            'Três tons: o expediente leva uma borda superior colorida, a hora de cada lado fica mais clara, e o resto fica plano. A borda pesa tanto quanto o preenchimento — a distinção nunca depende só da cor, então continua legível mesmo se você não separa esses dois azuis.',
          ],
        },
        {
          heading: 'Quando não há sobreposição',
          paragraphs: [
            'Algumas equipes realmente não têm nenhuma. Um expediente das 09:00 às 18:00 em Los Angeles e o mesmo em Mumbai não compartilham nada — o dia de Mumbai termina antes de Los Angeles acordar. Nova York e Sydney são ainda mais curiosas: compartilham exatamente uma hora de novembro a março, quando a distância é de 16 horas, e absolutamente nada de abril a outubro, quando ela encolhe para 14. As mesmas duas cidades, resposta oposta, e a única coisa que mudou foi a data.',
            'Quando isso acontece, o planejador avisa em vez de sombrear alguma coisa e torcer. As escolhas realistas são ampliar o expediente de um dos lados, revezar quem fica com a chamada desconfortável, ou parar de se reunir ao vivo. Fingir que 22:00 está de bom tamanho é como as pessoas se esgotam em silêncio.',
          ],
        },
      ],
    },

    worldClock: {
      title: 'Relógio mundial',
      metaTitle: 'Relógio mundial online: hora em 80 cidades',
      description:
        'Relógio mundial online com hora ao vivo em 80 cidades. Veja o horário de Brasília agora, horário em Nova York agora, que horas são em Londres e outras.',
      summary:
        'Relógio mundial online com a hora local ao vivo em 80 cidades, do relógio mais adiantado do planeta ao mais atrasado. Veja o horário de Brasília agora, confira o horário de Tóquio agora — busque para filtrar e fixe as cidades que você consulta sempre.',
      faqs: [
        {
          question: 'Qual é a precisão desses relógios?',
          answer:
            'Eles leem o relógio do seu aparelho e aplicam a diferença que o navegador obtém do banco de dados IANA, então são tão precisos quanto a sua própria máquina. Se o relógio do computador estiver errado, todos os relógios daqui estarão errados na mesma medida — nada nesta página vem de um servidor.',
        },
        {
          question: 'Posso manter minhas cidades no topo?',
          answer:
            'Pode. Fixe uma cidade e ela vai para o começo da grade, e continua lá na próxima visita. As cidades fixadas ficam só no seu navegador; nada é enviado a lugar nenhum e nenhum cookie é criado.',
        },
        {
          question: 'Que horas são em Londres, Nova York e Tóquio agora?',
          answer:
            'Este relógio mundial mostra a hora ao vivo em todas essas cidades. Para saber que horas são em Londres agora, basta procurá-la na grade — o mesmo vale para o horário em Nova York agora ou o horário de Tóquio agora. Cada relógio mostra a data e a hora local corretas neste instante.',
        },
        {
          question: 'Como vejo o horário de Brasília agora?',
          answer:
            'São Paulo e Brasília ficam no mesmo fuso (America/Sao_Paulo, UTC-03:00), então basta buscar "São Paulo" na grade para ver o horário de Brasília agora. O relógio é ao vivo e atualiza a cada segundo.',
        },
        {
          question: 'Por que algumas cidades mostram uma data diferente?',
          answer:
            'Porque é assim mesmo. Quando é segunda à noite em Nova York, já é terça de manhã em Tóquio. A data embaixo de cada relógio é a data do calendário local daquela cidade, não a sua.',
        },
        {
          question: 'Por que Mumbai e Katmandu mostram horários terminados em :30 e :45?',
          answer:
            'A Índia funciona em UTC+05:30 e o Nepal em UTC+05:45. São as diferenças reais, não erros de arredondamento — cerca de um quinto do mundo vive com uma diferença que não é um número inteiro de horas.',
        },
      ],
      sections: [],
    },

    timeDifference: {
      title: 'Diferença de horário',
      metaTitle: 'Diferença de horário entre dois fusos',
      description:
        'A diferença de horário atual entre dois lugares — inclusive Brasil e EUA — e as datas do próximo ano em que ela muda devido a ajustes nos relógios.',
      summary:
        'Escolha dois lugares e veja a que distância eles estão agora — calcule a diferença de horário Brasil EUA, Brasil Portugal ou qualquer outro par, mais as datas exatas do próximo ano em que essa distância muda.',
      faqs: [
        {
          question: 'Qual é a diferença de horário entre Brasil e EUA?',
          answer:
            'Depende de quais cidades. São Paulo (UTC\u201103:00) está 2 horas à frente de Nova York (UTC\u201105:00) na maior parte do ano, mas 1 hora durante as semanas em que os EUA já adiantaram os relógios e o Brasil não, porque o Brasil aboliu o horário de verão em 2019. Para Los Angeles a diferença é de 5 ou 4 horas. Use esta ferramenta para ver a diferença de horário Brasil EUA exata na data que importa.',
        },
        {
          question: 'Por que a diferença não é a mesma o ano todo?',
          answer:
            'Porque os dois lugares mudam o relógio em datas diferentes, ou um deles não muda de jeito nenhum. Nova York e Londres ficam 5 horas separadas na maior parte do ano, 4 horas nas três semanas de março depois de os Estados Unidos adiantarem e antes de a Europa adiantar, e 4 horas de novo na semana do fim de outubro depois de a Europa atrasar e antes de os Estados Unidos atrasarem.',
        },
        {
          question: 'Quais lugares nunca mudam a diferença?',
          answer:
            'Qualquer par em que nenhum dos dois adota horário de verão — Índia e Japão, por exemplo, ficam permanentemente 3 horas e 30 minutos separados. Pares dentro do mesmo bloco regulatório também são estáveis: todos os fusos da União Europeia mudam no mesmo instante, então Lisboa e Atenas continuam exatamente 2 horas separadas o ano inteiro.',
        },
        {
          question: 'Como a diferença é calculada?',
          answer:
            'Pedindo ao navegador a diferença de cada fuso no mesmo instante e subtraindo. Isso significa que ela está correta no momento em que você olha, inclusive no meio de uma mudança de horário, em vez de repetir um número guardado que era verdade mês passado.',
        },
        {
          question: 'O que significa uma diferença negativa?',
          answer:
            'Significa que o segundo lugar está atrás do primeiro. A página escreve “à frente” ou “atrás” por extenso exatamente por isso: sinais de menos em diferenças de horário são lidos ao contrário por cerca de metade das pessoas.',
        },
      ],
      sections: [],
    },

    workingHoursOverlap: {
      title: 'Sobreposição de expediente',
      metaTitle: 'Expediente em comum de equipes distribuídas',
      description:
        'Encontre as horas exatas que uma equipe distribuída compartilha, no relógio local de cada pessoa — ou descubra com honestidade que não há nenhuma.',
      summary:
        'Adicione os fusos em que sua equipe trabalha e receba as janelas exatas em que todo mundo está disponível, no relógio de cada um — e uma resposta clara quando não houver nenhuma.',
      faqs: [
        {
          question: 'O que conta como expediente?',
          answer:
            'O padrão é das 09:00 às 18:00 no horário local de todo mundo, com as duas pontas ajustáveis. Cada fuso é tratado igual de propósito, em vez de embutir suposições sobre quais países começam cedo — uma equipe que trabalha mesmo das 10:00 às 19:00 deveria dizer isso.',
        },
        {
          question: 'E se não houver sobreposição?',
          answer:
            'Você é avisado, junto com as janelas mais próximas em que o maior número de pessoas está dentro do expediente. Los Angeles e Mumbai não compartilham um minuto de um dia das 09:00 às 18:00; nenhum arranjo da grade muda isso. As opções honestas são ampliar o dia de um dos lados, revezar quem fica com a chamada desconfortável, ou trabalhar de forma assíncrona.',
        },
        {
          question: 'Qual a diferença para o planejador de reuniões?',
          answer:
            'O planejador mostra o dia inteiro como uma faixa, para você enxergar o formato. Esta ferramenta responde à pergunta mais estreita com exatidão: quais minutos são compartilhados e como esses minutos aparecem no relógio de cada pessoa. Use o planejador para explorar e este para decidir.',
        },
        {
          question: 'Ela considera o horário de verão?',
          answer:
            'Sim, para hoje. As janelas de sobreposição se deslocam uma hora quando um lado já mudou o relógio e o outro ainda não — por isso a mesma equipe tem quatro horas em comum em fevereiro e três em março.',
        },
      ],
      sections: [],
    },

    unixTimestamp: {
      title: 'Conversor de timestamp Unix',
      metaTitle: 'Conversor de timestamp Unix para data',
      description:
        'Converta um timestamp Unix em data legível e de volta, em qualquer fuso. Detecta segundos ou milissegundos e mostra um contador ao vivo.',
      summary:
        'Cole um timestamp Unix para lê-lo como data, ou escolha uma data para obter o timestamp — o conversor detecta se o seu número está em segundos ou em milissegundos e diz o que assumiu.',
      faqs: [
        {
          question: 'Segundos ou milissegundos: como ele sabe?',
          answer:
            'Pelo tamanho. Um timestamp de 1e11 para cima é tratado como milissegundos, porque 1e11 segundos correspondem ao ano 5138 e nada real chega lá. A unidade detectada aparece ao lado do resultado em vez de ser aplicada em silêncio, porque errar aqui é um erro de fator 1000 que joga você em 1970.',
        },
        {
          question: 'O que é um timestamp Unix?',
          answer:
            'O número de segundos desde 1º de janeiro de 1970 às 00:00:00 UTC, sem contar segundos bissextos. É um número único, sem fuso horário grudado, e é exatamente por isso que os sistemas o usam: duas máquinas em qualquer ponto da Terra lendo o mesmo timestamp concordam sobre o mesmo instante.',
        },
        {
          question: 'Um timestamp pode ser negativo?',
          answer:
            'Pode. Tudo antes de 1970 é negativo. A chegada da Apollo 11 à Lua fica em torno de -14.182.940. Este conversor lida com valores negativos nos dois sentidos.',
        },
        {
          question: 'O que acontece em 2038?',
          answer:
            'Sistemas que guardam a contagem em um inteiro de 32 bits com sinal ficam sem espaço às 03:14:07 UTC de 19 de janeiro de 2038. O segundo seguinte transborda para um número negativo, que esses sistemas leem como dezembro de 1901. Quase toda plataforma moderna migrou para contagens de 64 bits anos atrás; quem ainda está exposto são sistemas embarcados e legados.',
        },
        {
          question: 'O fuso horário afeta o timestamp?',
          answer:
            'O timestamp em si, não — ele é sempre contado a partir de um instante em UTC. O fuso só decide como aquele instante é mostrado como data e hora, e qual leitura local volta a qual número.',
        },
      ],
      sections: [],
    },

    durationCalculator: {
      title: 'Calculadora de duração',
      metaTitle: 'Calculadora de duração entre fusos horários',
      description:
        'Calcule o tempo entre duas datas e horas, cada uma no seu fuso. Trata o horário de verão certo: um dia de 23 horas é reportado como 23 horas.',
      summary:
        'Defina um início e um fim — cada um no seu próprio fuso, se forem diferentes — e receba o tempo que passou de verdade, incluindo os dias que têm 23 ou 25 horas.',
      faqs: [
        {
          question: 'Por que às vezes um dia dá 23 ou 25 horas?',
          answer:
            'Porque deu mesmo. No dia em que os relógios adiantam, de meia-noite a meia-noite são 23 horas; no dia em que atrasam, são 25. Esta calculadora resolve as duas pontas em instantes absolutos antes de subtrair, então reporta o tempo que realmente passou em vez do tempo que o calendário sugere.',
        },
        {
          question: 'As duas pontas podem estar em fusos diferentes?',
          answer:
            'Podem, e é justamente o ponto. Um voo que sai de Tóquio às 17:00 e pousa em São Francisco às 09:30 da mesma manhã levou nove horas e meia, não menos sete e meia. Defina cada ponta no seu próprio fuso e a conta fecha.',
        },
        {
          question: 'Os segundos bissextos entram na conta?',
          answer:
            'Não. Os navegadores não os expõem — o relógio do JavaScript ignora segundos bissextos por completo, então um intervalo que atravessa um deles é reportado um segundo mais curto. Em toda a história do UTC isso soma 27 segundos, o que importa para navegação por satélite e para nada que você provavelmente vá medir aqui.',
        },
        {
          question: 'E se o fim vier antes do início?',
          answer:
            'A calculadora avisa, e reporta a magnitude mesmo assim. Uma duração negativa normalmente é erro de digitação, e inverter o sinal em silêncio esconderia isso.',
        },
      ],
      sections: [
        {
          heading: 'Por que aritmética de calendário não é aritmética de relógio',
          paragraphs: [
            '“Um dia depois” e “24 horas depois” são instruções diferentes, e duas vezes por ano dão respostas diferentes. Se uma rotina noturna está agendada para 02:30 no horário local, ela roda duas vezes em uma manhã de outono e nenhuma vez em uma manhã de primavera. Se estiver agendada a cada 86.400 segundos, ela se afasta uma hora das 02:30.',
            'Nenhum dos dois comportamentos é um defeito; eles respondem a perguntas diferentes. O problema começa quando o código faz um e a pessoa esperava o outro. Esta calculadora responde sempre à pergunta do relógio — quanto tempo passou de fato — e mostra os dias de calendário ao lado.',
          ],
        },
      ],
    },

    countdown: {
      title: 'Contagem regressiva',
      metaTitle: 'Contagem regressiva para qualquer data e fuso',
      description:
        'Faça a contagem regressiva para qualquer momento em qualquer fuso e compartilhe como link. Sem conta, sem armazenamento: tudo vive no endereço.',
      summary:
        'Escolha um momento e um fuso, e a contagem abaixo corre até lá — ela inteira mora no endereço, então compartilhar é copiar a barra de endereços.',
      faqs: [
        {
          question: 'Como compartilho uma contagem regressiva?',
          answer:
            'Monte a contagem e copie a barra de endereços — todos os campos estão ali. Quem abrir vê a mesma contagem para o mesmo instante, medida pelo relógio do próprio aparelho. Não há conta, não há registro salvo e não há nada em um servidor, porque não existe servidor.',
        },
        {
          question: 'Quem recebe vê no próprio fuso horário?',
          answer:
            'Vê a mesma contagem, porque uma contagem regressiva mede a distância até um instante e essa distância é igual em todo lugar. A data e a hora de destino aparecem no fuso que você escolheu, para que todos vejam a que momento local ela se refere.',
        },
        {
          question: 'O que acontece quando chega a zero?',
          answer:
            'A contagem diz que o momento passou e para. Ela não começa a contar para cima — se você quer o tempo decorrido desde um evento, a calculadora de duração responde a isso direito.',
        },
        {
          question: 'Posso contar até um horário que não existe?',
          answer:
            'Se você escolher um horário local dentro do buraco criado quando os relógios adiantam, a contagem se move para o instante equivalente depois da mudança e avisa. É a mesma política que todas as ferramentas deste site seguem.',
        },
      ],
      sections: [
        {
          heading: 'Por que a contagem inteira fica no link',
          paragraphs: [
            'Quase toda ferramenta de contagem regressiva pede que você crie uma conta, para guardar sua contagem no servidor deles e mostrar um anúncio ao lado. Aqui não existe servidor, então o estado precisa morar em algum lugar que o link consiga carregar — o que acaba sendo melhor para todo mundo. Nada para assinar, nada para apagar depois, nada que pare de funcionar quando uma empresa fecha.',
            'Uma coisa vale saber: como o título viaja no endereço, trate um link de contagem vindo de um desconhecido como trataria qualquer link. O título é limpo de tudo que não seja texto puro e sempre exibido como texto, nunca como marcação.',
          ],
        },
      ],
    },

    utcTime: {
      title: 'Hora UTC',
      metaTitle: 'Hora UTC agora — tempo universal coordenado',
      description:
        'A hora UTC atual, correndo ao vivo. Veja o horário UTC Brasil (UTC−03:00 em Brasília), a diferença entre UTC e GMT e contra o que se mede cada fuso.',
      summary:
        'UTC é o relógio de referência contra o qual todos os outros fusos são definidos — ele nunca se desloca pelo horário de verão. O horário UTC Brasil, por exemplo, é UTC−03:00 em Brasília, e a leitura abaixo é o relógio do seu aparelho expresso em UTC.',
      faqs: [
        {
          question: 'O que é UTC?',
          answer:
            'O tempo universal coordenado é a referência contra a qual todos os outros fusos horários são definidos. Não é um fuso em que alguém viva — é a linha de base. Toda diferença que você vê, de UTC-12 a UTC+14, é uma distância a partir deste relógio.',
        },
        {
          question: 'Qual é o horário UTC Brasil?',
          answer:
            'O Brasil abrange quatro fusos: UTC−02:00 (Fernando de Noronha), UTC−03:00 (Brasília, São Paulo, Rio de Janeiro — o horário oficial), UTC−04:00 (Manaus, Cuiabá) e UTC−05:00 (Rio Branco). O horário de Brasília agora é UTC−03:00 o ano todo, porque o Brasil aboliu o horário de verão em 2019.',
        },
        {
          question: 'UTC é a mesma coisa que GMT?',
          answer:
            'Para o dia a dia, os dois mostram a mesma leitura, mas são coisas diferentes. GMT é um fuso horário, definido pela posição do sol no meridiano de Greenwich, e o Reino Unido sai dele todo verão. UTC é um padrão de tempo, mantido por cerca de 450 relógios atômicos e nunca ajustado por horário de verão. Se você quer dizer “a referência”, diga UTC.',
        },
        {
          question: 'Por que a sigla é UTC e não CUT?',
          answer:
            'Porque nem o acrônimo inglês nem o francês venceram. Os falantes de inglês queriam CUT, de “coordinated universal time”, os de francês queriam TUC, de “temps universel coordonné”, e a União Internacional de Telecomunicações fechou em UTC — que não combina com nenhuma das duas línguas e por isso ofende as duas igualmente.',
        },
        {
          question: 'UTC adota horário de verão?',
          answer:
            'Nunca. É justamente o sentido dele. UTC não se desloca, e é por isso que servidores, aviação, navegação e todo sistema distribuído em que duas máquinas precisam concordar sobre quando algo aconteceu usam UTC em vez de um fuso local.',
        },
        {
          question: 'E os segundos bissextos?',
          answer:
            'O UTC ocasionalmente recebeu um segundo bissexto para ficar dentro de 0,9 segundo da rotação real da Terra — 27 deles desde 1972, o mais recente no fim de 2016. Em 2022 a Conferência Geral de Pesos e Medidas votou por parar de adicioná-los até 2035. Seu navegador não expõe segundos bissextos, então esta página também não.',
        },
      ],
      sections: [
        {
          heading: 'Por que tudo se mede a partir daqui',
          paragraphs: [
            'Antes de 1884, cada cidade mantinha o próprio relógio, acertado pelo próprio meio-dia. Isso funcionou até chegarem as ferrovias, quando duas cidades a sessenta quilômetros de distância discordando em doze minutos deixou de ser curiosidade e virou risco de colisão. A Conferência Internacional do Meridiano escolheu Greenwich como meridiano de origem, e o sistema moderno de diferenças decorre daí.',
            'O UTC substituiu o horário médio de Greenwich como padrão técnico em 1972. A diferença importa mais do que parece: o GMT é definido pela Terra, que oscila, enquanto o UTC é definido por átomos de césio, que não oscilam. Os dois são mantidos a menos de um segundo um do outro na mão.',
            'Se você está guardando um timestamp em um banco de dados, registrando um evento ou agendando qualquer coisa sobre a qual duas máquinas precisem concordar, guarde em UTC e converta só na exibição. Guardar horário local é como os sistemas acabam com uma hora que acontece duas vezes por ano e um chamado de suporte à altura.',
          ],
        },
      ],
    },

    dstChanges: {
      title: 'Mudanças de horário de verão',
      metaTitle: 'Horário de verão: mudanças deste ano e do próximo',
      description:
        'Mudanças de relógio para este ano e o próximo, incluindo fuso horário Brasil e fuso horário Portugal. Datas exatas, hora local e diferença.',
      summary:
        'Cada data abaixo vem do banco de dados IANA, com o momento local exato em que a mudança entra em vigor. O fuso horário Brasil não muda mais desde 2019; o fuso horário Portugal continua mudando duas vezes por ano — e as cidades que nunca mexem nos relógios aparecem em lista separada.',
      faqs: [
        {
          question: 'O fuso horário Brasil ainda muda os relógios?',
          answer:
            'Não. O Brasil aboliu o horário de verão em 2019, depois de décadas usando. Desde então o fuso horário Brasil permanece fixo: UTC-03:00 para Brasília e São Paulo, UTC-04:00 para Manaus, UTC-05:00 para Rio Branco. A diferença para o UTC não muda mais em nenhum mês.',
        },
        {
          question: 'E o fuso horário Portugal — muda os relógios?',
          answer:
            'Sim. O fuso horário Portugal continental (Europe/Lisbon) segue WET (UTC+00:00) no inverno e WEST (UTC+01:00) no verão, alinhado com a União Europeia. Os Açores ficam uma hora atrás (UTC-01:00/UTC+00:00). Enquanto a UE não abolir a mudança, Portugal continua mexendo nos relógios duas vezes por ano.',
        },
        {
          question: 'Quais países aboliram o horário de verão?',
          answer:
            'A Rússia parou em 2014, a Turquia em 2016, o Irã em 2022 e o México em 2022 na maior parte do território; o Brasil em 2019, depois de décadas usando. Japão, Índia, China e quase toda a África e o Sudeste Asiático nunca adotaram. Cerca de um terço do mundo observa; o resto acompanha a discussão semestral com interesse.',
        },
        {
          question: 'A União Europeia ainda planeja abolir?',
          answer:
            'O Parlamento Europeu votou em 2019 pelo fim das mudanças sazonais, mas a diretiva emperrou: os Estados-membros não conseguiram concordar entre horário de verão permanente e horário padrão permanente, e uma colcha de retalhos fragmentaria os fusos do mercado único. Até isso se resolver, valem as datas desta página.',
        },
        {
          question: 'Por que a ilha Lord Howe se desloca só 30 minutos?',
          answer:
            'Porque ela decidiu que uma hora era demais. Lord Howe, na costa leste da Austrália, vai de UTC+10:30 para UTC+11:00 — a única mudança de horário de verão de meia hora do mundo. É também o motivo pelo qual qualquer biblioteca de datas que presuma um deslocamento de uma hora está silenciosamente errada para umas 380 pessoas.',
        },
        {
          question: 'A que horas os relógios mudam de fato?',
          answer:
            'Varia. Os Estados Unidos mudam às 02:00 no horário local, a União Europeia às 01:00 UTC — ou seja, todos os fusos europeus mudam no mesmo instante, mas em horas locais diferentes. A Austrália muda às 02:00 locais, o Chile às 24:00. A coluna de hora local mostra a última leitura antes de cada mudança.',
        },
        {
          question: 'Com que frequência esta página é atualizada?',
          answer:
            'Ela é reconstruída todo mês, e também no 1º de março, 1º de abril, 1º de outubro e 1º de novembro, para que qualquer alteração no banco de dados IANA entre antes das datas que ela afeta. Governos anunciam essas mudanças com prazos que vão de um ano a duas semanas.',
        },
      ],
      sections: [],
    },
  },

  hubs: {
    convert: {
      title: 'Conversões de fuso horário',
      metaTitle: 'Conversões de fuso horário entre cidades',
      description:
        'Todas as conversões entre cidades e entre siglas deste site, cada uma com tabela hora a hora, datas de horário de verão e as horas para ligar.',
      summary:
        'Cada conversão traz uma tabela hora a hora, as datas de horário de verão das duas cidades e as horas em que uma ligação é realmente possível.',
    },
    cities: {
      title: 'Hora atual por cidade',
      metaTitle: 'Hora atual por cidade em todos os continentes',
      description:
        'Hora local, diferença para o UTC e datas de horário de verão para 80 cidades em todos os continentes habitados.',
      summary:
        'Cada página traz um relógio ao vivo, as datas exatas de horário de verão daquele fuso, nascer e pôr do sol calculados a partir das coordenadas da cidade, e conversões para os grandes centros.',
    },
    guides: {
      title: 'Guias',
      metaTitle: 'Guias sobre fusos, UTC e horário de verão',
      description:
        'Guias sobre como os fusos horários funcionam, o que é UTC, por que existe horário de verão e como lidar com tudo isso no código sem errar.',
      summary:
        'Como os fusos horários funcionam de verdade — o mecanismo, a história e as formas específicas pelas quais o software erra. Escritos para serem lidos uma vez e lembrados, não para ranquear.',
    },
  },

  generated: {
    hourByHour: 'Hora a hora',
    daylightSaving: 'Horário de verão',
    whenYouCanTalk: 'Quando dá para conversar de verdade',
    reference: 'Referência',
    zoneFacts: 'Dados do fuso',
    sunriseSunset: 'Nascer e pôr do sol',
    againstHubs: 'Em relação aos grandes centros',
    convertTo: 'Converter para',
    exampleNote:
      'Diferenças e datas são calculadas na geração do site a partir do banco IANA. Os horários ao vivo são gerados no seu navegador.',
    sunNote:
      'Calculados a partir da latitude e da longitude da cidade com o algoritmo solar da NOAA — sem API, sem chamada de rede.',
    noDstNote:
      'Esta cidade não adota horário de verão. Sua diferença para o UTC é a mesma em todos os dias do ano.',
    ambiguousPanelHeading: 'Estas letras significam mais de uma coisa',
    ambiguousPanelBody:
      'Se você quis dizer uma das outras, a diferença abaixo está errada para o seu caso — e é exatamente assim que reuniões são marcadas na hora errada.',
    abbreviationTableNote:
      'Calculado em uma data em que esta sigla está realmente em vigor — usar hoje estaria errado durante metade do ano.',
  },
};

export default copy;
