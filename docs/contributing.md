# Contributing

How to contribute to GLG.

## Development Setup

```sh
git clone https://github.com/glg-project/glg.git
cd glg
cargo build
cargo test
```

## Requirements

- Rust 1.75 or later
- No external services required

## Project Structure

```
glg/
  Cargo.toml           # Dependencies and metadata
  build.rs             # Build script for embedded data
  src/
    main.rs            # CLI entry point
    lib.rs             # Library root
    license.rs         # Core types
    questionnaire.rs   # 314 questions
    compiler.rs        # License compiler
    clauses.rs         # Clause template database
    spdx.rs            # SPDX license database
    crypto.rs          # Hashing and signatures
    validator.rs       # License validation
    compatibility.rs   # Compatibility matrix
    database.rs        # Unified database facade
    export.rs          # Multi-format export
    llm.rs             # AI integration
    html.rs            # Embedded frontend
    ui.rs              # Web server
  licenses/            # Embedded JSON databases
    spdx_licenses.json
    compatibility.json
    clauses.json
  static/              # Standalone static assets
    style.css
    app.js
  docs/                # Documentation (MkDocs)
  tests/               # Integration tests
```

## Development Commands

```sh
cargo build              # Debug build
cargo build --release    # Optimized release build
cargo test               # Run all tests
cargo test --lib         # Unit tests only
cargo test --test integration_test  # Integration tests only
cargo clippy             # Lint
cargo clippy -- -D warnings  # Lint (deny warnings)
cargo fmt                # Format code
cargo fmt --check        # Check formatting
```

## Code Style

- No `unwrap()` in production code -- use `Result` types
- No `panic!()` in production code
- Use `thiserror` for error types
- Use `serde` for serialization
- Follow existing patterns in neighboring files
- Keep functions focused and testable

## Testing

### Unit Tests

Unit tests are in each module file under `#[cfg(test)] mod tests`.

```sh
cargo test --lib
```

### Integration Tests

Integration tests are in `tests/integration_test.rs`.

```sh
cargo test --test integration_test
```

### Adding Tests

1. Add unit tests in the relevant module file
2. Add integration tests in `tests/integration_test.rs`
3. Use descriptive test names
4. Test both success and error paths
5. Test edge cases

## Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Run the test suite: `cargo test`
5. Run the linter: `cargo clippy -- -D warnings`
6. Ensure formatting: `cargo fmt --check`
7. Submit a pull request

## Reporting Issues

- Use the GitHub issue tracker
- Include your Rust version (`rustc --version`)
- Include your OS and architecture
- Provide steps to reproduce
- Include error messages

## License

By contributing, you agree that your contributions will be licensed under the same license as the project: MIT OR Apache-2.0.
