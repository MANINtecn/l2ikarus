export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(200).json({ message: "API de Registro pronta. Aguardando banco de dados." });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}
