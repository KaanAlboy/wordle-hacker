import { list as listTr } from "./listTr.js";
import { list as listEn } from "./listEn.js";
import * as readline from "readline";

let list = [];
let orderedList = [];
const deletedLetters = [];
const mustLetters = [];
const guessStr = [];

const setFreqList = () => {
  function isUnique(str) {
    return new Set(str).size == str.length;
  }

  const frequencies = {};

  for (const word of list) {
    for (const letter of word) {
      if (frequencies.hasOwnProperty(letter)) {
        frequencies[letter] += 1;
      } else {
        frequencies[letter] = 1;
      }
    }
  }

  const wordPossibilities = [];
  for (const word of list) {
    if (!isUnique(word)) continue;
    let frequency = 1;
    for (const letter of word) {
      frequency += frequencies[letter];
    }
    wordPossibilities.push({
      w: word,
      f: frequency,
    });
  }

  orderedList = wordPossibilities.sort((a, b) => (a.f > b.f ? -1 : 1));

  console.log(`Önerilen Başlangıç Kelimesi: ${orderedList[0].w}`);
};

const update = (word, userInput) => {
  const wordArr = word.split("");
  const userInputArr = userInput.split("");

  for (let i = 0; i < wordArr.length; i++) {
    if (userInputArr[i] === "t") {
      guessStr.push({ letter: wordArr[i], pos: i });
    } else if (userInputArr[i] === "h") {
      mustLetters.push({ letter: wordArr[i], pos: i });
    } else {
      if (!deletedLetters.includes((letter) => letter === wordArr[i]))
        deletedLetters.push(wordArr[i]);
    }
  }

  alterList();
};

const alterList = () => {
  orderedList = orderedList.filter((item) => {
    let returnFlag = true;
    const word = item.w.split("");

    for (let index = 0; index < guessStr.length; index++) {
      const pos = guessStr[index].pos;
      const letter = guessStr[index].letter;

      if (word[pos] !== letter) {
        returnFlag = false;
        break;
      }
    }

    if (returnFlag) {
      for (let index = 0; index < mustLetters.length; index++) {
        const pos = mustLetters[index].pos;
        const letter = mustLetters[index].letter;

        if (word[pos] === letter) {
          returnFlag = false;
          break;
        } else if (word.includes(letter)) {
        } else {
          returnFlag = false;
          break;
        }
      }
    }

    if (returnFlag) {
      for (let index = 0; index < deletedLetters.length; index++) {
        const letter = deletedLetters[index];
        if (word.includes(letter)) {
          returnFlag = false;
          break;
        }
      }
    }

    return returnFlag;
  });
};

function askQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question("Dil (tr-en): ", (lang) => {
      if (lang === "en") {
        list = listEn;
      } else {
        list = listTr;
      }

      setFreqList();

      rl.question("İlk kelimeniz: ", (guess1) => {
        rl.question("İlk sonuç: ", (res1) => {
          update(guess1.toLowerCase(), res1.toLowerCase());
          console.log(`Tahminimiz: ${orderedList[0].w}`);

          rl.question("İkinci kelimeniz: ", (guess2) => {
            rl.question("İkinci sonuç: ", (res2) => {
              update(guess2.toLowerCase(), res2.toLowerCase());
              console.log(`Tahminimiz: ${orderedList[0].w}`);

              rl.question("Üçüncü kelimeniz: ", (guess3) => {
                rl.question("Üçüncü sonuç: ", (res3) => {
                  update(guess3.toLowerCase(), res3.toLowerCase());
                  console.log(`Tahminimiz: ${orderedList[0].w}`);

                  rl.question("Dördüncü kelimeniz: ", (guess4) => {
                    rl.question("Dördüncü sonuç: ", (res4) => {
                      update(guess4.toLowerCase(), res4.toLowerCase());
                      console.log(`Tahminimiz: ${orderedList[0].w}`);

                      rl.question("Beşinci kelimeniz: ", (guess5) => {
                        rl.question("Beşinci sonuç: ", (res5) => {
                          update(guess5.toLowerCase(), res5.toLowerCase());
                          console.log(`Tahminimiz: ${orderedList[0].w}`);

                          rl.question("Üçüncü kelimeniz: ", (guess6) => {
                            rl.question("İkinci sonuç: ", (res6) => {
                              update(guess6.toLowerCase(), res6.toLowerCase());
                              console.log(`Tahminimiz: ${orderedList[0].w}`);

                              rl.close();
                              resolve();
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
  );
}

const main = async () => {
  const ans = await askQuestion();
};

main();
