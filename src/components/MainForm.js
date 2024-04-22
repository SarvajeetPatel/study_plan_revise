import React from 'react'
import BooksList from './BooksList'
import { useFormik } from 'formik'

function MainForm() {
    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
        initialValues: {
            id: '',
            name: '',
            books: [],
            timing: {},
            start_date: '',
            end_date: '',
            created_date: new Date()
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    console.log(values)
    return (
        <>
            <h2> Create New Plan </h2>
            <div>
                <h3> Title of your plan </h3>
                <input type='text' name='name' value={values.name} onChange={handleChange} />
            </div>

            <div>
                <h3> Select Books </h3>
                <select onChange={(e) => setFieldValue('books', { book_id: e.target.value, chapters: [] })}>
                    {BooksList.map((books) => (
                        <>
                            <option value={books.id} key={books.id}> {books.name} </option>
                        </>
                    ))}
                </select>
            </div>
        </>
    )
}

export default MainForm