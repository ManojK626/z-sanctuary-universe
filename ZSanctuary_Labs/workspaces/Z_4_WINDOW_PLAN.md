# Z 4-Window Plan (Auto Tiled)

1. Core Window A: `C:\ZSanctuary_Universe\Z_SSWS.code-workspace`
2. Core Window B: `C:\ZSanctuary_Universe\core\ZSanctuary_Universe.code-workspace`
3. Lab Window A: `C:\ZSanctuary_Labs\workspaces\Z_LAB_Dashboard_Copy.code-workspace`
4. Lab Window B: `C:\ZSanctuary_Labs\workspaces\Z_LAB_SSWS_Copy.code-workspace`

Run:

- `C:\ZSanctuary_Labs\workspaces\launch_4_windows.cmd`

Behavior:

- If 2 monitors are detected: monitor 1 gets 2 split windows (left/right), monitor 2 gets 2 split windows (left/right).
- If only 1 monitor is detected: fallback to 2x2 tiling on the primary monitor.

Safety:

- Lab windows are isolated copy hubs.
- No runtime registry linkage is added to Sanctuary core.
