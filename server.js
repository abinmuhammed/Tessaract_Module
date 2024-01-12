const express = require("express");
const app = express();
// multer importing
const multer = require("multer");
const tesseract = require("tesseract.js");
const Jimp = require("jimp");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const port = 3000;

app.get("/", (req, res) => {
  res.send("hello" + "express");
});

app.post("/updloadFile", upload.single("image"), async (req, res) => {
  try {
    const image = await Jimp.read(req.file?.buffer);
    const {
      data: { text },
    } = await tesseract.recognize(req.file.buffer, "eng");

    console.log("Extracted text:", text);
    const lines = text.split("\n");
    const keyValuePairs = {};
    console.log(lines, "lines");

    const results = []; 
    const questionLines =[]
    const questionLines2 =[]
    let previousQuestion = null;

    for (const line of lines) {
      const questionMatch = line.match(/(\d+)\. (.*)/); // Match question number and text
      if ( questionMatch){
        questionLines.push(questionMatch[1]+"."+questionMatch[2])
      }
    }
    console.log(questionLines,"questions");

    for ( const line of questionLines){
        const questionMatchYesOrNO = line.match(/\[([^\]]*)\]/);
        console.log(questionMatchYesOrNO,"123");
        // questionLines2.push(questionMatchYesOrNO[1],questionMatchYesOrNO[2])
    }

    console.log(questionLines2);


    // console.log(questionLines);


    // for (const line of lines) {
    //     const match = line.match(/(\d+)\. (.*)\.\s*\[([^\]]*NA)\]/);
    //     console.log(match);
    //     if (match) {
    //       const questionNumber = match[1];
    //       const answer = match[3];

    //       // Check if the answer contains "NA"
    //       if (answer.includes("NA")) {
    //         // Create key-value pairs based on the question number and answer
    //         keyValuePairs[`${questionNumber}. Yes`] = answer.includes("Yes");
    //         keyValuePairs[`${questionNumber}. No`] = answer.includes("No");
    //       }
    //     }
    //   }
    console.log(keyValuePairs, "key value pairs");
    res.send(keyValuePairs);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
