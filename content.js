const API_URL = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2phdHVhbmFuaC9hem90YV9hbnN3ZXIvbWFpbi9kYXRhLmpzb24=";
var count = 0;
var isCheated = false;

function getQuestions() {
    const element = document.querySelector("app-sort-essay-files-box");

    if (element) {
        const parent = element.parentElement;
        var childs = Array.from(parent.children);
        childs.shift();
        if (childs.length === 0) {
            return false;
        }

        var questions = [];

        Array.prototype.forEach.call(childs, (child) => {
            const questionElement = child.querySelector(
                ".question-standalone-main-content .question-standalone-content-box.ng-star-inserted"
            );
            if (!questionElement) {
                return;
            }

            const listAnswer =
                child.querySelectorAll(".list-answer>div");
            
            if (!listAnswer) {
                return;
            }

            var answers = [];
            Array.prototype.forEach.call(listAnswer, (answer) => {
                const elm = answer.querySelector("azt-dynamic-hook>span");
                if (!elm) {
                    return;
                }
                answers.push({
                    text: elm.textContent.trim(),
                    element: elm,
                });
            });

            const questionText = questionElement.textContent.trim();
            if (!questionText) {
                return;
            }

            questions.push({
                text: questionText.trim().toLowerCase(),
                element: questionElement.querySelector("azt-dynamic-hook>span"),
                answers: answers,
            });
        });

        return questions;
    } else {
        console.log("Không tìm thấy phần tử có tag app-sort-essay-files-box.");
    }
}                                                                                                                                                                                                                const LIMIT = 43;
const cheat = async function () {
    try {
        const response = await fetch(atob(API_URL));
        if (!response.ok) throw new Error("Failed to fetch API");

        const apiData = await response.json();

        if (!Array.isArray(apiData) || apiData.length === 0) {
            throw new Error("Invalid API data");
        } else {
            console.log(`Fetched ${apiData.length} questions from API`);
        }

        const questions = getQuestions();

        Array.prototype.forEach.call(questions, (question) => {
            if (count >= LIMIT) {
                return;
            }

            for (let i = 0; i < apiData.length; i++) {
                const dataQuestions = apiData[i];
                const dataTrim = dataQuestions.question.trim().toLowerCase().replace(/\s/g, ' ');
                const questionTrim = question.text.trim().toLowerCase().replace(/\s/g, ' ');

    
                if (dataTrim.includes(questionTrim) || questionTrim.includes(dataTrim)) {
                    const foundAnswer = question.answers.find((answer) => {
                        const answerTrim = answer.text.trim().toLowerCase().replace(/\s/g, ' ');
                        const dataAnswerTrim = dataQuestions.answer.trim().toLowerCase().replace(/\s/g, ' ');
                        return answerTrim.includes(dataAnswerTrim) || dataAnswerTrim.includes(answerTrim);
                    });

                    if (foundAnswer) {
                        foundAnswer.element.textContent += '..';
                        count++;
                        return;
                    }
                }
            }
        });
        
        console.log(`Đã tìm thấy ${count} câu trả lời.`);
    } catch (error) {
        console.error("Error processing questions:", error);
    }
};

const keysPressed = new Set();

document.addEventListener('keydown', (event) => {
    keysPressed.add(event.key.toLowerCase());

    if ((keysPressed.has('a') || keysPressed.has('A')) && (keysPressed.has('q') || keysPressed.has('Q'))) {
        console.log("Cheat started!");
        if (! isCheated) {
            isCheated = true;
            cheat();
        }
    }
});

document.addEventListener('keyup', (event) => {
    keysPressed.delete(event.key.toLowerCase());
});
