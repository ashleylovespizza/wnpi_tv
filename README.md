# wnpi_tv
homemade custom programmed TV for charlie and me


# raspi backup sd card:
sudo dd bs=4M if=/dev/rdisk4 of=~/Desktop/wnpi_raspi_bak.img


# install on raspi
sudo npm install -g http-server


# raspi pw
`a new tv for our baby`

#TODO!
- bg script to check folders for avi / mkv files and convert to mp4 where possible
- auto start on raspi boot
- auto reboot
- 


# autoboot stuff
- in 	
USE: https://dougbatton.blogspot.com/2016/08/raspberry-pi-3-jessie-auto-start.html
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
@point-rpi
@xset s off
@xset -dpms
@xset noblank

@sh /home/pi/wnpi/wnpi_tv/startwnpiservers.sh
@sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/Default/Preferences
@chromium-browser --noerrdialogs --kiosk file:///home/pi/wnpi_wnpi_tv/app/hold.html --incognito




# to run
`cd /home/pi/wnpi/wnpi_tv`
server (on port 3000): `forever -w server.js `
client (on port 5000): `cd app && server -p 5000`


# idea is

backend engine - keeps track of state
- pings spreadsheet every X minutes (30 is probably plenty?)
	- turns that into living local object to check schedule


loop that checks
- has channel or state changed?
	- if so, update view with current thing playing on current state/channel
	- determine what time it hsould be playing
	- play

- if no change in channel/state (ie if i didn't just check this above) -
(initially this can be super simplified, just doing second check)
	- is currently playing thing correct (ie does it jive with google spreadsheet)
		- if not update to what should be playing according to GS
	- is what is currently playing still playing (ie is length of what is playing > curr time - start time)
		- if not play autofallthrough image



frontend view
- controls channel and state (on/off)
