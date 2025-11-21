import Lottie from "lottie-react";

export default function HeroAnimation() {
  return (
    <div className="max-w-sm mx-auto mt-10">
      <Lottie path="/hero.json" loop={true} />
    </div>
  );
}
