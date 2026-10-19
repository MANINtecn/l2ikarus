// Fonte unica da pagina /sandbox (Survival Weapon Class Mod).
// Tudo que a pagina mostra sai daqui. Origem de cada numero:
//   - doutrinas/skills: WeaponClassDoctrine + WeaponClassSkillRegistry (DIARIO-MODS-WEAPONCLASS.md secao 4)
//   - % de skills por raridade: WeaponClassSkillManager.initializeWeaponMod (0.30 / 0.55 / 0.80 / 1.0)
//   - chances: ikarus_mods.properties (79/15/5/1, refino com catalisador 35/40/20/5)
// Quando o servidor mudar, mudar AQUI (no futuro: gerado por script a partir do sync).

// Jogos da IS Labs que aparecem na barra. Entra aqui so' o que estiver no ar;
// quando outro servidor abrir, e' so' acrescentar uma linha.
export const jogos = [
  { id: 'l2', nome: 'Lineage II', sub: 'Interlude Sandbox', rota: '/', online: true, beta: true },
]

// O link do download (e o tamanho) vem do painel admin, aba LINKS: config/linksComunidade.js.

// Mapa do jogo: linha principal (o ciclo) + o que alimenta cada etapa.
// acima/abaixo = ramos que entram ou saem da etapa. alvo = bloco de detalhes.
export const mapa = [
  {
    id: 'caca', nome: 'Caça', curto: 'Mate monstros', alvo: 'raridades',
    det: ['Qualquer monstro pode derrubar uma arma do mod.', 'Também caem pedra bruta e peças de armadura.'],
  },
  {
    id: 'arma', nome: 'Arma', curto: 'É a sua classe', alvo: 'raridades',
    abaixo: { nome: 'Mercado', txt: 'compre e venda armas' },
    det: ['A doutrina da arma é a sua classe. Trocou de arma, trocou de kit.', 'A raridade decide quantas skills da classe ela libera e quantos slots de runa ela tem.'],
  },
  {
    id: 'pedra', nome: 'Pedra bruta', curto: 'Matéria-prima', alvo: 'd-oficios',
    acima: { nome: 'Coleta de materiais brutos', txt: 'picareta nos cristais' },
    det: ['Cai dos monstros ou sai dos cristais de minério.', 'Cristal mais raro solta mais pedra: 1, 2, 3 ou 5.'],
  },
  {
    id: 'refino', nome: 'Refino', curto: 'Pedra vira runa', alvo: 'd-oficios',
    acima: { nome: 'Pesca', txt: 'catalisador opcional' },
    det: ['No NPC de serviços, 1 pedra bruta vira 1 runa.', 'O catalisador não é obrigatório: ele só melhora a chance de sair Rara, Épica ou Lendária.'],
  },
  {
    id: 'runa', nome: 'Runa', curto: 'Atributo sorteado', alvo: 'd-runas',
    abaixo: { nome: 'Mercado', txt: 'cada runa é única' },
    det: ['70% saem runa de armadura e 30% runa de arma.', 'As lendárias de arma: Rupture, Parry, Disarm e Flash Dash.'],
  },
  {
    id: 'socket', nome: 'Socket', curto: 'Fica mais forte', alvo: 'd-runas', volta: true,
    det: ['Encaixe a runa no slot da armadura ou da arma.', 'Peça Lendária tem 5 slots: até 20 no corpo inteiro.', 'Mais forte, você caça monstros maiores, e o ciclo recomeça.'],
  },
]

export const raridades = [
  { id: 'normal', nome: 'Normal', cor: '#d9d9d9', chance: 79, skills: 30, sockets: 1, adicionais: 1, pedras: 1 },
  { id: 'rara', nome: 'Rara', cor: '#4aa3ff', chance: 15, skills: 55, sockets: 2, adicionais: 2, pedras: 2 },
  { id: 'epica', nome: 'Épica', cor: '#a970ff', chance: 5, skills: 80, sockets: 3, adicionais: 3, pedras: 3 },
  { id: 'lendaria', nome: 'Lendária', cor: '#f2b632', chance: 1, skills: 100, sockets: 5, adicionais: 4, pedras: 5 },
]

