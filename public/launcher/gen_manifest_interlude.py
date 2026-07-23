"""
Gera o manifest-interlude.json (atualizacao incremental do cliente Interlude).

COMO FUNCIONA
  O launcher le esse manifest, calcula o MD5 dos arquivos que estao no PC do
  jogador e baixa SO os que diferem ou nao existem. A instalacao nova continua
  vindo do Interlud.rar (bloco "drivePackages", preservado deste arquivo).

FLUXO DE USO
  1) Subir a pasta do cliente pro Drive (uma vez; depois so o que mudou):
       rclone sync "C:\\TECX SOFTHOUSE\\L2 IKARUS INTERCROW\\L2 INTERLUDE ACIS\\Cliente l2interlud\\Interlud" gdrive:l2ikarus/Interlud --progress

  2) Listar os fileIds:
       rclone lsjson gdrive:l2ikarus/Interlud -R --files-only > drive_listing.json

  3) Gerar o manifest:
       python gen_manifest_interlude.py

  4) Publicar o manifest-interlude.json no site.

REGRA DE OURO
  O manifest tem que sair do MESMO cliente que virou o Interlud.rar. Se o RAR
  for de uma versao e o manifest de outra, o jogador instala e o launcher acha
  que TUDO esta diferente -> baixa o cliente inteiro arquivo por arquivo pelo
  Drive -> bloqueio de cota de 24h.
"""

import hashlib
import json
import os
import datetime

# ---------------------------------------------------------------------------
CLIENT_DIR = r"C:\TECX SOFTHOUSE\L2 IKARUS INTERCROW\L2 INTERLUDE ACIS\Cliente l2interlud\Interlud"

# Prefixo dos caminhos no manifest. O launcher instala em "L2 Ikarus Interlude"
# e roda "Interlud\system\l2.exe" — entao os caminhos comecam com "Interlud/".
PATH_PREFIX = "Interlud"

# Saida do "rclone lsjson ... -R --files-only"
DRIVE_LISTING = "drive_listing.json"

# Manifest existente (de onde herdamos o bloco drivePackages).
MANIFEST_OUT = "manifest-interlude.json"

# Acima disso o Drive responde com a pagina "nao verificamos virus" em vez do
# arquivo — o launcher salvaria HTML no lugar do binario e corromperia a
# instalacao. Esses ficam de fora e sao avisados no relatorio.
DRIVE_INLINE_LIMIT = 95 * 1024 * 1024

# ---------------------------------------------------------------------------
# Nada disso vai pro jogador.
SKIP_DIRS = {
    "Screenshot",              # prints do jogador
    "SystemBKauto+slotbuffs",  # backup nosso da system
    "systemoriginalinterludBACKUP",
    "Logs",
}

SKIP_DIR_PREFIXES = ("system_BACKUP", "BACKUP")

# Config PESSOAL: se entrar no manifest, o launcher sobrescreve os ajustes de
# tecla/grafico do jogador a cada atualizacao.
SKIP_FILES = {
    "user.ini", "option.ini", "windowsinfo.ini", "running.ini",
    "autouse.ini", "l2.log", "chatlog.txt",
}

SKIP_EXTS = (".bak", ".bak2", ".new", ".log", ".tmp")

SKIP_SUBSTRINGS = ("bak_retail", "backup_orig", "bak_pre_")


def deve_pular_dir(nome):
    if nome in SKIP_DIRS:
        return True
    return any(nome.upper().startswith(p.upper()) for p in SKIP_DIR_PREFIXES)


def deve_pular_arquivo(nome):
    baixo = nome.lower()
    if baixo in SKIP_FILES:
        return True
    if baixo.endswith(SKIP_EXTS):
        return True
    return any(s in baixo for s in SKIP_SUBSTRINGS)


def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def drive_url(file_id):
    return f"https://drive.google.com/uc?export=download&id={file_id}"


# --- fileIds vindos do rclone ----------------------------------------------
if not os.path.exists(DRIVE_LISTING):
    raise SystemExit(
        f"ERRO: '{DRIVE_LISTING}' nao encontrado.\n"
        "Rode antes:\n"
        "  rclone lsjson gdrive:l2ikarus/Interlud -R --files-only > drive_listing.json"
    )

# O ">" do PowerShell salva em UTF-16; o rclone/utf-8 salva sem isso. Detecta
# pelo BOM e decodifica no encoding certo, pra nao depender de como foi gerado.
with open(DRIVE_LISTING, "rb") as f:
    raw = f.read()

if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
    texto = raw.decode("utf-16")
elif raw[:3] == b"\xef\xbb\xbf":
    texto = raw.decode("utf-8-sig")
else:
    texto = raw.decode("utf-8")

listagem = json.loads(texto)

# rclone devolve "Path" relativo com barra normal; casamos por esse caminho.
ids_por_caminho = {item["Path"].replace("\\", "/"): item["ID"] for item in listagem}
print(f"Drive: {len(ids_por_caminho)} arquivos na listagem.\n")

# --- varredura do cliente local --------------------------------------------
files = []
sem_id = []
grandes = []
total_bytes = 0

for root, dirs, names in os.walk(CLIENT_DIR):
    dirs[:] = [d for d in dirs if not deve_pular_dir(d)]

    for name in names:
        if deve_pular_arquivo(name):
            continue

        full = os.path.join(root, name)
        rel = os.path.relpath(full, CLIENT_DIR).replace("\\", "/")
        size = os.path.getsize(full)

        if size > DRIVE_INLINE_LIMIT:
            grandes.append((rel, size))
            continue

        file_id = ids_por_caminho.get(rel)
        if not file_id:
            sem_id.append(rel)
            continue

        files.append({
            "path": f"{PATH_PREFIX}/{rel}",
            "hash": md5(full),
            "size": size,
            "url": drive_url(file_id),
        })
        total_bytes += size

        if len(files) % 500 == 0:
            print(f"  {len(files)} arquivos processados...")

# --- monta o manifest preservando o drivePackages --------------------------
drive_packages = []
if os.path.exists(MANIFEST_OUT):
    with open(MANIFEST_OUT, encoding="utf-8") as f:
        drive_packages = json.load(f).get("drivePackages", [])

manifest = {
    "version": datetime.datetime.now().strftime("%Y.%m.%d.%H%M"),
    "drivePackages": drive_packages,
    "files": files,
}

with open(MANIFEST_OUT, "w", encoding="utf-8") as f:
    json.dump(manifest, f, separators=(",", ":"))

# --- relatorio --------------------------------------------------------------
print("\n" + "=" * 70)
print(f"manifest-interlude.json gerado — versao {manifest['version']}")
print(f"  {len(files)} arquivos  ({total_bytes / (1024**3):.2f} GB)")
print(f"  drivePackages preservados: {len(drive_packages)}")

if grandes:
    print(f"\nFORA DO MANIFEST — grandes demais pro Drive servir direto ({len(grandes)}):")
    for rel, size in sorted(grandes, key=lambda x: -x[1]):
        print(f"  {size / (1024**2):8.1f} MB  {rel}")
    print("  -> esses so chegam no jogador pelo Interlud.rar da instalacao.")

if sem_id:
    print(f"\nSEM fileId NO DRIVE ({len(sem_id)}) — faltou subir ou o rclone nao listou:")
    for rel in sem_id[:40]:
        print(f"  {rel}")
    if len(sem_id) > 40:
        print(f"  ... e mais {len(sem_id) - 40}")
    print("  -> rode o rclone sync de novo e regenere.")
