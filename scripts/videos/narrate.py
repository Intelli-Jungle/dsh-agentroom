"""Synthesize one uninterrupted narration track and align original caption text."""
import asyncio
import json
import os
import sys
from pathlib import Path

import edge_tts
from speech_text import script_data, normalized

ROOT = Path(__file__).resolve().parents[2]


async def narrate(path):
    timeline = json.loads(path.read_text())
    spoken, settings, sentences, digest = script_data(timeline)
    folder = ROOT / 'work/narration' / timeline['slug']
    folder.mkdir(parents=True, exist_ok=True)
    mp3, metadata = folder / 'full.mp3', folder / 'full.json'
    if mp3.exists() and metadata.exists() and json.loads(metadata.read_text()).get('digest') == digest:
        print(f'{timeline["slug"]}: continuous narration cached', flush=True)
        return
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
                        cues.append(dict(start=chunk['offset']/1e7,
                                         end=(chunk['offset']+chunk['duration'])/1e7,
                                         text=chunk['text']))
            if temporary.stat().st_size < 1000 or len(cues) != len(sentences):
                raise ValueError(f'Narration alignment mismatch: {len(cues)} cues / {len(sentences)} sentences')
            for cue, sentence in zip(cues, sentences):
                if normalized(cue['text']) != normalized(sentence['text']):
                    raise ValueError(f'Caption alignment mismatch: {cue["text"]!r} / {sentence["text"]!r}')
                cue.update(sentence)
            temporary.replace(mp3)
            metadata.write_text(json.dumps({'digest': digest, 'cues': cues}, ensure_ascii=False, indent=2))
            print(f'{timeline["slug"]}: continuous narration ready, {len(cues)} sentences', flush=True)
            return
        except Exception:
            if attempt == 2:
                raise
            await asyncio.sleep(2 * (attempt + 1))


async def main():
    for argument in sys.argv[1:]:
        await narrate(Path(argument))


if __name__ == '__main__':
    asyncio.run(main())
