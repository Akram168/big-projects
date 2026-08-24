# Encrypted Notes CLI

A notes app where everything is encrypted at rest with a key derived from your passphrase — the file on disk is ciphertext, not readable text, and a wrong passphrase fails closed instead of showing garbage. Built on the `cryptography` library's vetted primitives (PBKDF2-HMAC-SHA256 + Fernet/AES), not hand-rolled crypto.

## Requirements

```bash
pip install cryptography
```

## Usage

```bash
python notes.py add "note text"     # prompts for passphrase (hidden input)
python notes.py list                # shows previews, decrypted on the fly
python notes.py show <id>           # full note text
python notes.py delete <id>
```

Set `NOTES_PASSPHRASE` as an environment variable to skip the interactive prompt (useful for scripting — not recommended for real use, since it can leak into shell history/process lists).

## Example

```
$ python notes.py add "Meeting notes: rotate the API keys before Friday"
Passphrase: ********
Saved note #1 (encrypted, 164 bytes on disk)

$ python notes.py list
Passphrase: ********
#1: Meeting notes: rotate the API keys be...

$ cat notes.enc.json
{
  "notes": {
    "1": "gAAAAABqjMGwHECCGGWWNc6YjDLgTazn40yZ9tVnkvRMGTgqwXgVK0gdaL1dMWDA0eQxOEQxtYlz0Cy8lMn5f7nS-nqP7IF_aDB7QVRsQ3F1f1_AdnYWExhtFYV81uQuUAkh5vh3L4rZhNbyKGMDLNOOpLA4nLG7IQ=="
  }
}

$ NOTES_PASSPHRASE="wrong passphrase" python notes.py show 1
Wrong passphrase -- cannot decrypt this note.
```

The file on disk (`notes.enc.json`) never contains plaintext — confirmed above, that's a Fernet token, not the note text.

## How the crypto works

1. **Key derivation**: passphrase → PBKDF2-HMAC-SHA256, 480,000 iterations (OWASP's current minimum recommendation), with a random 16-byte salt generated once and stored in `salt.bin`. The iteration count makes brute-forcing the passphrase computationally expensive even if `notes.enc.json` and `salt.bin` both leak.
2. **Encryption**: the derived key feeds `Fernet`, which is AES-128-CBC for confidentiality plus HMAC-SHA256 for integrity/authenticity — so a tampered ciphertext fails to decrypt rather than silently decrypting to garbage.
3. **Wrong passphrase handling**: a wrong passphrase derives a different key, which makes the HMAC check fail, which raises `InvalidToken` — the app catches that and fails closed with an error, never partial/garbled plaintext.

## Why not the `cipher-toolkit` ciphers for this?

Compare against [`cipher-toolkit`](../../small-projects/cipher-toolkit): Caesar/Vigenère/XOR there are for *learning* classical cryptanalysis, and are explicitly broken by frequency analysis. This project is the "how you'd actually do it" counterpart — real key derivation with a deliberately slow KDF (to resist offline brute force) and an authenticated cipher (to resist tampering), both from an audited library instead of hand-rolled.
