const IP_ADDRESS_BULB = '192.168.1.75';

const dgram = require('dgram');
const midi = require('midi');
const client = dgram.createSocket('udp4');

let count = 0;
// Set up a new input.
const input = new midi.Input();

setupUdpCallbacks();

// Count the available input ports.
input.getPortCount();

// Get the name of a specified input port.
input.getPortName(0);

// Configure a callback.
input.on('message', (deltaTime, message) => {
    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.
    console.log(`m: ${message} d: ${deltaTime}`);
    // Cycle through RGB colors each time Note On received for bass drum
    if (message[0] === 153 && message[1] === 36) {
        count += 1;
        count %= 3;
        let colors = [0, 0, 0];
        colors[count] = 255;

        let msg = getMessageWithColorBrightness(colors[0], colors[1], colors[2], 100);
        client.send(msg, 0, msg.length, 38899, IP_ADDRESS_BULB, function (err, bytes) {
            console.log("sent message with colors: " + colors);
        });
    }
});

// Open the first available input port.
input.openPort(0);

input.ignoreTypes(false, false, false);

process.on('SIGINT', function() {
    console.log("Exiting...");
    client.close();
    input.closePort();
    process.exit();
});

// https://nodejs.org/api/dgram.html#socketbindport-address-callback
function setupUdpCallbacks() {
    client.on('error', (err) => {
        console.error(`client error:\n${err.stack}`);
        client.close();
    });

    client.on('message', (msg, rinfo) => {
        console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    client.on('listening', () => {
        const address = client.address();
        console.log(`client listening ${address.address}:${address.port}`);
    });

    client.bind(38899);
}

// https://aleksandr.rogozin.us/blog/2021/8/13/hacking-philips-wiz-lights-via-command-line
function getMessageWithColorBrightness(r, g, b, dimming) {
    // Also possible to turn the light on and off
    // let msg = `{"id":1,"method":"setState","params":{"state":true}}`;
    let msg = {
        "id":1,
        "method": "setPilot",
        "params": {
            "r": r,
            "g": g,
            "b": b,
            "dimming": dimming
        }
    };
    return JSON.stringify(msg);
}
