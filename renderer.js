const { ipcRenderer } = require('electron')

let button_status = false
function click_button() {
    if (button_status) {
        button_status = 0;
        gpio_invoke(24, 'OFF')
        return;
    }
    button_status = 1;
    gpio_invoke(24, 'ON')
    return;
}

//gpio ipc invoke main.jsへ送信
// level="ON" or "OFF"
function gpio_invoke(pin, level) {
    let returnval = ipcRenderer.invoke('output_gpio', level)
    console.log("returnval = " + returnval)
    return;
}

let error_flug = false;
//main.jsからピン状態を受け取る
ipcRenderer.on('input-torenderer', (event, arg) => {
    console.log(arg);
    if (arg == '1') {
        error_flug = true;
        return;
    } 
    error_flug = false;
    return;
});