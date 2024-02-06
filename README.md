# RunJava-code-at-backend

## Build
Run `node server.js` to run this project. 

## Dependencies
Node v20.11.0 
Download: https://nodejs.org/en/download

## Notes
I essentially needed to test a project, so I create a backend that ran java code. Takes the context of the string, writes it in a .java file, then runs it on where it is being hosted on.
Takes the name of the class and uses it as the name of the java file. 
Cleans up by unlinking

## How to connect
- Send to url: `https://localhost:3030` or the url of where it is being hosted with the port of `3030`.
- POST `/executeJava` (Full Url `https://localhost:3030/executeJava`)
- Make sure the header is `text/plain` and that it gets sent as a string (Very Important).
- Lastly, if you are hosting it remotely, update CORS with the url of the hosted server or it will get blocked by browser.

## WARNING
If you are using this for a live build, please update to prevent injections or add other protection for security reasons!