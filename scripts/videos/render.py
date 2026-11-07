import json, subprocess, sys, re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/videos'; OUT.mkdir(exist_ok=True)
TMP=ROOT/'work/render'; TMP.mkdir(exist_ok=True)
FF=imageio_ffmpeg.get_ffmpeg_exe()
FONT='/System/Library/Fonts/Hiragino Sans GB.ttc'
LAT='/System/Library/Fonts/Avenir Next.ttc'
def font(n,latin=False): return ImageFont.truetype(LAT if latin else FONT,n)
def text(d,xy,s,n=32,fill='#f2f4ff',latin=False): d.text(xy,s,font=font(n,latin),fill=fill)
def card(slug,title,sub,chapter):
 im=Image.new('RGB',(1920,1080),'#0c1120'); d=ImageDraw.Draw(im)
 for x,y,r,c in [(1650,100,420,'#171c3c'),(1750,140,260,'#242354')]: d.ellipse((x-r,y-r,x+r,y+r),fill=c)
 d.rounded_rectangle((100,90,386,142),radius=26,fill='#4f46e5');text(d,(122,101),'DSH AGENTROOM',22,latin=True)
 text(d,(100,260),chapter,26,'#9a98ff',True)
 lines=title.split('\n')
 for i,line in enumerate(lines):text(d,(100,340+i*110),line,82)
 text(d,(105,630),sub,30,'#b8c3db')
 for i,(name,color) in enumerate([('DSH','#8268f5'),('CODEX CLI','#3b82f6'),('CLAUDE CODE','#db9272')]):
  x=104+i*430;d.rounded_rectangle((x,740,x+385,840),radius=20,fill='#1a2235',outline='#344059',width=2);d.ellipse((x+24,779,x+40,795),fill=color);text(d,(x+64,770),name,29,latin=True)
 text(d,(104,961),'Intelli-Jungle  /  dsh-agentroom',25,'#8793ad',True);text(d,(1600,961),'v0.2.0',25,'#8793ad',True)
 path=OUT/(slug+'-cover.png');im.save(path);return path
card('getting-started','把 CLI 团队\n请进同一个房间','安装 · 成员配置 · 真实对话 · 并行协作','01  /  GETTING STARTED')
card('werewolf','天黑请闭眼\nCLI 狼人杀开局','新建 Room · 独立身份 · 公开辩论 · 投票揭晓','02  /  THE WEREWOLF ROOM')
if len(sys.argv)<2:sys.exit()
import math, wave, hashlib
manifest_path=Path(sys.argv[1])
manifest=json.loads(manifest_path.read_text());name=manifest['slug'];clips=[];captions=[];total=0
voice=manifest.get('voice')
if not voice or voice.get('engine')!='edge-tts':
 raise SystemExit('Run narrate.py with a neural voice timeline before rendering.')
lead=voice.get('leadIn',0.22);tail=voice.get('tailOut',0.45)
def ts(t):
 ms=round(t*1000)
 return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
def ass_ts(t):
 cs=round(t*100)
 return f'{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}'
