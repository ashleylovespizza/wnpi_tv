# wnpi_tv
homemade custom programmed TV for charlie and me


# raspi backup sd card:
sudo dd bs=4M if=/dev/rdisk4 of=~/Desktop/wnpi_raspi_bak.img

# raspi pw
`a new tv for our baby`

#TODO!
- bg script to check folders for avi / mkv files and convert to mp4 where possible
- auto start on raspi boot
- auto reboot
- 


# autoboot stuff
- in /etc/xdg/lxsession/LXDE-pi/autostart...

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
