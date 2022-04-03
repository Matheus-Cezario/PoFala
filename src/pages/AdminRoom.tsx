import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
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


export function AdminRoom(){
    const navigate = useNavigate();
    const {id} = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState('');
    const {user} = useAuth();

    const {questions,title} = useRoom(id);

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
    
    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Tem certeza que você deseja excluir esta pergunta?')){
            await database.ref(`rooms/${id}/questions/${questionId}`).remove();
        }
    }

    async function handleEndRoom(){
        await database.ref(`rooms/${id}/`).update({
            endedAt: new Date(),
        })
        navigate('/');
    }
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Let Me Ask" />
                    <div>
                        <RoomCode code={id}/>
                        <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    
                </div>
                <div className="question-list">
                {questions.map((question) =>{
                    return (
                    <Question key={question.id} {...question}>
                        <button
                        type="button"
                        onClick={() => handleDeleteQuestion(question.id)}>
                            <img src={deleteImg} alt="Remover pergunta" />
                        </button>
                    </Question>
                    )
                })}
                </div>
            </main>
        </div>
    )
}