//src/Worker/worker.ts
const workerFunction = function () {
//we perform every operation we want in this function right here
// eslint-disable-next-line no-restricted-globals
  self.onmessage = async (event: MessageEvent) => {
    const getConfigureAssets = async () => {
      const { workflow, product, customer, locale } = event.data;
      const graphUrl =
        `https://cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/product/${product}/graph-settings-${locale}.json`;
      const preferencesUrl =
        `https://cdn-prod.fluidconfigure.com/static/configs/3.13.0/prod/${workflow}/${customer}/preferences.json`;
      
      return Promise.all([
        fetch(graphUrl),
        fetch(preferencesUrl)
      ]).then(async (
        [
          productGraphResponse,
          preferencesResponse
        ]
      ) => {
        if (productGraphResponse.ok && preferencesResponse.ok) {
          const productGraph = await productGraphResponse.json();
          const preferences = await preferencesResponse.json();
          return {
            productGraph,
            preferences
          }
        }
        return {
          productGraph: null,
          preferences: null
        }
      });
    };

    let assets;
    try {
      assets = await getConfigureAssets();
    } catch (e) {
      assets = null;
    }
    postMessage(assets);
  };
};

//This stringifies the whole function
let codeToString = workerFunction.toString();
//This brings out the code in the bracket in string
let mainCode = codeToString.substring(codeToString.indexOf('{') + 1, codeToString.lastIndexOf('}'));
//convert the code into a raw data
let blob = new Blob([mainCode], { type: 'application/javascript' });
//A url is made out of the blob object and we're good to go
let configure_assets = URL.createObjectURL(blob);

export default configure_assets;