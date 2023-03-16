import * as React from "react";
import "./BeerBubbles.css";
import { useMemo } from "react";

export function BeerBubbles({ isSelected }) {
  const img = useMemo(
    () => (
      <img
        style={{
          transform: `rotate(${isSelected ? 90 : 0}deg)`,
        }}
        src={"./beer.png"}
        width={50}
        height={50}
        alt={"beer_symbol"}
      />
    ),
    [isSelected]
  );
  if (isSelected) {
    return img;
  }
  return (
    <div>
      <div className="wrapper">
        <div className="inner-wrapper">
          <div className="bubbles">
            <div className="bubble bubble-sm" />
            <div className="bubble bubble-sm1" />
            <div className="bubble bubble-sm2" />
            <div className="bubble bubble-sm3" />
            <div className="bubble bubble-sm4" />
            <div className="bubble bubble-sm5" />
            <div className="bubble bubble-sm6" />
            <div className="bubble bubble-md" />
            <div className="bubble bubble-md1" />
          </div>
          {img}
        </div>
      </div>
    </div>
  );
}
