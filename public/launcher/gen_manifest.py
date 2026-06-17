"""
Gera o manifest.json a partir dos arquivos REAIS que estao no Firebase Storage
(que sao copia da pasta local do cliente). Assim os hashes batem 100%.

Uso:
  python gen_manifest.py

Le a pasta CLIENT_DIR, calcula MD5+tamanho de cada arquivo, e escreve manifest.json
com URLs apontando pro Firebase.
"""

import hashlib
import json
import os
import urllib.parse
import datetime

CLIENT_DIR = r"C:\TECX SOFTHOUSE\L2 IKARUS INTERCROW\Cliente Samurai\L2 Samurai Crow"
BUCKET     = "papaleguastoc.firebasestorage.app"
PREFIX     = "l2ikarus/L2 Samurai Crow"   # caminho no Firebase
BASE_URL   = f"https://firebasestorage.googleapis.com/v0/b/{BUCKET}/o/"

def md5(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def firebase_url(rel_path):
    full = f"{PREFIX}/{rel_path}".replace("\\", "/")
    return BASE_URL + urllib.parse.quote(full, safe="") + "?alt=media"

files = []
count = 0
for root, _, names in os.walk(CLIENT_DIR):
    for name in names:
        full = os.path.join(root, name)
        rel = os.path.relpath(full, CLIENT_DIR).replace("\\", "/")
        files.append({
            "path": rel,
            "hash": md5(full),
            "size": os.path.getsize(full),
            "url": firebase_url(rel),
        })
        count += 1
        if count % 500 == 0:
            print(f"  {count} arquivos processados...")

manifest = {
    "version": datetime.datetime.now().strftime("%Y.%m.%d.%H%M"),
    "files": files,
}

with open("manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, separators=(",", ":"))

print(f"Pronto! {len(files)} arquivos no manifest.")
print("Exemplo:", files[0]["url"])
