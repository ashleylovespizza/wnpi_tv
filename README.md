# wnpi_tv
homemade custom programmed TV for charlie and me


# omxplayer examples

Play a file at a particular time stamp with no on screen display on layer 2:
`omxplayer --no-osd -b --layer 2 --pos 00:08:00 vids/2\ -\ Death\ Lends\ A\ Hand.avi`

Play a file looping on layer 1, no audio
`omxplayer --loop -o local --layer 1 vids/static.mp4`

Display a png file with an alpha channel on top of the current video:
`util/pngview -l 3 ../../upnext.png`
