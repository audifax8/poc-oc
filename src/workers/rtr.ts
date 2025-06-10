//src/Worker/worker.ts
const workerFunction = function () {
//we perform every operation we want in this function right here
// eslint-disable-next-line no-restricted-globals
  self.onmessage = async () => {
    const rtrUrl = 'https://rtrmv.essilorluxottica.com/lib/v/3.0.3/main.umd.js';

    return await fetch(rtrUrl)
      .then(async (rtrResponse) => {
        if (rtrResponse.ok) {
          const rtrCode = await rtrResponse.text();
          return postMessage({
            rtrCode,
            result: true
          });
        }
        return postMessage(false);
      })
      .catch((err) => {
        postMessage({
            rtrCode: null,
            result: false
          });
      });
  };
};

//This stringifies the whole function
let codeToString = workerFunction.toString();
//This brings out the code in the bracket in string
let mainCode = codeToString.substring(codeToString.indexOf('{') + 1, codeToString.lastIndexOf('}'));
//convert the code into a raw data
let blob = new Blob([mainCode], { type: 'application/javascript' });
//A url is made out of the blob object and we're good to go
let rtr_script = URL.createObjectURL(blob);

export default rtr_script;