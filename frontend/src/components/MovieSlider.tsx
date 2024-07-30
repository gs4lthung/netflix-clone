import React, { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMAGE_BASE_URL } from "../utils/constant";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MovieSlider({ category }: { category: string }) {
  const { contentType } = useContentStore() as { contentType: string };
  const [content, setContent] = useState<
    { id: string; backdrop_path: string; title: string; name: string }[]
  >([]);
  const [showArrows, setShowArrows] = useState(false);
  const formattedCategoryName =
    category.replace(/_/g, " ")[0].toUpperCase() +
    category.replace(/_/g, " ").slice(1);
  const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";
  useEffect(() => {
    const getContent = async () => {
      const res = await axios.get(`/api/v1/${contentType}/${category}`);
      if (contentType === "movie") setContent(res.data.movies);
      else setContent(res.data.tv);
      console.log(res);
    };
    getContent();
  }, [category, contentType]);

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
  return (
    <div
      className="bg-black text-white relative px-5 md:px-20"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <h2 className="mb-4 text-2xl font-bold">
        {formattedCategoryName} {formattedContentType}
      </h2>
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
        {content?.map((item) => (
          <Link
            to={`/watch/${item.id}`}
            key={item.id}
            className="min-w-[250px] relative group"
          >
            <div className="rounded-lg overflow-hidden">
              <img
                src={SMALL_IMAGE_BASE_URL + item?.backdrop_path}
                alt={item.title}
                className="transparent-transform duration-300 ease-in-out group-hover:scale-125"
              />
            </div>
            <p className="mt-2 text-center">{item.title || item.name}</p>
          </Link>
        ))}
      </div>
      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            title="Previous"
            onClick={scrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            title="Next"
            onClick={scrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
