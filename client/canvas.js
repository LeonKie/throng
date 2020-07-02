const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const x_center = canvas.width/2;
const y_center = canvas.height/2;



ctx.fillStyle = "#FF0000";
ctx.beginPath();
ctx.arc(x_center, y_center , 100, 0, 2 * Math.PI);
ctx.stroke();


//game constanst parametes
const answerRad=100

const gameSetup= {
    "question": "Wo gehts heute hin?",
    "answer": ["Indisch","Chinesisch", "Italienisch","Döner"]
}

const gameState= {
    
}

showGameSetup(gameSetup)

function showGameSetup(gameSetup){
    const answers= gameSetup["answer"]
    // calc answer Positions
    const sectionSize = 2 * Math.PI / answers.length

    const answerPositions = answers.map((a, i) => {
        
        const angle=  sectionSize * (i+1)
        const xx = x_center + (answerRad * Math.cos(angle))
        const yy = y_center + (answerRad * Math.sin(angle))
        return [xx,yy]
    });
    drawQuestions(answerPositions)
}

function drawQuestions(answerPositions) {
    answerPositions.forEach((a,i) => {
        ctx.beginPath();
        ctx.arc(a[0], a[1] , 5, 0, 2 * Math.PI);
        ctx.fill();
    });
}



function showAllPlayers(players){


}

