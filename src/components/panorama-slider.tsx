import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType, SwiperOptions } from "swiper/types";

import "swiper/css";

const IMAGES = [
  "/gallery/gallery-1.jpg",
  "/gallery/gallery-2.jpg",
  "/gallery/gallery-3.jpg",
  "/gallery/gallery-4.jpg",
  "/gallery/gallery-5.jpg",
  "/gallery/gallery-6.png",
  "/gallery/gallery-7.jpg",
  "/gallery/gallery-8.jpg",
];

type PanoramaSlide = HTMLElement & { progress: number };

type EffectPanoramaArgs = {
  swiper: SwiperType;
  extendParams: (params: Record<string, unknown>) => void;
  on: SwiperType["on"];
};

// Ported from https://panorama-slider.uiinitiative.com bundle (effect: "panorama")
function EffectPanorama({ swiper, extendParams, on }: EffectPanoramaArgs) {
  extendParams({ panoramaEffect: { depth: 200, rotate: 30 } });

  on("beforeInit", () => {
    if (swiper.params.effect !== "panorama") return;
    const classNames = (swiper as unknown as { classNames: string[] })
      .classNames;
    classNames.push(`${swiper.params.containerModifierClass}panorama`);
    classNames.push(`${swiper.params.containerModifierClass}3d`);
    const overwriteParams = { watchSlidesProgress: true };
    Object.assign(swiper.params, overwriteParams);
    Object.assign(swiper.originalParams, overwriteParams);
  });

  on("progress", () => {
    if (swiper.params.effect !== "panorama") return;

    const sizesGrid = swiper.slidesSizesGrid;
    const { depth = 200, rotate = 30 } = (
      swiper.params as unknown as {
        panoramaEffect: { depth: number; rotate: number };
      }
    ).panoramaEffect;
    const angle = (rotate * Math.PI) / 180 / 2;
    const step = 1 / (180 / rotate);

    for (let i = 0; i < swiper.slides.length; i += 1) {
      const slide = swiper.slides[i] as PanoramaSlide;
      const progress = slide.progress;
      const size = sizesGrid[i];
      const centerOffset = swiper.params.centeredSlides
        ? 0
        : ((swiper.params.slidesPerView as number) - 1) * 0.5;
      const offset = progress + centerOffset;
      const curve = 1 - Math.cos(offset * step * Math.PI);

      const translateX = `${offset * (size / 3) * curve}px`;
      const rotateY = offset * rotate;
      const translateZ = `${((size * 0.5) / Math.sin(angle)) * curve - depth}px`;

      slide.style.transform =
        swiper.params.direction === "horizontal"
          ? `translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateY}deg)`
          : `translateY(${translateX}) translateZ(${translateZ}) rotateX(${-rotateY}deg)`;
    }
  });

  on("setTransition", (_swiper, duration) => {
    if (swiper.params.effect !== "panorama") return;
    for (const slide of swiper.slides) {
      slide.style.transitionDuration = `${duration}ms`;
    }
  });
}

export function PanoramaSlider() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const swiper = new Swiper(el, {
      modules: [Autoplay, EffectPanorama],
      effect: "panorama",
      slidesPerView: 1.5,
      spaceBetween: 12,
      loop: true,
      loopAdditionalSlides: 1,
      centeredSlides: true,
      grabCursor: true,
      speed: 5000,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      panoramaEffect: { depth: 150, rotate: 45 },
      breakpoints: {
        480: { slidesPerView: 2, panoramaEffect: { rotate: 35, depth: 150 } },
        640: { slidesPerView: 3, panoramaEffect: { rotate: 30, depth: 150 } },
        1024: { slidesPerView: 4, panoramaEffect: { rotate: 30, depth: 200 } },
        1200: { slidesPerView: 4, panoramaEffect: { rotate: 25, depth: 250 } },
      },
    } as unknown as SwiperOptions);

    return () => swiper.destroy(true, true);
  }, []);

  return (
    <div className="h-full w-full">
      <div
        ref={containerRef}
        className="swiper h-full! overflow-visible! perspective-distant"
      >
        <div className="swiper-wrapper ease-linear! items-center transform-3d">
          {IMAGES.map((src, i) => (
            <div
              key={src}
              className="swiper-slide ease-linear! will-change-transform"
            >
              <div className="mx-auto h-[400px] w-full max-w-[480px] overflow-hidden rounded-4xl bg-[#d7d7d7] md:h-[480px]">
                <img
                  src={src}
                  alt={`Ecsight gallery ${i + 1}`}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
