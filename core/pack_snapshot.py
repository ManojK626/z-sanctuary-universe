from pathlib import Path
import shutil
root = Path('.')
snap = root / 'release_snapshot'
if snap.exists():
    shutil.rmtree(snap)
snap.mkdir()
for fn in ['index.html','z_registry_badge.js']:
    shutil.copy(root / fn, snap / fn)
for fn in [root / 'data' / 'Z_module_registry.json', root / 'core' / 'data' / 'Z_module_registry.json']:
    shutil.copy(fn, snap / fn.name)
zip_target = root / 'release_snapshot.zip'
if zip_target.exists():
    zip_target.unlink()
shutil.make_archive(str(zip_target.with_suffix('')), 'zip', str(snap))
print('release_snapshot.zip created and includes registry + badge + index.html')