// status: 'ar' = no servidor da VPS | 'teste' = existe mas so GM / so local | 'plano' = desenhado
export const STATUS = {
  ar: { rotulo: 'No ar', cor: '#6fcf97' },
  teste: { rotulo: 'Em teste', cor: '#f2b632' },
  plano: { rotulo: 'Planejado', cor: '#8a8478' },
}

// Arsenal: tipo de arma -> doutrinas que ela pode trazer (sorteada no drop)
export const arsenal = [
  {
    id: 'lanca', arma: 'Lança', papel: 'Dano em área', doutrinas: [
      { nome: 'Lance Dreadnought', ref: 'Dreadnought', skills: ['Whirlwind', 'Wrath', 'Howl', 'Revival', 'Thrill Fight'] },
    ],
  },
  {
    id: 'duals', arma: 'Duals', papel: 'Dano e suporte de grupo', doutrinas: [
      { nome: 'Dual Imperial', ref: 'Duelist', skills: ['Sonic Buster', 'Sonic Storm', 'Triple Slash', 'Duelist Spirit'] },
      { nome: 'Dual Élfico', ref: 'Sword Muse', skills: ['Song of Hunter', 'Song of Earth', 'Song of Warding', 'Song of Champion'] },
      { nome: 'Dual Darkness', ref: 'Spectral Dancer', skills: ['Dance of Fire', 'Dance of Warrior', 'Dance of Fury', "Siren's Dance"] },
    ],
  },
  {
    id: 'espada1', arma: 'Espada de 1 mão', papel: 'Tanque', doutrinas: [
      { nome: 'Tanker Imperial', ref: 'Phoenix Knight', skills: ['Shield Stun', 'Aggression', 'Tribunal', 'Ultimate Defense', 'Touch of Life'] },
      { nome: 'Tanker Crusader', ref: 'Hell Knight', skills: ['Shield Stun', 'Aggression', 'Judgment', 'Touch of Death'] },
      { nome: 'Tanker Élfico', ref: "Eva's Templar", skills: ['Shield Stun', 'Aggression', 'Guard of Eva', 'Touch of Eva'] },
      { nome: 'Tanker Darkness', ref: 'Shillien Templar', skills: ['Shield Stun', 'Lightning Strike', 'Touch of Shillien'] },
    ],
  },
  {
    id: 'arco', arma: 'Arco', papel: 'Dano à distância', doutrinas: [
      { nome: 'Bow Imperial', ref: 'Sagittarius', skills: ['Double Shot', 'Snipe', 'Lethal Shot', 'Hamstring Shot'] },
      { nome: 'Bow Élfico', ref: 'Moonlight Sentinel', skills: ['Double Shot', 'Rapid Shot', 'Lethal Shot'] },
      { nome: 'Bow Darkness', ref: 'Ghost Sentinel', skills: ['Double Shot', 'Dead Eye', 'Fatal Counter'] },
    ],
  },
  {
    id: 'adaga', arma: 'Adaga', papel: 'Assassino', doutrinas: [
      { nome: 'Dagger Imperial', ref: 'Adventurer', skills: ['Deadly Blow', 'Backstab', 'Mirage', 'Trick', 'Bluff'] },
      { nome: 'Dagger Élfico', ref: 'Wind Rider', skills: ['Deadly Blow', 'Backstab', 'Dodge', 'Mortal Blow'] },
      { nome: 'Dagger Darkness', ref: 'Ghost Hunter', skills: ['Deadly Blow', 'Backstab', 'Shadow Step'] },
    ],
  },
  {
    id: 'espada2', arma: 'Espada de 2 mãos', papel: 'Dano bruto', doutrinas: [
      { nome: 'Sword Colosso', ref: 'Titan', skills: ['Frenzy', 'Guts', 'Earthquake', 'Lionheart', 'Demolition Impact'] },
    ],
  },
  {
    id: 'martelo2', arma: 'Martelo de 2 mãos', papel: 'Engenheiro', doutrinas: [
      { nome: 'Mace Engenheiro', ref: 'Maestro', skills: ['Golem Crash', 'Hammer Crush', 'Summon Big Boom', 'Battle Mount'] },
    ],
  },
  {
    id: 'martelo1', arma: 'Martelo de 1 mão', papel: 'Coletor', doutrinas: [
      { nome: 'Mace Coletor', ref: 'Fortune Seeker', skills: ['Spoil', 'Spoil Festival', 'Hammer Crush', 'Armor Crush'] },
    ],
  },
  {
    id: 'rod', arma: 'Clava / Rod mágico', papel: 'Cura e bênção', doutrinas: [
      { nome: 'Saints Bless', ref: 'Hierophant', skills: ['Bless the Body', 'Bless the Soul', 'Haste', 'Acumen'] },
      { nome: 'Saints Heal', ref: 'Cardinal', skills: ['Greater Battle Heal', 'Balance Life', 'Mass Resurrection', 'Cleanse'] },
      { nome: 'Saints Élfico', ref: "Eva's Saint", skills: ['Greater Group Heal', 'Wild Magic', 'Clarity'] },
      { nome: 'Saints Darkness', ref: 'Shillien Saint', skills: ['Greater Group Heal', 'Empower', 'Wild Magic'] },
    ],
  },
  {
    id: 'punhos', arma: 'Punhos', papel: 'Lutador', doutrinas: [
      { nome: 'Claw Monge', ref: 'Grand Khavatari', skills: ['Hurricane Assault', 'Force Blaster', 'Force Storm', 'Soul Breaker'] },
    ],
  },
  {
    id: 'cajado', arma: 'Cajado / Espada mágica', papel: 'Mago e invocador', doutrinas: [
      { nome: 'Mago Imperial Fire', ref: 'Archmage', skills: ['Prominence', 'Solar Flare', 'Blazing Circle', 'Volcano'] },
      { nome: 'Mago Imperial Cursed', ref: 'Soultaker', skills: ['Death Spike', 'Curse Gloom', 'Anchor', 'Corpse Burst'] },
      { nome: 'Mago Imperial Summon', ref: 'Arcana Lord', skills: ['Summon Feline King', 'Betray', 'Servitor Heal'] },
      { nome: 'Mago Élfico', ref: 'Mystic Muse', skills: ['Hydro Blast', 'Ice Dagger', 'Frost Bolt', 'Blizzard'] },
      { nome: 'Mago Élfico Summon', ref: 'Elemental Master', skills: ['Summon Seraphim', 'Betray', 'Servitor Heal'] },
      { nome: 'Mago Darkness Wind', ref: 'Storm Screamer', skills: ['Hurricane', 'Shadow Spark', 'Death Cloud', 'Demon Wind'] },
      { nome: 'Mago Darkness Summon', ref: 'Spectral Master', skills: ['Summon Spectral Lord', 'Betray', 'Servitor Heal'] },
    ],
  },
  {
    id: 'shaman', arma: 'Cajado xamã', papel: 'Xamã', doutrinas: [
      { nome: 'Shaman Lord', ref: 'Dominator', skills: ['Chant of Victory', 'Steal Essence', 'Mass Fear', 'Seal of Silence'] },
      { nome: 'Shaman Doom', ref: 'Doomcryer', skills: ['Chant of Victory', 'Chant of Blood', 'Steal Essence'] },
    ],
  },
]

