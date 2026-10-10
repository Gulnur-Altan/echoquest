export type Prediction = {
  label: string;
  score: number;
};

export type NatureInsight = {
  isNature: boolean;
  category: string;
  title: string;
  message: string;
  points: number;
};

export function getNatureInsight(label: string): NatureInsight {
  const sound = label.toLowerCase();

  if (
    sound.includes("bird") ||
    sound.includes("chirp")
  ) {
    return {
      isNature: true,
      category: "Birdsong",
      title: "🐦 Birdsong detected!",
      message: "Listen closely. Birds communicate through calls and songs.",
      points: 5,
    };
  }

  if (
    sound.includes("wind") ||
    sound.includes("rustling") ||
    sound.includes("leaves")
  ) {
    return {
      isNature: true,
      category: "Wind & leaves",
      title: "🍃 Nature is moving!",
      message:
        "Wind moving through leaves creates a unique natural soundscape.",
      points: 5,
    };
  }

  if (
    sound.includes("water") ||
    sound.includes("rain") ||
    sound.includes("stream") ||
    sound.includes("waterfall") ||
    sound.includes("ocean") ||
    sound.includes("waves")
  ) {
    return {
      isNature: true,
      category: "Water",
      title: "💧 Water sound detected!",
      message:
        "Water creates one of nature's most recognizable soundscapes.",
      points: 5,
    };
  }

  if (
    sound.includes("insect") ||
    sound.includes("cricket") ||
    sound.includes("frog") ||
    sound.includes("croak")
  ) {
    return {
      isNature: true,
      category: "Small wildlife",
      title: "🦗 Wildlife sound detected!",
      message:
        "Small creatures can make a big contribution to a natural soundscape.",
      points: 5,
    };
  }

  return {
    isNature: false,
    category: "Unclassified",
    title: "🔎 Keep exploring!",
    message:
      "This sound was not confidently matched to one of our nature categories. Try recording birds, wind, water, or insects.",
    points: 0,
  };
}

export function getBestNatureMatch(predictions: Prediction[]) {
  return predictions
    .map((prediction) => ({
      prediction,
      insight: getNatureInsight(prediction.label),
    }))
    .find(({ insight }) => insight.isNature);
}