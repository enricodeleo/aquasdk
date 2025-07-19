# Changelog

## [2.2.1](https://github.com/enricodeleo/aquasdk/compare/v2.2.0...v2.2.1) (2025-07-19)

### Bug Fixes

* **queryUtils.js:** remove opinionated where wrapper ([a0abba0](https://github.com/enricodeleo/aquasdk/commit/a0abba09a116784d4998925c3e98fd21c70ee8bf))

## [2.2.0](https://github.com/enricodeleo/aquasdk/compare/v1.8.2...v2.2.0) (2025-07-17)

### Features

* **generator:** Implement factory pattern for full sub-resource support ([ca477e7](https://github.com/enricodeleo/aquasdk/commit/ca477e79fdaac9c1cfc6b2395fd341ad9a4df8f9))
* ideomatic api ([3b87cff](https://github.com/enricodeleo/aquasdk/commit/3b87cfff16c08ee8f9399920826464249e6ae60f))

### Bug Fixes

* **generator:** Ensure correct operation mapping and response handling ([db0dade](https://github.com/enricodeleo/aquasdk/commit/db0dadecc7d8322f5da74971ab6c2924df985d71))
* **lint:** Remove unused function and fix comma-dangle errors ([ad3499c](https://github.com/enricodeleo/aquasdk/commit/ad3499c49aabe5b5b1ea1e5fc2ae856c2e92dde0))

## 2.1.0 (2025-07-17)

### Features

*   **generator:** Implement factory pattern for full sub-resource support. The generator now creates callable resource functions that provide an intuitive, Waterline-style interface for both top-level operations and nested sub-resources (e.g., `api.companies(id).people.find()`).
*   **QueryBuilder:** The generated SDK now includes a powerful `QueryBuilder` that makes queries "thenable," allowing for direct use of `await` on chained methods without needing an explicit `.execute()` call.

### Bug Fixes

*   **generator:** Correctly differentiate between static endpoints (e.g., `/users/me`) and true sub-resources, resolving a critical bug where methods were not attached to the correct resource object.
*   **generator:** Ensure `operationId` from the OpenAPI specification is always respected, preserving the intended casing for function names (e.g., `getUsersMe`).
*   **client:** The API client now returns the full, unmodified Axios response object on success, preventing errors when handling responses with no content (e.g., `204 No Content`).
*   **QueryBuilder:** The `where` parameter is now omitted from the final query string if it is empty, preventing unnecessary `?where={}` clauses.

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
