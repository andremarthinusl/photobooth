import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera, FaDownload, FaRedo, FaShare, FaInstagram, FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const PHOTO_FRAMES = {
  normal: "Normal",
  polaroid: "Polaroid",
  vintage: "Vintage",
  rounded: "Rounded",
};

const PHOTO_COUNTS = [1, 2, 3, 4];

const App = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState("normal");
  const [photoCount, setPhotoCount] = useState(1);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const capture = useCallback(() => {
    if (currentPhotoIndex < photoCount) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedPhotos(prev => [...prev, { src: imageSrc, frame: selectedFrame }]);
      setCurrentPhotoIndex(prev => prev + 1);
      
      if (currentPhotoIndex === photoCount - 1) {
        setImgSrc(imageSrc);
      } else {
        toast.info(`Photo ${currentPhotoIndex + 1} of ${photoCount} taken!`);
      }
    }
  }, [webcamRef, photoCount, currentPhotoIndex, selectedFrame]);

  const retake = () => {
    setImgSrc(null);
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    setShowOptions(false);
  };

  const downloadImage = () => {
    if (capturedPhotos.length > 0) {
      capturedPhotos.forEach((photo, index) => {
        const link = document.createElement("a");
        link.href = photo.src;
        link.download = `captured-photo-${index + 1}.png`;
        link.click();
      });
      toast.success("Images downloaded successfully!");
    }
  };

  const shareImage = async () => {
    if (capturedPhotos.length > 0) {
      try {
        const files = await Promise.all(
          capturedPhotos.map(async (photo, index) => {
            const blob = await (await fetch(photo.src)).blob();
            return new File([blob], `captured-photo-${index + 1}.png`, { type: blob.type });
          })
        );

        if (navigator.share) {
          await navigator.share({
            files,
            title: "Captured Photos",
            text: "Check out my photos!",
          });
          toast.success("Images shared successfully!");
        } else {
          toast.error("Web Share API not supported");
        }
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Error sharing images");
      }
    }
  };

  const getFrameClass = (frame) => {
    switch (frame) {
      case "polaroid":
        return "p-4 bg-white shadow-lg";
      case "vintage":
        return "sepia brightness-75 contrast-125";
      case "rounded":
        return "rounded-full overflow-hidden";
      default:
        return "";
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
                    <div className="grid grid-cols-2 gap-4">
                      {capturedPhotos.map((photo, index) => (
                        <div key={index} className={getFrameClass(photo.frame)}>
                          <img
                            src={photo.src}
                            alt={`captured-${index + 1}`}
                            className="w-full h-auto"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={getFrameClass(selectedFrame)}>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>

                {!imgSrc && !showOptions ? (
                  <button
                    onClick={() => setShowOptions(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Choose Options
                  </button>
                ) : !imgSrc && showOptions ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frame Style:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(PHOTO_FRAMES).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() => setSelectedFrame(key)}
                            className={`p-2 rounded-lg text-sm ${
                              selectedFrame === key
                                ? "bg-purple-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Photos:
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {PHOTO_COUNTS.map((count) => (
                          <button
                            key={count}
                            onClick={() => setPhotoCount(count)}
                            className={`p-2 rounded-lg text-sm ${
                              photoCount === count
                                ? "bg-purple-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={capture}
                      disabled={currentPhotoIndex >= photoCount}
                      className="w-full flex items-center justify-center px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      <FaCamera className="mr-2" />
                      {currentPhotoIndex === 0
                        ? "Capture"
                        : `Take Photo ${currentPhotoIndex + 1}/${photoCount}`}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center space-x-4 mt-4">
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
                      Download All
                    </button>
                    <button
                      onClick={shareImage}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <FaShare className="mr-2" />
                      Share All
                    </button>
                  </div>
                )}
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