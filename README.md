# wnpi_tv
homemade custom programmed TV for charlie and me


# raspi backup sd card:
sudo dd bs=4M if=/dev/rdisk4 of=~/Desktop/wnpi_raspi_bak.img


# install on raspi
sudo npm install -g http-server


# raspi pw
`a tv for george`


# Raspbi specific -
- set up symlink from webserver folder to USB video folder root... ?????
- auto start on raspi boot
- auto reboot
- fullscreen / YOU CAN'T GET OUT OF IT


- bg script to check folders for avi / mov / mkv files and convert to mp4 where possible



# autoboot stuff
- in 	
USE: https://dougbatton.blogspot.com/2016/08/raspberry-pi-3-jessie-auto-start.html
the below launches chromium in kiosk mode with the hold.html open
in /home/pi/.config/lxsession/LXDE-pi/autostart  :

@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
@point-rpi

@xset s off
@xset -dpms
@xset noblank

@sed -i 's/"exited_cleanly": false/"exited_cleanly": true/' ~/.config/chromium/Default/Preferences
@chromium-browser --noerrdialogs --kiosk file:///home/pi/wnpi/wnpi_tv/app/hold.html --incognito

- then, in .bashrc ./superscript in ~ is launched
which sleeps and then launches the raspberry pi startwnpiservers.sh

- meanwhile, in cron -
11:30am restart
00:00 restart
03:00 rsync with usb stick

# TODO
- the @sh line above doens't seem to be working

# to run
`cd /home/pi/wnpi/wnpi_tv`
server (on port 3000): `forever -w server.js `
client (on port 5000): `cd app && serve -p 5000`


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
