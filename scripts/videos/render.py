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
card('getting-started-ending','让分工发生\n让讨论留下来','从一个问题，到一份可以继续推进的方案','SHARED DISCUSSION  /  CLEAR NEXT STEPS')
card('werewolf-ending','一场对局\n看见不同的推理','各自扮演角色，共同推进讨论','CODEX × CLAUDE  /  ONE SHARED ROOM')
if len(sys.argv)<2:sys.exit()
import math, wave
from speech_text import script_data
manifest_path=Path(sys.argv[1])
manifest=json.loads(manifest_path.read_text());name=manifest['slug']
voice=manifest['voice'];lead=voice.get('leadIn',0.25);tail=voice.get('tailOut',0.6)
source_audio=ROOT/'work/narration'/name/'full.mp3'
metadata=json.loads(source_audio.with_suffix('.json').read_text())
assert metadata['digest']==script_data(manifest)[3], 'Narration changed; run narrate.py again.'
# Normalize the uninterrupted voice track as a whole, preserving sentence joins.
analysis=subprocess.run([FF,'-hide_banner','-nostats','-i',str(source_audio),'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True).stderr
measured=json.JSONDecoder().raw_decode(analysis[analysis.rfind('{'):])[0]
normalization='loudnorm=I=-16:TP=-1.5:LRA=9:'+':'.join(f'{key}={measured[value]}' for key,value in [('measured_I','input_i'),('measured_TP','input_tp'),('measured_LRA','input_lra'),('measured_thresh','input_thresh'),('offset','target_offset')])+':linear=true'
audio=TMP/f'{name}-full-voice.wav'
subprocess.run([FF,'-y','-hide_banner','-loglevel','error','-i',str(source_audio),'-af',normalization,'-ar','48000','-ac','1',str(audio)],check=True)
with wave.open(str(audio)) as wav:audio_seconds=wav.getnframes()/wav.getframerate()
total=math.ceil((lead+audio_seconds+tail)*30)/30
cuts=[0]
for i in range(1,len(manifest['shots'])):
 first=next(c for c in metadata['cues'] if c['shot']==i)
 cuts.append(math.floor((lead+first['start']-0.06)*30)/30)
cuts.append(total)
assert all(b>a for a,b in zip(cuts,cuts[1:])), 'Invalid shot timing'
captions=[];previous=0
for cue in metadata['cues']:
 a=max(previous,lead+cue['start']);b=min(total-0.1,lead+cue['end'])
 assert b>a
 captions.append((a,b,cue['text']));previous=b

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
Style: Narration,Hiragino Sans GB,36,&H00FFFFFF,&H00FFFFFF,&H00100C08,&H00100C08,0,0,0,0,100,100,0,0,1,1,0,2,130,130,28,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
 path.write_text(header+''.join(f'Dialogue: 0,{ass_ts(a)},{ass_ts(b)},Narration,,0,0,0,,{c}\n' for a,b,c in cues))
clips=[]
for i,shot in enumerate(manifest['shots']):
 start,end=cuts[i:i+2];dur=end-start;target=TMP/f'{name}-{i:02}.mp4'
 overlay=Image.new('RGBA',(1920,1080),'#0c1120');d=ImageDraw.Draw(overlay)
 text(d,(68,28),'AGENTROOM',24,'#9b95ff',True);text(d,(410,25),shot.get('title',''),28)
 d.rounded_rectangle((1540,40,1845,46),radius=3,fill='#242d47')
 d.rounded_rectangle((1540,40,1540+305*(i+1)/len(manifest['shots']),46),radius=3,fill='#9690ff')
 d.rectangle((96,96,1824,960),fill=(0,0,0,0))
 mask=TMP/f'{name}-{i:02}.png';overlay.save(mask)
 local_cues=[(max(0,a-start),min(dur,b-start),c) for a,b,c in captions if b>start and a<end]
 ass=TMP/f'{name}-{i:02}.ass';write_ass(ass,local_cues)
 src=ROOT/shot['source'];cmd=[FF,'-hide_banner','-loglevel','error','-y']
 if shot.get('kind')=='card':
  cmd+=['-loop','1','-i',str(src)]
  filt='[0:v]scale=1920:1080,setsar=1[base]'
 else:
  span=shot['duration']*shot.get('speed',1)
  playback=span/dur
  cmd+=['-ss',str(shot.get('start',0)),'-t',str(span),'-i',str(src),'-loop','1','-i',str(mask)]
  filt=f'[0:v]setpts=(PTS-STARTPTS)/{playback},crop=1440:720:0:0,scale=1728:864,setsar=1,tpad=stop_mode=clone:stop_duration=1[screen];[1:v][screen]overlay=96:96:shortest=1[base]'
  shot['rendered_playback_rate']=round(playback,4)
 filt+=f";[base]ass=filename='{ass}'"
 if i==0:filt+=',fade=t=in:st=0:d=0.3'
 if i==len(manifest['shots'])-1:filt+=f',fade=t=out:st={dur-0.4}:d=0.4'
 filt+='[v]'
 cmd+=['-filter_complex',filt,'-map','[v]','-an','-t',str(dur),'-r','30','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(target)]
 subprocess.run(cmd,check=True);clips.append(target)
 shot['rendered_start']=round(start,3);shot['rendered_duration']=round(dur,3)
 print(f'{name} {i+1}/{len(manifest["shots"])}: {dur:.2f}s',flush=True)
concat=TMP/f'{name}.txt';concat.write_text(''.join(f"file '{p}'\n" for p in clips))
video=TMP/f'{name}-picture.mp4'
subprocess.run([FF,'-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(concat),'-c','copy',str(video)],check=True)
subprocess.run([FF,'-y','-hide_banner','-loglevel','error','-i',str(video),'-i',str(audio),'-map','0:v','-map','1:a','-c:v','copy','-af',f'adelay={round(lead*1000)}:all=1,apad,atrim=duration={total}','-c:a','aac','-b:a','192k','-t',str(total),'-movflags','+faststart',str(OUT/(name+'.mp4'))],check=True)
(OUT/(name+'.zh-CN.srt')).write_text('\n'.join(f'{i+1}\n{ts(a)} --> {ts(b)}\n{c}\n' for i,(a,b,c) in enumerate(captions)))
manifest['rendered_duration']=round(total,3);manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(f'Finished {name}: {total:.2f}s',flush=True)
