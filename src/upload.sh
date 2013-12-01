#/bin/sh
echo 'Uploading to server ...'
rsync -arv --exclude 'node_modules' ../WellNestAdminConsole/ root@192.237.241.60:/usr/share/tomcat6/webapps/console/
