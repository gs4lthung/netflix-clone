import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { LARGE_IMAGE_BASE_URL, SMALL_IMAGE_BASE_URL } from "../utils/constant";
import { formatReleaseDate } from "../utils/dateFunc";
import WatchPageSkeleton from "../components/skeleton/WatchPageSkeleton";
export default function WatchPage() {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  interface Content {
    id?: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    adult?: boolean;
    overview?: string; // Add the 'overview' property
    poster_path?: string;
  }

  const [content, setContent] = useState<Content>({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore() as { contentType: string };

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        setTrailers(res.data.trailers);
      } catch (error) {
        const errorResponse = error as {
          response: { data: { message: string } };
        };
        if (errorResponse.response.data.message.includes("404")) {
          setTrailers([]);
          console.log("No trailers found");
        }
      }
    };
    getTrailers();

    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
        setSimilarContent(res.data.similar);
      } catch (error) {
        const errorResponse = error as {
          response: { data: { message: string } };
        };
        if (errorResponse.response.data.message.includes("404")) {
          setSimilarContent([]);
          console.log("No trailers found");
        }
      }
    };
    getSimilarContent();

    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
        setContent(res.data.content);
      } catch (error) {
        const errorResponse = error as {
          response: { data: { message: string } };
        };
        if (errorResponse.response.data.message.includes("404")) {
          setContent({});
          console.log("No trailers found");
        }
      } finally {
        setIsLoading(false);
      }
    };
    getContentDetails();
  }, [contentType, id]);

  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-10">
        <WatchPageSkeleton />
      </div>
    );
  }
  if (!content) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="mx-auto container px-4 py-8 h-full">
          <Navbar />
          <h2 className="text-xl text-center mt-5">No content found</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4 py-8 h-full">
        <Navbar />
        {trailers?.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <button
              title="Previous"
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={currentTrailerIdx === 0}
              onClick={() => {
                if (currentTrailerIdx > 0) {
                  setCurrentTrailerIdx((prev) => prev - 1);
                }
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              title="Next"
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                currentTrailerIdx === trailers.length - 1
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              disabled={currentTrailerIdx === trailers.length - 1}
              onClick={() => {
                if (currentTrailerIdx < trailers.length - 1) {
                  setCurrentTrailerIdx((prev) => prev + 1);
                }
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
          {trailers?.length > 0 && (
            <ReactPlayer
              controls
              width={"100%"}
              height={"70vh"}
              className={"mx-auto overflow-hidden rounded-lg"}
              url={`https://www.youtube.com/watch?v=${
                (trailers[currentTrailerIdx] as { key?: string })?.key
              }`}
            />
          )}
          {trailers?.length === 0 && (
            <h2 className="text-xl text-center mt-5">
              No trailers available for{" "}
              <span className="font-bold">{content.title || content.name}</span>
            </h2>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
          <div className="mb-4 md:mb-0">
            <h2 className="text-5xl font-bold text-balance">
              {content?.title || content?.name}
            </h2>
            <p className="mt-2 text-lg">
              {formatReleaseDate(
                content?.release_date || content?.first_air_date || ""
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span className="text-red-600">18+</span>
              ) : (
                <span className="text-green-600">PG-13</span>
              )}
            </p>
            <p className="mt-4 text-lg">{content?.overview}</p>
          </div>
          <img
            src={LARGE_IMAGE_BASE_URL + content?.poster_path}
            alt={content?.title || content?.name}
            className="max-h-[600px] rounded-md"
          />
        </div>
        {similarContent?.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto relative">
            <h3 className="text-3xl font-bold mb-4">Similar Movies/Tv Shows</h3>
            <div
              className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group"
              ref={sliderRef}
            >
              {similarContent?.map(
                (content: {
                  id: number;
                  poster_path: string;
                  title: string;
                  name: string;
                }) => {
                  if (content.poster_path === null) return null;
                  return (
                    <Link
                      key={content?.id}
                      to={`/watch/${content?.id}`}
                      className="w-52 flex-none"
                    >
                      <img
                        src={SMALL_IMAGE_BASE_URL + content?.poster_path}
                        alt={content?.title || content?.name}
                        className="w-full h-auto rounded-lg"
                      />
                      <h4 className="mt-2 text-lg font-semibold">
                        {content?.title || content?.name}
                      </h4>
                    </Link>
                  );
                }
              )}

              <ChevronLeft
                className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full"
                size={24}
                onClick={scrollLeft}
              />
              <ChevronRight
                className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 text-white rounded-full"
                size={24}
                onClick={scrollRight}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
