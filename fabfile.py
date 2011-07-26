from fabric.api import *
import os,sys,time,re,subprocess,urllib2
sys.path.append("../joshfire-framework/build")
from joshfabric import *


def serve():
  os.system("node joshfire/adapters/node/bootstrap.js node.cli.js")


env.export_dir = os.path.join(os.path.dirname(__file__),"export")
def prod():
    "Use prod environment"
    env.hosts = ['joshfire.com']
    env.path = '/home/mikiane/mytedtv'
    env.user = 'mikiane'
    env.restartcmd = 'sudo /sbin/stop node-mytedtv ; sudo /sbin/start node-mytedtv'
    env.nodeenv = '/home/mikiane/local/node04'



def deploy():
    "Deploys, currently in dev mode"
    env.release = time.strftime('%Y%m%d%H%M%S')
    export()
    setup_remote_environment()
    upload_tar_from_export()
    #npm
    run('cd %s/releases/%s ; export PATH=%s/bin:$PATH ; npm install' % (env.path,env.release,env.nodeenv))
    symlink_current_release()
    node_restart()

    
def node_restart():
    run(env.restartcmd)
    
    
   
def iphone_xcode():
  
    export()
    
    #create a index.html for iphone version
    p = subprocess.Popen(["node","export/server.js"])
    time.sleep(2)
    u = urllib2.urlopen("http://127.0.0.1:40010/tedxparis?device=iphone")
    open("export/public/index.iphone.html","w").write(u.read())
    u.close()
    u = urllib2.urlopen("http://127.0.0.1:40010/tedxparis?device=ipad")
    open("export/public/index.ipad.html","w").write(u.read())
    u.close()
    p.kill()
    
    local("rm -rf xcode/tedxparis/www/*")
    local("cp -R export/public/* xcode/tedxparis/www/")
    
    
def iphone_build():
    
    #doesn't work yet :/
    
    local("cd phonegap/ && rm -rf tmp/ios && ./bin/create/ios")
  
    templates()
    
    #create a index.html for iphone version
    p = subprocess.Popen(["node","server.js"])
    time.sleep(2)
    u = urllib2.urlopen("http://127.0.0.1:40010/?device=iphone")
    open("phonegap/tmp/ios/www/index.iphone.html","w").write(u.read())
    u.close()
    u = urllib2.urlopen("http://127.0.0.1:40010/?device=ipad")
    open("phonegap/tmp/ios/www/index.ipad.html","w").write(u.read())
    u.close()
    p.kill()
    
    local("cd phonegap/ && ./bin/build/ios")
    
def export():
    templates()
    optimize()
    compile("export-optimized/")
    
    compiledstamp = int(time.time())
    
    local("mkdir -p %s" % (env.export_dir,))
    local("mkdir -p public/js/")
    
    local("rm -rf %s/*" % (env.export_dir,))
    local("cp -RL public %s/" % (env.export_dir,))
    
    
    
    for js in os.listdir("export-optimized/"):
      
      local("cp export-optimized/%s %s/public/js/%s.%s%s" % (js,env.export_dir,js[0:-3],compiledstamp,js[-3:]))
      
    for f in ["server.js","package.json","src","joshfire","templates_compiled"]:
      local("cp -RL %s %s/" % (f,env.export_dir))
    
    
    cnt = open(os.path.join(env.export_dir,"server.js"),"r").read()
    f = open(os.path.join(env.export_dir,"server.js"),"w")
    f.write(cnt.replace("COMPILED = false;","COMPILED = %s;"%(compiledstamp)))
    f.close()

    
def serve():
    templates()
    local("node server.js")

def templates():
    local("node joshfire/adapters/node/bootstrap.js joshfire/adapters/node/utils/templatecompiler.cli.js templates/ "+os.path.join(os.getcwd(),"templates_compiled"))
