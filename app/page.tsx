"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ImagePlus, ImageUp } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrediction(null);
    if (!e.target.files) return;

    if (e.target.files.length === 0) {
      setImage(null);
      return;
    }
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const sendFile = async () => {
    setPrediction(null);

    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      body: formData,
      cache: "no-cache",
    });
    if (res.ok) {
      const data = await res.json();
      setPrediction(data.prediction);
    } else {
      console.error("Error");
    }
  };

  return (
    <div className="justify-items-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl font-bold">Clock Test</h1>

        <motion.div animate={{ opacity: [0, 1] }} className="flex gap-8">
          <p className="text-lg max-w-sm">
            Draw a clock on a piece of paper like the example below and upload
            it.
          </p>
          <Image src="/clock.png" width={200} height={200} alt="clock" />
        </motion.div>
        <div className="flex gap-4 items-center justify-center">
          <ImagePlus />

          <Input
            type="file"
            accept="image/*"
            placeholder="Upload Image"
            onChange={(e) => {
              handleFileChange(e);
            }}
            className="w-fit"
          />
        </div>
        <div className="flex justify-between text-center w-full max-w-lg">
          <motion.div
            animate={{ scale: [0, 1] }}
            className="flex flex-col gap-4"
          >
            {image && (
              <motion.div animate={{ scale: [0, 1] }}>
                <Image src={image} width={200} height={200} alt="clock" />
              </motion.div>
            )}
            {file && (
              <Button
                className="flex gap-2"
                variant={"secondary"}
                onClick={() => sendFile()}
              >
                <ImageUp />
                <p>Upload</p>
              </Button>
            )}
          </motion.div>
          {prediction && (
            <motion.div
              animate={{ scale: [0, 1] }}
              className="flex flex-col gap-4 items-center justify-center"
            >
              <h1 className="text-2xl font-bold">Result:</h1>
              <h2
                className={`
                  text-2xl font-bold
                  ${
                    prediction === "disorder" ? "text-red-400" : "text-blue-400"
                  }
                  `}
              >
                {prediction}
              </h2>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
