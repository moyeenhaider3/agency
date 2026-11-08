---
schema_version: 1
open_count: 1
waived_count: 0
fixed_count: 0
total_count: 1
last_updated: 2026-11-08T09:38:09.277Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 03 | unrun-verify | site/index.html |  | Browser visual, screen-reader, and breakpoint manual pass was not runnable in the available local environment. | open |  | 2026-11-08T09:38:09.277Z |  |

````json
[
  {
    "id": 1,
    "kind": "unrun-verify",
    "phase": "03",
    "file": "site/index.html",
    "line": null,
    "description": "Browser visual, screen-reader, and breakpoint manual pass was not runnable in the available local environment.",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-11-08T09:38:09.277Z",
    "resolved_at": null,
    "milestone": null
  }
]
````
