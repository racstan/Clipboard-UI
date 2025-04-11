# 📋 Clipboard UI

**Clipboard UI** is a web-based application built with **HTML, CSS, and JavaScript** that helps you manage text snippets in a clean, card-based layout. It allows quick copying to the clipboard, customizable display settings, autosave, and import/export support — all within a dark/light theme toggle. Instead of relying on web-browsers to autofill your data and bearing the risk of it getting leaked, you can create multiple cards for different purposes.

## 🚀 Features

### 🔖 Card-Based Interface
- Create visually consistent cards with optional captions and text content.
- Cards support fixed-size containers with an expand/collapse toggle for long text.
- Edit and Delete buttons appear on hover for clean interaction.

### 📋 Clipboard Integration
- Automatically copies card content to the clipboard on creation or click.
- Easily paste your clipboard content directly into the input area using a **Paste** button.

### 📦 Dynamic Import/Export
- **Export** all cards to a `.json` file.
- **Import** cards from JSON while skipping duplicates (only adds new cards).

### 💾 Autosave
- Enable autosave with a dropdown selector (1 min, 5 min, 15 min, 30 min, 1 hr, or Off).
- Saves cards automatically to `localStorage` if enabled and cards exist.

### 🌓 Dark/Light Theme Toggle
- Switch between dark mode and light mode for a personalized experience.

### 🖋️ Customizable Fonts
- Choose your preferred font from a dropdown to update the entire app’s appearance.

---

## 🌐 Live Demo

Try the app live:  
👉 [clipboardui.netlify.app](https://www.clipboardui.netlify.app)

---

## 📸 Screenshots

### Light Mode
![Light Mode](https://github.com/user-attachments/assets/27947f1a-28e4-481d-abde-62ea111d5cc6)

### Dark Mode
![Dark Mode](https://github.com/user-attachments/assets/b0653aaa-5aae-4afb-988b-a2bc6790cdd9)

---

## 🛠️ Installation

Clone the repository:

```bash
git clone https://github.com/racstan/clipboard-ui.git
cd clipboard-ui
```

Then, simply open the `index.html` file in your browser.

---

## 📌 To-Do

- [ ] Fix known bugs and performance issues  
- [ ] Add cloud storage integration (Google Drive, Dropbox, etc.)  
- [ ] Expand functionalities (e.g., tagging, search, filters)
