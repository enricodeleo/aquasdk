# **AquaSDK**

**A modern JavaScript SDK generator from OpenAPI specs**

<img src="logo.jpg" alt="aquasdk logo" width="200"/>

AquaSDK is an open-source tool that generates a fully-featured JavaScript SDK from an OpenAPI specification. It enables easy integration with APIs through a chainable, **Waterline-like** syntax. AquaSDK helps you rapidly create SDKs, making it easier to interact with RESTful APIs.

### **Why**

**Waterline ORM**, commonly used in [Sails.js](https://sailsjs.com/), is often praised for its intuitive and flexible syntax, which simplifies database interactions.

---

## 📦 **Installation**

You can easily install AquaSDK globally, or locally for development.

### Global Installation
Install AquaSDK globally for command-line access:
```bash
npm install -g aquasdk
```

### Local Installation (for development)
To install locally and contribute to the project:
```bash
# Clone the repository
git clone https://github.com/enricodeleo/aquasdk.git
cd aquasdk
npm install
npm link
```

---

## 🛠 **Usage**

Once installed, you can use the `generate-sdk` command to generate a JavaScript SDK from an OpenAPI specification.

```bash
generate-sdk <swagger-file-path> <output-directory> <version> [--verbose]
```

### Arguments

- `swagger-file-path`: Path to your OpenAPI/Swagger JSON file (default: `./swagger.json`)
- `output-directory`: Directory where the SDK will be generated (default: `./sdk`)
- `version`: The version number of the generated SDK (default: `1.0.0`)
- `--verbose`: Flag for detailed logging

### Example

```bash
generate-sdk ./swagger.json ./sdk 1.0.0 --verbose
```

---

## 🎉 **Features of the Generated SDK**

The generated SDK includes the following features:

- **Waterline-like Syntax**: Chainable query methods for interacting with your API, similar to Sails.js/Waterline. Brings ORM-style chaining (`.find()`, `.limit()`, `.sort()`) to REST API calls, making client-side code more expressive.
- **OpenAPI-Driven Development**: Automates SDK generation from specs, reducing human error and ensuring alignment with API contracts.
- **Promise-based API**: All API calls return promises, making them compatible with `async/await`.
- **Response Headers Access**: All API responses include both data and headers, allowing access to important HTTP header information.
- **Comprehensive Error Handling**: Includes detailed and meaningful error messages.
- **Support for Associations**: Handling relationships via `.populate()` (if implemented) would mirror Waterline's eager-loading, a standout feature for nested resources.
- **Configurable HTTP Client**: Support for additional Axios configuration options to customize timeout, headers, and other HTTP client settings.

---

## 💻 **SDK API Example**

Once the SDK is generated, you can use it as follows:

### Example Code
```javascript
import API from './sdk/index.js';

// Initialize the SDK
const api = new API({
  baseUrl: 'https://api.example.com',
  auth: {
    token: 'your-auth-token'
    // Or use basic auth
    // username: 'user',
    // password: 'pass'
  },
  // Additional Axios configuration options
  timeout: 5000,
  headers: {
    'Custom-Header': 'value'
  },
  // Custom parameter serializer
  paramsSerializer: {
    serialize: (params) => {
      // Custom parameter serialization logic
      return Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    }
  }
});

// Examples using Waterline-like syntax
async function examples() {
  // Find all users
  const response = await api.users.find().execute();
  const users = response.data;
  const headers = response.headers;

  // Find users with criteria
  const activeResponse = await api.users
    .find({ active: true })
    .execute();
  const activeUsers = activeResponse.data;

  // Pagination and sorting
  const paginatedResponse = await api.users
    .find()
    .limit(10)
    .skip(20)
    .sort('createdAt DESC')
    .execute();
  const paginatedUsers = paginatedResponse.data;

  // Find a single user by ID
  const userResponse = await api.users.findOne(123);
  const user = userResponse.data;

  // Create a new user
  const createResponse = await api.users.create({
    name: 'John Doe',
    email: 'john@example.com'
  });
  const newUser = createResponse.data;
  
  // Access response headers (e.g., for rate limiting info)
  console.log('Rate limit remaining:', createResponse.headers['x-rate-limit-remaining']);

  // Update an existing user
  const updateResponse = await api.users.update(123, {
    name: 'Jane Doe'
  });
  const updatedUser = updateResponse.data;

  // Delete a user
  const deleteResponse = await api.users.destroy(123);

  // Use complex criteria with operators
  const olderResponse = await api.users
    .find({ age: { '>': 30 } })
    .execute();
  const olderUsers = olderResponse.data;
}
```

---

## 🔍 **How It Works**

### 1. **Reads the OpenAPI spec**
AquaSDK parses your Swagger/OpenAPI JSON definition to understand your API's structure.

### 2. **Preprocesses the spec**
The tool resolves circular references and prepares the API definition for SDK generation.

### 3. **Generates Model Classes**
A class is created for each model in the OpenAPI schema, ensuring proper data handling and validation.

### 4. **Builds Method Chains**
AquaSDK generates a Waterline-like query syntax for accessing your API’s resources.

### 5. **Creates the SDK**
A complete SDK is generated, including methods, models, and utility files.

---

## 🚀 **Development and Contribution**

Since AquaSDK is open source, we welcome contributions from developers who wish to improve the tool, add features, or fix bugs.

### How to Contribute

1. Fork the repository and create a new branch.
2. Make your changes and commit them with clear messages.
3. Push your changes and submit a pull request with a description of your updates.

We appreciate all contributions and aim to review pull requests as quickly as possible.

---

## 📄 **License**

AquaSDK is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. See the [LICENSE](LICENSE.md) file for more information.

The GPL-3.0 license allows you to freely use, modify, and distribute AquaSDK, but requires that you make any derivative works available under the same license. If you distribute AquaSDK, or any derivative works, you must include the source code and provide the GPL license terms.

For more details, please refer to the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).

---

Feel free to use, modify, and contribute to AquaSDK! We hope this tool helps you build better, more efficient integrations with OpenAPI-based APIs. 🚀
