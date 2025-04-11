document.addEventListener('DOMContentLoaded', function() {
    const captionInput = document.getElementById('captionInput');
    const textInput = document.getElementById('textInput');
    const addCardBtn = document.getElementById('addCardBtn');
    const pasteBtn = document.getElementById('pasteBtn');
    const cardsContainer = document.getElementById('cardsContainer');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const importFileInput = document.getElementById('importFile');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const autosaveBtn = document.getElementById('autosaveBtn');
    const autosaveSelect = document.getElementById('autosaveSelect');
    const fontSelect = document.getElementById('fontSelect');
    const selectFontBtn = document.getElementById('selectFontBtn');
    
    let cardsData = [];
    let autosaveTimer = null;
    
    function showTooltip(message, targetEl) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerText = message;
      document.body.appendChild(tooltip);
      const rect = targetEl.getBoundingClientRect();
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = (rect.top - 40) + 'px';
      setTimeout(() => {
        tooltip.classList.add('fade-out');
        setTimeout(() => tooltip.remove(), 500);
      }, 1000);
    }
    
    async function copyText(text, targetEl) {
      try {
        await navigator.clipboard.writeText(text);
        showTooltip("Copied!", targetEl);
      } catch (err) {
        console.error("Clipboard error:", err);
        showTooltip("Copy failed!", targetEl);
      }
    }
    
    function cardExists(newCard) {
      return cardsData.some(card =>
        card.caption.trim() === newCard.caption.trim() &&
        card.content.trim() === newCard.content.trim()
      );
    }
    
    function createCardElement(cardObj, index) {
      const card = document.createElement('div');
      card.className = 'card';
      if (cardObj.caption && cardObj.caption.trim() !== "") {
        const h3 = document.createElement('h3');
        h3.innerText = cardObj.caption;
        card.appendChild(h3);
      }
      const textContainer = document.createElement('div');
      textContainer.className = 'card-text-container';
      const p = document.createElement('p');
      p.innerText = cardObj.content;
      textContainer.appendChild(p);
      card.appendChild(textContainer);
      setTimeout(() => {
        if (p.scrollHeight > textContainer.clientHeight + 5) {
          const toggleBtn = document.createElement('button');
          toggleBtn.className = 'toggle-btn';
          toggleBtn.innerText = "+";
          toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (textContainer.classList.contains('expanded')) {
              textContainer.classList.remove('expanded');
              toggleBtn.innerText = "+";
            } else {
              textContainer.classList.add('expanded');
              toggleBtn.innerText = "–";
            }
          });
          card.appendChild(toggleBtn);
        }
      }, 50);
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions';
      const editBtn = document.createElement('button');
      editBtn.className = 'edit';
      editBtn.innerText = "Edit";
      editBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        captionInput.value = cardObj.caption;
        textInput.value = cardObj.content;
        cardsData.splice(index, 1);
        updateCardsUI();
      });
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete';
      deleteBtn.innerText = "Delete";
      deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cardsData.splice(index, 1);
        updateCardsUI();
      });
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);
      card.appendChild(actionsDiv);
      card.addEventListener('click', function(e) {
        if (e.target.tagName.toLowerCase() === 'button') return;
        if (cardObj.content && cardObj.content.trim() !== "") {
          copyText(cardObj.content, card);
        } else if (cardObj.caption && cardObj.caption.trim() !== "") {
          copyText(cardObj.caption, card);
        }
      });
      return card;
    }
    
    function updateCardsUI() {
      cardsContainer.innerHTML = "";
      cardsData.forEach((cardObj, index) => {
        const cardEl = createCardElement(cardObj, index);
        cardsContainer.appendChild(cardEl);
      });
    }
    
    function addCard() {
      const caption = captionInput.value.trim();
      const content = textInput.value.trim();
      if (!caption && !content) {
        alert("Please enter a caption or some text to create a card.");
        return;
      }
      const cardObj = { caption, content };
      if (cardExists(cardObj)) {
        alert("This card already exists.");
        return;
      }
      cardsData.unshift(cardObj);
      updateCardsUI();
      if (content) copyText(content, addCardBtn);
      else copyText(caption, addCardBtn);
      captionInput.value = "";
      textInput.value = "";
    }
    
    async function pasteClipboard() {
      try {
        const clipText = await navigator.clipboard.readText();
        textInput.value = clipText;
      } catch (err) {
        console.error("Failed to read clipboard:", err);
        alert("Could not paste from clipboard.");
      }
    }
    
    function exportCards() {
      if (cardsData.length === 0) {
        alert("No cards to export.");
        return;
      }
      const dataStr = JSON.stringify(cardsData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "cards-export.json";
      link.click();
      URL.revokeObjectURL(url);
    }
    
    function importCards(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const imported = JSON.parse(e.target.result);
          if (!Array.isArray(imported)) {
            alert("Invalid file format. Expected a JSON array.");
            return;
          }
          imported.forEach(card => {
            if (!cardExists(card)) {
              cardsData.push(card);
            }
          });
          updateCardsUI();
        } catch (err) {
          console.error("Import error:", err);
          alert("Failed to import cards. Check the file.");
        }
      };
      reader.readAsText(file);
    }
    
    function deleteAllCards() {
      if (confirm("Are you sure you want to delete all cards?")) {
        cardsData = [];
        updateCardsUI();
      }
    }
    
    function autosave() {
      if (cardsData.length === 0) return;
      try {
        localStorage.setItem("autosavedCards", JSON.stringify(cardsData));
        showTooltip("Cards autosaved", autosaveBtn);
      } catch (err) {
        console.error("Autosave failed:", err);
      }
    }
    
    function updateAutosaveTimer() {
      const minutes = parseInt(autosaveSelect.value);
      if (autosaveTimer) {
        clearInterval(autosaveTimer);
        autosaveTimer = null;
      }
      if (minutes > 0 && cardsData.length > 0) {
        autosaveTimer = setInterval(autosave, minutes * 60 * 1000);
      }
      autosaveBtn.innerText = "Autosave";
      autosaveSelect.style.display = "none";
    }
    
    function toggleMode() {
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('light-mode')) {
        toggleModeBtn.innerText = "Dark Mode";
      } else {
        toggleModeBtn.innerText = "Light Mode";
      }
    }
    
    function updateFont() {
      document.body.style.fontFamily = fontSelect.value;
    }
    
    autosaveBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      autosaveSelect.style.display = autosaveSelect.style.display === "block" ? "none" : "block";
    });
    document.addEventListener('click', function(e) {
      if (e.target !== autosaveBtn && e.target !== autosaveSelect) {
        autosaveSelect.style.display = "none";
      }
    });
    
    addCardBtn.addEventListener('click', addCard);
    pasteBtn.addEventListener('click', pasteClipboard);
    exportBtn.addEventListener('click', exportCards);
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importCards);
    deleteAllBtn.addEventListener('click', deleteAllCards);
    toggleModeBtn.addEventListener('click', toggleMode);
    autosaveSelect.addEventListener('change', updateAutosaveTimer);
    fontSelect.addEventListener('change', updateFont);
    
    updateAutosaveTimer();
  });
  