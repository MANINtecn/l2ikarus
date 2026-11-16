// L2 Ikarus Web (o hack and slash): enderecos e textos da home nova de l2ikarus.com.
// Na etapa final o jogo muda de isblade.tecx.pro para l2ikarus.tecx.pro: trocar so' aqui.

export const URL_JOGO = 'https://www.isblade.tecx.pro/login.html'
export const URL_STATUS_JOGO = 'https://play.isblade.tecx.pro/status'

export const pilares = [
  { id: 'esquiva', titulo: 'Esquive e bloqueie', texto: 'Nada de clicar e esperar. Você desvia, bloqueia e contra-ataca em tempo real.' },
  { id: 'combo', titulo: 'Encadeie combos', texto: 'Skills que se ligam umas nas outras. Quem sabe combar decide a luta.' },
  { id: 'grupo', titulo: 'Party e dungeons', texto: 'Monte o grupo, entre na dungeon e limpe as hordas juntos.' },
  { id: 'pvp', titulo: 'PvP na mira', texto: 'Combate rápido e na mira. Stun curto: vence quem joga melhor.' },
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
