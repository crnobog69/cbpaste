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
    console.log("Fetching webhook URL..."); // Debug log
    const response = await fetch("/api/getWebhookUrl");
    console.log("Response received:", response.status); // Debug log

    const data = await response.json();
    console.log("Data received:", data); // Debug log

    if (data.error) {
      console.error("Webhook URL error:", data);
      return null;
    }

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

  statusDiv.className = "status";
  statusDiv.textContent = "Слање поруке...";

  try {
    console.log("Getting webhook URL..."); // Debug log
    const webhookUrl = await getWebhookUrl();
    console.log("Webhook URL received:", webhookUrl ? "Yes" : "No"); // Debug log

    if (!webhookUrl) {
      statusDiv.className = "status error";
      statusDiv.textContent =
        "Грешка при добијању webhook URL-а. Проверите конзолу за више детаља.";
      return;
    }

    const payload = {
      content: message,
    };

    console.log("Sending message to Discord..."); // Debug log
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Discord response status:", response.status); // Debug log

    if (response.ok) {
      statusDiv.className = "status success";
      statusDiv.textContent = "Порука је успешно послата!";
      document.getElementById("message").value = "";
      autoResize(document.getElementById("message"));
    } else {
      const errorText = await response.text();
      console.error("Discord error response:", errorText); // Debug log
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Full error:", error); // Debug log
    statusDiv.className = "status error";
    statusDiv.textContent = `Грешка при слању поруке: ${error.message}`;
  }
}
