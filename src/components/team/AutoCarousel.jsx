import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

export function AutoCarousel({ children, slideSpan, variant = "default" }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    if (emblaApi) {
      let animationFrame;
      const scroll = () => {
        if (!emblaApi.canScrollNext()) {
          emblaApi.scrollTo(0);
        } else {
          emblaApi.scrollNext();
        }
        animationFrame = requestAnimationFrame(() => {
          setTimeout(scroll, 3000);
        });
      };

      scroll();

      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }
  }, [emblaApi]);

  return (
    <div
      className={`overflow-hidden ${
        variant === "responsable" ? "px-4" : "px-2"
      }`}
      ref={emblaRef}
    >
      <div
        className={`flex ${
          variant === "responsable" ? "-mx-3" : "-mx-2"
        } ${slideSpan}`}
      >
        {children}
      </div>
    </div>
  );
}
