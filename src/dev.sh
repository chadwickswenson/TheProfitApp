#/bin/sh
echo 'Uploading to server ...'
rsync -arv --exclude 'node_modules' ../WellNestAdminConsole/ root@166.78.110.101:/usr/share/tomcat6/webapps/console/
