# Jeopardy Talambuhay

Questions for presentation:
-category 1 100, i live in new jersey
-category 1 400, leo tolstoy wrote war and peace, my favorite book
-category 2 200, this rock is in central park and i go there sometimes
-category 2 100, beethoven composed it and I play piano pieces including those by beethoven
-category 3 400, I have a pet mini goldendoodle


Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating this project 
```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create jeopardy-talambuhay
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

~~You can preview the production build with `npm run preview`.~~
Because we use a custom node server adapter, you can run the production server with `npm run start`.
You need node version 23 or higher in order to run typescript files directly. 

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Deploy 

We use a node server to run the app. on the terminal in your production server, run:

```bash
npm run start
``` 
