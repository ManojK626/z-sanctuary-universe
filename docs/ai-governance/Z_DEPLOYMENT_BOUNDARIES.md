# Z Deployment Boundaries

## Current Active Deployment Layer

CF-A:

* static Pages deployment only

Allowed:

* HTML
* CSS
* JS
* Vite static assets
* documentation
* dashboards
* local metadata

Not allowed:

* autonomous agents
* billing systems
* production AI APIs
* Workers AI
* D1 runtime databases
* Vector databases
* orchestration runtime
* authentication systems
* surveillance systems

---

# Deployment Classes

| Class | Meaning                |
| ----- | ---------------------- |
| CF-A  | Static-only            |
| CF-B  | API-assisted           |
| CF-C  | Advanced orchestration |

Only CF-A is currently active.

---

# Human Review Requirement

All deployment changes require:

* human review
* rollback path
* deployment verification
* documentation updates
