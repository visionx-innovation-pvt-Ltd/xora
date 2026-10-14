from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / 'xora'
ERRORS = []

class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        for key in ('href', 'src'):
            value = attrs.get(key)
            if value:
                self.links.append((tag, key, value))

html_files = sorted(APP.glob('*.html'))
if not html_files:
    ERRORS.append('No HTML pages found under xora/')

parsers = {}
for path in html_files:
    parser = SiteParser()
    try:
        parser.feed(path.read_text(encoding='utf-8'))
        parsers[path.resolve()] = parser
    except (OSError, UnicodeError) as exc:
        ERRORS.append(f'{path.relative_to(ROOT)}: cannot read HTML: {exc}')

for path, parser in parsers.items():
    for tag, key, raw in parser.links:
        url = urlsplit(raw.strip())
        if not raw.strip() or raw.strip().startswith('#') or url.scheme or url.netloc:
            if raw.strip().startswith('#') and len(raw.strip()) > 1:
                target_id = raw.strip()[1:]
                if target_id not in parser.ids:
                    ERRORS.append(f'{path.relative_to(ROOT)}: missing anchor #{target_id}')
            continue
        if url.path in ('',):
            continue
        target = (path.parent / url.path).resolve()
        if not target.exists():
            ERRORS.append(f'{path.relative_to(ROOT)}: missing {key} target {raw!r}')
            continue
        if url.fragment and target.suffix.lower() == '.html':
            target_parser = parsers.get(target)
            if target_parser and url.fragment not in target_parser.ids:
                ERRORS.append(f'{path.relative_to(ROOT)}: {raw!r} points to missing anchor')

manifest = APP / 'manifest.json'
try:
    data = json.loads(manifest.read_text(encoding='utf-8'))
    for icon in data.get('icons', []):
        icon_path = APP / icon.get('src', '')
        if not icon_path.exists():
            ERRORS.append(f'manifest.json: missing icon {icon.get("src")!r}')
except (OSError, json.JSONDecodeError) as exc:
    ERRORS.append(f'manifest.json: invalid or unreadable: {exc}')

if ERRORS:
    print('Site validation failed:')
    for error in ERRORS:
        print(f' - {error}')
    sys.exit(1)
print(f'Site validation passed: {len(html_files)} HTML pages and manifest checked.')
