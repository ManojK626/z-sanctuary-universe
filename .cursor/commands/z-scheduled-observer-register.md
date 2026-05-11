Registers the **Windows Scheduled Task** that runs `npm run monitor:cross-project` daily and appends **Z-EAII Watchdog**.

**One-time (elevated PowerShell if registration fails without admin):**

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
& "C:\Cursor Projects Organiser\ZSanctuary_Universe\scripts\z_register_observer_scheduled_task.ps1"
```

Default schedule: **daily 06:30**, task name **`Z-EAII-Universe-CrossProject-Observer`**, runs as your user (interactive logon) so **npm** stays on PATH.

**Manual check:** Task Scheduler → Task Scheduler Library → find that name → **Run** to test.

**Artifacts:**

- Runner: `scripts\z_scheduled_observer_watchdog.ps1`
- Watchdog: `C:\Cursor Projects Organiser\Z-EAII-Watchdog.log`

Do not register a second duplicate task with the same name.
