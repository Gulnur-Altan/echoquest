# 🌿 EchoQuest — Touch Grass, One Sound at a Time

<p align="center">
  <strong>Turn your next walk into an AI-powered nature discovery quest.</strong>
</p>

<p align="center">
  🎙️ Audio Classification · 🌱 Nature Discovery · ✨ Gamification
</p>

<p align="center">
  <em>Built for Hacktoberfest Open-Source AI Challenge — Week 1: Touch Grass</em>
</p>

---

## 🌎 About

**EchoQuest** is an AI-powered web application that encourages people to step away from their screens and reconnect with nature through sound.

Record the sounds around you, explore AI-generated audio predictions, collect discovery points, unlock achievement badges, and build your own nature journal.

The idea is simple: **use AI to inspire people to experience the real world, not spend more time staring at a screen.**

## ✨ Features

- 🎙️ **Record Nature Sounds** — Capture environmental audio directly in your browser.
- 🤖 **AI Audio Classification** — Analyze recordings with a pretrained audio classification model.
- 🍃 **Nature Insights** — Explore nature-focused information based on recognized sound categories.
- ⭐ **Experience Points (XP)** — Earn points when a recording matches a supported nature category.
- 📔 **Nature Journal** — Review previous discoveries and track your progress.
- 🏆 **Achievement Badges** — Unlock milestones as your collection grows.
- 💾 **Persistent History** — Keep your discoveries saved in browser local storage.
- 🌙 **Nature-Inspired UI** — Explore with a dark, green-themed interface.

## 🚀 Live Demo

**Live app:** Coming soon — deployment in progress.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and application structure |
| React | Interactive user interface |
| TypeScript | Type-safe application logic |
| Transformers.js | Run audio classification in the browser |
| MediaRecorder API | Capture audio from the microphone |
| Web Audio API | Decode and preprocess recorded audio |
| Local Storage | Persist the nature journal across refreshes |

## 🧠 AI Model

EchoQuest uses the pretrained model:

[`Xenova/ast-finetuned-audioset-10-10-0.4593`](https://huggingface.co/Xenova/ast-finetuned-audioset-10-10-0.4593)

The model is based on Audio Spectrogram Transformer (AST) audio classification and recognizes general audio-event categories.

EchoQuest processes recorded audio in the browser and displays the model's top predictions. It then maps supported prediction labels to nature-related insights and discovery points.

> **Important:** This is a general audio-event classifier, not a dedicated wildlife species identification model. Predictions are exploratory hints, not scientific confirmation of a particular species.

## 🔍 How It Works

1. **Record** — Allow microphone access and record a sound in your surroundings.
2. **Analyze** — The app processes the recording and runs audio classification.
3. **Explore** — Review the model's predictions and nature-related insights.
4. **Collect** — Earn XP for supported nature discoveries.
5. **Track progress** — Build your journal and unlock achievement badges.

## 💻 Getting Started

### Prerequisites

- Node.js compatible with your installed Next.js version
- npm
- A modern browser with microphone support

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd echoquest
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Allow microphone access when prompted and try recording a sound.

### Production Build

```bash
npm run build
npm start
```

## 🔐 Privacy

EchoQuest uses browser microphone access to record sounds for classification. Audio is processed in the browser by the current client-side inference flow.

Discovery history is stored in browser local storage.

The current app does not require a dedicated paid inference API for its core audio classification flow. The pretrained model and its runtime are downloaded as needed, which may require an internet connection.

## 🌱 Why Open-Source AI?

Open-source AI tools make it possible to experiment with machine learning without depending entirely on proprietary, paid inference services.

By combining a pretrained audio model with an open web development stack, EchoQuest explores how AI can support outdoor discovery, curiosity, and environmental awareness.

The project can also be extended by the community with better sound categories, accessibility improvements, tests, and new discovery experiences.

## 🗺️ Roadmap

- [ ] Deploy the application publicly
- [ ] Improve recording controls and error handling
- [ ] Expand nature sound categories
- [ ] Add tests for prediction-to-insight mapping
- [ ] Improve accessibility and mobile experience
- [ ] Explore more accurate nature-specific audio classification
- [ ] Document beginner-friendly contribution opportunities

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Open a pull request with a clear description.

If you find a bug or have an idea, open a GitHub issue to start a discussion.

## 📜 License

No license has been specified yet. A license can be added to clarify how others may use, modify, and distribute the project.

---

<p align="center">
  🌿 <strong>Step outside. Listen closely. Discover more.</strong>
</p>
