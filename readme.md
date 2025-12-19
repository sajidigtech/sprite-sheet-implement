<!-- step 1 -->

npm init -y

npm i pixi.js

npm i vite --save-dev

add into package.json : ->


"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "vite build",
    "preview": "vite preview",
    "dev":"vite"
  },

------------------------------------------------------------------------------------------------------------------------------
<!-- step 2 -->

assets folder , index.html, link with main.js 
find spritesheet and generate atlas for them

blast.png : atlas -> blast.json
spriteImage.png -> player.json

------------------------------------------------------------------------------------------------------------------------------

<!-- step 3 -->

create main.js -> link with index.html 
