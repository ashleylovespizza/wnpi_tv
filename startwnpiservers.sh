#!/bin/bash
sleep 2s

if pgrep -f server.js > /dev/null
then
  echo "starting WNPI server!"
  cd /home/pi/wnpi/wnpi_tv
  forever server.js &
else
    echo "WNPI server already running."
fi


#
#cd /home/pi/wnpi/wnpi_tv/app
# for now don't worry about forevering
#serve -p 5001 &
