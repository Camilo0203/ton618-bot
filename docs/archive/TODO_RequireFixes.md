# Task: Fix Old Require Paths

## Files Modified:

1. **src/handlers/verifHandler.js**
   - Old: `require("../commands/verify")`
   - New: `require("../commands/admin/config/verify")`

2. **src/events/ready.js**
   - Old: `require("../commands/cumpleanos")`
   - New: `require("../commands/public/utility/cumpleanos")`

## Status:
- [x] Fix verifHandler.js
- [x] Fix ready.js
