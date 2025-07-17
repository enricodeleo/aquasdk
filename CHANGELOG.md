# Changelog

## [2.1.0](https://github.com/enricodeleo/aquasdk/compare/v2.0.0...v2.1.0) (2025-07-17)

### Features

* **generator:** Implement Waterline-style hierarchical API ([4df9ebe](https://github.com/enricodeleo/aquasdk/commit/4df9ebe535b9225c0de0555cebec27b40acbb068))

## 2.0.0 (2025-07-17)

### ⚠ BREAKING CHANGES

*   **New Hierarchical API**: The default resource generation strategy is now `hierarchical`, which creates a more intuitive, chained API for interacting with resources and sub-resources. This is a breaking change from the previous `tags`-based strategy.
*   The old `tags`-based strategy is still available via the `--strategy=tags` flag.

### Features

*   **Idiomatic, Chained API**: The new `hierarchical` strategy creates a natural, resource-oriented API that's a pleasure to use (e.g., `api.assistants(id).skills.list()`).
*   **Flexible Generation Strategies**: You can now choose between a modern, `hierarchical` API or a classic, `tags`-based structure to suit your needs.

### Bug Fixes

*   **Sub-Resource Handling**: The new `hierarchical` strategy correctly handles nested resources, ensuring that all API endpoints are accessible.
*   **JSDoc Comments**: Restored JSDoc comments to all generated methods, ensuring full documentation for the SDK.

## [1.9.3](https://github.com/enricodeleo/aquasdk/compare/v1.9.2...v1.9.3) (2025-07-17)

### Bug Fixes

* subresources ([d5c79cf](https://github.com/enricodeleo/aquasdk/commit/d5c79cf415f98acad37438ef8d841aafe85c74c1))

## [1.9.2](https://github.com/enricodeleo/aquasdk/compare/v1.9.1...v1.9.2) (2025-07-17)

### Bug Fixes

* **index.js:** provide default values for swagger file, output directory, and version if positional arguments are not provided ([f53def4](https://github.com/enricodeleo/aquasdk/commit/f53def45def6e48d71142e4a8fbfd203902e9fcf))

## [1.9.1](https://github.com/enricodeleo/aquasdk/compare/v1.9.0...v1.9.1) (2025-07-17)

### Bug Fixes

* whitespace in subresources ([be12fc5](https://github.com/enricodeleo/aquasdk/commit/be12fc5ba1e2cc254ed85f652ea4fd30b8fd8a92))

## [1.9.0](https://github.com/enricodeleo/aquasdk/compare/v1.8.3...v1.9.0) (2025-07-17)

### Features

* sub-resources ([969320f](https://github.com/enricodeleo/aquasdk/commit/969320fa3ba6a45eeb51ba44f472fb666417f0e0))

## [1.8.2](https://github.com/enricodeleo/aquasdk/compare/v1.8.1...v1.8.2) (2025-03-31)

### Bug Fixes

* **resource.hbs:** change PUT request to PATCH request for update method to allow partial updates ([8641b40](https://github.com/enricodeleo/aquasdk/commit/8641b40e5daefe7cf6ba1c5fb776f882cc847bb9))

## [1.8.1](https://github.com/enricodeleo/aquasdk/compare/v1.8.0...v1.8.1) (2025-03-26)

### Bug Fixes

* improve parameter serialization for complex queries ([7a8930c](https://github.com/enricodeleo/aquasdk/commit/7a8930cc00536d17e6cd0053117a9b8f94217a35))

## [1.8.0](https://github.com/enricodeleo/aquasdk/compare/v1.7.0...v1.8.0) (2025-03-26)

### Features

* add paramsSerializer support to SDK client ([e2ff8ce](https://github.com/enricodeleo/aquasdk/commit/e2ff8ce74b15075374c7d70025bf7367a8c04c10))

## [1.7.0](https://github.com/enricodeleo/aquasdk/compare/v1.6.2...v1.7.0) (2025-03-19)

### Features

* **client.hbs:** enhance ApiClient constructor to support additional Axios configuration options ([663a40f](https://github.com/enricodeleo/aquasdk/commit/663a40f4698f59b4720fd6509ea96a8ec3f5d910))

## [1.6.2](https://github.com/enricodeleo/aquasdk/compare/v1.6.1...v1.6.2) (2025-03-16)

## [1.5.1](https://github.com/enricodeleo/aquasdk/compare/1.5.0...1.5.1) (2025-03-13)

## 1.5.0 (2025-03-11)


### Features

* **generator.js:** remove redundant namespace prefix `@ediliziasemplice/` from npm package name to simplify installation and usage ([bbe8e1c](https://github.com/enricodeleo/aquasdk/commit/bbe8e1c325809598831349ea30e309f1950266de))
