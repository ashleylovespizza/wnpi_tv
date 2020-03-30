#!/bin/bash
sleep 2s


if pidof -x  /home/pi/.nvm/versions/node/v8.9.4/bin/node /home/pi/wnpi/wnpi_tv/server.js > /dev/null
then

  cd /home/pi/wnpi/wnpi_tv
  forever server.js &
else
    echo "WNPI server already running."
fi



#cd /home/pi/wnpi/wnpi_tv/app
# for now don't worry about forevering
#serve -p 5001 &
