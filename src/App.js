import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
// import * as cocossd from "@tensorflow-models/coco-ssd";


function App() {

  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);

  const imageRef = useRef();
  const textInputRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model)
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  }

  const uploadImage = (e) => {

    const { files } = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
  }

  const handlePrediction = async () => {
    const results = await model.classify(imageRef.current);
    setResults(results)

  }

  const handleOnChange = (e) => {
    setImageURL(e.target.value)
    setResults([])

  }

  useEffect(() => {
    loadModel();
  }, []);


  if (isModelLoading) {
    return <h2>Model Loading...</h2>
  }

  console.log(results);

  return (
    <div className="App">
      <h1 className="header">Image Identification</h1>
      <div className='inputHolder'>
        <input type='file' accept="image/*" capture='camera'
          onChange={uploadImage}
        />
        <span className="or">OR</span>
        <input type="text" placeholder="Paste image URL" ref={textInputRef}
          onChange={handleOnChange}
        />
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
            {imageURL && <img src={imageURL} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef} />}
          </div>
          {results.length > 0 && <div className="resultsHolder">
            {results.map((results, index) => {
              return (
                <div className="result" key={results.className}>
                  <span className="name">{results.className}</span>
                  <span className="confidence">Confidence level:{(results.probability * 100).toFixed(2)}% {index === 0 && <span className="bestGuess">Best Guess
</span>}</span>
                </div>
              )
            })}
          </div>}
        </div>
        {imageURL && <button className="button" onClick={handlePrediction}>
          Identify Image
        </button>}
      </div>
    </div>
  );
}

export default App;
