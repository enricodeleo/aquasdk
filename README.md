# **AquaSDK 2.0**

**A modern JavaScript SDK generator from OpenAPI specs**

<img src="logo.jpg" alt="aquasdk logo" width="200"/>

AquaSDK is an open-source tool that generates a fully-featured JavaScript SDK from an OpenAPI specification. It enables easy integration with APIs through a **chainable, Waterline-style API** that is both powerful and intuitive.

---

## 🎉 **What's New in 2.0**

Version 2.0 is a major update focused on developer experience and API design.

*   **Breaking Change**: The default SDK is now generated with a `hierarchical` strategy, creating a beautiful, resource-oriented API.
*   **Waterline-Style API**: The new API fully embraces the Waterline ORM syntax. Methods like `.find()`, `.findOne()`, `.populate()`, and `.limit()` are now available on all resources.
*   **Chainable Queries**: All query methods are chainable and "thenable," meaning you can `await` them directly without needing to call `.execute()`.
*   **Backward Compatibility**: The old, tag-based generation strategy is still available via the `--strategy=tags` flag for full backward compatibility.

---

## 📦 **Installation**

```bash
npm install -g aquasdk
```

---

## 🛠 **Usage**

```bash
generate-sdk <swagger-file-path> <output-directory> <version> [--strategy] [--verbose]
```

### Arguments

- `swagger-file-path`: Path to your OpenAPI/Swagger JSON file (default: `./swagger.json`).
- `output-directory`: Directory where the SDK will be generated (default: `./sdk`).
- `version`: The version number of the generated SDK (default: `2.0.0`).
- `--strategy`: The resource generation strategy. Can be `hierarchical` (default) or `tags`.
- `--verbose`: Flag for detailed logging.

### Example

```bash
# Generate the new, Waterline-style hierarchical SDK
generate-sdk ./swagger.json ./sdk 2.0.0

# Generate the old, tag-based SDK for backward compatibility
generate-sdk ./swagger.json ./sdk_legacy 1.5.0 --strategy=tags
```

---

## ✨ **Features**

*   **Waterline-Style Query Language**: A powerful, chainable API for querying your resources (`.find()`, `.findOne()`, `.populate()`, `.limit()`, `.skip()`, `.sort()`).
*   **Hierarchical Resource Access**: Intuitively access sub-resources (e.g., `api.users(123).orders.find()`).
*   **"Thenable" Queries**: `await` queries directly without needing `.execute()`.
*   **Flexible Generation Strategies**: Choose between a modern, hierarchical API or a classic, tag-based structure.
*   **OpenAPI-Driven Development**: Automates SDK generation from your spec.
*   **Promise-based & Async-ready**: Fully compatible with `async/await`.
*   **Configurable HTTP Client**: Customize timeout, headers, and other `axios` options.

---

## 💻 **SDK API Examples**

The new `hierarchical` strategy produces a clean, powerful, and intuitive API.

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

### Finding Records with `.find()`

The `.find()` method returns a chainable query that you can `await` directly.

```javascript
async function findUsers() {
  // Find all users
  const { data: allUsers } = await api.users.find();

  // Find active users over 30, with pagination and sorting
  const { data: activeUsers } = await api.users.find({ 
    active: true,
    age: { '>': 30 } 
  })
  .limit(10)
  .skip(20)
  .sort('createdAt DESC');
}
```

### Finding a Single Record with `.findOne()`

The `.findOne()` method is also chainable, making it perfect for populating relations.

```javascript
async function findOneUser() {
  // Find a single user by ID
  const { data: user } = await api.users.findOne(123);

  // Find a single user and populate their orders
  const { data: userWithOrders } = await api.users.findOne(123)
    .populate('orders');
    
  // Find the first active admin
  const { data: admin } = await api.users.findOne({ 
    active: true,
    role: 'admin'
  }).sort('createdAt ASC');
}
```

### Creating, Updating, and Destroying Records

These methods are simple and direct.

```javascript
async function manageUser() {
  // Create a new user
  const { data: newUser } = await api.users.create({ name: 'John Doe' });

  // Update a user
  const { data: updatedUser } = await api.users.update(newUser.id, { name: 'Jane Doe' });

  // Destroy a user
  await api.users.destroy(newUser.id);
}
```

### Working with Sub-Resources

The API for sub-resources is identical, making it incredibly intuitive.

```javascript
async function manageUserOrders() {
  const userId = 123;

  // Find all orders for a specific user
  const { data: orders } = await api.users(userId).orders.find();

  // Find a single order for that user and populate the product
  const { data: order } = await api.users(userId).orders.findOne(456)
    .populate('product');
}
```

---

## 🚀 **Development and Contribution**

We welcome contributions! Please fork the repository, make your changes, and submit a pull request.

---

## 📄 **License**

AquaSDK is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. See the [LICENSE](LICENSE.md) file for more information.
