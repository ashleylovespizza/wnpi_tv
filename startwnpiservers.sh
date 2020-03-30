#!/bin/bash
sleep 2s
cd /home/pi/wnpi/wnpi_tv
forever server.js &
#cd /home/pi/wnpi/wnpi_tv/app
# for now don't worry about forevering
#serve -p 5001 &

