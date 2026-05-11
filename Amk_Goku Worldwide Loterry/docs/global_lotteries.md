<!-- Z: Amk_Goku Worldwide Loterry\docs\global_lotteries.md -->

# Research: Global Lottery Formats

These are the new formats added to `core-engine/config/global-formats/`, selected to cover major global markets:

| Lottery | Code | Main range/count | Lucky range/count | Notes |
| --- | --- | --- | --- | --- |
| EuroMillions | `euromillions` | 1-50 (5) | 1-12 (2) | Standard 5+2 draw across much of Europe |
| EuroJackpot | `eurojackpot` | 1-50 (5) | 1-12 (2) | Primary jackpot in the EU, Tuesday + Friday |
| Global Sevens | `global-sevens` | 1-49 (5) | 1-12 (2) | Custom twin-draw format for internal experiments |
| US Powerball | `powerball` | 1-69 (5) | 1-26 (1) | Massive US jackpot, Wednesday + Saturday |
| Mega Millions | `mega-millions` | 1-70 (5) | 1-25 (1) | US multi-state alternative with a Mega Ball |
| UK Lotto | `uk-lotto` | 1-59 (6) | 1-59 (1) | Six main balls + bonus; we treat bonus as lucky |
| Spain La Primitiva | `la-primitiva` | 1-49 (6) | 0-9 (1) | Includes the Reintegro digit; represented as the lucky set |

## What to do next

1. When you acquire the real history CSV for any of these lotteries, place it in `data/histories/` with the same filename used in the format JSON (`powerball.csv`, `mega-millions.csv`, etc.).
2. If you expand to another lottery (e.g., Brazil Mega Sena, Australia Oz Lotto), author a JSON in `core-engine/config/global-formats/` with the matching ranges and update the `history` pointer.
3. Rerun `python core-engine/pipeline.py` to reload caches + trust reports so all modules see the new coverage.