// Adicionais de armadura por qualidade: [peca, normal, rara, epica, lendaria]
export const armaduras = {
  Heavy: {
    tema: 'Sobrevivência e sustentação',
    linhas: [
      ['Elmo', '+200 HP', '+7% resist. Stun', '+300 CP', '-7% crítico recebido'],
      ['Peito', '+5% P.Def', '+400 HP', '+4% redução de dano', '+8% reflect'],
      ['Luvas', '+1 CON', '+10% bloqueio de escudo', '+5 STR', '+7 CON'],
      ['Botas', '+4 velocidade', '+3% P.Def', '+8% resist. Root', '+5% vampirismo'],
    ],
  },
  Light: {
    tema: 'Mobilidade e crítico',
    linhas: [
      ['Elmo', '+3 esquiva', '+250 CP', '+5 DEX', '+7% resist. Silence/Blind'],
      ['Peito', '+4% P.Def', '+4% Atk. Speed', '+6% dano crítico', '+4% redução física'],
      ['Luvas', '+4% Atk. Speed', '+20 crítico', '+4% P.Atk', '+8% dano crítico'],
      ['Botas', '+7 velocidade', '+3 esquiva', '+10% resist. Slow', '+25 crítico'],
    ],
  },
  Robe: {
    tema: 'Poder mágico e conjuração',
    linhas: [
      ['Elmo', '+250 MP', '+5% M.Def', '+7% resist. Sleep/Fear', '+15 crítico mágico'],
      ['Peito', '+6% M.Def', '+5% M.Atk', '+5 INT', '+4% redução mágica'],
      ['Luvas', '+5% Cast Speed', '+3 precisão mágica', '+7% dano crítico mágico', '+15% resist. Cancel'],
      ['Botas', '+4 velocidade', '+5% M.Def', '+8% resist. Paralyze', '+10 WIT'],
    ],
  },
}

