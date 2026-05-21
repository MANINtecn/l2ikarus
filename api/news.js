const NEWS = [
  {
    title: "Servidor L2 Ikarus aberto!",
    body: "Bem-vindos ao L2 Ikarus. Taxa de XP: 50x, Adena: 30x. Crie sua conta no site e comece agora!",
    date: "21/05/2026",
    tag: "EVENTO",
  },
  {
    title: "Sistema de clãs ativo",
    body: "Guerras de castelo acontecem toda semana. Forme seu clã e domine Aden.",
    date: "21/05/2026",
    tag: "NEWS",
  },
];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(NEWS);
}
