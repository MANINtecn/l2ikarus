// L2 Ikarus Web (o hack and slash): enderecos e textos da home nova de l2ikarus.com.
// Na etapa final o jogo muda de isblade.tecx.pro para l2ikarus.tecx.pro: trocar so' aqui.

export const URL_JOGO = 'https://www.isblade.tecx.pro/login.html'
export const URL_STATUS_JOGO = 'https://play.isblade.tecx.pro/status'

export const pilares = [
  { id: 'esquiva', titulo: 'Esquive e bloqueie', texto: 'Nada de clicar e esperar. Você desvia, bloqueia e contra-ataca em tempo real.' },
  { id: 'combo', titulo: 'Encadeie combos', texto: 'Skills que se ligam umas nas outras. Quem sabe combar decide a luta.' },
  { id: 'grupo', titulo: 'Party e dungeons', texto: 'Monte o grupo, entre na dungeon e limpe as hordas juntos.' },
  { id: 'pvp', titulo: 'PvP na mira', texto: 'Sem target travado: no PvP, quem mira e esquiva melhor vence.' },
]

export const classes = [
  { id: 'guardiao', nome: 'Guardião', arma: 'Escudo', papel: 'Linha de frente', texto: 'Segura a horda, protege o grupo e pune quem chega perto.' },
  { id: 'guerreiro', nome: 'Guerreiro', arma: 'Espada de duas mãos', papel: 'Dano corpo a corpo', texto: 'Golpes pesados, fendas no chão e o Tufão que você mesmo conduz.' },
  { id: 'mago', nome: 'Mago', arma: 'Cajado', papel: 'Dano à distância', texto: 'Domina o campo de longe com vento, fogo e explosões.' },
  { id: 'clerigo', nome: 'Clérigo', arma: 'Livro astral', papel: 'Suporte', texto: 'Glifos de luz que curam aliados e quebram a defesa inimiga.' },
]

export const andares = [
  { n: '3º', nome: 'O Baium', texto: 'O chefe dorme no topo da torre e só acorda quando você chega. PvP liberado.' },
  { n: '2º', nome: 'Dungeon Hard', texto: 'Onde a partida começa. Hordas pesadas, PvP, e limpar tudo abre a porta do Baium.' },
  { n: '1º', nome: 'Dungeon Normal e Média', texto: 'Para aprender a classe, sozinho ou em grupo.' },
]

export const progressao = [
  { valor: '99', rotulo: 'níveis' },
  { valor: '5', rotulo: 'pontos por nível' },
  { valor: '4', rotulo: 'atributos: FOR, INT, AGI, VIT' },
  { valor: 'Grátis', rotulo: 'reset de pontos, sempre' },
]

// L2 classico x L2 Ikarus: [tema, classico, ikarus]
export const versus = [
  ['Ataque', 'Clica no alvo e espera o personagem bater.', 'Você mira e acerta onde apontar. Errou a mira, errou o golpe.'],
  ['Defesa', 'Fica parado tomando dano.', 'Esquiva e bloqueio no tempo certo. Saber sair do golpe faz parte.'],
  ['Skills', 'Fila de comandos, uma de cada vez.', 'Combos que se encadeiam. Quem sabe combar vence.'],
  ['Onde jogar', 'Só no PC, com cliente pesado.', 'No navegador, no PC e no celular. Sem download.'],
]

export const galeria = [
  { src: '/media/web/jogo_baium.webp', legenda: 'Na mira do gigante: o retículo no centro da tela é a sua mira.' },
  { src: '/media/web/jogo_combo.webp', legenda: 'Combo encadeado: dano, efeito da skill e contador de combo.' },
]

export const plataformas = [
  { id: 'pc', nome: 'No PC', itens: ['Mouse para mirar', 'Teclado para andar, esquivar e soltar skills', 'Roda no navegador, sem instalar nada'] },
  { id: 'celular', nome: 'No celular', itens: ['Joystick na tela para andar', 'Mira e skills no toque', 'Mesmo jogo, mesmo servidor do PC'] },
  { id: 'app', nome: 'Como app', itens: ['Instale na tela inicial do celular', 'Abre em tela cheia, como um app', 'Atualiza sozinho, sem loja'] },
]
