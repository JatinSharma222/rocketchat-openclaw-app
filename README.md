# OpenClaw Integration for Rocket.Chat

A Rocket.Chat App that integrates OpenClaw AI assistant into your workspace via a `/openclaw` slash command.

> Built with the Rocket.Chat Apps Engine framework and TypeScript.

---

## Demo

/openclaw write a TypeScript function to reverse a string

<img width="1710" height="1013" alt="Screenshot 2026-02-26 at 5 36 00 AM" src="https://github.com/user-attachments/assets/4cc1b16e-0cf6-4bdc-ad1d-4eb1c3e0c3fe" />

---

## Error Handling

Empty prompts are caught and the user is guided with the correct usage.

<img width="1371" height="176" alt="Screenshot 2026-02-26 at 5 53 22 AM" src="https://github.com/user-attachments/assets/e5984e18-db0d-4e6c-a0a1-5c65089fa211" />

---

## Features

- `/openclaw <prompt>` slash command
- OpenAI-compatible HTTP API integration
- Configurable via Admin settings (server URL, API key, model)
- Mock mode for local development and testing

---

## Project Structure

```
OpenClaw-Extension/
├── OpenClawApp.ts          # App entry point
├── commands/
│   └── OpenClawCommand.ts  # Slash command handler
├── services/
│   └── OpenClawService.ts  # API integration layer
├── settings/
│   └── settings.ts         # Admin settings
└── lib/
    └── sendMessage.ts      # Message utility
```

---

## Setup

### Prerequisites
- Rocket.Chat running locally
- Node.js v16+
- Rocket.Chat Apps CLI: `npm install -g @rocket.chat/apps-cli`

### Install & Deploy

```bash
git clone https://github.com/JatinSharma222/rocketchat-openclaw-app.git
cd rocketchat-openclaw-app
npm install
rc-apps package
```

Upload the generated `dist/openclaw-integration_0.0.1.zip` via **Marketplace → Private Apps → Upload private app**.

---

## Configuration

Go to **Marketplace → Private Apps → OpenClaw Integration → Settings**:

| Setting | Description | Default |
|---|---|---|
| Server URL | Base URL of your OpenClaw server | _(empty)_ |
| API Key | API key for authentication | _(empty)_ |
| Model Name | Model to use for completions | `openclaw` |
| Mock Mode | Returns fake responses for testing | `true` |

---

## Local Testing with Ollama

```bash
brew install ollama
ollama pull qwen2.5-coder:7b
ollama serve
```

Set **Server URL** to `http://localhost:11434`, **API Key** to `ollama`, **Model** to `qwen2.5-coder:7b`, and disable **Mock Mode**.

---

## Usage

```
/openclaw What is dependency injection?
/openclaw Write a TypeScript interface for a User object
```

---

## Author

**Jatin Sharma** — [GitHub](https://github.com/JatinSharma222) · sharma.jatin2202@gmail.com

---

## License

MIT
