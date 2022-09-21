/* eslint-disable max-len */
const fs = require('fs');

const codes = [];

for (i=1; i<=560; i++) {
  let iter = true;
  while (iter) {
    const currentCode = `${(Math.floor(Math.random() * 1000)).toString((Math.floor(Math.random() * 10) + 26))}`;
    if (codes.filter((g)=>g === currentCode)[0]) {
      break;
    }
    codes.push(currentCode);
    iter = false;
  }
}

const codesFinal = codes.map((e, i)=>{
  if (i <= 280) {
    return `2A${parseInt((i)/10) +1}-${e}`;
  } else {
    return `2B${parseInt((i-280)/10)+1}-${e}`;
  }
});

console.log('hi world');
console.log(codesFinal);

// const a = [];
// for (i=1; i<=28; i++) {
//   const current = {
//     n: i,
//     name: '',
//     codes: [],
//   };
//   console.log(i);
//   for (e=1; e<=10; e++) {
//     let code = '';
//     let iter = true;
//     while (iter) {
//       code = `2A${i}-${(Math.floor(Math.random() * 1000)).toString((Math.floor(Math.random() * 10) + 26))}`;
//       const test = a.filter((he)=>{
//         return he.codes.filter((w)=>{
//           return w.code.match(/-(.+)/)[0] === code.match(/-(.+)/)[0];
//         })[0];
//       });
//       // console.log(code, test[0], i, e);
//       if (test[0]) {
//         return null;
//       }
//       iter = false;
//     }
//     const currentCode = {
//       code,
//       active: true,
//       canjeado: '',
//     };
//     current.codes.push(currentCode);
//   }
//   a.push(current);
// };


fs.writeFile('./test.js', `${JSON.stringify(codesFinal, '', 2)}`, (err, data)=>{
  if (err) {
    console.log(err);
  }
  console.log(data);
});
