let i = 0;
let t = 0;
const newTimeSlots = [];

while (i < 24) {
    for (let j = 0; j < 4; j++) {
        t++;

        let h = i % 12;

        if (h == 0) {
            h = 12;
        } else if (h < 10 && h > 0) {
            h = '0' + h
        }

        newTimeSlots.push({
            hour: h.toString(),
            minutes: ((j * 15) / 10 > 1) ? (j * 15).toString() : '0' + (j * 15).toString(),
            meridiem: i < 12 ? 'AM' : 'PM',
            t
        })
    }
    i++
}

// newTimeSlots.push({
//     hour: '12',
//     minutes: '00',
//     meridiem: 'AM',
//     t: ++t
// })

console.log(newTimeSlots)

export default newTimeSlots