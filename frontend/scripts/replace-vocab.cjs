const fs = require('fs');
const file = 'c:/Users/GamingGear/Desktop/SumaryJapanese/frontend-figma/src/app/screens/study/tabs/VocabStudyTab.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\(item\.term \|\| ""\)/g, '(item.japanese || "")');
content = content.replace(/\(item\.reading \|\| ""\)/g, '(item.hiragana || "")');
content = content.replace(/\(item\.meaning \|\| ""\)/g, '(item.english || "")');

content = content.replace(/currentCard\.partOfSpeech/g, 'currentCard.type');
content = content.replace(/currentCard\.term/g, 'currentCard.japanese');
content = content.replace(/currentCard\.reading/g, 'currentCard.hiragana');
content = content.replace(/currentCard\.meaning/g, 'currentCard.english');
content = content.replace(/currentCard\.exampleSentenceJp/g, 'currentCard.exampleJp');
content = content.replace(/currentCard\.exampleSentenceEn/g, 'currentCard.exampleEn');

content = content.replace(/item\.partOfSpeech/g, 'item.type');
content = content.replace(/item\.term/g, 'item.japanese');
content = content.replace(/item\.reading/g, 'item.hiragana');
content = content.replace(/item\.meaning/g, 'item.english');
content = content.replace(/item\.exampleSentenceJp/g, 'item.exampleJp');
content = content.replace(/item\.exampleSentenceEn/g, 'item.exampleEn');

fs.writeFileSync(file, content, 'utf8');
console.log('Replacements done!');
