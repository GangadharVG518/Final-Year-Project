import React, { useState, useRef } from "react";
import axios from "axios";
import "./styles.css";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      setError("Please select exactly 4 videos");
      setSelectedFiles([]);
      return;
    }
    setSelectedFiles(files);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 4) {
      setError("Please select exactly 4 videos");
      return;
    }
    setSelectedFiles(files);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedFiles.length !== 4) {
      setError("Please upload exactly 4 videos");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("videos", file));

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
      setError(
        "An error occurred while processing your videos. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🚗 AI Based Traffic Management</h1>

      <div className="main-container">
        <div className="left">
          <section className="hero">
            <h2>🚦 Optimize Traffic Flow with AI 🤖</h2>
            <p>
              Enhance your city's traffic management with our smart adaptive
              system. Our technology optimizes traffic light timings based on
              real-time data to reduce congestion and improve traffic flow.
            </p>
          </section>

          <section className="upload">
            <h2>📹 Upload Your Traffic Videos</h2>
            <p>
              Select 4 videos showing different roads at an intersection. Our
              system will analyze these videos to provide optimized traffic
              light timings for smoother traffic flow.
            </p>

            <form onSubmit={handleSubmit}>
              <div
                className="file-upload-container"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleFileChange}
                />
                <div className="file-upload-text">
                  <p>Drag and drop your videos here or click to browse</p>
                  <p>Supported formats: MP4, AVI, MOV</p>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="selected-files">
                    <p>Selected files ({selectedFiles.length}/4):</p>
                    <ul>
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                disabled={loading || selectedFiles.length !== 4}
              >
                {loading ? "Processing..." : "Run Model"}
              </button>
            </form>
          </section>
        </div>

        <section className="result">
          {!loading && !result && (
            <div className="placeholder">
              <p>Optimization results will show here</p>
              <span>🚦🚦🚦🚦</span>
            </div>
          )}

          {loading && (
            <div className="loader">
              <div className="loading-spinner" />
              <p>Processing videos, please wait...</p>
              <p>This may take a few minutes</p>
            </div>
          )}

          {result && !result.error && (
            <>
              <h2>✅ Optimization Results</h2>
              <p>
                Your traffic light timings have been optimized. Here are the
                recommended green times for each direction:
              </p>
              <ul>
                <li>
                  <div>🚦 North</div>
                  <span>{result.north} seconds</span>
                </li>
                <li>
                  <div>🚦 South</div>
                  <span>{result.south} seconds</span>
                </li>
                <li>
                  <div>🚦 West</div>
                  <span>{result.west} seconds</span>
                </li>
                <li>
                  <div>🚦 East</div>
                  <span>{result.east} seconds</span>
                </li>
              </ul>
            </>
          )}

          {result && result.error && (
            <div className="error-message">
              <h2>Error:</h2>
              <p>{result.error}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
