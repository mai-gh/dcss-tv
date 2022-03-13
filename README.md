# DCSS-TV

## Dungeon Crawl Stone Soup Television


The point of this project is to automate spectating games of the webtiles version of dungeon crawl stone soup. 

DCSS-TV is an electron app

to try it out: 

```
git clone https://github.com/mai-gh/dcss-tv.git && cd dcss-tv && npm install && npm start
```

to package as an electron app:

```
npm run pack-app
```

control flow:

1. open lobby page
2. check if logged in; if not wait for login
3. parse & shuffle the current games table
4. select a game that is not idle, if all idle go to 2
5. open it, watch the game!

6. if game goes idle (player afk greater than 30 seconds)
    - close game; go to 2
7. if game ends (death, player quit, etc)
    - go to 2

Notes:

- use Ctrl + Shift + i to open chrome dev panel in the app
- the url is fixed to [https://crawl.kelbi.org/](https://crawl.kelbi.org/)
    - to change this; edit win.loadURL() in main.js
    - more public servers are listed at [https://crawl.develz.org/play.htm](https://crawl.develz.org/play.htm)
    - you can also host your own webtiles server and point this app to spectage games there! [https://github.com/crawl/crawl/blob/master/crawl-ref/source/webserver/README.md](https://github.com/crawl/crawl/blob/master/crawl-ref/source/webserver/README.md)

- this project is a complete re-write of a project i did a few years ago that used python3 and selenium webdriver. [https://notabug.org/mai/dcss-watch](https://notabug.org/mai/dcss-watch) this version is much better!

- next rewrite will probably involve forking [https://github.com/crawl/crawl](https://github.com/crawl/crawl) and adding "auto-spectate" functionality directly to the webtiles server!
