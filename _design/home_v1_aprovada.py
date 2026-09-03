import os
D = os.path.dirname(os.path.abspath(__file__))
b = {k: open(os.path.join(D, f"_{k}.b64")).read().strip() for k in ("bg", "vid")}

HTML = r"""<title>Portais IS Servers</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Sora:wght@200;300;400;600;800&display=swap">
<style>
:root{
  --art-h:clamp(150px,25vh,208px);   /* altura da faixa reservada pra arte no topo */
  --void:#08070a; --void-2:#0d0b10; --card:#100d13; --edge:#221d17;
  --gold:#d9a441; --gold-dim:#8a6d2f; --gold-glow:rgba(217,164,65,.16);
  --ink:#f4eee2; --ink-2:#9b9484; --ink-3:#6b6558;
  --inter:#5b93c7; --pvp:#d1583c; --mu:#31b6a8;
  --shell:1220px;
  /* TROCAR AQUI pela arte definitiva: url('/hero.webp') */
  --hero-img:url("data:image/webp;base64,__BG__");
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
html{background:var(--void)}
body{margin:0;background:transparent;color:var(--ink);
     font:300 16px/1.65 'Sora',system-ui,-apple-system,sans-serif;overflow-x:hidden}
.shell{max-width:var(--shell);margin:0 auto;padding:0 clamp(18px,4vw,40px)}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:3px}

/* ── nav ── */
.nav{position:sticky;top:0;z-index:50;
     background:transparent;border-bottom:1px solid transparent;
     transition:background .3s ease,border-color .3s ease,backdrop-filter .3s ease}
/* .rolou e' posto por JS assim que a pagina desce */
.nav.rolou{background:rgba(8,7,10,.88);backdrop-filter:blur(14px);border-bottom-color:#16130f}
/* no topo, sobre a cena clara, o texto precisa de sombra pra ler */
.nav:not(.rolou) .brand,.nav:not(.rolou) .links a{text-shadow:0 2px 12px rgba(0,0,0,.9)}

.nav .shell{display:flex;align-items:center;justify-content:space-between;height:58px;gap:20px}
.brand{font:900 15px/1 'Cinzel Decorative',Georgia,serif;letter-spacing:.16em;color:var(--gold);white-space:nowrap}
.links{display:flex;gap:26px;font-size:13px;color:var(--ink-2)}
.links a{transition:color .18s} .links a:hover{color:var(--ink)}
.entrar{font:700 11px/1 'Sora',sans-serif;letter-spacing:.16em;text-transform:uppercase;
        border:1px solid var(--gold-dim);padding:12px 22px;border-radius:5px;
        color:#1a1206;background:linear-gradient(180deg,#e8bd5f,#c8942f);
        box-shadow:0 2px 14px rgba(217,164,65,.28);
        transition:transform .18s,box-shadow .25s,filter .2s;white-space:nowrap}
.entrar:hover{transform:translateY(-1px);filter:brightness(1.08);
        box-shadow:0 4px 22px rgba(217,164,65,.45)}
.entrar:active{transform:translateY(0)}
@media(max-width:880px){
  /* o menu nao some: desce pra uma linha propria, rolavel na horizontal */
  .nav .shell{height:auto;flex-wrap:wrap;padding-top:10px;padding-bottom:10px;gap:10px}
  .links{order:3;width:100%;gap:18px;overflow-x:auto;padding-bottom:2px;
         font-size:12.5px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
  .links::-webkit-scrollbar{display:none}
  .links a{white-space:nowrap}
  .brand{font-size:13.5px}
  .entrar{padding:9px 14px;font-size:10.5px}
}

/* ── herói ── */
.hero{position:relative;text-align:center;
  padding:clamp(290px,52vh,620px) 0 0;
  overflow:hidden}
/* ── ARTE DE FUNDO DA PAGINA (atras do heroi E dos cards) ─────────
   Trocar --hero-img no :root pela arte definitiva. Fica fixa, cobrindo
   toda a primeira tela; .pagina-veu e' o que garante a leitura por cima. */
.pagina-bg{position:fixed;inset:0;z-index:-2;pointer-events:none;
  background-image:var(--hero-img,none);
  background-size:cover;background-repeat:no-repeat;background-position:center top;
  opacity:.9;filter:saturate(1.04)}
/* video de fundo — entra por cima da imagem, que fica de fallback */
.pagina-vid{position:fixed;inset:0;z-index:-2;pointer-events:none;
  width:100%;height:100%;object-fit:cover;object-position:center top;
  opacity:.9;filter:saturate(1.04)}
/* quem pede menos movimento fica so' com a imagem */
@media (prefers-reduced-motion:reduce){.pagina-vid{display:none}}
.pagina-veu{position:fixed;inset:0;z-index:-1;pointer-events:none;
  background:
    linear-gradient(180deg,rgba(8,7,10,.08) 0%,rgba(8,7,10,.06) 34%,
                    rgba(8,7,10,.26) 62%,rgba(8,7,10,.52) 84%,rgba(8,7,10,.86) 100%)}
.hero::before{content:"";position:absolute;top:-30%;left:50%;transform:translateX(-50%);
  width:min(1000px,140%);aspect-ratio:1;pointer-events:none;z-index:2;
  background:radial-gradient(circle,var(--gold-glow),transparent 62%)}
.hero > .shell{position:relative;z-index:3}
.eyebrow{font:600 10px/1 'Sora',sans-serif;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:22px}
.hero h1{font:900 clamp(24px,min(4.6vw,5.6vh),46px)/1.08 'Cinzel Decorative',Georgia,serif;
         margin:0 0 clamp(8px,1.4vh,14px);text-wrap:balance;letter-spacing:-.005em;
         text-shadow:0 2px 28px rgba(0,0,0,.75)}
.hero h1 em{font-style:normal;color:var(--gold);display:block}
.uma-conta{display:inline-flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px;
  margin-top:clamp(12px,2.2vh,22px)}
.dot-sep{width:3px;height:3px;border-radius:50%;background:var(--gold-dim)}
@media(max-width:560px){.dot-sep{display:none}}
.uc{font:300 12.5px/1 'Sora',sans-serif;color:#d8d2c6;letter-spacing:.01em;
    text-shadow:0 1px 10px rgba(0,0,0,.9)}
.uc b{color:var(--gold);font-weight:600}
/* ── SLOT DO SELO ────────────────────────────────────────────────
   A arte definitiva entra em .selo-arte como background-image
   (PNG/WEBP com fundo TRANSPARENTE, 256x256 ou 512x512, quadrado).
   Enquanto ela nao existe, o losango abaixo segura o lugar.
   O texto fica FORA da arte — assim a imagem nao precisa conter
   letra nenhuma e continua legivel em qualquer tamanho.        */
.selo-slot{display:inline-flex;align-items:center;gap:9px;
  border:1px solid #35563f;background:rgba(10,20,14,.72);backdrop-filter:blur(6px);
  padding:6px 14px 6px 8px;border-radius:100px}
.selo-arte{width:26px;height:26px;flex:none;background-size:contain;
  background-repeat:no-repeat;background-position:center;
  /* PLACEHOLDER — trocar por: background-image:url('/selo-sem-p2w.webp'); */
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2.6 21.4 12 12 21.4 2.6 12z' fill='none' stroke='%236fcf97' stroke-width='1.4'/><path d='M8.4 12.3l2.5 2.5 4.8-5.2' fill='none' stroke='%236fcf97' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/></svg>")}
.selo-txt{display:flex;align-items:baseline;gap:7px;line-height:1}
.selo-txt b{font:600 11.5px/1 'Sora',sans-serif;letter-spacing:.1em;color:#6fcf97}
.selo-txt i{font:300 11.5px/1 'Sora',sans-serif;font-style:normal;color:#8fae9c}
@media(max-width:560px){.selo-txt i{display:none}}

.rodape-rede{text-align:center;margin-top:clamp(24px,4vh,44px)}
.rodape-rede p{font-size:clamp(13px,1.5vw,15.5px);color:#cfc9bc;max-width:none;
  margin:0 auto;font-weight:200;line-height:1.55;text-shadow:0 2px 14px rgba(0,0,0,.8)}
.rodape-rede .uma-conta{margin-top:0}
@media(max-width:620px){.rodape-rede p{font-size:13px;max-width:40ch}}

.rule{height:1px;margin:clamp(18px,3vw,28px) 0 clamp(18px,3vw,26px);
      background:linear-gradient(90deg,transparent,#332c1f 15%,#332c1f 85%,transparent)}

/* ── portais ── */
.portais{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(10px,1.4vw,16px);align-items:stretch}
@media(max-width:1080px){.portais{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.portais{grid-template-columns:1fr}}

.p{position:relative;display:flex;flex-direction:column;
   background:transparent;
   border:0;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);
   padding:20px 16px 16px;overflow:hidden;
   transition:transform .3s cubic-bezier(.2,.7,.3,1),border-color .3s,box-shadow .3s}
.p::before{content:"";position:absolute;inset:0;z-index:0;border-radius:inherit;opacity:0;
  transition:opacity .3s}
.p-inter::before{background:radial-gradient(115% 62% at 50% 0,#16324f,transparent 68%)}
.p-pvp::before  {background:radial-gradient(115% 62% at 50% 0,#4a1d15,transparent 68%)}
.p-mu::before   {background:radial-gradient(115% 62% at 50% 0,#0d3b38,transparent 68%)}
.p-ess::before  {background:radial-gradient(115% 62% at 50% 0,#241f2e,transparent 68%)}

/* ── borda de brasa ───────────────────────────────────────────────
   A moldura inteira respira: acende e apaga devagar, como carvao vivo.
   Nada gira. Cada card tem UMA cor (do brasa ao claro, mesma familia).
   O brilho externo pulsa junto, um pouco defasado, pro calor parecer
   vir de dentro da borda e nao de uma luz uniforme.               */
.moldura{position:absolute;inset:0;border-radius:inherit;z-index:1;
  pointer-events:none;padding:3px;
  background:linear-gradient(150deg,var(--brasa),var(--chama) 45%,var(--claro) 52%,var(--chama) 60%,var(--brasa));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  mask-composite:exclude;
  animation:brasa 3.6s ease-in-out infinite;
  transition:filter .35s}
@keyframes brasa{
  0%,100%{opacity:.40;filter:drop-shadow(0 0 4px var(--brasa)) saturate(.85)}
  50%    {opacity:1;  filter:drop-shadow(0 0 16px var(--chama)) saturate(1.2)}
}
/* cada card respira no seu tempo — senao os 4 piscam juntos, vira pisca-pisca */
.p-inter .moldura{animation-duration:4.2s}
.p-pvp   .moldura{animation-duration:3.1s;animation-delay:-1.2s}
.p-mu    .moldura{animation-duration:4.8s;animation-delay:-2.4s}
.p-ess   .moldura{animation-duration:6.5s;animation-delay:-.6s;opacity:.55}

/* veu base — TEM que vir ANTES dos overrides .p-mu/.p-pvp .veu */
.veu{position:absolute;inset:0;z-index:1;border-radius:inherit;
     background:none}
.p-inter{--brasa:#6b4a12;--chama:#c9922b;--claro:#ffdf9b;
         --brilho:rgba(201,146,43,.45);--brilho-forte:rgba(201,146,43,.7)}   /* dourado */
.p-pvp  {--brasa:#7a1f08;--chama:#e0561f;--claro:#ffc182;
         --brilho:rgba(224,86,31,.45);--brilho-forte:rgba(224,86,31,.7)}   /* fogo */
.p-mu   {--brasa:#0d4a2c;--chama:#2f9e5f;--claro:#9df0bd;
         --brilho:rgba(47,158,95,.45);--brilho-forte:rgba(47,158,95,.7)}   /* verde */
.p-ess  {--brasa:#3a2a12;--chama:#7a6234;--claro:#c9ab72;
         --brilho:rgba(122,98,52,.4);--brilho-forte:rgba(122,98,52,.6)}   /* brasa fria */
.p-ess .moldura{opacity:.7}
/* no hover a brasa acende de vez e para de respirar */
.p:hover .moldura{animation:none;opacity:1;
  filter:drop-shadow(0 0 22px var(--chama)) saturate(1.25)}

@media (prefers-reduced-motion:reduce){.moldura{animation:none;opacity:.75}}

.p:hover{transform:translateY(-5px);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.09),0 22px 50px rgba(0,0,0,.5)}
/* o 300x usa a arte do launcher — retangular, ja' com fundo. Vai um pouco maior e
   sem drop-shadow, porque as bordas dela ja' foram esmaecidas pra fundir no card. */
/* mesma altura dos vizinhos: o padding-top continua igual, a arte e' que passa por tras */
/* veu leve por cima da arte inteira — so' o bastante pro texto ter contraste */
/* texto com sombra propria: assim ele le por cima do brasao sem precisar apagar a arte */
"
.p:hover::before{opacity:.28}

/* véu que garante leitura do texto sobre a arte */

.plataforma{position:absolute;top:10px;right:10px;z-index:3;font:600 8px/1 'Sora',sans-serif;
  letter-spacing:.12em;text-transform:uppercase;color:#e2ddd3;
  background:rgba(8,7,10,.78);border:1px solid #251f18;padding:5px 8px;border-radius:100px}
.p-mu .plataforma{color:var(--mu);border-color:#17423e}

.pn{font:900 clamp(15px,1.6vw,18px)/1.16 'Cinzel Decorative',Georgia,serif;margin:0 0 7px;color:#fff;
    text-align:center;text-shadow:0 2px 14px rgba(0,0,0,.95);
}
.pt{font-size:11.5px;line-height:1.5;color:#e8e3d9;font-weight:300;text-align:center;
    text-shadow:0 1px 10px rgba(0,0,0,.9);

    margin:0 0 clamp(8px,1.4vh,12px);min-height:33px}
.taxas{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;padding-top:clamp(8px,1.3vh,11px);
  border-top:1px solid rgba(255,255,255,.13);margin-bottom:clamp(9px,1.5vh,13px)}
.t{font:400 9.5px/1 'Sora',sans-serif;color:#ded8cd;background:rgba(8,7,10,.55);
   backdrop-filter:blur(4px);
   border:1px solid #1e1a14;padding:5px 7px;border-radius:3px;font-variant-numeric:tabular-nums}
.t b{font-weight:600}
.p-inter .t b{color:var(--inter)} .p-pvp .t b{color:var(--pvp)} .p-mu .t b{color:var(--mu)}

.pb{display:block;text-align:center;font:600 9.5px/1 'Sora',sans-serif;letter-spacing:.14em;
    text-transform:uppercase;padding:12px 10px;border-radius:5px;border:1px solid #453a26;
    background:rgba(6,5,8,.78);backdrop-filter:blur(6px);color:var(--ink);
    box-shadow:0 2px 12px rgba(0,0,0,.5);transition:background .22s,border-color .22s,color .22s}
.p-inter .pb:hover{background:rgba(91,147,199,.13);border-color:var(--inter);color:#cfe4f7}
.p-pvp  .pb:hover{background:rgba(209,88,60,.13);border-color:var(--pvp);color:#f7d8cf}
.p-mu   .pb:hover{background:rgba(49,182,168,.13);border-color:var(--mu);color:#cff2ee}

/* Essence em espera */

  
.p-ess .pb{cursor:default}

/* todos os cards com a mesma altura: o botao encosta no rodape em qualquer um */
.corpo{display:flex;flex-direction:column;flex:1;position:relative;z-index:2}
.pb{margin-top:auto}
/* ABERTO — chama de verdade: fundo solido na cor do card, texto escuro, brilho */
.pb-on{font-weight:800;letter-spacing:.18em;color:#1a1206;border:0;
  background:linear-gradient(180deg,var(--claro),var(--chama));
  box-shadow:0 3px 16px var(--brilho),inset 0 1px 0 rgba(255,255,255,.35);
  transition:transform .18s,box-shadow .25s,filter .2s}
.pb-on:hover{transform:translateY(-2px);filter:brightness(1.1);
  box-shadow:0 6px 26px var(--brilho-forte),inset 0 1px 0 rgba(255,255,255,.4)}
.pb-on:active{transform:translateY(0)}
/* FECHADO — informa, nao convida: neutro e sem brilho */
.pb-off{color:#b6afa2;border-color:#3a3328;background:rgba(6,5,8,.72);
  box-shadow:none;cursor:default}

/* ── rodapé da amostra ── */
.nota{position:relative;background:var(--void);z-index:2;margin:clamp(40px,6vw,72px) 0 0;padding:26px 0 clamp(60px,9vw,90px);border-top:1px solid #16130f}
.nota h2{font:800 15px/1.3 'Sora',sans-serif;margin:0 0 12px;color:var(--ink)}
.nota p{font-size:14px;color:var(--ink-2);max-width:70ch;margin:0 0 10px;font-weight:200}
.nota b{color:var(--ink);font-weight:600}
/* telas baixas: so' um alivio leve — o heroi continua alto o bastante pra
   a cena do fundo aparecer, que e' o ponto do layout. */
@media(max-height:800px) and (min-width:1080px){
  .hero{padding:clamp(250px,44vh,480px) 0 0}
  }
/* ── celular ─────────────────────────────────────────────────── */
@media(max-width:620px){
  .hero{padding:clamp(120px,30vh,220px) 0 0}
    .uma-conta{flex-direction:column;gap:10px}
  .selo-slot{padding:7px 14px}
  .p{padding:18px 14px 14px}
  .pn{font-size:16px}
  .pt{font-size:12px}
  .nota{padding-bottom:44px}
  .nota p{font-size:13px}
}
/* tablet em pe: 2 colunas com respiro maior */
@media(min-width:621px) and (max-width:1080px){
  .hero{padding:clamp(160px,32vh,300px) 0 0}
  .portais{gap:14px}
}
/* telas MUITO largas: nao deixa os cards esticarem demais */
@media(min-width:1500px){ :root{--shell:1340px} }
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
<script>
  // Marca a nav quando a pagina sai do topo. IntersectionObserver em vez de
  // listener de scroll: o navegador avisa so' na troca de estado.
  document.addEventListener('DOMContentLoaded', function(){
    var nav = document.querySelector('.nav');
    var alvo = document.createElement('div');
    alvo.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none';
    document.body.prepend(alvo);
    new IntersectionObserver(function(e){
      nav.classList.toggle('rolou', !e[0].isIntersecting);
    }, {threshold: 0}).observe(alvo);
  });
</script>

<nav class="nav"><div class="shell">
  <span class="brand">IS SERVERS</span>
  <div class="links">
    <a href="#">Servidores</a><a href="#">Conta</a><a href="#">Ranking</a><a href="#">Discord</a>
  </div>
  <a href="#" class="entrar">Entrar</a>
</div></nav>

<div class="pagina-bg"></div>
<video class="pagina-vid" autoplay muted loop playsinline
       aria-hidden="true" tabindex="-1"
       src="data:video/mp4;base64,__VID__"></video>
<div class="pagina-veu"></div>

<header class="hero"></header>

<div class="shell">

  <div class="portais">

    <a href="#" class="p p-inter">
      <span class="moldura"></span>
      <span class="veu"></span>
      <span class="plataforma">PC</span>
      <div class="corpo">
        <h2 class="pn">Interlude 30x</h2>
        <p class="pt">Cada classe faz o que promete. Nada de build quebrada — aqui sua classe funciona.</p>
        <div class="taxas">
          <span class="t">XP <b>30x</b></span><span class="t">SP <b>30x</b></span>
          <span class="t">Drop <b>10x</b></span><span class="t">Spoil <b>15x</b></span>
        </div>
        <span class="pb pb-on">Jogar agora</span>
      </div>
    </a>

    <a href="#" class="p p-pvp">
      <span class="moldura"></span>
      <span class="veu"></span>
      <span class="plataforma">PC</span>
      <div class="corpo">
        <h2 class="pn">Interlude PVP 300x</h2>
        <p class="pt">Quanto mais você farma, mais forte fica no PvP. Progressão sem fim.</p>
        <div class="taxas">
          <span class="t">XP <b>300x</b></span><span class="t">SP <b>300x</b></span>
          <span class="t">Adena <b>300x</b></span><span class="t">Sub <b>livre</b></span>
        </div>
        <span class="pb pb-on">Jogar agora</span>
      </div>
    </a>

    <a href="#" class="p p-mu">
      <span class="moldura"></span>
      <span class="veu"></span>
      <span class="plataforma">PC e celular</span>
      <div class="corpo">
        <h2 class="pn">Mu Online</h2>
        <p class="pt">Comece no PC, continue no celular. Mesmo personagem, mesmo mundo, sem perder nada.</p>
        <div class="taxas">
          <span class="t">PC <b>+</b> Android</span><span class="t">Progresso <b>sincronizado</b></span>
          <span class="t">Season <b>clássica</b></span>
        </div>
        <span class="pb pb-off">Beta fechado</span>
      </div>
    </a>

    <div class="p p-ess">
      <span class="moldura"></span>
      <span class="veu"></span>
      <span class="plataforma">PC</span>
      <div class="corpo">
        <h2 class="pn">Essence</h2>
        <p class="pt">Em preparação. Sua conta já vale aqui quando ele abrir.</p>
        <span class="pb pb-off">Beta fechado</span>
      </div>
    </div>

  </div>

  <div class="rodape-rede">
    <div class="uma-conta">
      <span class="uc"><b>1 conta</b>, vários mundos</span>
      <span class="dot-sep"></span>
      <span class="uc">sem venda de vantagens</span>
      <span class="dot-sep"></span>
      <span class="selo-slot" title="lugar reservado para a arte do selo">
        <span class="selo-arte" aria-hidden="true"></span>
        <span class="selo-txt"><b>SEM P2W</b><i>nenhum item à venda</i></span>
      </span>
    </div>
  </div>

  <div class="nota">
    <h2>Sobre esta amostra</h2>
    <p>Direção <b>Portais</b> com a arte que já existe no site. Os personagens são recortes com fundo transparente — por isso <b>saem da moldura</b> em vez de virar imagem de fundo, e cada card ganha um clima de luz próprio. O véu escuro sob o texto garante leitura seja qual for a arte que entrar depois.</p>
    <p>Os quatro cards seguem o mesmo tratamento: a arte atravessa o card e continua visível <b>por trás do texto</b>, que carrega sombra própria em vez de exigir um véu pesado. No 300x a arte do launcher entra como fundo (é retangular); nos outros três os personagens são recortes transparentes, agora maiores e com a base aparecendo.</p>
    <p>Os botões estão como <b>Beta fechado</b> — trocar para “Entrar no mundo” quando abrir. Pendência: as <b>taxas reais do Mu</b> e confirmar se o progresso é mesmo sincronizado entre PC e celular, já que o card promete isso.</p>
    <p>A <b>primeira tela</b> vai do topo até os botões “entrar no mundo”. Para caber em qualquer janela, o herói e os cards respondem também à <b>altura</b> da tela, não só à largura: título, respiros e a altura dos personagens encolhem juntos em notebook baixo. Em telas médias os cards viram 2 colunas; no celular, uma — aí a página rola, como é natural no telefone.</p>
    <p><b>Sem P2W</b> é o diferencial da rede num mercado onde quase todo servidor vende item, então ganhou a única cor fora da paleta dourada. O <b>Ikoin saiu da navegação</b>: continua existindo para o Premium, mas fora da barra ninguém chega no site achando que há loja de vantagem — o lugar dele é dentro da conta do jogador.</p>
    <h2 style="margin-top:26px">Para a imagem de fundo</h2>
    <p>A arte agora é <b>fundo de toda a primeira tela</b>, não só do herói: ela passa atrás dos cards, que ficaram translúcidos com um leve desfoque para o texto continuar legível. Usei a faixa central da imagem — os dois guerreiros e os exércitos — deixando de fora o logo do topo e o slogan do pé, que a página já traz como texto.</p>
    <h2 style="margin-top:26px">Para a arte do selo</h2>
    <p>O losango verde ao lado de “SEM P2W” é <b>provisório</b> — está segurando o lugar da sua arte. Quando ela existir, é só trocar o <code>background-image</code> da classe <code>.selo-arte</code>. Especificação:</p>
    <p>· <b>Quadrada</b>, 256×256 ou 512×512 · <b>fundo transparente</b> (PNG ou WEBP)<br>
       · precisa ler bem a <b>26 px</b> — silhueta clara, pouco detalhe fino<br>
       · <b>sem texto dentro da imagem</b>: “SEM P2W” já é texto na página, então continua nítido em qualquer tela e funciona para leitores de tela<br>
       · o verde da página é <code>#6fcf97</code>, mas a arte pode ter cor própria</p>
    <p>Se preferir um selo maior e mais ilustrado, dá para promovê-lo a peça do herói — aí ele vira um círculo de 90–120 px ao lado do título, e o texto pode entrar na própria arte. É só dizer.</p>
  </div>
</div>
"""

HTML = HTML.replace("__BG__", b["bg"]).replace("__VID__", b["vid"])
open(os.path.join(D, "home-portais.html"), "w", encoding="utf-8").write(HTML)
print("gerado:", len(HTML) // 1024, "KB")
