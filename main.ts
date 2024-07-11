let analogValue = 0
let light2 = 0
let airHumi = 0
let airTemp = 0
I2C_LCD1602.LcdInit(39)
basic.forever(function () {
    airTemp = Environment.dht11value(Environment.DHT11Type.DHT11_temperature_C, DigitalPin.P2)
    airHumi = Environment.dht11value(Environment.DHT11Type.DHT11_humidity, DigitalPin.P2)
    basic.pause(100)
})
basic.forever(function () {
    I2C_LCD1602.ShowString("T " + airTemp, 0, 0)
    I2C_LCD1602.ShowString("H " + airHumi, 9, 0)
    I2C_LCD1602.ShowString("L " + light2 + "   ", 0, 1)
    basic.pause(100)
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
    basic.pause(500)
})
