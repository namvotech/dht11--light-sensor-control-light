let analogValue = 0
let strip: neopixel.Strip = null
let light2 = 0
let airHumi = 0
let airTemp = 0
let setLight = EEPROM.readw(100)
I2C_LCD1602.LcdInit(39)
basic.forever(function () {
    I2C_LCD1602.ShowString("Te:" + Math.trunc(airTemp) + "C ", 0, 0)
    I2C_LCD1602.ShowString("Hu:" + airHumi + "%  ", 9, 0)
    I2C_LCD1602.ShowString("Li:" + light2 + "%  ", 0, 1)
    I2C_LCD1602.ShowString("SLi:" + setLight + "  ", 9, 1)
    basic.pause(100)
})
basic.forever(function () {
    if (light2 < setLight) {
        basic.showIcon(IconNames.Asleep)
        pins.digitalWritePin(DigitalPin.P14, 1)
        strip = neopixel.create(DigitalPin.P15, 8, NeoPixelMode.RGB)
        strip.showColor(neopixel.colors(NeoPixelColors.White))
    } else {
        basic.showIcon(IconNames.Happy)
        pins.digitalWritePin(DigitalPin.P14, 0)
        strip.clear()
    }
})
basic.forever(function () {
    airTemp = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P2)
    basic.pause(100)
    airHumi = Environment.dht11value(Environment.DHT11Type.DHT11_humidity, DigitalPin.P2)
    basic.pause(100)
})
basic.forever(function () {
    if (input.buttonIsPressed(Button.A)) {
        setLight += -1
        if (setLight < 0) {
            setLight = 100
        }
        basic.showLeds(`
            . . . . .
            . . . . .
            . # # # .
            . . . . .
            . . . . .
            `)
    } else if (input.buttonIsPressed(Button.B)) {
        setLight += 1
        if (setLight > 100) {
            setLight = 0
        }
        basic.showLeds(`
            . . . . .
            . . # . .
            . # # # .
            . . # . .
            . . . . .
            `)
    } else if (input.logoIsPressed()) {
        while (input.logoIsPressed()) {
            basic.showIcon(IconNames.Yes)
        }
        EEPROM.writew(100, setLight)
        music.play(music.tonePlayable(880, music.beat(BeatFraction.Quarter)), music.PlaybackMode.UntilDone)
    }
})
basic.forever(function () {
    analogValue = 0
    for (let index = 0; index <= 9; index++) {
        analogValue += pins.analogReadPin(AnalogPin.P1)
    }
    analogValue = analogValue / 10
    light2 = Math.round(pins.map(
    analogValue,
    0,
    1023,
    100,
    0
    ))
    basic.pause(100)
})
