/* If you are using this for live please add preventions for Injections!!! */
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3030;

/* For Cross Origin Resource Sharing */
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'POST',
};

app.use(express.text());
app.use(cors());
app.use(cors(corsOptions));

app.post('/executeJava', async(req, res) => {
  let javaCode = req.body;

  /* Currently only supports string */
  if (typeof javaCode !== 'string') {
    console.log('Invalid Java code provided.');
    return res.status(400).send('Invalid Java code provided.');
  }

  /* Checks for empty java string */
  javaCode = javaCode.trim();
  if (!javaCode) {
    console.log('Empty Java code provided.');
    return res.status(400).send('Empty Java code provided.');
  }

  const className = extractClassName(javaCode);
  const fileName = `${className}.java`;
  const fileName2 = `${className}.class`;
  await fs.writeFileSync(fileName, javaCode); // writes to a new file

  /* Executes the run command for java */
  exec(`javac ${fileName} && java ${fileName.replace('.java', '')}`, async (error, stdout, stderr) => {
    console.log('Current Working Directory:', process.cwd());
    await fs.unlinkSync(fileName); // removes the .java file
    if (error) {
      console.log(stderr);
      /* Shortens the string and removes carrots for cleaner error messages */
      let response = stderr.substring(0, stderr.length - 10);
      res.send(response.replaceAll('^', ''));
    } else {
      /* removes the .class file */
      await fs.unlinkSync(fileName2);
      /* sends a response with the output */
      res.send(stdout);
    }
  });
});

/* Listens on port 3030 */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

/* 
 * Function grabs the class name and returns it
 * New Java versions allow no main methods so it defaults to main.java
*/
function extractClassName(javaCode) {
  const classRegex = /class\s+(\w+)/;
  const match = javaCode.match(classRegex);

  if (match && match[1]) {
    return match[1];
  } else {
    return 'Main';
  }
}
