import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

import Stack from "@/components/Stack";

// Past-class photos as a draggable React Bits <Stack>: autoplays through the
// photos, pauses on hover, and can be dragged or clicked to send the top
// photo to the back. `cards` is memoized because Stack resets its order
// whenever it receives a new array.
export function PhotoStack({ images, alt }: { images: string[]; alt: string }) {
  const reduce = useReducedMotion() ?? false;
  const cards = useMemo(
    () =>
      images.map((src, i) => (
        <img key={src} src={src} alt={i === 0 ? alt : ""} loading="lazy" className="card-image" />
      )),
    [images, alt],
  );

  // Stack shrinks the top card to (1 - 0.06) around its 90%/90% point,
  // which shifts it off the column's left edge. Scaling the whole stack back
  // up around the same point makes the top card fill the box exactly, so it
  // lines up with the heading and caption; the cards behind fan out right.
  const fill = 1 / (1 - 0.06);

  return (
    <div className="pr-[7%]">
      <div className="aspect-4/3 w-full" style={{ transform: `scale(${fill})`, transformOrigin: "90% 90%" }}>
        <Stack
          cards={cards}
          autoplay={!reduce}
          autoplayDelay={3000}
          pauseOnHover
          sendToBackOnClick
          sensitivity={150}
          mobileClickOnly
        />
      </div>
    </div>
  );
}
