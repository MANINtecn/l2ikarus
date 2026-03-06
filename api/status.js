export default function handler(req, res) {
  res.status(200).json({
    online: true,
    players: 0,
    message: "API de Status inicializada. Aguardando conexão com o DB.",
  });
}
