"""Generate cached neural narration and sentence timestamps for a video timeline."""
import asyncio
import hashlib
import json
import os
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[2]


async def narrate(path):
    timeline = json.loads(path.read_text())
    voice = timeline['voice']
    folder = ROOT / 'work/narration' / timeline['slug']
    folder.mkdir(parents=True, exist_ok=True)
    for index, shot in enumerate(timeline['shots']):
        original = shot.get('narration')
        if not original:
            continue
        spoken = original.replace('DSH', 'D S H').replace('CLI', 'C L I')
        settings = dict(voice=voice['name'], rate=voice['rate'], pitch=voice['pitch'])
        digest = hashlib.sha256(json.dumps([spoken, settings]).encode()).hexdigest()
        mp3 = folder / f'{index:02}.mp3'
        metadata = folder / f'{index:02}.json'
        if mp3.exists() and metadata.exists() and json.loads(metadata.read_text()).get('digest') == digest:
            print(f'{timeline["slug"]} voice {index+1}: cached', flush=True)
            continue
        for attempt in range(3):
            cues = []
            try:
                request = edge_tts.Communicate(
                    spoken, **settings, boundary='SentenceBoundary',
                    proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('HTTP_PROXY'),
                )
                temporary = mp3.with_suffix('.part')
                with temporary.open('wb') as output:
                    async for chunk in request.stream():
                        if chunk['type'] == 'audio':
                            output.write(chunk['data'])
                        elif chunk['type'] == 'SentenceBoundary':
                            cues.append(dict(
                                start=chunk['offset'] / 1e7,
                                end=(chunk['offset'] + chunk['duration']) / 1e7,
                                text=chunk['text'].replace('D S H', 'DSH').replace('C L I', 'CLI'),
                            ))
                if temporary.stat().st_size < 1000 or not cues:
                    raise ValueError('Narration or timing data is empty')
                temporary.replace(mp3)
                metadata.write_text(json.dumps({'digest': digest, 'cues': cues}, ensure_ascii=False, indent=2))
                print(f'{timeline["slug"]} voice {index+1}/{len(timeline["shots"])}', flush=True)
                break
            except Exception:
                if attempt == 2:
                    raise
                await asyncio.sleep(2 * (attempt + 1))


async def main():
    for argument in sys.argv[1:]:
        await narrate(Path(argument))


if __name__ == '__main__':
    asyncio.run(main())
