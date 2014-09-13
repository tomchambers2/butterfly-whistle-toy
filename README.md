butterfly-whistle-toy
=====================

A toy that makes use of the html5 web audio API to measure the pitch of your whistling and use it to control a butterfly with CSS transform.

Still to do
* replace the pitch detection algorithm with something more reliable, it doesn't work well with my singing for some reason
* replace the animation to make it smoother

Chrome only.

Does not work on Safari due to lack of getUserMedia support which is the way of getting microphone input. Does not work on firefox due to lack of support for Uint8Array when using the analyser node. Probably doesn't work in IE either...

Demo: http://tomchambers2.github.io/butterfly-whistle-toy/
