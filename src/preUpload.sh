#/bin/sh
echo 'Uploading to server ...'
rsync -arv --exclude 'node_modules' ../WellNestAdminConsole/ root@166.78.249.163:/usr/share/tomcat6/webapps/console/
