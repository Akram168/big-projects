#!/usr/bin/env python3
"""
Encrypted notes CLI: notes are stored at rest encrypted with a key
derived from a passphrase (PBKDF2-HMAC-SHA256 -> Fernet/AES-128-CBC+HMAC).
Uses the `cryptography` library -- vetted, audited crypto, not
hand-rolled (see the cipher-toolkit project for why that matters).

Usage:
  python notes.py add "note text"                 (prompts for passphrase)
  python notes.py list
  python notes.py show <id>
  python notes.py delete <id>
"""

import argparse
import base64
import getpass
import json
import os
import sys
from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

STORE_FILE = Path(__file__).parent / "notes.enc.json"
SALT_FILE = Path(__file__).parent / "salt.bin"
PBKDF2_ITERATIONS = 480_000  # OWASP-recommended minimum as of 2023 for PBKDF2-HMAC-SHA256


def get_or_create_salt():
    if SALT_FILE.exists():
        return SALT_FILE.read_bytes()
    salt = os.urandom(16)
    SALT_FILE.write_bytes(salt)
    return salt


def derive_key(passphrase, salt):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=PBKDF2_ITERATIONS,
    )
    return base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))


def load_store():
    if STORE_FILE.exists():
        return json.loads(STORE_FILE.read_text())
    return {"next_id": 1, "notes": {}}  # {id: base64-ciphertext}


def save_store(store):
    STORE_FILE.write_text(json.dumps(store, indent=2))


def get_fernet(passphrase):
    salt = get_or_create_salt()
    key = derive_key(passphrase, salt)
    return Fernet(key)


def cmd_add(args, fernet):
    store = load_store()
    note_id = str(store["next_id"])
    token = fernet.encrypt(args.text.encode())
    store["notes"][note_id] = token.decode()
    store["next_id"] += 1
    save_store(store)
    print(f"Saved note #{note_id} (encrypted, {len(token)} bytes on disk)")


def cmd_list(args, fernet):
    store = load_store()
    if not store["notes"]:
        print("No notes.")
        return
    for note_id, token in store["notes"].items():
        try:
            plaintext = fernet.decrypt(token.encode()).decode()
        except InvalidToken:
            print(f"#{note_id}: <wrong passphrase, cannot decrypt>")
            continue
        preview = plaintext if len(plaintext) <= 40 else plaintext[:37] + "..."
        print(f"#{note_id}: {preview}")


def cmd_show(args, fernet):
    store = load_store()
    token = store["notes"].get(args.id)
    if not token:
        print(f"No note #{args.id}", file=sys.stderr)
        sys.exit(1)
    try:
        print(fernet.decrypt(token.encode()).decode())
    except InvalidToken:
        print("Wrong passphrase -- cannot decrypt this note.", file=sys.stderr)
        sys.exit(1)


def cmd_delete(args, fernet):
    store = load_store()
    if args.id not in store["notes"]:
        print(f"No note #{args.id}", file=sys.stderr)
        sys.exit(1)
    del store["notes"][args.id]
    save_store(store)
    print(f"Deleted note #{args.id}")


def main():
    parser = argparse.ArgumentParser(description="Encrypted notes CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    p_add = sub.add_parser("add")
    p_add.add_argument("text")
    p_add.set_defaults(func=cmd_add)

    p_list = sub.add_parser("list")
    p_list.set_defaults(func=cmd_list)

    p_show = sub.add_parser("show")
    p_show.add_argument("id")
    p_show.set_defaults(func=cmd_show)

    p_delete = sub.add_parser("delete")
    p_delete.add_argument("id")
    p_delete.set_defaults(func=cmd_delete)

    args = parser.parse_args()
    passphrase = os.environ.get("NOTES_PASSPHRASE") or getpass.getpass("Passphrase: ")
    fernet = get_fernet(passphrase)
    args.func(args, fernet)


if __name__ == "__main__":
    main()
