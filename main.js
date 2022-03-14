const { app, BrowserWindow, session } = require('electron')

const maxIdleTimeout = 45;
const maxLoadingTimeout = 15;





const createWindow = () => {
  const win = new BrowserWindow({
//    width: 800,
//    height: 600,
//    nodeIntegration: true,
    frame: false ,
    titleBarStyle: 'hidden',
    show: false,
    fullscreen: true,
    webPreferences: {
      nativeWindowOpen: true,
    }
  })

  //win.setMenu(null)
  win.loadURL('https://crawl.kelbi.org/')
//  win.loadURL('http://127.0.0.1:8080')
  win.maximize()
  win.show()
  //win.openDevTools();

  win.webContents.once('dom-ready', () => {
    win.webContents.executeJavaScript(`
      const msg = (str) => {
        const textContainerNode = document.createElement("span");
        textContainerNode.classList.add('fg5')
        const textNode = document.createTextNode(str);
        textContainerNode.appendChild(textNode);
        const messageContainerNode = document.createElement("div");
        messageContainerNode.classList.add('game_message')
        messageContainerNode.appendChild(textContainerNode)
        document.getElementById("messages").appendChild(messageContainerNode);
      }

      const chatMsg = (msg) => {
        const senderText = document.createTextNode('LOG');
        const senderContainer = document.createElement("span");
        senderContainer.classList.add('chat_sender');
        senderContainer.appendChild(senderText);

        const messageText = document.createTextNode(msg);
        const messageContainer = document.createElement("span");
        messageContainer.classList.add('chat_msg');
        messageContainer.appendChild(messageText);

        const colon = document.createTextNode(': ');

        document.getElementById("chat_history").appendChild(senderContainer);
        document.getElementById("chat_history").appendChild(colon);
        document.getElementById("chat_history").appendChild(messageContainer);
        document.getElementById("chat_history").appendChild(document.createElement("br"));
      }

      const controlFlow = async () => {
        while (true) {
          const initialExitGameMessage = document.getElementById('exit_game').innerText;;

          while (!document.getElementById('login_message').innerText.includes('Logged in as ')) {
            console.log("not logged in")
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          while (document.querySelectorAll('#player_list tbody tr').length < 1) {
            console.log("rows not found")
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

            let unsortedRowsArray = [];
            for (let row of document.querySelectorAll('#player_list tbody tr')) {
              unsortedRowsArray.push(row)
            }

            // shuffle!
            let rows = unsortedRowsArray.map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value)

          loopWalkRows:
          for (let row of rows) {
            //console.log('------------------')
            let idleTime = document.querySelectorAll('#' + row.id + ' .idle_time')[0].getAttribute('data-time')
            //console.log('idleTime: ', idleTime)

            if (idleTime == 0 ) {
              const button = document.querySelectorAll('#' + row.id + ' .username')[0].firstChild
              //console.log('click', row)
              button.click()

              let loadingCounter = 0;
              while (!document.getElementById('stats_titleline')) {
                //wait to be in game
                await new Promise(resolve => setTimeout(resolve, 1000));
                loadingCounter++
                if (loadingCounter >= ${maxLoadingTimeout}) {
                  // stuck on loading page
                  break loopWalkRows;
                }
              }
              let newGameHTML = document.getElementById('game').innerHTML;
              let oldGameHTML;
              let gameMatchCounter = 0;

              //document.getElementById('chat_hide_button_span').click()

              while (true) {
                //document.getElementById('game').style.pointer-events = 'none';
                document.getElementById('overlay').style.display = "none";
                await new Promise(resolve => setTimeout(resolve, 1000));


                if (!document.getElementById('normal')) {
                  // you are no longer wathing a game,
                  // escape was probably pushed
                  // and you are probably in the lobby
                  console.log('Detected Spectator Out Of Game View!')
                  break loopWalkRows;
                }

                oldGameHTML = newGameHTML;
                newGameHTML = document.getElementById('game').innerHTML;

                if (newGameHTML === oldGameHTML) {
                  gameMatchCounter++
                  //chatMsg(gameMatchCounter)
                //  console.log('newGameHTML oldGameHTML MATCHED, COUNTER: ', gameMatchCounter)
                } else {
                  gameMatchCounter = 0
                //  console.log('newGameHTML oldGameHTML NOTMATCHED, COUNTER: ', gameMatchCounter, row.id)
                }

                if (gameMatchCounter >= ${maxIdleTimeout}) {
                  // game went idle
                  console.log('CHANGE CHANNEL (player idle out):', 'idle for: ', gameMatchCounter, ' >=', ${maxIdleTimeout})
                  document.dispatchEvent(new KeyboardEvent("keydown", {keyCode: 27})) // send escape key
                  break loopWalkRows;
                }

                //idleTime = document.querySelectorAll('#' + row.id + ' .idle_time')[0].getAttribute('data-time')
                //console.log('row.id = ', row.id, 'idleTime = ', idleTime)

                let exitGameMessage = document.getElementById('exit_game').innerText;
                if (exitGameMessage != initialExitGameMessage) {
                  console.log('GAME MESSAGE NOT MATCH! (GAME ENDED)')
                  //document.getElementById('exit_game').innerText = initialExitGameMessage;
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  //console.log('probably need to push ok')
                  break loopWalkRows;

                }
                //console.log('exitGameMessage: ', exitGameMessage)
              }
              break loopWalkRows;
            }
          }
          console.log('finished walking table')
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      controlFlow()

    `)
  })
}

app.whenReady().then(() => {
  createWindow()
})
