# **AquaSDK 2.0**

**A modern JavaScript SDK generator from OpenAPI specs**

<img src="logo.jpg" alt="aquasdk logo" width="200"/>

AquaSDK is an open-source tool that generates a fully-featured JavaScript SDK from an OpenAPI specification. It enables easy integration with APIs through a chainable, resource-oriented syntax. AquaSDK helps you rapidly create SDKs, making it easier to interact with any RESTful API.

---

## 🎉 **What's New in 2.0**

Version 2.0 is a major update that introduces a new, more intuitive way to interact with your API.

*   **Breaking Change**: The default SDK generation strategy is now `hierarchical`, which creates a beautiful, chained API that mirrors your RESTful resource structure.
*   **New Chained API**: Interact with sub-resources in a natural, object-oriented way (e.g., `api.assistants(id).skills.list()`).
*   **Backward Compatibility**: The old, tag-based generation strategy is still available via the `--strategy=tags` flag for full backward compatibility.

---

## 📦 **Installation**

```bash
npm install -g aquasdk
```

---

## 🛠 **Usage**

Once installed, you can use the `generate-sdk` command to generate a JavaScript SDK from an OpenAPI specification.

```bash
generate-sdk <swagger-file-path> <output-directory> <version> [--strategy] [--verbose]
```

### Arguments

- `swagger-file-path`: Path to your OpenAPI/Swagger JSON file (default: `./swagger.json`).
- `output-directory`: Directory where the SDK will be generated (default: `./sdk`).
- `version`: The version number of the generated SDK (default: `1.0.0`).
- `--strategy`: The resource generation strategy. Can be `hierarchical` (default) or `tags`.
- `--verbose`: Flag for detailed logging.

### Example

```bash
# Generate the new, hierarchical SDK (default)
generate-sdk ./swagger.json ./sdk 2.0.0

# Generate the old, tag-based SDK for backward compatibility
generate-sdk ./swagger.json ./sdk_legacy 1.5.0 --strategy=tags
```

---

## ✨ **Features**

*   **Idiomatic, Chained API**: The new `hierarchical` strategy creates a natural, resource-oriented API that's a pleasure to use.
*   **Flexible Generation Strategies**: Choose between a modern, hierarchical API or a classic, tag-based structure.
*   **OpenAPI-Driven Development**: Automates SDK generation from your spec, reducing errors and ensuring consistency.
*   **Promise-based & Async-ready**: All API calls return promises, making them fully compatible with `async/await`.
*   **Full Error Handling**: Includes detailed and meaningful error messages.
*   **Configurable HTTP Client**: Customize timeout, headers, and other `axios` options.

---

## 💻 **SDK API Examples**

The new `hierarchical` strategy produces a clean, intuitive API. Here's how you'd use it:

### Initializing the SDK

```javascript
import SDK from './sdk/index.js';

const api = new SDK({
  baseUrl: 'https://api.example.com',
  auth: {
    token: 'your-auth-token'
  }
});
```

### Working with Top-Level Resources

```javascript
async function manageAssistants() {
  try {
    // List all assistants
    const { data: assistants } = await api.assistants.list();
    console.log('Assistants:', assistants);

    // Create a new assistant
    const { data: newAssistant } = await api.assistants.create({
      name: 'My New Assistant'
    });
    console.log('New Assistant:', newAssistant);

    // Get a single assistant by ID
    const { data: assistant } = await api.assistants(newAssistant.id).get();
    console.log('Fetched Assistant:', assistant);

    // Update an assistant
    const { data: updatedAssistant } = await api.assistants(newAssistant.id).update({
      name: 'My Updated Assistant'
    });
    console.log('Updated Assistant:', updatedAssistant);

    // Delete an assistant
    await api.assistants(newAssistant.id).destroy();
    console.log('Assistant deleted.');

  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Working with Sub-Resources (The Magic!)

This is where the new API really shines. Notice how easy it is to work with the `skills` of an `assistant`.

```javascript
async function manageSkills() {
  try {
    const assistantId = 'asst_123'; // An existing assistant ID

    // List all skills for a specific assistant
    const { data: skills } = await api.assistants(assistantId).skills.list();
    console.log(`Skills for assistant ${assistantId}:`, skills);

    // Create a new skill for that assistant
    const { data: newSkill } = await api.assistants(assistantId).skills.create({
      name: 'My New Skill'
    });
    console.log('New Skill:', newSkill);

    // Get a single skill by ID
    const { data: skill } = await api.assistants(assistantId).skills(newSkill.id).get();
    console.log('Fetched Skill:', skill);

  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

## 🚀 **Development and Contribution**

We welcome contributions! Please fork the repository, make your changes, and submit a pull request.

---

## 📄 **License**

AquaSDK is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. See the [LICENSE](LICENSE.md) file for more information.