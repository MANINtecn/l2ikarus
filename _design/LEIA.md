# Design da home da rede

`home_v2_aprovada.py` é o **gerador do protótipo** aprovado em 2026-09-03 (direção
"Portais"). Ele existe como registro das decisões: posições travadas dos cards,
bordas pulsantes por servidor, selo SEM P2W no vão central.

**O código que roda em produção é o React**, em `src/assets/components/HeroRede.{jsx,css}`.
Mexer lá, não aqui. Este gerador serve só de referência histórica.

Os `.html` gerados e os assets em base64 ficam fora do repo (pesam ~1,4 MB e o
resultado já está no React). Para regerar o protótipo, os assets estão em
`public/media/`.
