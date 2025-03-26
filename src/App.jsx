import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import Webcam from "react-webcam";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

const App = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const downloadImage = () => {
    if (imgSrc) {
      const link = document.createElement("a");
      link.href = imgSrc;
      link.download = "captured-photo.png";
      link.click();
      toast.success("Image downloaded successfully!");
    }
  };

  const shareImage = async () => {
    if (imgSrc) {
      try {
        const blob = await (await fetch(imgSrc)).blob();
        const file = new File([blob], "captured-photo.png", { type: blob.type });
        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: "Captured Photo",
            text: "Check out my photo!",
          });
          toast.success("Image shared successfully!");
        } else {
          toast.error("Web Share API not supported");
        }
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Error sharing image");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-purple-600">
                  Photo Booth
                </h1>
                <div className="rounded-lg overflow-hidden">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt="captured"
                      className="w-full h-auto"
                    />
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-auto"
                    />
                  )}
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  {imgSrc ? (
                    <>
                      <button
                        onClick={retake}
                        className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        <FaRedo className="mr-2" />
                        Retake
                      </button>
                      <button
                        onClick={downloadImage}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                      <button
                        onClick={shareImage}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaShare className="mr-2" />
                        Share
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={capture}
                      className="flex items-center px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <FaCamera className="mr-2" />
                      Capture
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
              <div className="flex justify-center space-x-4">
                <a
                  href="https://www.instagram.com/andremarthinus.l/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-600"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://github.com/andremarthinusl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-900"
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600"
                >
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default App;
