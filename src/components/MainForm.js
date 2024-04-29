import React, { useEffect } from 'react'
import BooksList from './BooksList'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import Multiselect from 'multiselect-react-dropdown'
import TimingsSlot from './TimingsSlot'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { v4 as uuid } from 'uuid'

function MainForm() {
    let sum = 0
    let calculatedTime = 0, hoursDiff, minsDiff, count = 0
    let userChoosenDate, userChoosenDay, userChoosenMonth, userChoosenYear, minsRequired = 0
    const DaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
        initialValues: {
            id: uuid().slice(0, 8),
            name: '',
            books: [{ book_id: '', chapters: [] }],
            timing: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
            start_date: '',
            end_date: '',
            created_date: new Date()
        },
        onSubmit: (values) => {
            const existingData = JSON.parse(localStorage.getItem('bookingDetails')) || []
            if (values.name) {
                const nameCheck = existingData.filter(item => item.name === values.name) || []
                if (nameCheck.length > 0) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "A PLAN WITH SAME TITLE ALREADY EXISTS!",
                        footer: '<a href="#">Why do I have this issue?</a>'
                    })
                }
            }
            else if (!values.name) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE ENTER PLAN TITLE!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                })
            }

            else if (values.timing) {
                values.books.map(allBooks => {
                    if (!allBooks.book_id || allBooks.chapters.length === 0) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "PLEASE COMPLETE BOOKS DATA!",
                            footer: '<a href="#">Why do I have this issue?</a>'
                        })
                    }
                    return true
                })

                Object.keys(values.timing).map(timeSelect => {
                    if (values.timing[timeSelect].length > 0) {
                        count++
                    }
                    return true
                })

                if (count === 0) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "PLEASE SELECT AT LEAST ONE TIME SLOT!",
                        footer: '<a href="#">Why do I have this issue?</a>'
                    })
                }
            }

            else if (!values.start_date) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "PLEASE SELECT START DATE!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                })
            }

            else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Booked successfully!",
                    showConfirmButton: false,
                    timer: 1000
                })
                existingData.push(values)
                localStorage.setItem('bookingDetails', JSON.stringify(existingData))
                setFieldValue('name', '')
                setFieldValue('books', [{ book_id: '', chapters: [] }])
                setFieldValue('timing', { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] })
                setFieldValue('start_date', '')
                setFieldValue('end_date', '')
            }
            console.log(values)
        }
    })

    const handleAddBook = (e, index) => {
        const tempBooks = values.books
        if (!tempBooks[index].book_id || tempBooks[index].book_id) {
            tempBooks[index].book_id = e.target.value
            tempBooks[index].chapters = []
        } else if (tempBooks) {
            tempBooks.push({ book_id: e.target.value, chapters: [] })
        }
        setFieldValue('books', tempBooks)
    }

    const handleNewBook = () => {
        values.books.push({ book_id: '', chapters: [] })
        setFieldValue('books', values.books)
    }

    const handleTimeSlot = (index) => {
        values.timing?.[index]?.push({ 'start': '', 'end': '' })
        setFieldValue('timing', values.timing)
    }

    const handleTimeSelect = (e, index, i) => {
        const { name, value } = e.target
        values.timing[i][index][name] = value
        setFieldValue('timing', values.timing)
    }

    useEffect(() => {
        if (values?.start_date) {
            // eslint-disable-next-line
            userChoosenDay = values?.start_date?.getDay()
            // eslint-disable-next-line
            userChoosenDate = values?.start_date?.getDate()
            // eslint-disable-next-line
            userChoosenMonth = values?.start_date?.getMonth()
            // eslint-disable-next-line
            userChoosenYear = values?.start_date?.getFullYear()
        }
        values?.books?.map(nbooks => (
            // eslint-disable-next-line
            nbooks.chapters.forEach(chapter => sum += chapter.no_of_words)
        ))
        // eslint-disable-next-line
        minsRequired = sum / 50
        outputTime()
    }, [values.timing, values.books, values.start_date])

    function outputTime() {
        if (values?.start_date) {
            if (values.timing[userChoosenDay].length > 0 && minsRequired > 0) {
                values.timing[userChoosenDay].map(userTime => {
                    let userStart = userTime.start.split(' ')
                    let userEnd = userTime.end.split(' ')
                    if (userTime.start && userTime.end && userStart[1] === userEnd[1]) {
                        hoursDiff = userEnd[0].split(':')[0] - userStart[0].split(':')[0]
                        minsDiff = userEnd[0].split(':')[1] - userStart[0].split(':')[1]
                    } else if (userTime.start && userTime.end && userStart[1] !== userEnd[1]) {
                        let startHour, startMins, endHour, endMins
                        if (userStart[0] === 'AM') {
                            startHour = 12 - userStart[0].split(':')[0]
                            startMins = 60 - userStart[0].split(':')[1]
                            hoursDiff = userEnd[0].split(':')[0] + startHour
                            minsDiff = userEnd[0].split(':')[1] + startMins
                        } else {
                            endHour = 12 - userEnd[0].split(':')[0]
                            endMins = 60 - userEnd[0].split(':')[1]
                            hoursDiff = endHour + userStart[0].split(':')[0]
                            minsDiff = endMins + userStart[0].split(':')[1]
                        }
                    }
                    calculatedTime = calculatedTime + (hoursDiff * 60) + minsDiff
                    minsRequired = minsRequired - calculatedTime
                    return true
                })
            }
            if (minsRequired > 0) {
                if (userChoosenDay === 6) {
                    userChoosenDay = 0;
                }
                else {
                    userChoosenDay += 1;
                }

                const daysInMonth = new Date(userChoosenYear, userChoosenMonth + 1, 0).getDate();

                if (userChoosenDate === daysInMonth) {
                    userChoosenDate = 1;
                    userChoosenMonth += 1;
                } else if (userChoosenDate === daysInMonth && userChoosenMonth === 11) {
                    userChoosenMonth = 0;
                    userChoosenDate = 1;
                    userChoosenYear += 1;
                } else {
                    userChoosenDate += 1;
                }
                outputTime();
            }
            else {
                setFieldValue('end_date', `${userChoosenDate}/${userChoosenMonth + 1}/${userChoosenYear}`)
                return true;
            }
        }
    }

    return (
        <>
            <div className='hero-element'>
                <h2> Create New Plan </h2>
                <div className='sub-element'>
                    <h3> <u> Title of your plan </u> </h3>
                    <input type='text' name='name' value={values.name} onChange={handleChange} />
                </div>

                <div className='sub-element'>
                    <h3> <u> Select Books </u> </h3>
                    {
                        values.books.map((nbooks, index) => (
                            <>
                                <select onChange={(e) => handleAddBook(e, index)} defaultValue={nbooks.book_id} >
                                    <option value='' disabled={true}> Select a Book </option>
                                    {BooksList.map((books) => (
                                        <option value={books.id} key={books.id}> {books.name} </option>
                                    ))}
                                </select>

                                {values.books[index].book_id !== '' &&
                                    <div className='multiselect-div'>
                                        <Multiselect options={BooksList.filter(book => book.id === Number(nbooks.book_id))[0]?.chapters}
                                            selectedValues={values.books[index].chapters}
                                            onSelect={(selectedList) => setFieldValue(`books[${index}].chapters`, selectedList)}
                                            onRemove={(selectedList) => setFieldValue(`books[${index}].chapters`, selectedList)}
                                            showCheckbox
                                            displayValue="name" />
                                    </div>
                                }
                                <br />
                            </>
                        ))
                    }
                    <button type='button' onClick={(e) => handleNewBook(e)}> ADD BOOKS </button>
                </div>

                <div className='sub-element'>
                    <h3> <u> Select Timings </u> </h3>
                    <div className='day-heading'>
                        {
                            DaysOfWeek.map((weekdays, i) => (
                                <div>
                                    <div key={i}> {weekdays} </div> <br />
                                    {
                                        values.timing[i].map((bookTime, index) => (
                                            <div>
                                                <div>
                                                    <select name='start' onChange={(e) => handleTimeSelect(e, index, i)} defaultValue=''>
                                                        <option value='' disabled={true}> START TIME </option>
                                                        {TimingsSlot.map((displayTime, i) => (
                                                            <option value={displayTime} key={i}> {displayTime} </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <select name='end' onChange={(e) => handleTimeSelect(e, index, i)} defaultValue=''>
                                                        <option value='' disabled={true}> END TIME </option>
                                                        {TimingsSlot.map((displayTime, i) => (
                                                            <option value={displayTime} key={i}> {displayTime} </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <br />
                                            </div>
                                        ))
                                    }
                                    <button className='timeslot-button' onClick={() => handleTimeSlot(i)}> + </button>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='sub-element'>
                    <h3> <u> Duration </u> </h3>
                    <div className='duration-elements'>
                        <div> Start Date <DatePicker selected={values.start_date} minDate={new Date()} onChange={(date) => setFieldValue('start_date', date)} showIcon /> </div>
                        <div className='enddate-elements'>
                            <div> End Date </div> &nbsp;
                            <div className='enddate-div'> {values?.end_date} </div>
                        </div>
                    </div>
                </div>

                <div>
                    <button className='save-button' type='submit' onClick={handleSubmit}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="30"
                            height="30"
                            class="icon"
                        >
                            <path
                                d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"
                            ></path>
                        </svg>
                        <span> SAVE </span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default MainForm