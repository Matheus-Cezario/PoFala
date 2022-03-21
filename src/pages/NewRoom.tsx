import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"

import '../styles/auth.scss'
import { Button } from "../components/Button";
import { Link } from 'react-router-dom';


export function NewRoom(){

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
                    <h2>Criar uma nova sala</h2>
                    <form>
                        <input type="text" placeholder="Nome da sala" />
                        <Button type="submit">Criar sala</Button>
                    </form>
                    <p>Queer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}