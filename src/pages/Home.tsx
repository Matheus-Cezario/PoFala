import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import gooogleIconImg from "../assets/images/google-icon.svg"

import '../styles/auth.scss'
import { Button } from "../components/Button";

import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";


export function Home(){
    const navigate = useNavigate();
    const {user, signInWithGoogle} = useAuth()
    const [roomCode, setRoomCode] = useState('')
    async function handleCreateRoom(){ 
        if(!user){
            await signInWithGoogle();
        }
        navigate('/rooms/new');
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();
        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();
        if(!roomRef.exists()) {
            alert(`Could not find room ${roomCode}`);
            return;
        }

        navigate(`/rooms/${roomCode}`)
    }
    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustação simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire duvidas da sua audiencia em tempo-real.</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Let Me Ask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={gooogleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text" placeholder="Digite o código da sala" onChange={event => setRoomCode(event.target.value)} value={roomCode}/>
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}