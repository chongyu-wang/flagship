export const userDataQuestions = [
    "What is your name?",
    "What is your gender?",
    "What is your age?"
];

export const questionnaireQuestions = [
    "Can you describe your childhood and any memorable events or experiences?",
    "What is the most significant achievement in your life so far, and why?",
    // "Have you faced any major challenges or obstacles, and how did you overcome them?",
    // "What was a pivotal moment or turning point in your career or personal life?",
    // "Can you tell me about a time when you had to make a difficult decision?",
    // "What are some of the happiest moments you’ve experienced?",
    // "Have there been any life-changing events that shaped who you are today?",
    // "What important lessons have you learned from your relationships and interactions with others?",
    // "How have your beliefs or values evolved over time, and what influenced these changes?",
    // "Can you share a story about a person who had a significant impact on your life?"
];

export const registerAnswer = (newAnswer, setAnswers) => {
    setAnswers((answers) => {
        return [...answers, newAnswer];
    });
};

export const handleUserDataSubmit = (newAnswer, setAnswers, setSurveyPhase) => {
    registerAnswer(newAnswer, setAnswers);
    setSurveyPhase(1);
    setAnswers([]);
};

export const handleQuestionnaireSubmit = (newAnswer, setAnswers, setSurveyPhase) => {
    registerAnswer(newAnswer, setAnswers);
    setSurveyPhase(2);
    alert("done");
    // All questions answered, handle form submission
    // const username = user.user.username;
    // const jsonData = {
    //     username: username,
    //     prompt: "help me guage this peron's personality",
    //     questionnaire: questionnaireQuestions.map((question, index) => ({
    //         question: question,
    //         answer: answers[index]
    //     }))
    // };

    // console.log(JSON.stringify(jsonData));
    // Alert.alert("Submitted Answers", JSON.stringify(jsonData));
    // Here you would handle the actual saving of answers, e.g., sending them to an API

    // setResponseData("Querying...");
    // fetch(`http://${SERVER_IP}:3000/chatgpt`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ input: jsonData }),
    // })
    //     .then((response) => {
    //         console.log('Response:', response);
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok: ' + response.statusText);
    //         }
    //         return response.json();
    //     })
    //     .then((data) => {
    //         console.log('Data:', data);
    //         setResponseData(data.response);
    //         // setChatLog(prevChatLog => [...prevChatLog, { user: "gpt", message: data.response }]);
    //     })
    //     .catch((error) => {
    //         console.error('Error:', error);
    //     })
    //     .finally(() => {
    //         // router.replace("/home");
    //         console.log("A");
    //     });
};
