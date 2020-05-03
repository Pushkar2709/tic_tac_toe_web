#include<bits/stdc++.h>
#include<conio.h>
using namespace std;
char board[3][3] = {{' ', ' ', ' '}, 
                    {' ', ' ', ' '}, 
                    {' ', ' ', ' '}};
char players[2] = {'X', 'O'};
int currplayer, available_cnt = 9, computer = 1;
vector < vector <int> > available(3, vector <int> (3, 0));
char Check_Winner()
{
    for (int i=0;i<3;i++)
    {
        if (board[i][0] != ' ' && board[i][0] == board[i][1] && board[i][1] == board[i][2])
        return board[i][0];
    }
    for (int i=0;i<3;i++)
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

int minimax(int x)
{
    if (Check_Winner() == players[computer])
    return -1;
    else if (Check_Winner() == players[(computer+1)%2])
    return 1;
    int ans, k = 0;
    if (x == computer)
    ans = INT_MAX;
    else
    ans = INT_MIN;
    for (int i=0;i<3;i++)
    {
        for (int j=0;j<3;j++)
        {
            if (board[i][j] == ' ')
            {
                k = 1;
                board[i][j] = players[x];
                if (x == computer)
                ans = min(ans, minimax((x+1)%2));
                else
                ans = max(ans, minimax((x+1)%2));
                board[i][j] = ' ';
            }
        }
    }
    if (k)
    return ans;
    return 0;
}

pair <int, int> bestMove()
{
    int p = INT_MAX, q;
    pair <int, int> move;
    for (int i=0;i<3;i++)
    {
        for (int j=0;j<3;j++)
        {
            if (board[i][j] == ' ')
            {
                board[i][j] = players[computer];
                if (Check_Winner() == players[computer])
                {
                    move.first = i;
                    move.second = j;
                    board[i][j] = ' ';
                    return move;
                }
                q = minimax((computer+1)%2);
                // cout << q << " ";
                if (q < p)
                {
                    p = q;
                    move.first = i;
                    move.second = j;
                }
                board[i][j] = ' ';
            }
        }
    }
    return move;
}

void print()
{
    for (int i=0;i<3;i++)
    {
        for (int j=0;j<3;j++)
        {
            cout << board[i][j] << " ";
            if (j != 2)
            cout << " | ";
        }
        cout << "\n";
        if (i != 2)
        cout << "___|____|___\n";
    }
    cout << "   |    |   \n";
}
int main()
{
    srand(time(0));
    cout << "Who's First?\n";
    cout << "Enter \n1 for computer \n0 for yourself\n";
    cin >> currplayer;
    // currplayer = 1;
    // print();
    // cout << currplayer;
    pair <int, int> move;
    char winner;
    while (available_cnt)
    {
        print();
        cout << "\n";
        if (currplayer == 0)
        {
            cout << "Player " << players[currplayer] << " input the coordinates of the block for next move.\n";
            cin >> move.first >> move.second;
            move.first--; move.second--;
        }
        else
        {
            move = bestMove();
        }
        cout << move.first << " " << move.second << "\n";
        if (move.first < 0 || move.first > 2 || move.second < 0 || move.second > 2)
        {
            cout << "Invalid coordinates!!\n";
            cout << "Row and Column should be between 1 and 3\n";
            cout << "Try Again!!\n\n";
            break;
        }
        if (board[move.first][move.second] != ' ')
        {
            cout << "This block is not available. Try another block!\n\n";
            continue;
        }
        board[move.first][move.second] = players[currplayer];
        available_cnt--;
        winner = Check_Winner();
        if (winner != 'T')
        {
            print();
            cout << winner << " is the WINNER!!\n";
            break;
        }
        currplayer = (currplayer+1)%2;
    }
    if (winner == 'T')
    {
        print();
        cout << "\nMatch TIED!!\n";
    }
    cout << "\nPress ENTER to exit!!\n";
    getch();
    return 0;
}