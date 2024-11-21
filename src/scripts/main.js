// Auto-resize function for textarea
function autoResize(textarea) {
  textarea.style.height = "auto"; // Reset height to recalculate
  textarea.style.height = textarea.scrollHeight + "px"; // Set new height
}

// Initialize auto-resize
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("message");

  // Initial resize
  autoResize(textarea);

  // Resize on input
  textarea.addEventListener("input", () => {
    autoResize(textarea);
  });
});

async function getWebhookUrl() {
  try {
    const response = await fetch("/api/getWebhookUrl");
    const data = await response.json();
    return data.webhookUrl;
  } catch (error) {
    console.error("Error fetching webhook URL:", error);
    return null;
  }
}

async function sendMessage() {
  const message = document.getElementById("message").value;
  const statusDiv = document.getElementById("status");

  if (!message) {
    statusDiv.className = "status error";
    statusDiv.textContent = "Молимо вас да унесете поруку!";
    return;
  }

  const webhookUrl = await getWebhookUrl();
  if (!webhookUrl) {
    statusDiv.className = "status error";
    statusDiv.textContent =
      "Грешка при добијању webhook URL-а. Контактирајте администратора.";
    return;
  }

  const payload = {
    content: message,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      statusDiv.className = "status success";
      statusDiv.textContent = "Порука је успешно послата!";
      document.getElementById("message").value = "";
      // Reset height after clearing
      autoResize(document.getElementById("message"));
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    statusDiv.className = "status error";
    statusDiv.textContent = `Грешка при слању поруке: ${error.message}`;
  }
}
