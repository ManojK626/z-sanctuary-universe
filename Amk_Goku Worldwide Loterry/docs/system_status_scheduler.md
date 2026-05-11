<!-- Z: Amk_Goku Worldwide Loterry\docs\system_status_scheduler.md -->

# System Status Scheduler (Windows)

This runs the system status generator once per day.

## 1 Generate reputation + status

Use this command:

```powershell
python scripts/apicon_reputation.py
python scripts/system_status.py
python C:\ZSanctuary_Universe\scripts\zuno_weekly_reflection.py
```

## 2 Task Scheduler setup

1. Open **Task Scheduler**.
2. Create **Basic Task** → name: `Z-Sanctuary System Status`.
3. Trigger: **Daily**.
4. Action: **Start a program**.
5. Program/script:

   ```text
   C:\Windows\System32\cmd.exe
   ```

6. Add arguments:

   ```text
   /c python C:\ZSanctuary_Universe\Amk_Goku Worldwide Loterry\scripts\apicon_reputation.py && python C:\ZSanctuary_Universe\Amk_Goku Worldwide Loterry\scripts\system_status.py && python C:\ZSanctuary_Universe\scripts\zuno_weekly_reflection.py
   ```

7. Start in:

   ```text
   C:\ZSanctuary_Universe\Amk_Goku Worldwide Loterry
   ```

## 3 Monthly Reports Retention (Windows)

This archives reports older than 90 days into `data/reports/_archive`.

1. Open **Task Scheduler**.
2. Create **Basic Task** → name: `Z-Sanctuary Reports Retention`.
3. Trigger: **Monthly** (pick day/time you prefer).
4. Action: **Start a program**.
5. Program/script:

   ```text
   C:\Windows\System32\cmd.exe
   ```

6. Add arguments:

   ```text
   /c python C:\ZSanctuary_Universe\scripts\reports_retention.py
   ```

7. Start in:

   ```text
   C:\ZSanctuary_Universe
   ```

## Notes

- This is read-only reporting.
- No pipelines are executed here.
- Adjust the folder path if your repo moves.
