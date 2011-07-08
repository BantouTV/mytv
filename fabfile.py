from fabric.api import *
import os,sys,time,re
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
    
    
    
def export():
    templates()
    optimize()
    
    compiledstamp = int(time.time())
    
    local("mkdir -p %s" % (env.export_dir,))
    local("mkdir -p public/js/")
    
    local("rm -rf %s/*" % (env.export_dir,))
    local("cp -RL public %s/" % (env.export_dir,))
    
    compile("export-optimized/")
    
    for js in os.listdir("export-optimized/"):
      
      local("cp export-optimized/%s %s/public/js/%s.%s%s" % (js,env.export_dir,js[0:-3],compiledstamp,js[-3:]))
      
    for f in ["server.js","package.json","src","joshfire"]:
      local("cp -RL %s %s/" % (f,env.export_dir))
    
    
    cnt = open(os.path.join(env.export_dir,"server.js"),"r").read()
    f = open(os.path.join(env.export_dir,"server.js"),"w")
    f.write(cnt.replace("COMPILED = false;","COMPILED = %s;"%(compiledstamp)))
    f.close()

    
def serve():
    templates()
    local("node-dev server.js")

def templates():
    local("node joshfire/adapters/node/bootstrap.js joshfire/adapters/node/utils/templatecompiler.cli.js templates/ "+os.path.join(os.getcwd(),"templates_compiled"))
