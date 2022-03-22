import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import '../styles/room.scss';
type RoomParams = {
    id: string
}
type FirebaseQuestions = Record<string,{
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}>

type Question = {
    id: string | null,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}
export function Room(){

    const {id} = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState('');
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const {user} = useAuth();

    useEffect(() => {
        setQuestions([])
        const roomRef = database.ref(`rooms/${id}`);
        roomRef.once('value', room => {
            const databaseRoom = room.val()
            setTitle(databaseRoom.title)
        })
        const questionRef = database.ref(`rooms/${id}/questions`)
        questionRef.on('child_added', room => {
            questions.push({id: room.key, ...room.val()})
            setQuestions(questions)
        })
        return () => questionRef.off()
    },[id])

    async function handleSendQuestion(event: FormEvent){
        event.preventDefault()
        if(newQuestion.trim() === ''){
            return;
        }
        if(!user){
            throw new Error('You must be logged in')
        }

        const question ={
            content: newQuestion,
            author:{
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${id}/questions`).push(question);
        setNewQuestion('');
    }
    
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Let Me Ask" />
                    <RoomCode code={id}/>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {user ? 
                        (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : 
                        (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        )}
                        
                        <Button disabled={!user} type="submit">Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions.map(q => q.content + " | "))}
            </main>
        </div>
    )
}