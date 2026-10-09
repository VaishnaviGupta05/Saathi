# Saathi — personal diary starter

A responsive Next.js + TypeScript visual prototype for a personal diary with multiple notebook themes, mood-to-paper suggestions, a diary shelf, a memory list, and handwriting/typing modes.

## Important security status

**This is a prototype, not a secure private diary yet.** The opening screen is a UI preview gate: any input of at least four characters opens it. It does not authenticate the user, encrypt entries, or protect data. Entries are held in React memory and disappear on refresh. Do not enter real sensitive diary content into a deployed demo.

`lib/crypto.ts` contains an isolated Web Crypto AES-GCM + PBKDF2 helper as a starting building block. It is not connected to saving or accounts and has not been security-audited. Do not describe the product as end-to-end encrypted until the full flow is designed, reviewed, tested, and connected to encrypted persistence.

## Requirements

- Node.js 20.9+ recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The preview password field accepts any four or more characters.

## Build and test

```bash
npm run build
npm test
npm run lint
```

## Current features

- Responsive sidebar, home shelf, memory garden, and theme atelier
- Five visual themes: Everyday Pages, Rosewater, Old Soul, Moonlight, Little Garden
- Mood-to-Paper theme suggestions with user choice
- Entry editor with handwriting-inspired and typing styles
- In-memory create/edit flow and word count
- Preview lock screen and manual lock control
- Isolated Web Crypto encryption helper with round-trip tests

## Suggested next implementation sequence

1. Replace the preview gate with a real authentication/session system. Keep secrets out of client-visible environment variables.
2. Finalize the encryption model before persistence: derive a key from a high-entropy passphrase, use per-entry random IVs, store versioned ciphertext + salt + KDF parameters, and decide how the encryption key is recovered or wrapped.
3. Encrypt/decrypt only in the browser. Send ciphertext to the server; never send diary passwords to application logs or analytics. Do not store raw passwords or plaintext in localStorage.
4. Add a database schema for users, encrypted diaries, encrypted entries, and non-sensitive theme preferences. Enforce row-level access policies and test cross-account access.
5. Add lock-on-inactivity, safe logout, key clearing, rate limits, CSP, security headers, CSRF protections where applicable, dependency updates, backups, and restore testing.
6. Add autosave only after encryption is integrated; use explicit status for saved/unsaved content.
7. Add accessibility and usability checks for keyboard navigation, focus handling, reduced motion, contrast, and mobile layouts.
8. Perform an independent security review before accepting real private entries.

## Suggested data model

Keep sensitive entry content encrypted client-side. Example logical schema:

- `profiles`: `id` (auth user ID), `created_at`
- `diaries`: `id`, `owner_id`, `encrypted_title`, `theme_id`, `created_at`, `updated_at`
- `entries`: `id`, `diary_id`, `owner_id`, `encrypted_payload`, `encryption_version`, `created_at`, `updated_at`
- `key_envelopes` (only if using wrapped keys): `owner_id`, `kdf`, `salt`, `wrapped_key`, `version`

Treat titles, mood labels, timestamps, diary names, and entry counts as potentially revealing metadata if left unencrypted. Decide intentionally what metadata the service can see.

## Notes

- Fonts currently use safe CSS fallback stacks. For a polished release, add licensed handwriting fonts via local font assets or a font package.
- Do not add analytics or AI reflection on private text without clear, informed opt-in.
- The demo date label is decorative; production should use the user's locale and real date.
