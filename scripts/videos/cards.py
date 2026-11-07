from pathlib import Path
exec((Path(__file__).parent/'render.py').read_text().split("if len(sys.argv)<2:")[0])
def make(name,title,lines,footer):
 im=Image.new('RGB',(1920,1080),'#0c1120');d=ImageDraw.Draw(im)
 text(d,(100,75),'DSH AGENTROOM  /  SETUP',25,'#9b95ff',True)
 text(d,(100,175),title,58)
 d.rounded_rectangle((96,310,1824,850),radius=24,fill='#172035',outline='#354058',width=2)
 y=354
 for label,command in lines:
  text(d,(140,y),label,25,'#aebad2');y+=52
  text(d,(140,y),command,29,'#f1f4ff',True);y+=95
 text(d,(100,940),footer,28,'#b8c3db');im.save(OUT/name)
make('install-web.png','安装 DSH 与 Agentroom',[
 ('01  安装 DSH（Node.js 22+）','npm install -g @deepseek-ai/dsh@0.2.1-rc.5'),
 ('02  安装官方仓库（CLI 增强需上游合并）','dsh plugin --profile web add github:Intelli-Jungle/dsh-agentroom#main'),
 ('03  启动 Web 界面','dsh web')], '安装完成后重启 DSH，在左侧打开 Agentroom。')
make('install-desktop.png','Desktop：安装、启用、完整重启',[
 ('01  插件 → 添加插件，输入 Git 来源','github:Intelli-Jungle/dsh-agentroom#main'),
 ('02  点击立即启用，然后完整退出并重新打开','Agentroom v0.2.0'),
 ('03  外部 CLI 先安装并登录；DSH 原生成员先配置模型','codex login     /     claude auth login')], '安装地址保持原仓库；本片 v0.2.0 CLI 增强为待合并演示版。')