export const runasLendarias = [
  { nome: 'Rune of Rupture', efeito: '5% de chance ao atacar: ignora toda defesa do alvo (P.Def, M.Def, escudo) por 3 segundos.' },
  { nome: 'Rune of Parry', efeito: '5% de chance ao apanhar: bloqueia todo o dano por 3 segundos e devolve metade para quem bateu.' },
  { nome: 'Rune of Disarm', efeito: 'No PvP, 5% de chance de tirar a arma da mão do inimigo por 5 segundos. Ele não consegue reequipar.' },
  { nome: 'Rune of Flash Dash', efeito: 'Skill ativa na barra: avanço instantâneo de 600 de alcance para frente.' },
]

export const runasEpicas = [
  { nome: 'Poder Heroico', efeito: '+2 em todos os atributos de uma vez.' },
  { nome: 'Vampirismo Tático', efeito: 'Recupera em HP 5% de qualquer dano que você causa.' },
  { nome: 'Fortaleza Inquebrável', efeito: '-25% de dano sofrido com o HP abaixo de 30%.' },
  { nome: 'Fúria Berserker', efeito: '+30% de ataque com o HP abaixo de 30%.' },
]

export const atributosRuna = [
  { grupo: 'Ofensivos', itens: ['Dano PvP', 'Dano PvE', 'Dano de skill', 'Dano crítico', 'Chance de crítico', 'Crítico mágico', 'Atk. Speed', 'Cast Speed'] },
  { grupo: 'Defensivos', itens: ['P.Def', 'M.Def', 'Reflect', 'Vampirismo', 'Bloqueio de escudo', 'HP máximo', 'CP máximo'] },
  { grupo: 'Controle', itens: ['Velocidade', 'Esquiva', 'Resist. Cancel', 'Resist. Stun', 'Resist. Sleep/Fear', 'Resist. a debuffs', 'Duração de debuffs'] },
  { grupo: 'Farm', itens: ['Taxa de drop', 'Drop de adena'] },
]