def write_ass(path,cues):
 header="""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Narration,Hiragino Sans GB,34,&H00FFFFFF,&H00FFFFFF,&H00100C08,&H00100C08,0,0,0,0,100,100,0,0,1,1,0,2,130,130,29,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
 path.write_text(header+''.join(f'Dialogue: 0,{ass_ts(a)},{ass_ts(b)},Narration,,0,0,0,,{c}\n' for a,b,c in cues))
for i,shot in enumerate(manifest['shots']):
 dur=shot['duration'];target=TMP/f'{name}-{i:02}.mp4'
 overlay=Image.new('RGBA',(1920,1080),'#0c1120');d=ImageDraw.Draw(overlay)
 text(d,(68,28),'AGENTROOM',24,'#9b95ff',True);text(d,(410,25),shot.get('title',''),28)
 text(d,(1755,28),f'{i+1:02}/{len(manifest["shots"]):02}',22,'#8793ad',True)
 d.rectangle((96,96,1824,960),fill=(0,0,0,0))
 mask=TMP/f'{name}-{i:02}.png';overlay.save(mask)
 source_audio=ROOT/'work/narration'/name/f'{i:02}.mp3'
 metadata=json.loads(source_audio.with_suffix('.json').read_text())
 spoken=shot['narration'].replace('DSH','D S H').replace('CLI','C L I')
 settings=dict(voice=voice['name'],rate=voice['rate'],pitch=voice['pitch'])
 digest=hashlib.sha256(json.dumps([spoken,settings]).encode()).hexdigest()
 assert metadata['digest']==digest,'Narration changed; run narrate.py again before rendering.'
 audio=TMP/f'{name}-{i:02}-voice.wav'
 subprocess.run([FF,'-y','-hide_banner','-loglevel','error','-i',str(source_audio),'-af','highpass=f=65,loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000','-ac','1',str(audio)],check=True)
 with wave.open(str(audio)) as wav:seconds=wav.getnframes()/wav.getframerate()
 assert seconds>0,'Voice synthesis returned empty audio'
 dur=math.ceil(max(dur,lead+seconds+tail)*30)/30
 local_cues=[];previous=0
 for cue in metadata['cues']:
  a=max(previous,lead+cue['start']);b=min(dur-0.1,lead+cue['end'])
  if b>a:local_cues.append((a,b,cue['text']));previous=b
 ass=TMP/f'{name}-{i:02}.ass';write_ass(ass,local_cues)
 src=ROOT/shot['source'];cmd=[FF,'-hide_banner','-loglevel','error','-y']
 if shot.get('kind')=='card':cmd+=['-loop','1','-i',str(src)]
 else:cmd+=['-ss',str(shot.get('start',0)),'-t',str(shot['duration']*shot.get('speed',1)),'-i',str(src)]
 if shot.get('kind')!='card':cmd+=['-loop','1','-i',str(mask)]
 cmd+=['-i',str(audio)]
 if shot.get('kind')=='card':
  filt=f'[0:v]scale=1920:1080,setsar=1,fade=t=in:st=0:d=0.3,fade=t=out:st={dur-0.3}:d=0.3[base]';audioidx=1
 else:
  filt=f'[0:v]setpts=(PTS-STARTPTS)/{shot.get("speed",1)},crop=1440:720:0:0,scale=1728:864,setsar=1,tpad=stop_mode=clone:stop_duration={dur}[screen];[1:v][screen]overlay=96:96:shortest=1,fade=t=in:st=0:d=0.25,fade=t=out:st={dur-0.25}:d=0.25[base]';audioidx=2
 filt+=f";[base]ass=filename='{ass}'[v]"
 filt+=f';[{audioidx}:a]adelay={round(lead*1000)}:all=1,apad,atrim=duration={dur},afade=t=out:st={dur-0.2}:d=0.2[a]'
 cmd+=['-filter_complex',filt,'-map','[v]','-map','[a]','-c:a','aac','-b:a','160k','-t',str(dur),'-r','30','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(target)]
 subprocess.run(cmd,check=True);clips.append(target)
 captions.extend((total+a,total+b,c) for a,b,c in local_cues)
 shot['rendered_start']=round(total,3);shot['rendered_duration']=round(dur,3)
 total+=dur
 print(f'{name} {i+1}/{len(manifest["shots"])}: {dur:.2f}s',flush=True)
concat=TMP/f'{name}.txt';concat.write_text(''.join(f"file '{p}'\n" for p in clips))
subprocess.run([FF,'-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(concat),'-c','copy','-movflags','+faststart',str(OUT/(name+'.mp4'))],check=True)
(OUT/(name+'.zh-CN.srt')).write_text('\n'.join(f'{i+1}\n{ts(a)} --> {ts(b)}\n{c}\n' for i,(a,b,c) in enumerate(captions)))
manifest['rendered_duration']=round(total,3);manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(f'Finished {name}: {total:.2f}s',flush=True)
