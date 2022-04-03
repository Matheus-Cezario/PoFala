import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";
type Likes = Record<string,{
    authorId: string;
}>

type FirebaseQuestion =  {
    author: {
      name: string;
      avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Likes
  }

export type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeId: string | undefined,
    likeCount: number
}

export function useRoom(id: string | undefined){
    const {user} = useAuth();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');
    useEffect(() => {  
        setQuestions([]);   
        const roomRef = database.ref(`rooms/${id}`);
        roomRef.once('value', room => {
            const databaseRoom = room.val()
            setTitle(databaseRoom.title)
        })

        const questionRef = database.ref(`rooms/${id}/questions`)
        questionRef.on('child_added', question => {
            var value: FirebaseQuestion = question.val();
            var newValue = {
                ...value,
                id: question.key ?? '', 
                likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                likeCount: Object.values(value.likes ?? {}).length,
            } as QuestionType 
            setQuestions(q => [...q,newValue])
        })
        questionRef.on('child_changed', question => {
            var value: FirebaseQuestion = question.val();
            setQuestions(questions => {
                var parsedQuestions = Object.assign<QuestionType[],QuestionType[]>([],questions);
                var indexQuestion = parsedQuestions.findIndex(q => q.id == question.key)
                if(indexQuestion >= 0){
                    parsedQuestions[indexQuestion].likeId = Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0];
                    parsedQuestions[indexQuestion].likeCount = Object.values(value.likes ?? {}).length;
                    parsedQuestions[indexQuestion].isAnswered = value.isAnswered;
                    parsedQuestions[indexQuestion].isHighlighted = value.isHighlighted;
                }
                return parsedQuestions;
            })
        })
        questionRef.on('child_removed', question => {
            setQuestions(questions => {
                return Object.assign<QuestionType[],QuestionType[]>([],questions.filter(q => q.id != question.key));
            })
        })
        return () => {
            roomRef.off('value');
            questionRef.off('child_added');
            questionRef.off('child_changed');
            questionRef.off('child_removed');
        }
    },[id,user?.id])

    return {questions,title}
}