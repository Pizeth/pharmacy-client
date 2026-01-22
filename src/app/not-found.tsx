"use client"; // Directive to make this a Client Component

import { useRouter } from "next/navigation"; // Import from next/navigation for App Router
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Saturn from "@/components/effect/planets/saturn";
import Earth from "@/components/effect/planets/earth";
import Moon from "@/components/effect/planets/moon";
import Mars from "@/components/effect/planets/mars";
import Jupyter from "@/components/effect/planets/jupiter";
import Sun from "@/components/effect/planets/sun";
import TestPlanet from "@/components/effect/planets/testPlanet";

interface Star {
  id: number;
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
  direction: "topLeft" | "topRight";
}

const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i,
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 50}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 3 + 4,
    delay: Math.random() * 4,
    direction: Math.random() > 0.5 ? "topLeft" : "topRight",
  }));
};

function BackButton() {
  const router = useRouter();

  return (
    // <button type="button" onClick={() => router.back()}>
    //   Go Back
    // </button>
    <div className="flex justify-center">
      {/* <a className="btn-back" href="#"> */}
      <button
        className="btn-back px-6 py-3 text-white bg-purple-600/90 hover:bg-purple-600 rounded-lg transition-all shadow-lg shadow-purple-500/30 backdrop-blur-sm border border-purple-400/30"
        type="button"
        onClick={() => router.back()}
      >
        Back to previous page
      </button>
      {/* </a> */}
    </div>
  );
}

export default function NotFound() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(generateStars(30));
    const interval = setInterval(() => {
      setStars((prev) => [...prev.slice(-20), ...generateStars(10)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden font-sans">
      {/* Background Image: using 'bg-space' from tailwind.config */}
      <div className="absolute inset-0 bg-space bg-cover bg-center opacity-80" />
      {/* Stars Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            // Using the custom animations defined in tailwind.config.ts
            className={`absolute rounded-full bg-white opacity-80 ${
              star.direction === "topLeft"
                ? "animate-fall-topLeft"
                : "animate-fall-topRight"
            }`}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      {/* UFO Container: Outer Float, Inner Tilt */}
      <div className="absolute top-1/3 right-1 -translate-x-1/2 -translate-y-1/2 animate-float z-10">
        <div className="animate-tilt">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8794272-p5k6GdbD8O2RIat5GWtUGJGkDgXoxf.png"
            alt="UFO"
            width={300}
            height={150}
            priority
            className="drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          />
        </div>
      </div>

      {/* UFO Container: Outer Float, Inner Tilt */}
      <div className="absolute top-1/2 left-1/6 -translate-x-1/2 -translate-y-1/2  z-10">
        <div>
          <Image
            src="/static/images/blue_marble.png"
            alt="UFO"
            width={300}
            height={300}
            priority
            // className="rounded-[1000] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          />
        </div>
      </div>

      <div className="absolute top-1/7 right-1 -translate-x-1/2 -translate-y-1/2 z-10">
        <Saturn />
      </div>

      <div>
        {/* <Mars /> */}
        <Jupyter />
        {/* <TestPlanet /> */}
        {/* <Sun /> */}
        {/* <Moon /> */}
        <Earth size={43} />
        {/* <div
          style={{
            position: "absolute",
            width: "35vmin",
            height: "35vmin",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        ></div> */}
      </div>
      {/* <div>
        <Earth />
      </div> */}
      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-60 px-4 text-center z-20">
        {/* <h1 className="mb-2 text-7xl font-bold text-white tracking-tighter drop-shadow-lg">
          404
        </h1> */}
        {/* <p className="mb-8 text-xl text-gray-200 drop-shadow-md">
          Oops! Looks like this page got lost in space
        </p>
        <BackButton /> */}
        {/* <Link
          href="/admin"
          className="px-6 py-3 text-white bg-purple-600/90 hover:bg-purple-600 rounded-lg transition-all shadow-lg shadow-purple-500/30 backdrop-blur-sm border border-purple-400/30"
        >
          Back to previous page
        </Link> */}
      </div>

      {/* Additional Decorative Stars */}
      <div className="mars"></div>
      <img
        src="https://assets.codepen.io/1538474/404.svg"
        className="logo-404"
      />
      {/* <img
        src="https://assets.codepen.io/1538474/meteor.svg"
        className="meteor"
      /> */}
      <p className="title">Oh no!!</p>
      <p className="subtitle">
        You’re either misspelling the URL <br />
        or requesting a page that's no longer here.
      </p>
      {/* <div className="flex justify-center">
        <a className="btn-back" href="#">
          Back to previous page
        </a>
      </div> */}
      {/* <BackButton /> */}
      <img
        src="https://assets.codepen.io/1538474/astronaut.svg"
        className="astronaut"
      />
      <img
        src="https://assets.codepen.io/1538474/spaceship.svg"
        className="spaceship"
      />

      {/* Another 404 Page Styles */}
      <div className="stars">
        {/* <div className="custom-navbar">
          <div class="brand-logo">
            <img src="http://salehriaz.com/404Page/img/logo.svg" width="80px" />
          </div>
          <div class="navbar-links">
            <ul>
              <li>
                <a href="http://salehriaz.com/404Page/404.html" target="_blank">
                  Home
                </a>
              </li>
              <li>
                <a href="http://salehriaz.com/404Page/404.html" target="_blank">
                  About
                </a>
              </li>
              <li>
                <a href="http://salehriaz.com/404Page/404.html" target="_blank">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="http://salehriaz.com/404Page/404.html"
                  class="btn-request"
                  target="_blank"
                >
                  Request A Demo
                </a>
              </li>
            </ul>
          </div>
        </div> */}
        <div className="central-body">
          {/* <img
            className="image-404"
            src="http://salehriaz.com/404Page/img/404.svg"
            width="300px"
          /> */}
          <Link href="/admin" className="btn-go-home">
            GO BACK HOME
          </Link>
        </div>
        <div className="objects">
          <img
            className="object_rocket"
            src="http://salehriaz.com/404Page/img/rocket.svg"
            width="40px"
          />
          <div className="earth-moon">
            <img
              className="object_earth"
              src="http://salehriaz.com/404Page/img/earth.svg"
              width="100px"
            />
            <img
              className="object_moon"
              src="http://salehriaz.com/404Page/img/moon.svg"
              width="80px"
            />
          </div>
          <div className="box_astronaut">
            <img
              className="object_astronaut"
              src="http://salehriaz.com/404Page/img/astronaut.svg"
              width="140px"
            />
          </div>
        </div>
        <div className="glowing_stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>
    </div>
  );
}
