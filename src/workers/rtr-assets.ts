//src/Worker/worker.ts
const workerFunction = function () {
//we perform every operation we want in this function right here
// eslint-disable-next-line no-restricted-globals
  self.onmessage = async (event: MessageEvent) => {
    console.log(event.data);
  };
};

//This stringifies the whole function
let codeToString = workerFunction.toString();
//This brings out the code in the bracket in string
let mainCode = codeToString.substring(codeToString.indexOf('{') + 1, codeToString.lastIndexOf('}'));
//convert the code into a raw data
let blob = new Blob([mainCode], { type: 'application/javascript' });
//A url is made out of the blob object and we're good to go
let rtr_assets = URL.createObjectURL(blob);

export default rtr_assets;