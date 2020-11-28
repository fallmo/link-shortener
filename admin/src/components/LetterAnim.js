import React, { useEffect, useState, useRef } from "react";

export default function LetterAnim({ result, isLoading }) {
  const [places, setPlaces] = useState(["", "", "", "", ""]);
  const animRef = useRef();
  let content = places.map((place, i) => (
    <div key={i} className="circle b-gray2"></div>
  ));

  if (isLoading) {
    content = places.map((place, i) => {
      if (!place || place === " ")
        return <div key={i} className="circle b-gray2"></div>;
      return (
        <div key={i} className="c-secondary fade-val">
          {place}
        </div>
      );
    });
  }

  if (result) {
    content = result.split().map((place, i) => (
      <div key={i} className="c-secondary fade-val">
        {place}
      </div>
    ));
  }
  useEffect(() => {
    if (isLoading) startLoadAnim();
    else stopLoadAnim();
  }, [isLoading]);

  const startLoadAnim = () => {
    setPlaces(randomChars(5));
    return (animRef.current = setTimeout(startLoadAnim, 1000));
  };
  const stopLoadAnim = () => {
    return clearTimeout(animRef.current);
  };

  return <div className="letter-anim">{content}</div>;
}

const randomChars = length => {
  const characters =
    "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 ";
  return [...new Array(length)].map(_ =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  );
};
