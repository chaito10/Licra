# Compatibility Matrix

GLG includes a license compatibility engine with pairwise analysis for 21+ licenses.

## How It Works

The compatibility matrix stores directional compatibility pairs. "A compatible with B" does **not** imply "B compatible with A".

### Checking Compatibility

```sh
# CLI
glg compare MIT Apache-2.0
glg compare MIT GPL-3.0-only --verbose

# API
curl "http://localhost:8080/api/compatibility?license_a=MIT&license_b=GPL-3.0-only"
```

### Rust API

```rust
let matrix = CompatibilityMatrix::new();

// Simple check
let compatible = matrix.are_compatible("MIT", "Apache-2.0");

// Detailed explanation
let result = matrix.explain("MIT", "GPL-3.0-only");
println!("{}", result.reason);

// Batch check
let report = matrix.check_batch(&["MIT".into(), "Apache-2.0".into(), "ISC".into()]);
assert!(report.overall_compatible);
```

## Supported Licenses

| License | Compatible With |
|---------|----------------|
| MIT | All permissive, all copyleft (as input) |
| BSD-2-Clause | All permissive, all copyleft (as input) |
| ISC | All permissive, all copyleft (as input) |
| Apache-2.0 | MIT, BSD, ISC, Apache, MPL-2.0, GPL-3.0+, AGPL-3.0+ |
| 0BSD | All licenses |
| Unlicense | All licenses |
| CC0-1.0 | All licenses |
| LGPL-2.0-only | LGPL-2.0+, GPL-2.0+ |
| LGPL-2.1-only | LGPL-2.1+, GPL-2.0+ |
| LGPL-3.0-only | LGPL-3.0+, GPL-3.0+ |
| MPL-2.0 | MPL-2.0, GPL-2.0+, EPL |
| GPL-2.0-only | GPL-2.0+ |
| GPL-3.0-only | GPL-3.0+ |
| AGPL-3.0-only | AGPL-3.0+ |

## Upgrade Paths

Some licenses can be upgraded to stronger variants:

| From | Upgrade To |
|------|-----------|
| GPL-2.0-only | GPL-2.0-or-later, GPL-3.0-or-later |
| GPL-2.0-or-later | GPL-3.0-or-later |
| LGPL-2.0-only | LGPL-2.1-or-later, LGPL-3.0-or-later |
| LGPL-2.1-only | LGPL-3.0-or-later |
| EPL-1.0 | EPL-2.0 |
| EUPL-1.1 | EUPL-1.2 |

## Incompatible Combinations

Common incompatible combinations:

| License A | License B | Reason |
|-----------|-----------|--------|
| MIT | GPL-2.0-only (as output) | GPL requires derivative works under GPL |
| Apache-2.0 | GPL-2.0-only | Apache patent clause conflicts with GPL-2.0 |
| MIT | Proprietary | Proprietary cannot include copyleft obligations |
| GPL-3.0-only | Proprietary | GPL copyleft incompatible with proprietary |
