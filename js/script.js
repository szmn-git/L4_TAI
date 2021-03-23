let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let questionIndex = document.querySelector('#index');
let answers = document.querySelectorAll('.list-group-item');

let list = document.querySelector('.list');
let results = document.querySelector('.results');

let userScorePoint = document.querySelector('.userScorePoint');
let average = document.querySelector('.average');
let score = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
let preQuestions = [];

const getQuestions = fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        return resp
    });

window.onload = async () => {
    preQuestions = await getQuestions;
    setQuestion(0);
}

function setQuestion(index) {
    //clearClass();
    question.innerHTML = preQuestions[index].question;
    questionIndex.innerHTML = index + 1;

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }


    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];
}


next.addEventListener('click', function () {
    index++;
    if (index >= preQuestions.length) {
        list.style.display = 'none';
        results.style.display = 'block';
        userScorePoint.innerHTML = points;

        //localStorage.removeItem("savedResults");
        let games = JSON.parse(localStorage.getItem("savedResults"));


        if (games === null) {
            let newGame = {
                "numberOfGames": 1,
                "averageScore": points
            };
            localStorage.setItem("savedResults", JSON.stringify(newGame));

        } else {
            let newGame = {
                "numberOfGames": games.numberOfGames + 1,
                "averageScore": (games.averageScore + points) / (games.numberOfGames + 1)
            };
            localStorage.setItem("savedResults", JSON.stringify(newGame));

        }

        let savedGame = JSON.parse(localStorage.getItem("savedResults"));
        average.innerHTML = savedGame.averageScore;

    } else {
        setQuestion(index);
        activateAnswers();
        for (let i = 0; i < answers.length; i++) {
            answers[i].classList.remove('correct');
            answers[i].classList.remove('incorrect');
        }
    }
});

previous.addEventListener('click', function () {

    if (index > 0) {
        index--;
        setQuestion(index);
    }
    disableAnswers();
    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove('correct');
        answers[i].classList.remove('incorrect');
    }
});

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}
activateAnswers();

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}


function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        score.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}


restart.addEventListener('click', function (event) {
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
    list.style.display = 'block';
    results.style.display = 'none';
});