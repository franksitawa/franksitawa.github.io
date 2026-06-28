---
layout: post
title: "Installing Manim and Manim Voiceover for AI-Narrated Educational Videos"
date: 2026-06-28 09:00:00 +0300
categories: [ai, education, manim]
tags: [manim, tts, voice-cloning, xtts, animation, python, local-ai, educational-content]
description: "A step-by-step guide to installing Manim Community Edition and the Manim Voiceover plugin on Ubuntu, including a custom XTTS integration for cost-free local narration."
---

Manim is the animation engine originally built by 3Blue1Brown for mathematical explainers. The community edition makes it accessible to anyone building educational content with Python. Combined with the Manim Voiceover plugin, you can synchronise generated speech directly with your animations — no manual audio editing required.

This guide covers installation on Ubuntu and a custom XTTS integration that generates narration locally, without cloud API costs.

---

## Prerequisites

Install the system dependencies Manim needs for video rendering, font support, and LaTeX:

```bash
sudo apt update

sudo apt install -y \
    ffmpeg \
    libcairo2-dev \
    pkg-config \
    python3-dev \
    pango1.0-tools \
    texlive \
    texlive-latex-extra
```

---

## Set Up a Virtual Environment

Isolate your project dependencies in a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
```

---

## Install Manim

```bash
pip install manim
manim --version
```

The terminal should print the installed version, confirming Manim is ready.

---

## Install Manim Voiceover

The Voiceover plugin handles speech generation and synchronises audio timing with animations automatically:

```bash
pip install manim-voiceover
pip show manim-voiceover
```

### Install Audio Dependencies

The plugin requires SoX for audio processing. Without it you will see warnings like:

```text
WARNING  SoX could not be found!
```

Install it with:

```bash
sudo apt install -y sox
```

---

## Test Your Installation

Create a file named `hello.py`:

```python
from manim import *

class HelloWorld(Scene):
    def construct(self):
        text = Text("Hello Manim")
        self.play(Write(text))
        self.wait()
```

Render and preview it:

```bash
manim -pql hello.py HelloWorld
```

Manim will render the animation and open it automatically. If you see the text appear on screen, your installation is working correctly.

---

## Speech Provider Options

Manim Voiceover supports several speech backends. Install only the ones you need.

For OpenAI:

```bash
pip install openai
```

For Azure:

```bash
pip install azure-cognitiveservices-speech
```

In my own workflow, I use a **custom XTTS service** that connects to a locally running XTTS Docker container. If you missed that setup, you can find it here: [Running XTTS-v2 with Docker and NVIDIA CUDA on Ubuntu](https://franksitawa.github.io/ai/tts/docker/2026/06/25/xxts.html).

This approach gives you natural-sounding narration at zero API cost, with no audio data leaving your machine.

---

## A Narrated Animation Scene

Once installed, adding voiceover to a scene is straightforward. Here is a minimal example using the XTTS service:

```python
from manim import *
from manim_voiceover import VoiceoverScene
from xtts_service import XTTSService

class SlidingWindowVideo(VoiceoverScene):

    def construct(self):
        self.set_speech_service(XTTSService())

        title = Text("Sliding Window")

        with self.voiceover(
            text="Today we learn the sliding window technique."
        ) as tracker:
            self.play(
                Write(title),
                run_time=tracker.duration
            )

        self.wait()
```

The `tracker.duration` value comes from the generated audio clip, so the animation automatically stretches or compresses to match the narration length — no manual tweaking required.

---

## What Comes Next

With Manim and Voiceover in place, the full production workflow becomes:

1. Write the lesson as a Python scene
2. The XTTS service generates narration from your script
3. Manim renders animation and audio into a single video file
4. FFmpeg handles any final cuts or formatting

This is the same pipeline I use to produce educational CS content — animated explainers on topics like Big O notation, sorting algorithms, and data structures — entirely from a local machine, with no cloud dependencies.