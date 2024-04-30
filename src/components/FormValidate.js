import * as yup from 'yup'

const elements = [0, 1, 2, 3, 4, 5, 6]

export const FromValidate = yup.object().shape({
    name: yup.string().required('Enter Project title!'),
    books: yup.array().of(
        yup.object().shape({
            book_id: yup.string().required('Select a Book'),
            chapters: yup.array().min(1, 'Please select at least one chapter of this book!')
        })
    ),
    timing: yup.object().shape({
        ...(() => {
            const testing = {}
            elements.map((ele) => (
                Object.assign(testing, {
                    [ele]: yup.array().of(
                        yup.object().shape({
                            start: yup.string().required('Choose Start Time Slots!'),
                            end: yup.string().required('Choose End Time Slots!'),
                        }))
                })
            ))
            return testing
        })()
    }).test('time test', 'Select at least One Slot!', function (value) {
        if (Object.keys(value).filter(time => value[time].length > 0).length > 0) {
            return true
        }
        else return false
    }),
    start_date: yup.string().required('Please select the Start Date!')
})