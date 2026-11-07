"""Keep spoken pronunciation separate from the symbols shown in captions."""
import re
import hashlib
import json


def spoken_text(text):
    return text.replace('DSH', 'D S H').replace('CLI', 'C L I').replace('@', ' at ')


def caption_text(text):
    text = text.replace('D S H', 'DSH').replace('C L I', 'CLI')
    return re.sub(r'\s*\bat\b\s*', '@', text)


def script_data(timeline):
    sentences = []
    for index, shot in enumerate(timeline['shots']):
        for sentence in re.findall(r'[^。！？!?]+[。！？!?]?', shot['narration']):
            if sentence.strip():
                sentences.append({'shot': index, 'text': sentence.strip()})
    spoken = ' '.join(spoken_text(s['text']) for s in sentences)
    voice = timeline['voice']
    settings = dict(voice=voice['name'], rate=voice['rate'], pitch=voice['pitch'])
    digest = hashlib.sha256(json.dumps([spoken, settings, sentences]).encode()).hexdigest()
    return spoken, settings, sentences, digest


def normalized(text):
    return re.sub(r'[^\w@]', '', caption_text(text)).lower()
