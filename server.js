const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3030;

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'POST',
};

app.use(express.text());
app.use(cors());
app.use(cors(corsOptions));

app.post('/executeJava', async(req, res) => {
  let javaCode = req.body;

  if (typeof javaCode !== 'string') {
    console.log('Invalid Java code provided.');
    return res.status(400).send('Invalid Java code provided.');
  }

  javaCode = javaCode.trim();
  if (!javaCode) {
    console.log('Empty Java code provided.');
    return res.status(400).send('Empty Java code provided.');
  }

  const className = extractClassName(javaCode);
  const fileName = `${className}.java`;
  const fileName2 = `${className}.class`;
  await fs.writeFileSync(fileName, javaCode);

  exec(`javac ${fileName} && java ${fileName.replace('.java', '')}`, async (error, stdout, stderr) => {
    console.log('Current Working Directory:', process.cwd());
    await fs.unlinkSync(fileName);
    if (error) {
      console.log(stderr);
      let response = stderr.substring(0, stderr.length - 10);
      res.send(response.replaceAll('^', ''));
    } else {
      await fs.unlinkSync(fileName2);
      res.send(stdout);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

function extractClassName(javaCode) {
  const classRegex = /class\s+(\w+)/;
  const match = javaCode.match(classRegex);

  if (match && match[1]) {
    return match[1];
  } else {
    return 'Main';
  }
}
