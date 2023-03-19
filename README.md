# Wiz Realtime MIDI
Make a Wiz smart bulb respond to live MIDI input events.

## Requirements
1. Node
2. [`midi`](https://www.npmjs.com/package/midi) library uses Microsoft Visual C++ and python on Windows.

## Installation and Running
1. Connect MIDI device and note the input port number. You can use MIDI OX on Windows to monitor inputs. Ensure that MIDI OX has been closed completely after this to allow the port to rebind when running the Node app. 
2. Edit the IP address of the bulb, the MIDI input port number and other parameters at the top of `index.js`
3. Run following commands:
    ```
    npm install
    npm start
    ```
4. The default setup is to read the events from the first connected MIDI device and cycle through RGB colors on each Kick Drum note.
