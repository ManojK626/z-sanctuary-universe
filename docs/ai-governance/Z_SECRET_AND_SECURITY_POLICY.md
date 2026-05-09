# Z Secret and Security Policy

## Never Commit

* API keys
* Cloudflare tokens
* GitHub tokens
* passwords
* recovery phrases
* private certificates
* .env contents

---

# Forbidden AI Actions

AI builders must NEVER:

* print secrets into markdown
* expose tokens in logs
* hardcode credentials
* upload sensitive information
* share account recovery information

---

# Environment Variables

Secrets belong only in:

* Cloudflare environment variables
* local .env files
* secure secret stores

Never inside repositories.

---

# Security Principle

Deployment convenience never overrides security discipline.