export const oficios = [
  {
    id: 'mineracao', nome: 'Mineração', status: 'ar',
    resumo: 'Cristais de minério nascem espalhados pelo mundo, em 4 raridades. Quanto mais raro, mais pedras brutas ele solta.',
    pontos: ['Picareta própria, com durabilidade: cada golpe gasta', 'Normal 1 pedra · Rara 2 · Épica 3 · Lendária 5', 'Os cristais renascem sozinhos com o tempo', 'Picareta à venda no NPC de serviços'],
  },
  {
    id: 'pesca', nome: 'Pesca', status: 'ar',
    resumo: 'A pesca voltou a valer a pena: o peixe vira uma roleta, e é do monstro da pesca que sai o Catalisador de Refino.',
    pontos: ['Duplo clique no peixe abre a roleta', 'Peixe melhor, chance de prêmio melhor', 'O catalisador só cai do monstro da pesca', 'Varas com durabilidade: cada lance gasta'],
  },
  {
    id: 'refino', nome: 'Refino', status: 'ar',
    resumo: 'A pedra bruta vira Runa no NPC de serviços. O catalisador é opcional: sem ele você refina normalmente, com ele a chance de sair rara sobe.',
    pontos: ['70% runa de armadura · 30% runa de arma', 'Cada runa é um item único, com seu atributo', 'Encaixe pela janela nativa de enchant'],
    tabela: [['Sem catalisador', 79, 15, 5, 1], ['Com catalisador', 35, 40, 20, 5]],
  },
]

export const regrasInicio = [
  ['Raça é só aparência', 'Escolha o visual que quiser. Quem define o que você faz é a arma.'],
  ['Start em 3 passos', 'O tutorial explica o conceito, as raridades e te deixa escolher a primeira arma.'],
  ['Arma inicial garantida', 'Sempre Normal, e toda doutrina começa com pelo menos um ataque.'],
  ['Profissão automática', 'Sobe sozinha nos níveis 20, 40 e 76. Sem quest, sem NPC. Ela só dá atributo: as skills vêm da arma.'],
]

export const economia = [
  ['Tudo se negocia', 'Armas com doutrina, runas e pedras vão para troca, loja de rua e warehouse.'],
  ['Cada runa é única', 'Runas não se acumulam: uma Lendária de +2,5% PvP é um item próprio, com preço próprio.'],
  ['Forja do Maestro', 'Só a arma Épica ou Lendária do Maestro abre a loja de transmutação.'],
  ['Gold Bar', 'Cai do drop global e vale 50.000 adena no NPC de serviços.'],
]

// Prints reais do cliente (Cliente Interlud 300x/system/ShotNNNNN.jpg), recortados
export const prints = {
  arma: { src: '/media/sandbox/print_arma.webp', legenda: 'Arcana Mace Épica: a doutrina (Saints Heal, Cardinal) aparece no próprio tooltip.' },
  start1: { src: '/media/sandbox/print_start1.webp', legenda: 'Start, passo 1: a raça é aparência e a arma é a classe.' },
  start3: { src: '/media/sandbox/print_start3.webp', legenda: 'Start, passo 3: escolha da primeira arma.' },
  armadura: { src: '/media/sandbox/print_armadura.webp', legenda: 'Imperial Crusader Lendária: 5 sockets e os adicionais no tooltip.' },
  runa: { src: '/media/sandbox/print_runa.webp', legenda: 'Refino concluído: Runa de Armadura Normal de Vampiric Rage.' },
  refino: { src: '/media/sandbox/print_refino.webp', legenda: 'Janela de refino: pedra bruta e catalisador.' },
  // cristais e picareta: aguardando prints novos (os antigos tinham a textura velha e a pose bugada)
}

export const roadmap = [
  { nome: 'Arma define a classe (31 doutrinas)', status: 'ar' },
  { nome: 'Drop de arma com doutrina e raridade', status: 'ar' },
  { nome: 'Adicionais de armadura por raridade', status: 'ar' },
  { nome: 'Runas de armadura e de arma + sockets', status: 'ar' },
  { nome: 'Mineração v2 (4 raridades de cristal)', status: 'ar' },
  { nome: 'Pesca, catalisador e refino', status: 'ar' },
  { nome: 'Profissão automática e trava de classe', status: 'ar' },
  { nome: 'Feixe de luz nos drops raros', status: 'teste' },
  { nome: 'Picareta só minera (trava de combate)', status: 'teste' },
  { nome: 'Cristais de minério com modelo 3D próprio', status: 'teste' },
  { nome: 'Extração de runas (remover socket)', status: 'plano' },
  { nome: 'Armaduras e skins feitas por IA', status: 'plano' },
]
