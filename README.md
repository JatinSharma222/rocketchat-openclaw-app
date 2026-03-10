# OpenClaw Integration for Rocket.Chat

A Rocket.Chat App that integrates OpenClaw AI assistant into your workspace via a `/openclaw` slash command.

> Built with the Rocket.Chat Apps Engine framework and TypeScript.

---

## Demo


https://github.com/user-attachments/assets/d6068c2b-e169-4b95-8f37-798fd63643a5


The demo shows:
1. User runs `/openclaw Explain how Rocket.Chat Apps Engine works`
2. `⏳ OpenClaw is thinking...` appears immediately
3. Full AI response is delivered to the correct room

---

## Error Handling

Empty prompts are caught and the user is guided with the correct usage.

<img width="1371" height="176" alt="Screenshot 2026-02-26 at 5 53 22 AM" src="https://github.com/user-attachments/assets/e5984e18-db0d-4e6c-a0a1-5c65089fa211" />

---

## Features

- `/openclaw <prompt>` slash command
- Immediate `⏳ thinking...` feedback before AI processes the request
- Async task routing layer — maps `task_id` to room and user
- Callback webhook endpoint — OpenClaw posts result back to the correct room
- OpenAI-compatible HTTP API integration
- Configurable via Admin settings (server URL, API key, model)
- Mock mode for local development and testing

---

## How It Works

```
User: /openclaw <prompt>
        ↓
⏳ "OpenClaw is thinking..." shown immediately
        ↓
App sends request to OpenClaw / Ollama
        ↓
If async → task_id stored (roomId + userId)
           OpenClaw calls back → response routed to correct room
If sync  → response posted directly
```

---

## Project Structure

```
OpenClaw-Extension/
├── OpenClawApp.ts              # App entry point
├── commands/
│   └── OpenClawCommand.ts      # Slash command handler
├── endpoints/
│   └── OpenClawCallbackEndpoint.ts  # Async callback webhook
├── services/
│   └── OpenClawService.ts      # API integration layer
├── settings/
│   └── settings.ts             # Admin settings
└── lib/
    ├── sendMessage.ts          # Message utility
    └── taskMap.ts              # In-memory task routing map
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

## Local Testing with Ollama (free, no API key needed)

```bash
brew install ollama
ollama pull qwen2.5-coder:7b
ollama serve
```

Set **Server URL** to `http://localhost:11434`, **API Key** to `ollama`, **Model** to `qwen2.5-coder:7b`, and disable **Mock Mode**.

Other free models you can use:

```bash
ollama pull llama3.2
ollama pull mistral
ollama pull deepseek-coder
```

---

## Testing the Async Callback

To simulate OpenClaw finishing an async task and calling back:

```bash
curl -X POST https://<your-rc-host>/api/apps/public/<app-id>/openclaw/callback \
  -H "Content-Type: application/json" \
  -d '{"task_id": "abc123", "result": "Task completed successfully"}'
```

The response will be routed to the exact room where `/openclaw` was run.

---

## Usage

```
/openclaw What is dependency injection?
/openclaw Write a TypeScript interface for a User object
/openclaw Explain how Rocket.Chat Apps Engine works
```

---

## Author

**Jatin Sharma** — [GitHub](https://github.com/JatinSharma222) · sharma.jatin2202@gmail.com

---

## License

MIT
