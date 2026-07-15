# Installation

GLG is a single binary with no runtime dependencies. Choose your installation method.

## From crates.io

When published:

```sh
cargo install glg
```

## Build from Source

Requires Rust 1.75 or later.

```sh
git clone https://github.com/glg-project/glg.git
cd glg
cargo build --release
```

The binary will be at `target/release/glg`.

### Platform-specific Notes

=== "Linux"

    ```sh
    # Install build essentials if needed
    sudo apt-get install build-essential pkg-config libssl-dev

    # Build
    cargo build --release

    # Optional: install system-wide
    sudo cp target/release/glg /usr/local/bin/
    ```

=== "macOS"

    ```sh
    # Install Xcode command line tools if needed
    xcode-select --install

    # Build
    cargo build --release

    # Optional: install via Homebrew (when available)
    # brew install glg
    ```

=== "Windows"

    ```powershell
    # Ensure MSVC build tools are installed
    # Download from https://visualstudio.microsoft.com/visual-cpp-build-tools/

    # Build
    cargo build --release

    # The binary will be at target\release\glg.exe
    ```

## Verify Installation

```sh
glg --version
glg doctor
```

`glg doctor` checks that all embedded databases load correctly:

```
GLG Doctor - Diagnostic Report
============================================================
Version: 1.0.0
Platform: linux
Arch: x86_64

  SPDX Database: OK (86 licenses)
  Clause Database: OK (50 clauses)
  Compatibility Matrix: OK (21 licenses)
  Questionnaire: OK (314 questions)
  Compiler: OK
  Validator: OK
  Database: OK
  LLM Client: Not configured (optional)

All systems operational.
```

## Next Steps

- [Quick Start](quickstart.md) -- Generate your first license
