<!-- Z: data\README.md -->

# Data

This folder is intended for runtime logs, lightweight memories, and serialized state for experimentation.

Current behavior:

- The project stores chronicle data in-memory; there is no automatic persistence.

When adding persistence:

- Use JSON or the `.zcrystal` wrapper format described in the project docs.
- Keep writes atomic (write to a temp file then rename) to avoid corruption of experimental logs.
