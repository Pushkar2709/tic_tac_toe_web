var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var h = 400;
var w = 400;
var board = [[' ', ' ', ' '],
             [' ', ' ', ' '],
             [' ', ' ', ' ']];
var players = ['X', 'O'];
var currplayer = 0, available_cnt = 9, computer = 1, move = [0, 0], winner = 'T', wait = 1;
function Check_Winner()
{
    for (let i=0;i<3;i++)
    {
        if (board[i][0] != ' ' && board[i][0] == board[i][1] && board[i][1] == board[i][2])
        return board[i][0];
    }
    for (let i=0;i<3;i++)
    {
        if (board[0][i] != ' ' && board[0][i] == board[1][i] && board[1][i] == board[2][i])
        return board[0][i];
    }
    if (board[0][0] != ' ' && board[0][0] == board[1][1] && board[1][1] == board[2][2])
        return board[0][0];
    if (board[0][2] != ' ' && board[0][2] == board[1][1] && board[1][1] == board[2][0])
        return board[0][2];
    return 'T';
}

function print()
{
    ctx.clearRect(0, 0, w, h);
    ctx.moveTo(w/3, 0);
    ctx.lineTo(w/3, h);
    ctx.moveTo(2*w/3, 0);
    ctx.lineTo(2*w/3, h);
    ctx.moveTo(0, h/3);
    ctx.lineTo(w, h/3);
    ctx.moveTo(0, 2*h/3);
    ctx.lineTo(w, 2*h/3);
    ctx.stroke();
    ctx.font = "70px Comic Sans MS";
    ctx.textAllign = "center";
    for (let i=1;i<=3;i++)
    {
        for (let j=1;j<=3;j++)
        {
            ctx.fillText(board[j-1][i-1], (i-1)*w/3 + w/9, j*h/3 - w/9);
        }
    }
}

function getBlock(x, y)
{
    if (x <= w/3) move[1] = 0;
    else if (x > w/3 && x <= 2*w/3) move[1] = 1;
    else move[1] = 2;
    if (y <= h/3) move[0] = 0;
    else if (y > h/3 && y <= 2*h/3) move[0] = 1;
    else move[0] = 2;
    // console.log(move[0]);
    // console.log(move[1]);
}

function getMousePosition(canvas, event)
{
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top;
    // console.log(x);
    // console.log(y);
    getBlock(x, y);
}

function minimax(x)
{
    if (Check_Winner() == players[computer])
    return -1;
    else if (Check_Winner() == players[(computer+1)%2])
    return 1;
    var ans, k = 0, m;
    if (x == computer)
    ans = 1000;
    else
    ans = -1000;
    for (let i=0;i<3;i++)
    {
        for (let j=0;j<3;j++)
        {
            if (board[i][j] == ' ')
            {
                k = 1;
                board[i][j] = players[x];
                m = minimax((x+1)%2);
                if (x == computer && m < ans)
                ans = m;
                else if (x != computer && m > ans)
                ans = m;
                board[i][j] = ' ';
            }
        }
    }
    if (k == 1)
    return ans;
    return 0;
}

function BestMove()
{
    var p = 1000, q;
    for (let i=0;i<3;i++)
    {
        for (let j=0;j<3;j++)
        {
            if (board[i][j] == ' ')
            {
                board[i][j] = players[computer];
                if (Check_Winner() == players[computer])
                {
                    move[0] = i;
                    move[1] = j;
                    board[i][j] = ' ';
                    return;
                }
                q = minimax((computer+1)%2);
                if (q < p)
                {
                    p = q;
                    move[0] = i;
                    move[1] = j;
                }
                board[i][j] = ' ';
            }
        }
    }
}

function turn()
{
    if (currplayer == computer)
    {
        BestMove();
    }
    if (board[move[0]][move[1]] != ' ')
    {
        //Invalid
        // console.log(board[move[0]][move[1]]);
        console.log("Block not available");
    }
    else
    {
        // console.log(move[0]);
        // console.log(move[1]);
        // console.log(players[currplayer]);
        board[move[0]][move[1]] = players[currplayer];
        available_cnt--;
        winner = Check_Winner();
        if (winner != 'T')
        {
            print();
            //We have a winner
            console.log("We have a Winner");
        }
        currplayer = (currplayer+1)%2;
    }
}

let canvasElem = document.querySelector("canvas");
    canvasElem.addEventListener("mousedown", function(e)
    {
        if (available_cnt && currplayer != computer && winner == 'T')
        {
            getMousePosition(canvasElem, e);
            print();
            turn(currplayer);
            // currplayer = (currplayer+1)%2;
            print();
        }
        if (available_cnt && currplayer == computer && winner == 'T')
        {
            turn(currplayer);
            // currplayer = (currplayer+1)%2;
            print();
        }
    });

print();