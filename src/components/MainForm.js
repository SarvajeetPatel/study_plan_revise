import React, { useEffect, useState } from 'react'
import BooksList from './BooksList'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import Multiselect from 'multiselect-react-dropdown'
import TimingsSlot from './TimingsSlot'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

function MainForm() {
    let sum = 0;
    const [flag, setFlag] = useState(0)
    const [words, setWords] = useState(0)
    const DaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
        initialValues: {
            id: '',
            name: '',
            books: [{ book_id: '', chapters: [] }],
            timing: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
            start_date: '',
            end_date: '',
            created_date: new Date()
        },
        onSubmit: (values) => {
            const existingData = JSON.parse(localStorage.getItem('')) || []
            const nameCheck = existingData.filter(item => item.name === values.name) || []
            if (nameCheck.length > 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "USER HAS ALREADY APPEARED THE EXAM!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                })
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Booked successfully!",
                    showConfirmButton: false,
                    timer: 1000
                })
                existingData.push(values)
                localStorage.setItem('bookingDetails', JSON.stringify(existingData))
            }
            console.log(values)
        }
    })

    useEffect(() => {
        values.books.map(nbooks => (
            nbooks.chapters.forEach(chapter => sum += chapter.no_of_words)
        ))
        setWords(sum)
    }, [values.books])

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
        if (name === 'start') {
            values.timing[i][index].start = value
        } else if (name === 'end') {
            values.timing[i][index].end = value
            setFlag(prev => prev + 1)
        }
        setFieldValue('timing', values.timing)
    }


    let calculatedTime = 0, hoursDiff, minsDiff;
    function outputTime() {
        let userChoosenDate, userChoosenDay, userChoosenMonth, userChoosenYear
        let minsRequired = (words / 50)
        // let totalDayHours = 0;
        // let totalDayMins = 0;
        if (values.start_date) {
            userChoosenDay = values?.start_date?.getDay()
            userChoosenDate = values?.start_date?.getDate()
            userChoosenMonth = values?.start_date?.getMonth()
            userChoosenYear = values?.start_date?.getFullYear()
            console.log(values.timing[userChoosenDay], 'userrrr')

            if (values.timing[userChoosenDay].length > 0) {
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
                    return 0;
                })
                console.log(calculatedTime)
            }
            if (minsRequired - calculatedTime > 0) {
                minsRequired = minsRequired - calculatedTime
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
                var finalDate = new Date(userChoosenYear, userChoosenMonth, userChoosenDate);
                console.log(finalDate, 'date')
                return finalDate;
            }
        }
    }

    useEffect(() => {
        let calculatedEndDate = outputTime()
        setFieldValue('end_date', calculatedEndDate)
    }, [flag])

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
                                    <button onClick={() => handleTimeSlot(i)}> + </button>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='sub-element'>
                    <h3> <u> Duration </u> </h3>
                    <div>
                        Start Date <DatePicker selected={values.start_date} minDate={new Date()} onChange={(date) => setFieldValue('start_date', date)} showIcon />
                        &nbsp; &nbsp; &nbsp;
                        End Date <div className='enddate-div'> {values?.end_date} </div>
                    </div>
                </div>

                <div>
                    <button type='submit' onClick={handleSubmit}> SAVE </button>
                </div>
            </div>
        </>
    )
}

export default MainForm