import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import "/src/App.css"
export default function App() {
    
    const [notes, setNotes] = React.useState(
        // Helps to sync the notes with the local storage
       () => JSON.parse(localStorage.getItem("notes")) || [] // Lazy initialization that is only called once
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0]?.id) // If notes[0] exists, then notes[0].id, else "" 
        || ""
        
    )
    const currentNote = notes.find(note => note.id === currentNoteId
    ) || notes[0] // If the note with the currentNoteId exists, then that note, else the first note in the notes array
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here",
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function deleteNote(event, noteId) {
        // Used to stop propagation of the event
        event.stopPropagation()
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
    }

    function updateNote(text) {
        // Try to rearrange the most recently-modified
        // not to be at the top
        setNotes(oldNotes => {
            const newArrangedNotes = []
            for(let i=0;i<oldNotes.length;i++) {
                if(oldNotes[i].id === currentNoteId) {
                    newArrangedNotes.unshift({ ...oldNotes[i], body: text })
                } else {
                    newArrangedNotes.push(oldNotes[i])
                }
            }
            return newArrangedNotes
        })
        
        // This does not rearrange the notes
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))
    }
    
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={currentNote} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
